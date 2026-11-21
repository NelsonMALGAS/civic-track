import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { municipalities } from "./municipality.schema";

export const serviceCategories = pgTable(
  "service_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    municipalityId: uuid("municipality_id")
      .notNull()
      .references(() => municipalities.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 140 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 80 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("service_categories_tenant_slug_uq").on(
      table.municipalityId,
      table.slug,
    ),
    index("service_categories_tenant_idx").on(table.municipalityId),
  ],
);
