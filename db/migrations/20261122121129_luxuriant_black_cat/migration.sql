CREATE TYPE "assignment_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "attachment_visibility" AS ENUM('public', 'internal');--> statement-breakpoint
CREATE TYPE "audit_action" AS ENUM('create', 'update', 'delete', 'login', 'logout', 'assign', 'status_change', 'export', 'other');--> statement-breakpoint
CREATE TYPE "comment_visibility" AS ENUM('public', 'internal');--> statement-breakpoint
CREATE TYPE "membership_status" AS ENUM('invited', 'active', 'suspended', 'removed');--> statement-breakpoint
CREATE TYPE "municipality_member_role" AS ENUM('municipal_admin', 'department_manager', 'staff');--> statement-breakpoint
CREATE TYPE "notification_type" AS ENUM('request_submitted', 'request_acknowledged', 'request_assigned', 'request_status_changed', 'request_commented', 'sla_warning', 'sla_breached', 'system');--> statement-breakpoint
CREATE TYPE "service_request_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "service_request_status" AS ENUM('submitted', 'acknowledged', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected', 'reopened', 'cancelled');--> statement-breakpoint
CREATE TABLE "municipalities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(180) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"description" text,
	"municipality_code" varchar(40),
	"province" varchar(100) NOT NULL,
	"district" varchar(150),
	"logo_url" text,
	"contact_email" varchar(255),
	"contact_phone" varchar(40),
	"website" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "municipality_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"municipality_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "municipality_member_role" DEFAULT 'staff'::"municipality_member_role" NOT NULL,
	"status" "membership_status" DEFAULT 'invited'::"membership_status" NOT NULL,
	"invited_by_user_id" text,
	"joined_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"municipality_id" uuid NOT NULL,
	"name" varchar(160) NOT NULL,
	"code" varchar(40) NOT NULL,
	"description" text,
	"manager_member_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"team_id" uuid NOT NULL,
	"municipality_member_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"department_id" uuid NOT NULL,
	"name" varchar(160) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resident_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"resident_profile_id" uuid NOT NULL,
	"label" varchar(80),
	"address_line" text NOT NULL,
	"suburb" varchar(120),
	"city" varchar(120),
	"province" varchar(100),
	"postal_code" varchar(20),
	"location" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resident_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"full_name" varchar(180) NOT NULL,
	"phone" varchar(40),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"municipality_id" uuid NOT NULL,
	"name" varchar(140) NOT NULL,
	"slug" varchar(160) NOT NULL,
	"description" text,
	"icon" varchar(80),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"municipality_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"resident_profile_id" uuid,
	"reporter_user_id" text,
	"department_id" uuid,
	"reference_number" varchar(40) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"status" "service_request_status" DEFAULT 'submitted'::"service_request_status" NOT NULL,
	"priority" "service_request_priority" DEFAULT 'medium'::"service_request_priority" NOT NULL,
	"address" text,
	"suburb" varchar(120),
	"location" geography(Point,4326),
	"guest_tracking_token_hash" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"service_request_id" uuid NOT NULL,
	"assigned_to_member_id" uuid,
	"assigned_to_team_id" uuid,
	"assigned_by_member_id" uuid,
	"status" "assignment_status" DEFAULT 'active'::"assignment_status" NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "request_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"service_request_id" uuid NOT NULL,
	"uploaded_by_user_id" text,
	"file_name" varchar(255) NOT NULL,
	"file_url" text NOT NULL,
	"file_key" text,
	"mime_type" varchar(150) NOT NULL,
	"file_size" bigint NOT NULL,
	"visibility" "attachment_visibility" DEFAULT 'public'::"attachment_visibility" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"service_request_id" uuid NOT NULL,
	"author_user_id" text,
	"body" text NOT NULL,
	"visibility" "comment_visibility" DEFAULT 'public'::"comment_visibility" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"service_request_id" uuid NOT NULL,
	"previous_status" "service_request_status",
	"new_status" "service_request_status" NOT NULL,
	"changed_by_user_id" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"service_request_id" uuid NOT NULL,
	"staff_member_id" uuid NOT NULL,
	"action" varchar(120) NOT NULL,
	"notes" text,
	"minutes_spent" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_sla_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"service_request_id" uuid NOT NULL,
	"sla_policy_id" uuid,
	"response_due_at" timestamp with time zone NOT NULL,
	"resolution_due_at" timestamp with time zone NOT NULL,
	"first_response_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sla_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"municipality_id" uuid NOT NULL,
	"category_id" uuid,
	"priority" "service_request_priority",
	"response_minutes" integer NOT NULL,
	"resolution_minutes" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"municipality_id" uuid,
	"service_request_id" uuid,
	"type" "notification_type" NOT NULL,
	"title" varchar(180) NOT NULL,
	"message" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"municipality_id" uuid,
	"actor_user_id" text,
	"action" "audit_action" NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" text,
	"metadata" jsonb,
	"ip_address" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "municipalities_slug_uq" ON "municipalities" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "municipalities_code_uq" ON "municipalities" ("municipality_code");--> statement-breakpoint
