import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "../../auth-schema";
import { municipalities } from "./municipality.schema";
import { municipalityMemberRoleEnum, membershipStatusEnum } from "./enums";

export const municipalityMembers = pgTable(
  "municipality_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    municipalityId: uuid("municipality_id")
      .notNull()
      .references(() => municipalities.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: municipalityMemberRoleEnum("role").notNull().default("staff"),
    status: membershipStatusEnum("status").notNull().default("invited"),
    invitedByUserId: text("invited_by_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    joinedAt: timestamp("joined_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("municipality_members_tenant_user_uq").on(
      table.municipalityId,
      table.userId,
    ),
    index("municipality_members_user_idx").on(table.userId),
    index("municipality_members_tenant_role_idx").on(
      table.municipalityId,
      table.role,
    ),
  ],
);
