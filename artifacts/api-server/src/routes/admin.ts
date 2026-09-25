import { Router, type IRouter, type Request, type Response } from "express";
import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import {
  db,
  adminSessionsTable,
  adminUsersTable,
  peopleTable,
  projectsTable,
  newsTable,
  researchAreasTable,
  teachingRecordsTable,
  profileInfoTable,
  mediaTable,
  opportunitiesTable,
  opportunityCategories,
  opportunityStatuses,
} from "@workspace/db";
import {
  allowLoginAttempt,
  attachAdminSession,
  clearSessionCookie,
  createAdminSession,
  ensureBootstrapAdmin,
  hashPassword,
  hashSessionToken,
  requireAdmin,
  requireSameOrigin,
  setAdminSessionCookie,
  verifyAdminCredentials,
} from "../lib/adminAuth";
import { createImageReadUrl, createImageUploadUrl, verifyUploadedImage } from "../lib/objectStorage";

const router: IRouter = Router();
router.use(attachAdminSession);

const category = z.enum(["PI", "Postdoctoral", "PhD", "MSc", "Research Assistant", "Undergraduate", "Visiting", "Alumni"]);
const url = z.string().url().refine((value) => /^https?:\/\//i.test(value), "Only http(s) URLs are allowed");
const stringList = z.array(z.string()).default([]);
const common = {
  displayOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(false),
  archived: z.boolean().default(false),
};

const resourceSchemas = {
  people: z.object({
    category,
    name: z.string().trim().min(1).max(200),
    role: z.string().max(300).default(""),
    institution: z.string().max(300).default(""),
    researchFocus: z.string().max(2000).default(""),
    linkedinUrl: url.nullable().optional(),
    status: z.enum(["current", "alumni"]).default("current"),
    photoMediaId: z.coerce.number().int().positive().nullable().optional(),
    ...common,
  }),
  projects: z.object({
    title: z.string().trim().min(1).max(300),
    objective: z.string().max(5000).default(""),
    status: z.string().max(100).default("planned"),
    location: z.string().max(300).default(""),
    collaborators: stringList,
    fundingAgency: z.string().max(300).default(""),
    years: z.string().max(100).default(""),
    methods: z.string().max(5000).default(""),
    relatedPublications: stringList,
    imageMediaId: z.coerce.number().int().positive().nullable().optional(),
    ...common,
  }),
  news: z.object({
    headline: z.string().trim().min(1).max(300),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    summary: z.string().max(2000).default(""),
    body: z.string().max(20000).default(""),
    imageMediaId: z.coerce.number().int().positive().nullable().optional(),
    ...common,
  }),
  researchAreas: z.object({
    title: z.string().trim().min(1).max(300),
    description: z.string().max(5000).default(""),
    researchQuestions: stringList,
    methods: z.string().max(5000).default(""),
    geographicScope: z.string().max(500).default(""),
    relatedProjects: stringList,
    ...common,
  }),
  teaching: z.object({
    academicYear: z.string().trim().min(1).max(30),
    courseCode: z.string().trim().min(1).max(50),
    title: z.string().trim().min(1).max(300),
    program: z.string().max(200).default(""),
    term: z.string().max(100).default(""),
    role: z.string().max(200).default(""),
    ...common,
  }),
  opportunities: z.object({
    title: z.string().trim().min(1).max(300),
    category: z.enum(opportunityCategories),
    shortDescription: z.string().max(1000).default(""),
    fullDetails: z.string().max(10000).default(""),
    applicationInstructions: z.string().max(5000).default(""),
    applicationEmail: z.string().email().nullable().optional(),
    applicationUrl: url.nullable().optional(),
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    status: z.enum(opportunityStatuses).default("Hidden"),
    ...common,
  }),
  profile: z.object({
    name: z.string().max(200).default(""),
    appointment: z.string().max(300).default(""),
    labName: z.string().max(300).default(""),
    directorRole: z.string().max(300).default(""),
    researchInterests: stringList,
    labEmail: z.string().email().nullable().optional(),
    contactEmail: z.string().email().nullable().optional(),
    department: z.string().max(300).default(""),
    university: z.string().max(300).default(""),
    office: z.string().max(100).default(""),
    externalLinks: z.array(z.object({ label: z.string().max(100), url })).default([]),
  }),
  media: z.object({
    fileName: z.string().trim().min(1).max(255),
    objectPath: z.string().regex(/^\/objects\/[A-Za-z0-9/_-]+$/),
    contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
    size: z.coerce.number().int().positive().max(10 * 1024 * 1024),
    altText: z.string().max(500).default(""),
    associatedType: z.enum(["people", "projects", "news"]).nullable().optional(),
    associatedId: z.coerce.number().int().positive().nullable().optional(),
    ...common,
  }),
} as const;

const resources = {
  people: { table: peopleTable, schema: resourceSchemas.people },
  projects: { table: projectsTable, schema: resourceSchemas.projects },
  news: { table: newsTable, schema: resourceSchemas.news },
  researchAreas: { table: researchAreasTable, schema: resourceSchemas.researchAreas },
  teaching: { table: teachingRecordsTable, schema: resourceSchemas.teaching },
  opportunities: { table: opportunitiesTable, schema: resourceSchemas.opportunities },
  profile: { table: profileInfoTable, schema: resourceSchemas.profile },
  media: { table: mediaTable, schema: resourceSchemas.media },
} as const;

type ResourceName = keyof typeof resources;
type ResourceTable = typeof resources[ResourceName]["table"];

function getResource(value: string): { name: ResourceName; table: ResourceTable; schema: z.ZodTypeAny } | null {
  if (!(value in resources)) return null;
  const name = value as ResourceName;
  const resource = resources[name];
  return { name, table: resource.table as ResourceTable, schema: resource.schema };
}

function parseId(req: Request): number | null {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function parseBody(resource: ResourceName, body: unknown, partial: boolean) {
  const schema = resources[resource].schema;
  return (partial ? schema.partial() : schema).safeParse(body);
}

router.post("/admin/auth/login", async (req, res): Promise<void> => {
  const ip = req.ip || "unknown";
  if (!allowLoginAttempt(ip)) {
    res.status(429).json({ error: "Too many attempts. Try again later." });
    return;
  }
  const parsed = z.object({ email: z.string().email(), password: z.string().min(1).max(200) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }
  try {
    const bootstrapped = await ensureBootstrapAdmin();
    if (!bootstrapped) {
      res.status(503).json({ error: "Admin access is not configured" });
      return;
    }
    const user = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = await createAdminSession(user.id);
    setAdminSessionCookie(res, token);
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    req.log.error({ err: error }, "Admin login failed");
    res.status(500).json({ error: "Unable to sign in" });
  }
});

router.get("/admin/auth/session", (req, res): void => {
  if (!req.adminUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ user: { id: req.adminUser.id, email: req.adminUser.email, role: req.adminUser.role } });
});

router.post("/admin/auth/logout", requireSameOrigin, async (req, res): Promise<void> => {
  const cookie = req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith("p3_admin_session="));
  if (cookie) {
    const token = decodeURIComponent(cookie.slice("p3_admin_session=".length));
    await db.delete(adminSessionsTable).where(eq(adminSessionsTable.tokenHash, hashSessionToken(token)));
  }
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.use("/admin", requireAdmin, requireSameOrigin);

router.post("/admin/auth/password", async (req, res): Promise<void> => {
  const parsed = z.object({
    currentPassword: z.string().min(1).max(200),
    newPassword: z.string().min(12).max(200),
  }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "New passwords must be at least 12 characters." });
    return;
  }

  try {
    const currentUser = req.adminUser;
    if (!currentUser || !(await verifyAdminCredentials(currentUser.email, parsed.data.currentPassword))) {
      res.status(400).json({ error: "Current password is incorrect." });
      return;
    }

    const passwordHash = await hashPassword(parsed.data.newPassword);
    await db.update(adminUsersTable)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(adminUsersTable.id, currentUser.id));
    await db.delete(adminSessionsTable).where(eq(adminSessionsTable.adminUserId, currentUser.id));

    const token = await createAdminSession(currentUser.id);
    setAdminSessionCookie(res, token);
    res.json({ ok: true });
  } catch (error) {
    req.log.error({ err: error }, "Admin password change failed");
    res.status(500).json({ error: "Unable to change password" });
  }
});

