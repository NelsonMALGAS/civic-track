import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { municipalities } from "./municipality.schema";
import { residentProfiles } from "./resident.schema";
import { serviceCategories } from "./category.schema";
import { departments } from "./department.schema";
import { user } from "../../auth-schema";
import { geographyPoint } from "./geography";
import { serviceRequestPriorityEnum, serviceRequestStatusEnum } from "./enums";

export const serviceRequests = pgTable(
  "service_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    municipalityId: uuid("municipality_id")
      .notNull()
      .references(() => municipalities.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => serviceCategories.id, { onDelete: "restrict" }),
    residentProfileId: uuid("resident_profile_id").references(
      () => residentProfiles.id,
      { onDelete: "set null" },
    ),
    reporterUserId: text("reporter_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    departmentId: uuid("department_id").references(() => departments.id, {
      onDelete: "set null",
    }),
    referenceNumber: varchar("reference_number", { length: 40 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    status: serviceRequestStatusEnum("status").notNull().default("submitted"),
    priority: serviceRequestPriorityEnum("priority")
      .notNull()
      .default("medium"),
    address: text("address"),
    suburb: varchar("suburb", { length: 120 }),
    location: geographyPoint("location"),
    guestTrackingTokenHash: text("guest_tracking_token_hash"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("service_requests_tenant_reference_uq").on(
      table.municipalityId,
      table.referenceNumber,
    ),
    index("service_requests_tenant_status_idx").on(
      table.municipalityId,
      table.status,
    ),
    index("service_requests_tenant_priority_idx").on(
      table.municipalityId,
      table.priority,
    ),
    index("service_requests_category_idx").on(table.categoryId),
    index("service_requests_resident_idx").on(table.residentProfileId),
    index("service_requests_department_idx").on(table.departmentId),
    index("service_requests_submitted_idx").on(table.submittedAt),
    index("service_requests_location_gist_idx").using("gist", table.location),
  ],
);
