import { pgEnum } from "drizzle-orm/pg-core";

export const municipalityMemberRoleEnum = pgEnum("municipality_member_role", [
  "municipal_admin",
  "department_manager",
  "staff",
]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "invited",
  "active",
  "suspended",
  "removed",
]);

export const serviceRequestStatusEnum = pgEnum("service_request_status", [
  "submitted",
  "acknowledged",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
  "rejected",
  "reopened",
  "cancelled",
]);

export const serviceRequestPriorityEnum = pgEnum("service_request_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const assignmentStatusEnum = pgEnum("assignment_status", [
  "active",
  "completed",
  "cancelled",
]);

export const commentVisibilityEnum = pgEnum("comment_visibility", [
  "public",
  "internal",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "request_submitted",
  "request_acknowledged",
  "request_assigned",
  "request_status_changed",
  "request_commented",
  "sla_warning",
  "sla_breached",
  "system",
]);

export const attachmentVisibilityEnum = pgEnum("attachment_visibility", [
  "public",
  "internal",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "login",
  "logout",
  "assign",
  "status_change",
  "export",
  "other",
]);