router.get("/admin/content/:resource", async (req, res): Promise<void> => {
  const resource = getResource(req.params.resource);
  if (!resource) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }
  try {
    const orderColumns = [
      (resource.table as any).displayOrder ? asc((resource.table as any).displayOrder) : null,
      (resource.table as any).updatedAt ? desc((resource.table as any).updatedAt) : null,
    ].filter(Boolean);
    const query = db.select().from(resource.table as any);
    const rows = orderColumns.length ? await query.orderBy(...orderColumns as any) : await query;
    res.json({ items: rows });
  } catch (error) {
    req.log.error({ err: error, resource: resource.name }, "Admin list failed");
    res.status(500).json({ error: "Unable to load records" });
  }
});

router.post("/admin/content/:resource", async (req, res): Promise<void> => {
  const resource = getResource(req.params.resource);
  if (!resource) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }
  const parsed = parseBody(resource.name, req.body, false);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid record", details: parsed.error.flatten() });
    return;
  }
  try {
    const returned = await db.insert(resource.table as any).values(parsed.data as any).returning();
    const record = Array.isArray(returned) ? returned[0] : undefined;
    res.status(201).json(record);
  } catch (error) {
    req.log.error({ err: error, resource: resource.name }, "Admin create failed");
    res.status(500).json({ error: "Unable to create record" });
  }
});

router.patch("/admin/content/:resource/:id", async (req, res): Promise<void> => {
  const resource = getResource(req.params.resource);
  const id = parseId(req);
  if (!resource || !id) {
    res.status(404).json({ error: "Record not found" });
    return;
  }
  const parsed = parseBody(resource.name, req.body, true);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid record", details: parsed.error.flatten() });
    return;
  }
  try {
    const [record] = await db.update(resource.table as any)
      .set({ ...(parsed.data as object), updatedAt: new Date() })
      .where(eq((resource.table as any).id, id))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Record not found" });
      return;
    }
    res.json(record);
  } catch (error) {
    req.log.error({ err: error, resource: resource.name, id }, "Admin update failed");
    res.status(500).json({ error: "Unable to update record" });
  }
});

