import { and, asc, desc, eq, ne } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, opportunitiesTable, profileInfoTable } from "@workspace/db";

const router: IRouter = Router();
const publicationLinkLabels = new Set(["Google Scholar", "ORCID", "CV", "Publication Profile", "CV / Publication Profile"]);
const publicProfileLinkLabels = new Set(["Google Scholar", "ORCID", "LinkedIn", "CV", "Publication Profile", "CV / Publication Profile", "Western University profile"]);
const publicationLinkSchema = z.object({
  label: z.string().trim().min(1).max(100),
  url: z.string().url().refine((value) => /^https?:\/\//i.test(value)),
});

router.get("/public/publications", async (req, res): Promise<void> => {
  try {
    const [profile] = await db
      .select({ externalLinks: profileInfoTable.externalLinks })
      .from(profileInfoTable)
      .orderBy(desc(profileInfoTable.updatedAt))
      .limit(1);

    const externalLinks = Array.isArray(profile?.externalLinks)
      ? profile.externalLinks
        .filter((link) => publicationLinkLabels.has(link.label))
        .map((link) => publicationLinkSchema.safeParse(link))
        .filter((result): result is { success: true; data: { label: string; url: string } } => result.success)
        .map((result) => result.data)
      : [];

    res.json({ externalLinks });
  } catch (error) {
    req.log.error({ err: error }, "Public publication links failed");
    res.status(500).json({ error: "Unable to load publication links" });
  }
});

router.get("/public/profile", async (req, res): Promise<void> => {
  try {
    const [profile] = await db
      .select({ externalLinks: profileInfoTable.externalLinks })
      .from(profileInfoTable)
      .orderBy(desc(profileInfoTable.updatedAt))
      .limit(1);

    const externalLinks = Array.isArray(profile?.externalLinks)
      ? profile.externalLinks
        .filter((link) => publicProfileLinkLabels.has(link.label))
        .map((link) => publicationLinkSchema.safeParse(link))
        .filter((result): result is { success: true; data: { label: string; url: string } } => result.success)
        .map((result) => result.data)
      : [];

    res.json({ externalLinks });
  } catch (error) {
    req.log.error({ err: error }, "Public profile links failed");
    res.status(500).json({ error: "Unable to load profile links" });
  }
});

router.get("/public/opportunities", async (req, res): Promise<void> => {
  try {
    const items = await db
      .select({
        id: opportunitiesTable.id,
        title: opportunitiesTable.title,
        category: opportunitiesTable.category,
        shortDescription: opportunitiesTable.shortDescription,
        details: opportunitiesTable.details,
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
      .orderBy(asc(opportunitiesTable.displayOrder), desc(opportunitiesTable.updatedAt));

    res.json({ items });
  } catch (error) {
    req.log.error({ err: error }, "Public opportunities failed");
    res.status(500).json({ error: "Unable to load opportunities" });
  }
});

export default router;