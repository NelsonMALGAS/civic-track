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
import { user } from "../../auth-schema";

export const residentProfiles = pgTable(
  "resident_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fullName: varchar("full_name", { length: 180 }).notNull(),
    phone: varchar("phone", { length: 40 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("resident_profiles_user_uq").on(table.userId)],
);

export const residentAddresses = pgTable(
  "resident_addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    residentProfileId: uuid("resident_profile_id")
      .notNull()
      .references(() => residentProfiles.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 80 }),
    addressLine: text("address_line").notNull(),
    suburb: varchar("suburb", { length: 120 }),
    city: varchar("city", { length: 120 }),
    province: varchar("province", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    location: text("location"),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("resident_addresses_profile_idx").on(table.residentProfileId),
  ],
);
