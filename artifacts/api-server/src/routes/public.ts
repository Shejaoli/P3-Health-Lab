import { and, asc, eq, ne } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, opportunitiesTable } from "@workspace/db";

const router: IRouter = Router();
const emailSchema = z.string().email();
const httpUrlSchema = z.string().url().refine((value) => /^https?:\/\//i.test(value));

function optionalText(value: unknown, maxLength = 500): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text && text.length <= maxLength ? text : null;
}

function optionalEmail(value: unknown): string | null {
  const text = optionalText(value, 320);
  const parsed = text ? emailSchema.safeParse(text) : null;
  return parsed?.success ? parsed.data : null;
}

function optionalHttpUrl(value: unknown): string | null {
  const text = optionalText(value, 2048);
  const parsed = text ? httpUrlSchema.safeParse(text) : null;
  return parsed?.success ? parsed.data : null;
}

router.get("/public/opportunities", async (req, res): Promise<void> => {
  try {
    const rows = await db
      .select({
        title: opportunitiesTable.title,
        category: opportunitiesTable.category,
        shortDescription: opportunitiesTable.shortDescription,
        fullDetails: opportunitiesTable.fullDetails,
        applicationInstructions: opportunitiesTable.applicationInstructions,
        applicationEmail: opportunitiesTable.applicationEmail,
        applicationUrl: opportunitiesTable.applicationUrl,
        deadline: opportunitiesTable.deadline,
        status: opportunitiesTable.status,
      })
      .from(opportunitiesTable)
      .where(and(
        eq(opportunitiesTable.published, true),
        eq(opportunitiesTable.archived, false),
        ne(opportunitiesTable.status, "Hidden"),
      ))
      .orderBy(asc(opportunitiesTable.displayOrder), asc(opportunitiesTable.id));

    res.json({
      opportunities: rows.map((row) => ({
        ...row,
        applicationEmail: optionalEmail(row.applicationEmail),
        applicationUrl: optionalHttpUrl(row.applicationUrl),
      })),
    });
  } catch (error) {
    req.log.error({ err: error }, "Public opportunities failed");
    res.status(500).json({ error: "Unable to load opportunities" });
  }
});

export default router;