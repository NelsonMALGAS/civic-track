import {
  boolean,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { municipalities } from "./municipality.schema";
import { serviceCategories } from "./category.schema";
import { serviceRequestPriorityEnum } from "./enums";
import { serviceRequests } from "./service-request.schema";

export const slaPolicies = pgTable(
  "sla_policies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    municipalityId: uuid("municipality_id")
      .notNull()
      .references(() => municipalities.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => serviceCategories.id, {
      onDelete: "cascade",
    }),
    priority: serviceRequestPriorityEnum("priority"),
    responseMinutes: integer("response_minutes").notNull(),
    resolutionMinutes: integer("resolution_minutes").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("sla_policies_tenant_active_idx").on(table.municipalityId, table.isActive)],
);

export const requestSlaTracking = pgTable(
  "request_sla_tracking",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    serviceRequestId: uuid("service_request_id")
      .notNull()
      .references(() => serviceRequests.id, { onDelete: "cascade" }),
    slaPolicyId: uuid("sla_policy_id").references(() => slaPolicies.id, {
      onDelete: "set null",
    }),
    responseDueAt: timestamp("response_due_at", { withTimezone: true }).notNull(),
    resolutionDueAt: timestamp("resolution_due_at", { withTimezone: true }).notNull(),
    firstResponseAt: timestamp("first_response_at", { withTimezone: true }),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("request_sla_tracking_response_due_idx").on(table.responseDueAt),
    index("request_sla_tracking_resolution_due_idx").on(table.resolutionDueAt),
  ],
);
