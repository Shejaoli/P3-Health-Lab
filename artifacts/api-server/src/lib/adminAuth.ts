import { createHmac, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { promisify } from "node:util";
import { and, eq, gt } from "drizzle-orm";
import { db, adminSessionsTable, adminUsersTable, type AdminUser } from "@workspace/db";

const scrypt = promisify(nodeScrypt);
const SESSION_COOKIE = "p3_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

declare global {
  namespace Express {
    interface Request {
      adminUser?: AdminUser;
    }
  }
}

export function hashSessionToken(token: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  return createHmac("sha256", secret).update(token).digest("hex");
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, salt, storedHex] = encoded.split(":");
  if (algorithm !== "scrypt" || !salt || !storedHex) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const stored = Buffer.from(storedHex, "hex");
  return stored.length === derived.length && timingSafeEqual(stored, derived);
}

function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? "admin@p3healthlab.local").trim().toLowerCase();
}

export async function ensureBootstrapAdmin(): Promise<AdminUser | null> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  const email = getAdminEmail();
  const existing = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email)).limit(1);
  if (existing[0]) return existing[0];
  const passwordHash = await hashPassword(password);
  const [created] = await db.insert(adminUsersTable).values({ email, passwordHash }).returning();
  return created;
}

function setSessionCookie(res: Response, token: string, maxAgeMs: number): void {
  const flags = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.max(0, Math.floor(maxAgeMs / 1000))}`,
  ];
  if (process.env.NODE_ENV === "production") flags.push("Secure");
  res.setHeader("Set-Cookie", flags.join("; "));
}

export function clearSessionCookie(res: Response): void {
  setSessionCookie(res, "", 0);
}

function getCookie(req: Request): string | undefined {
  const header = req.headers.cookie ?? "";
  const match = header.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)) : undefined;
}

export async function createAdminSession(userId: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await db.insert(adminSessionsTable).values({
    tokenHash: hashSessionToken(token),
    adminUserId: userId,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });
  return token;
}

export const attachAdminSession: RequestHandler = async (req, _res, next: NextFunction) => {
  try {
    const token = getCookie(req);
    if (!token) {
      next();
      return;
    }
    const [session] = await db.select({
      user: adminUsersTable,
      expiresAt: adminSessionsTable.expiresAt,
    }).from(adminSessionsTable)
      .innerJoin(adminUsersTable, eq(adminUsersTable.id, adminSessionsTable.adminUserId))
      .where(and(eq(adminSessionsTable.tokenHash, hashSessionToken(token)), gt(adminSessionsTable.expiresAt, new Date()), eq(adminUsersTable.isActive, true)))
      .limit(1);
    if (session) req.adminUser = session.user;
    next();
  } catch (error) {
    req.log.error({ err: error }, "Unable to load admin session");
    next();
  }
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!req.adminUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

export const requireSameOrigin: RequestHandler = (req, res, next) => {
  const origin = req.get("Origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const configuredHosts = [
        process.env.REPLIT_DEV_DOMAIN,
        ...(process.env.REPLIT_DOMAINS ?? "").split(","),
      ]
        .filter(Boolean)
        .flatMap((host) => [host!.replace(/^https?:\/\//, "").replace(/\/$/, "")]);
      if (originHost !== req.get("Host") && !configuredHosts.includes(originHost)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
    } catch {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
  }
  next();
};

export function allowLoginAttempt(ip: string): boolean {
  const now = Date.now();
  const state = loginAttempts.get(ip);
  if (!state || state.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (state.count >= 10) return false;
  state.count += 1;
  return true;
}

export async function verifyAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email.trim().toLowerCase())).limit(1);
  if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) return null;
  return user;
}

export { SESSION_COOKIE };