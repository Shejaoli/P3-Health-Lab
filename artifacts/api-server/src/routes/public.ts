import { desc } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, profileInfoTable } from "@workspace/db";

const router: IRouter = Router();
const publicationLinkLabels = new Set(["Google Scholar", "ORCID", "CV", "Publication Profile"]);
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

export default router;