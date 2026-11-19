import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export * from "./auth-schema";
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  services: text("services").notNull().default(""),
  results: text("results").notNull().default(""),
  images: text("images").notNull().default("[]"),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  updatedAt: integer("updated_at").notNull(),
});

/**
 * Define your database schema here, then apply it with `bun run db:push`
 * (from packages/web). Re-export any generated schema from this file
 * (e.g. Better Auth's auth-schema.ts) so drizzle generates complete migrations.
 * Table patterns and conventions: skills/app/references/api.md
 */
