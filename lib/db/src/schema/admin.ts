import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
};

export const adminUsersTable = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
}, (table) => ({
  emailIndex: uniqueIndex("admin_users_email_idx").on(table.email),
}));

export const adminSessionsTable = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  tokenHash: text("token_hash").notNull(),
  adminUserId: integer("admin_user_id").notNull().references(() => adminUsersTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  tokenIndex: uniqueIndex("admin_sessions_token_idx").on(table.tokenHash),
}));

export const peopleTable = pgTable("admin_people", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default(""),
  institution: text("institution").notNull().default(""),
  researchFocus: text("research_focus").notNull().default(""),
  linkedinUrl: text("linkedin_url"),
  status: text("status").notNull().default("current"),
  photoMediaId: integer("photo_media_id"),
  displayOrder: integer("display_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  ...timestamps,
});

export const projectsTable = pgTable("admin_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  objective: text("objective").notNull().default(""),
  status: text("status").notNull().default("planned"),
  location: text("location").notNull().default(""),
  collaborators: jsonb("collaborators").$type<string[]>().notNull().default([]),
  fundingAgency: text("funding_agency").notNull().default(""),
  years: text("years").notNull().default(""),
  methods: text("methods").notNull().default(""),
  relatedPublications: jsonb("related_publications").$type<string[]>().notNull().default([]),
  imageMediaId: integer("image_media_id"),
  displayOrder: integer("display_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  ...timestamps,
});

export const newsTable = pgTable("admin_news", {
  id: serial("id").primaryKey(),
  headline: text("headline").notNull(),
  date: date("date", { mode: "string" }),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  imageMediaId: integer("image_media_id"),
  published: boolean("published").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  ...timestamps,
});

export const researchAreasTable = pgTable("admin_research_areas", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  researchQuestions: jsonb("research_questions").$type<string[]>().notNull().default([]),
  methods: text("methods").notNull().default(""),
  geographicScope: text("geographic_scope").notNull().default(""),
  relatedProjects: jsonb("related_projects").$type<string[]>().notNull().default([]),
  displayOrder: integer("display_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  ...timestamps,
});

export const teachingRecordsTable = pgTable("admin_teaching_records", {
  id: serial("id").primaryKey(),
  academicYear: text("academic_year").notNull(),
  courseCode: text("course_code").notNull(),
  title: text("title").notNull(),
  program: text("program").notNull().default(""),
  term: text("term").notNull().default(""),
  role: text("role").notNull().default(""),
  displayOrder: integer("display_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  ...timestamps,
});

export const profileInfoTable = pgTable("admin_profile_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  appointment: text("appointment").notNull().default(""),
  labName: text("lab_name").notNull().default(""),
  directorRole: text("director_role").notNull().default(""),
  researchInterests: jsonb("research_interests").$type<string[]>().notNull().default([]),
  labEmail: text("lab_email"),
  university: text("university").notNull().default(""),
  externalLinks: jsonb("external_links").$type<Array<{ label: string; url: string }>>().notNull().default([]),
  ...timestamps,
});

export const mediaTable = pgTable("admin_media", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  objectPath: text("object_path").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  altText: text("alt_text").notNull().default(""),
  associatedType: text("associated_type"),
  associatedId: integer("associated_id"),
  published: boolean("published").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  ...timestamps,
});

export const insertAdminUserSchema = createInsertSchema(adminUsersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAdminSessionSchema = createInsertSchema(adminSessionsTable).omit({ id: true, createdAt: true });
export const insertPersonSchema = createInsertSchema(peopleTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNewsSchema = createInsertSchema(newsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertResearchAreaSchema = createInsertSchema(researchAreasTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTeachingRecordSchema = createInsertSchema(teachingRecordsTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProfileInfoSchema = createInsertSchema(profileInfoTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMediaSchema = createInsertSchema(mediaTable).omit({ id: true, createdAt: true, updatedAt: true });

export type AdminUser = typeof adminUsersTable.$inferSelect;
export type AdminSession = typeof adminSessionsTable.$inferSelect;
export type Person = typeof peopleTable.$inferSelect;
export type Project = typeof projectsTable.$inferSelect;
export type NewsRecord = typeof newsTable.$inferSelect;
export type ResearchArea = typeof researchAreasTable.$inferSelect;
export type TeachingRecord = typeof teachingRecordsTable.$inferSelect;
export type ProfileInfo = typeof profileInfoTable.$inferSelect;
export type Media = typeof mediaTable.$inferSelect;

export const adminCategories = z.enum(["PI", "Postdoctoral", "PhD", "MSc", "Research Assistant", "Undergraduate", "Visiting", "Alumni"]);