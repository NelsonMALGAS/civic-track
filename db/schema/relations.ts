import { relations } from "drizzle-orm/_relations";
import { municipalities } from "./municipality.schema";
import { municipalityMembers } from "./membership.schema";
import { departments, teams, teamMembers } from "./department.schema";
import { residentProfiles, residentAddresses } from "./resident.schema";
import { serviceCategories } from "./category.schema";
import { serviceRequests } from "./service-request.schema";
import {
  requestAssignments,
  requestStatusHistory,
  requestComments,
  requestAttachments,
  workLogs,
} from "./operations.schema";
import { slaPolicies, requestSlaTracking } from "./sla.schema";
import { notifications } from "./communication.schema";
import { auditLogs } from "./audit-log.schema";
import { user } from "../../auth-schema";

export const municipalitiesRelations = relations(
  municipalities,
  ({ many }) => ({
    members: many(municipalityMembers),
    departments: many(departments),
    categories: many(serviceCategories),
    serviceRequests: many(serviceRequests),
    slaPolicies: many(slaPolicies),
  }),
);

export const municipalityMembersRelations = relations(
  municipalityMembers,
  ({ one, many }) => ({
    municipality: one(municipalities, {
      fields: [municipalityMembers.municipalityId],
      references: [municipalities.id],
    }),
    user: one(user, {
      fields: [municipalityMembers.userId],
      references: [user.id],
    }),
    teams: many(teamMembers),
    assignmentsAsAssignee: many(requestAssignments, {
      relationName: "assignedToMember",
    }),
    assignmentsCreated: many(requestAssignments, {
      relationName: "assignedByMember",
    }),
    workLogs: many(workLogs),
  }),
);

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  municipality: one(municipalities, {
    fields: [departments.municipalityId],
    references: [municipalities.id],
  }),
  manager: one(municipalityMembers, {
    fields: [departments.managerMemberId],
    references: [municipalityMembers.id],
  }),
  teams: many(teams),
  serviceRequests: many(serviceRequests),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  department: one(departments, {
    fields: [teams.departmentId],
    references: [departments.id],
  }),
  members: many(teamMembers),
  assignments: many(requestAssignments),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  member: one(municipalityMembers, {
    fields: [teamMembers.municipalityMemberId],
    references: [municipalityMembers.id],
  }),
}));

export const residentProfilesRelations = relations(
  residentProfiles,
  ({ one, many }) => ({
    user: one(user, {
      fields: [residentProfiles.userId],
      references: [user.id],
    }),
    addresses: many(residentAddresses),
    serviceRequests: many(serviceRequests),
  }),
);

export const residentAddressesRelations = relations(
  residentAddresses,
  ({ one }) => ({
    resident: one(residentProfiles, {
      fields: [residentAddresses.residentProfileId],
      references: [residentProfiles.id],
    }),
  }),
);

export const serviceCategoriesRelations = relations(
  serviceCategories,
  ({ one, many }) => ({
    municipality: one(municipalities, {
      fields: [serviceCategories.municipalityId],
      references: [municipalities.id],
    }),
    serviceRequests: many(serviceRequests),
    slaPolicies: many(slaPolicies),
  }),
);

export const serviceRequestsRelations = relations(
  serviceRequests,
  ({ one, many }) => ({
    municipality: one(municipalities, {
      fields: [serviceRequests.municipalityId],
      references: [municipalities.id],
    }),
    category: one(serviceCategories, {
      fields: [serviceRequests.categoryId],
      references: [serviceCategories.id],
    }),
    resident: one(residentProfiles, {
      fields: [serviceRequests.residentProfileId],
      references: [residentProfiles.id],
    }),
    reporter: one(user, {
      fields: [serviceRequests.reporterUserId],
      references: [user.id],
    }),
    department: one(departments, {
      fields: [serviceRequests.departmentId],
      references: [departments.id],
    }),
    assignments: many(requestAssignments),
    statusHistory: many(requestStatusHistory),
    comments: many(requestComments),
    attachments: many(requestAttachments),
    workLogs: many(workLogs),
    slaTracking: many(requestSlaTracking),
  }),
);

export const requestAssignmentsRelations = relations(
  requestAssignments,
  ({ one }) => ({
    serviceRequest: one(serviceRequests, {
      fields: [requestAssignments.serviceRequestId],
      references: [serviceRequests.id],
    }),
    assignedToMember: one(municipalityMembers, {
      fields: [requestAssignments.assignedToMemberId],
      references: [municipalityMembers.id],
      relationName: "assignedToMember",
    }),
    assignedByMember: one(municipalityMembers, {
      fields: [requestAssignments.assignedByMemberId],
      references: [municipalityMembers.id],
      relationName: "assignedByMember",
    }),
    assignedToTeam: one(teams, {
      fields: [requestAssignments.assignedToTeamId],
      references: [teams.id],
    }),
  }),
);

export const requestStatusHistoryRelations = relations(
  requestStatusHistory,
  ({ one }) => ({
    serviceRequest: one(serviceRequests, {
      fields: [requestStatusHistory.serviceRequestId],
      references: [serviceRequests.id],
    }),
    changedBy: one(user, {
      fields: [requestStatusHistory.changedByUserId],
      references: [user.id],
    }),
  }),
);

export const requestCommentsRelations = relations(
  requestComments,
  ({ one }) => ({
    serviceRequest: one(serviceRequests, {
      fields: [requestComments.serviceRequestId],
      references: [serviceRequests.id],
    }),
    author: one(user, {
      fields: [requestComments.authorUserId],
      references: [user.id],
    }),
  }),
);

export const requestAttachmentsRelations = relations(
  requestAttachments,
  ({ one }) => ({
    serviceRequest: one(serviceRequests, {
      fields: [requestAttachments.serviceRequestId],
      references: [serviceRequests.id],
    }),
    uploader: one(user, {
      fields: [requestAttachments.uploadedByUserId],
      references: [user.id],
    }),
  }),
);

export const workLogsRelations = relations(workLogs, ({ one }) => ({
  serviceRequest: one(serviceRequests, {
    fields: [workLogs.serviceRequestId],
    references: [serviceRequests.id],
  }),
  staffMember: one(municipalityMembers, {
    fields: [workLogs.staffMemberId],
    references: [municipalityMembers.id],
  }),
}));

export const slaPoliciesRelations = relations(slaPolicies, ({ one, many }) => ({
  municipality: one(municipalities, {
    fields: [slaPolicies.municipalityId],
    references: [municipalities.id],
  }),
  category: one(serviceCategories, {
    fields: [slaPolicies.categoryId],
    references: [serviceCategories.id],
  }),
  trackingRecords: many(requestSlaTracking),
}));

export const requestSlaTrackingRelations = relations(
  requestSlaTracking,
  ({ one }) => ({
    serviceRequest: one(serviceRequests, {
      fields: [requestSlaTracking.serviceRequestId],
      references: [serviceRequests.id],
    }),
    policy: one(slaPolicies, {
      fields: [requestSlaTracking.slaPolicyId],
      references: [slaPolicies.id],
    }),
  }),
);

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(user, {
    fields: [notifications.userId],
    references: [user.id],
  }),
  municipality: one(municipalities, {
    fields: [notifications.municipalityId],
    references: [municipalities.id],
  }),
  serviceRequest: one(serviceRequests, {
    fields: [notifications.serviceRequestId],
    references: [serviceRequests.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  municipality: one(municipalities, {
    fields: [auditLogs.municipalityId],
    references: [municipalities.id],
  }),
  actor: one(user, {
    fields: [auditLogs.actorUserId],
    references: [user.id],
  }),
}));