router.delete("/admin/content/:resource/:id", async (req, res): Promise<void> => {
  const resource = getResource(req.params.resource);
  const id = parseId(req);
  if (!resource || !id) {
    res.status(404).json({ error: "Record not found" });
    return;
  }
  try {
    const archivedColumn = (resource.table as any).archived;
    if (archivedColumn) {
      const [record] = await db.update(resource.table as any)
        .set({ archived: true, published: false, updatedAt: new Date() })
        .where(eq((resource.table as any).id, id))
        .returning();
      if (!record) {
        res.status(404).json({ error: "Record not found" });
        return;
      }
      res.json(record);
      return;
    }
    const returned = await db.delete(resource.table as any).where(eq((resource.table as any).id, id)).returning();
    const record = Array.isArray(returned) ? returned[0] : undefined;
    if (!record) {
      res.status(404).json({ error: "Record not found" });
      return;
    }
    res.json(record);
  } catch (error) {
    req.log.error({ err: error, resource: resource.name, id }, "Admin delete failed");
    res.status(500).json({ error: "Unable to archive record" });
  }
});

router.post("/admin/media/upload-url", async (req, res): Promise<void> => {
  const parsed = z.object({
    name: z.string().trim().min(1).max(255),
    size: z.number().int().positive().max(10 * 1024 * 1024),
    contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Only JPEG, PNG, WebP, and GIF images up to 10 MB are accepted." });
    return;
  }
  try {
    res.json(await createImageUploadUrl());
  } catch (error) {
    req.log.error({ err: error }, "Media upload URL failed");
    res.status(500).json({ error: "Unable to prepare image upload" });
  }
});

router.post("/admin/media/verify-upload", async (req, res): Promise<void> => {
  const parsed = z.object({
    objectPath: z.string().regex(/^\/objects\/[A-Za-z0-9/_-]+$/),
    size: z.number().int().positive().max(10 * 1024 * 1024),
    contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid image metadata" });
    return;
  }
  try {
    const valid = await verifyUploadedImage(parsed.data.objectPath, parsed.data.contentType, parsed.data.size);
    if (!valid) {
      res.status(400).json({ error: "The uploaded file did not pass image validation." });
      return;
    }
    res.json({ valid: true });
  } catch (error) {
    req.log.warn({ err: error }, "Media verification failed");
    res.status(400).json({ error: "The uploaded file could not be verified." });
  }
});

router.patch("/admin/people/:id/photo", async (req, res): Promise<void> => {
  const id = parseId(req);
  const parsed = z.object({ photoMediaId: z.union([z.number().int().positive(), z.null()]) }).safeParse(req.body);
  if (!id || !parsed.success) {
    res.status(400).json({ error: "A valid People record and photo ID are required." });
    return;
  }

  try {
    const [person] = await db.select().from(peopleTable).where(eq(peopleTable.id, id)).limit(1);
    if (!person) {
      res.status(404).json({ error: "People record not found." });
      return;
    }

    if (parsed.data.photoMediaId !== null) {
      const [media] = await db.select().from(mediaTable).where(eq(mediaTable.id, parsed.data.photoMediaId)).limit(1);
      if (!media || media.archived || media.contentType.startsWith("image/") === false) {
        res.status(404).json({ error: "Photo record not found." });
        return;
      }
    }

    const updated = await db.transaction(async (tx) => {
      const previousPhotoMediaId = person.photoMediaId;
      if (parsed.data.photoMediaId !== null) {
        await tx.update(mediaTable)
          .set({ associatedType: "people", associatedId: id, published: true, archived: false, updatedAt: new Date() })
          .where(eq(mediaTable.id, parsed.data.photoMediaId));
      }

      const [updatedPerson] = await tx.update(peopleTable)
        .set({ photoMediaId: parsed.data.photoMediaId, updatedAt: new Date() })
        .where(eq(peopleTable.id, id))
        .returning();

      if (previousPhotoMediaId && previousPhotoMediaId !== parsed.data.photoMediaId) {
        await tx.update(mediaTable)
          .set({ published: false, archived: true, updatedAt: new Date() })
          .where(eq(mediaTable.id, previousPhotoMediaId));
      }
      return updatedPerson;
    });

    res.json({ person: updated });
  } catch (error) {
    req.log.error({ err: error, id }, "People photo association failed");
    res.status(500).json({ error: "Unable to update the People photo." });
  }
});

router.get("/storage/objects/*path", requireAdmin, requireSameOrigin, async (req, res): Promise<void> => {
  const raw = req.params.path;
  const path = `/objects/${Array.isArray(raw) ? raw.join("/") : raw}`;
  try {
    res.redirect(302, await createImageReadUrl(path));
  } catch (error) {
    req.log.warn({ err: error }, "Media object unavailable");
    res.status(404).json({ error: "Media not found" });
  }
});

export default router;