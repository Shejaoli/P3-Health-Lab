import { and, asc, desc, eq, ne } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { GetPublicNewsResponse, GetPublicOpportunitiesResponse, GetPublicProfileResponse, GetPublicTeachingResponse } from "@workspace/api-zod";
import { db, newsTable, opportunitiesTable, profileInfoTable, teachingRecordsTable } from "@workspace/db";

const router: IRouter = Router();
const publicationLinkLabels = new Set(["Google Scholar", "ORCID", "CV", "Publication Profile", "CV / Publication Profile"]);
const publicProfileLinkLabels = new Set(["Google Scholar", "ORCID", "LinkedIn", "CV", "Publication Profile", "CV / Publication Profile", "Western University profile"]);
const publicationLinkSchema = z.object({
  label: z.string().trim().min(1).max(100),
  url: z.string().url().refine((value) => /^https?:\/\//i.test(value)),
});
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

router.get("/public/news", async (req, res): Promise<void> => {
  try {
    const news = await db
      .select({
        headline: newsTable.headline,
        date: newsTable.date,
        summary: newsTable.summary,
        body: newsTable.body,
      })
      .from(newsTable)
      .where(and(
        eq(newsTable.published, true),
        eq(newsTable.archived, false),
      ))
      .orderBy(asc(newsTable.displayOrder), desc(newsTable.date), asc(newsTable.id));

    res.json(GetPublicNewsResponse.parse({ news }));
  } catch (error) {
    req.log.error({ err: error }, "Public news failed");
    res.status(500).json({ error: "Unable to load news" });
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

    const [profileDetails] = await db
      .select({
        name: profileInfoTable.name,
        appointment: profileInfoTable.appointment,
        labName: profileInfoTable.labName,
        directorRole: profileInfoTable.directorRole,
        department: profileInfoTable.department,
        university: profileInfoTable.university,
        office: profileInfoTable.office,
        contactEmail: profileInfoTable.contactEmail,
        labEmail: profileInfoTable.labEmail,
      })
      .from(profileInfoTable)
      .orderBy(desc(profileInfoTable.updatedAt))
      .limit(1);

    res.json(GetPublicProfileResponse.parse({
      externalLinks,
      contact: {
        name: optionalText(profileDetails?.name, 200),
        appointment: optionalText(profileDetails?.appointment, 300),
        labName: optionalText(profileDetails?.labName, 300),
        directorRole: optionalText(profileDetails?.directorRole, 300),
        department: optionalText(profileDetails?.department, 300),
        university: optionalText(profileDetails?.university, 300),
        office: optionalText(profileDetails?.office, 100),
        contactEmail: optionalEmail(profileDetails?.contactEmail),
        labEmail: optionalEmail(profileDetails?.labEmail),
      },
    }));
  } catch (error) {
    req.log.error({ err: error }, "Public profile failed");
    res.status(500).json({ error: "Unable to load profile information" });
  }
});

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

    const opportunities = rows.map((row) => ({
      ...row,
      applicationEmail: optionalEmail(row.applicationEmail),
      applicationUrl: optionalHttpUrl(row.applicationUrl),
    }));
    res.json(GetPublicOpportunitiesResponse.parse({ opportunities }));
  } catch (error) {
    req.log.error({ err: error }, "Public opportunities failed");
    res.status(500).json({ error: "Unable to load opportunities" });
  }
});

router.get("/public/teaching", async (req, res): Promise<void> => {
  try {
    const courses = await db
      .select({
        academicYear: teachingRecordsTable.academicYear,
        courseCode: teachingRecordsTable.courseCode,
        title: teachingRecordsTable.title,
      })
      .from(teachingRecordsTable)
      .where(and(
        eq(teachingRecordsTable.published, true),
        eq(teachingRecordsTable.archived, false),
      ))
      .orderBy(
        desc(teachingRecordsTable.academicYear),
        asc(teachingRecordsTable.displayOrder),
        asc(teachingRecordsTable.id),
      );

    res.json(GetPublicTeachingResponse.parse({ courses }));
  } catch (error) {
    req.log.error({ err: error }, "Public teaching courses failed");
    res.status(500).json({ error: "Unable to load teaching courses" });
  }
});

export default router;