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

export const municipalities = pgTable(
  "municipalities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 180 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    description: text("description"),
    municipalityCode: varchar("municipality_code", { length: 40 }),
    province: varchar("province", { length: 100 }).notNull(),
    district: varchar("district", { length: 150 }),
    logoUrl: text("logo_url"),
    contactEmail: varchar("contact_email", { length: 255 }),
    contactPhone: varchar("contact_phone", { length: 40 }),
    website: text("website"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("municipalities_slug_uq").on(table.slug),
    uniqueIndex("municipalities_code_uq").on(table.municipalityCode),
    index("municipalities_province_idx").on(table.province),
  ],
);
