import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  bigint,
} from "drizzle-orm/pg-core";
import { serviceRequests } from "./service-request.schema";
import { municipalityMembers } from "./membership.schema";
import { teams } from "./department.schema";
import { user } from "../../auth-schema";
import {
  assignmentStatusEnum,
  attachmentVisibilityEnum,
  commentVisibilityEnum,
  serviceRequestStatusEnum,
} from "./enums";

export const requestAssignments = pgTable(
  "request_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    serviceRequestId: uuid("service_request_id")
      .notNull()
      .references(() => serviceRequests.id, { onDelete: "cascade" }),
    assignedToMemberId: uuid("assigned_to_member_id").references(
      () => municipalityMembers.id,
      { onDelete: "set null" },
    ),
    assignedToTeamId: uuid("assigned_to_team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    assignedByMemberId: uuid("assigned_by_member_id").references(
      () => municipalityMembers.id,
      { onDelete: "set null" },
    ),
    status: assignmentStatusEnum("status").notNull().default("active"),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    notes: text("notes"),
  },
  (table) => [
    index("request_assignments_request_idx").on(table.serviceRequestId),
    index("request_assignments_member_idx").on(table.assignedToMemberId),
    index("request_assignments_team_idx").on(table.assignedToTeamId),
  ],
);

export const requestStatusHistory = pgTable(
  "request_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    serviceRequestId: uuid("service_request_id")
      .notNull()
      .references(() => serviceRequests.id, { onDelete: "cascade" }),
    previousStatus: serviceRequestStatusEnum("previous_status"),
    newStatus: serviceRequestStatusEnum("new_status").notNull(),
    changedByUserId: text("changed_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("request_status_history_request_idx").on(
      table.serviceRequestId,
      table.createdAt,
    ),
  ],
);

export const requestComments = pgTable(
  "request_comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    serviceRequestId: uuid("service_request_id")
      .notNull()
      .references(() => serviceRequests.id, { onDelete: "cascade" }),
    authorUserId: text("author_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    body: text("body").notNull(),
    visibility: commentVisibilityEnum("visibility").notNull().default("public"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("request_comments_request_idx").on(table.serviceRequestId)],
);

export const requestAttachments = pgTable(
  "request_attachments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    serviceRequestId: uuid("service_request_id")
      .notNull()
      .references(() => serviceRequests.id, { onDelete: "cascade" }),
    uploadedByUserId: text("uploaded_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    fileUrl: text("file_url").notNull(),
    fileKey: text("file_key"),
    mimeType: varchar("mime_type", { length: 150 }).notNull(),
    fileSize: bigint("file_size", { mode: "number" }).notNull(),
    visibility: attachmentVisibilityEnum("visibility")
      .notNull()
      .default("public"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("request_attachments_request_idx").on(table.serviceRequestId),
  ],
);

export const workLogs = pgTable(
  "work_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    serviceRequestId: uuid("service_request_id")
      .notNull()
      .references(() => serviceRequests.id, { onDelete: "cascade" }),
    staffMemberId: uuid("staff_member_id")
      .notNull()
      .references(() => municipalityMembers.id, { onDelete: "restrict" }),
    action: varchar("action", { length: 120 }).notNull(),
    notes: text("notes"),
    minutesSpent: integer("minutes_spent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("work_logs_request_idx").on(table.serviceRequestId),
    index("work_logs_staff_idx").on(table.staffMemberId),
  ],
);