CREATE INDEX "municipalities_province_idx" ON "municipalities" ("province");--> statement-breakpoint
CREATE UNIQUE INDEX "municipality_members_tenant_user_uq" ON "municipality_members" ("municipality_id","user_id");--> statement-breakpoint
CREATE INDEX "municipality_members_user_idx" ON "municipality_members" ("user_id");--> statement-breakpoint
CREATE INDEX "municipality_members_tenant_role_idx" ON "municipality_members" ("municipality_id","role");--> statement-breakpoint
CREATE UNIQUE INDEX "departments_tenant_code_uq" ON "departments" ("municipality_id","code");--> statement-breakpoint
CREATE INDEX "departments_tenant_idx" ON "departments" ("municipality_id");--> statement-breakpoint
CREATE UNIQUE INDEX "team_members_team_member_uq" ON "team_members" ("team_id","municipality_member_id");--> statement-breakpoint
CREATE INDEX "team_members_member_idx" ON "team_members" ("municipality_member_id");--> statement-breakpoint
CREATE INDEX "teams_department_idx" ON "teams" ("department_id");--> statement-breakpoint
CREATE INDEX "resident_addresses_profile_idx" ON "resident_addresses" ("resident_profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resident_profiles_user_uq" ON "resident_profiles" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "service_categories_tenant_slug_uq" ON "service_categories" ("municipality_id","slug");--> statement-breakpoint
CREATE INDEX "service_categories_tenant_idx" ON "service_categories" ("municipality_id");--> statement-breakpoint
CREATE UNIQUE INDEX "service_requests_tenant_reference_uq" ON "service_requests" ("municipality_id","reference_number");--> statement-breakpoint
CREATE INDEX "service_requests_tenant_status_idx" ON "service_requests" ("municipality_id","status");--> statement-breakpoint
CREATE INDEX "service_requests_tenant_priority_idx" ON "service_requests" ("municipality_id","priority");--> statement-breakpoint
CREATE INDEX "service_requests_category_idx" ON "service_requests" ("category_id");--> statement-breakpoint
CREATE INDEX "service_requests_resident_idx" ON "service_requests" ("resident_profile_id");--> statement-breakpoint
CREATE INDEX "service_requests_department_idx" ON "service_requests" ("department_id");--> statement-breakpoint
CREATE INDEX "service_requests_submitted_idx" ON "service_requests" ("submitted_at");--> statement-breakpoint
CREATE INDEX "service_requests_location_gist_idx" ON "service_requests" USING gist ("location");--> statement-breakpoint
CREATE INDEX "request_assignments_request_idx" ON "request_assignments" ("service_request_id");--> statement-breakpoint
CREATE INDEX "request_assignments_member_idx" ON "request_assignments" ("assigned_to_member_id");--> statement-breakpoint
CREATE INDEX "request_assignments_team_idx" ON "request_assignments" ("assigned_to_team_id");--> statement-breakpoint
CREATE INDEX "request_attachments_request_idx" ON "request_attachments" ("service_request_id");--> statement-breakpoint
CREATE INDEX "request_comments_request_idx" ON "request_comments" ("service_request_id");--> statement-breakpoint
CREATE INDEX "request_status_history_request_idx" ON "request_status_history" ("service_request_id","created_at");--> statement-breakpoint
CREATE INDEX "work_logs_request_idx" ON "work_logs" ("service_request_id");--> statement-breakpoint
CREATE INDEX "work_logs_staff_idx" ON "work_logs" ("staff_member_id");--> statement-breakpoint
CREATE INDEX "request_sla_tracking_response_due_idx" ON "request_sla_tracking" ("response_due_at");--> statement-breakpoint
CREATE INDEX "request_sla_tracking_resolution_due_idx" ON "request_sla_tracking" ("resolution_due_at");--> statement-breakpoint
CREATE INDEX "sla_policies_tenant_active_idx" ON "sla_policies" ("municipality_id","is_active");--> statement-breakpoint
CREATE INDEX "notifications_user_unread_idx" ON "notifications" ("user_id","read_at");--> statement-breakpoint
CREATE INDEX "notifications_created_idx" ON "notifications" ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_tenant_created_idx" ON "audit_logs" ("municipality_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" ("actor_user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" ("entity_type","entity_id");--> statement-breakpoint
ALTER TABLE "municipality_members" ADD CONSTRAINT "municipality_members_municipality_id_municipalities_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "municipality_members" ADD CONSTRAINT "municipality_members_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "municipality_members" ADD CONSTRAINT "municipality_members_invited_by_user_id_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_municipality_id_municipalities_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_manager_member_id_municipality_members_id_fkey" FOREIGN KEY ("manager_member_id") REFERENCES "municipality_members"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_T6zhE5AIWCjA_fkey" FOREIGN KEY ("municipality_member_id") REFERENCES "municipality_members"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_department_id_departments_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "resident_addresses" ADD CONSTRAINT "resident_addresses_PibuJGY5xZ7s_fkey" FOREIGN KEY ("resident_profile_id") REFERENCES "resident_profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "resident_profiles" ADD CONSTRAINT "resident_profiles_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "service_categories" ADD CONSTRAINT "service_categories_municipality_id_municipalities_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_municipality_id_municipalities_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_category_id_service_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_resident_profile_id_resident_profiles_id_fkey" FOREIGN KEY ("resident_profile_id") REFERENCES "resident_profiles"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_reporter_user_id_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_department_id_departments_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "request_assignments" ADD CONSTRAINT "request_assignments_service_request_id_service_requests_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "request_assignments" ADD CONSTRAINT "request_assignments_RwGEYcG61cFH_fkey" FOREIGN KEY ("assigned_to_member_id") REFERENCES "municipality_members"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "request_assignments" ADD CONSTRAINT "request_assignments_assigned_to_team_id_teams_id_fkey" FOREIGN KEY ("assigned_to_team_id") REFERENCES "teams"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "request_assignments" ADD CONSTRAINT "request_assignments_hc2lz27WbNxT_fkey" FOREIGN KEY ("assigned_by_member_id") REFERENCES "municipality_members"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "request_attachments" ADD CONSTRAINT "request_attachments_service_request_id_service_requests_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "request_attachments" ADD CONSTRAINT "request_attachments_uploaded_by_user_id_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "request_comments" ADD CONSTRAINT "request_comments_service_request_id_service_requests_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "request_comments" ADD CONSTRAINT "request_comments_author_user_id_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "request_status_history" ADD CONSTRAINT "request_status_history_rcF5jkt1XjTE_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "request_status_history" ADD CONSTRAINT "request_status_history_changed_by_user_id_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "work_logs" ADD CONSTRAINT "work_logs_service_request_id_service_requests_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "work_logs" ADD CONSTRAINT "work_logs_staff_member_id_municipality_members_id_fkey" FOREIGN KEY ("staff_member_id") REFERENCES "municipality_members"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "request_sla_tracking" ADD CONSTRAINT "request_sla_tracking_wKqOSta9hBx1_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "request_sla_tracking" ADD CONSTRAINT "request_sla_tracking_sla_policy_id_sla_policies_id_fkey" FOREIGN KEY ("sla_policy_id") REFERENCES "sla_policies"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "sla_policies" ADD CONSTRAINT "sla_policies_municipality_id_municipalities_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sla_policies" ADD CONSTRAINT "sla_policies_category_id_service_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_municipality_id_municipalities_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_service_request_id_service_requests_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_municipality_id_municipalities_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "user"("id") ON DELETE SET NULL;