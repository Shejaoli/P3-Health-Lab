import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const opportunityCategories = [
  "Graduate Students",
  "Postdoctoral Researchers",
  "Research Assistants & Staff",
  "Undergraduate / Research Students",
  "Visiting Students & Scholars",
] as const;

export const opportunityStatuses = ["Open", "Closed", "Hidden"] as const;

export const opportunityCategoryEnum = pgEnum("opportunity_category", opportunityCategories);
export const opportunityStatusEnum = pgEnum("opportunity_status", opportunityStatuses);

export const opportunitiesTable = pgTable("admin_opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: opportunityCategoryEnum("category").notNull(),
  shortDescription: text("short_description").notNull().default(""),
  fullDetails: text("full_details").notNull().default(""),
  applicationInstructions: text("application_instructions").notNull().default(""),
  applicationEmail: text("application_email"),
  applicationUrl: text("application_url"),
  deadline: date("deadline", { mode: "string" }),
  status: opportunityStatusEnum("status").notNull().default("Hidden"),
  displayOrder: integer("display_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOpportunitySchema = createInsertSchema(opportunitiesTable)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunitiesTable.$inferSelect;