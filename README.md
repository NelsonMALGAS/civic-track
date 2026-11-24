# CivicTrack

### A smarter way to connect communities with local government.

CivicTrack is a modern civic engagement and municipal service-delivery platform designed to bridge the gap between residents and local government. It provides a centralized digital environment where residents can report service delivery issues, municipalities can coordinate responses, and administrators can monitor operational performance.

By replacing fragmented reporting processes with structured digital workflows, CivicTrack aims to improve transparency, accountability, and the overall efficiency of municipal service delivery.

> **Project status:** In Development

---

## Overview

Service delivery challenges remain a significant concern for communities, particularly when residents lack accessible channels to report problems and municipalities struggle to coordinate, track, and resolve incoming requests.

CivicTrack addresses these challenges through a shared municipal platform that brings residents, municipal administrators, department managers, and municipal staff into one connected system.

Residents can submit service requests, follow their progress, and receive updates. Municipal teams can manage incoming requests, assign responsibilities, monitor service-level agreements (SLAs), and maintain an auditable record of actions taken.

The goal is simple: make municipal service delivery more accessible, measurable, and accountable.

## Core Features

### Resident Engagement
- Submit municipal service delivery complaints and requests.
- Report issues with supporting attachments.
- Provide location information for reported incidents.
- Track the progress and status of submitted requests.
- Receive notifications and updates.

### Municipal Management
- Centralized municipal administration.
- Department and team management.
- Staff membership and role-based access.
- Assign service requests to relevant departments and personnel.
- Monitor operational workloads and request progress.

### Service Request Management
- Structured service request lifecycle.
- Request categorization and prioritization.
- Assignment and reassignment workflows.
- Internal and public communication.
- Status history and work-log tracking.

### Accountability and Performance
- Service-level agreement (SLA) policies.
- SLA monitoring and breach tracking.
- Request activity and audit logs.
- Operational visibility into outstanding and resolved requests.

### Geospatial Capabilities
- Location-based service request reporting.
- Geographic data management using PostGIS.
- Spatial queries to support location-aware municipal operations.

---

## User Roles

CivicTrack is designed around distinct user roles with appropriate access and responsibilities.

| Role | Responsibilities |
|---|---|
| Resident | Submit and track service requests. |
| Municipal Administrator | Manage municipal operations, departments, teams, and memberships. |
| Department Manager | Coordinate departmental requests and staff. |
| Municipal Staff | Handle assigned requests and record work performed. |

---

## Technology Stack

CivicTrack uses a modern TypeScript-based technology stack focused on maintainability, scalability, and reliable data management.

| Technology | Purpose |
|---|---|
| Next.js | Full-stack application framework |
| TypeScript | Type safety and maintainability |
| PostgreSQL | Relational database |
| Neon | Serverless PostgreSQL hosting |
| PostGIS | Geospatial data management |
| Drizzle ORM | Database schema and query management |
| Better Auth | Authentication and session management |
| shadcn/ui | Reusable interface components |
| Tailwind CSS | Styling and responsive layouts |

---

## System Architecture

CivicTrack follows a shared municipal architecture.

Rather than maintaining a separate application for every municipality, the platform is designed to support multiple municipalities within a shared database.

Municipal records are logically separated through their relationships and ownership, allowing each municipality to manage its own departments, teams, staff, and service requests.

The database architecture uses PostgreSQL for relational data and PostGIS for spatial capabilities.

Better Auth manages authentication independently of the application's domain-specific database schema.

### High-level architecture

```text
                    CIVICTRACK
                         |
          +--------------+--------------+
          |                             |
     RESIDENTS                    MUNICIPALITIES
          |                             |
  Submit Service Requests       Municipal Administration
          |                             |
          +--------------+--------------+
                         |
                 SERVICE REQUESTS
                         |
          +--------------+--------------+
          |              |              |
      Assignment       Tracking        Updates
          |              |              |
       Departments    SLA Monitoring  Notifications
          |              |              |
          +--------------+--------------+
                         |
                  PostgreSQL
                         |
                       Neon
                         |
                      PostGIS
```

---

## Database Design

The database is organized into domain-specific schemas and relationships.

Core entities include:

- **Municipalities:** Municipal organizations using the platform.
- **Municipality Members:** Users associated with municipalities and their roles.
- **Departments:** Organizational units responsible for service delivery.
- **Teams:** Operational groups within departments.
- **Team Members:** Staff assigned to teams.
- **Resident Profiles:** Resident information and associated addresses.
- **Service Categories:** Classification of municipal service requests.
- **Service Requests:** Issues and complaints submitted by residents.
- **Request Assignments:** Assignment records for municipal personnel.
- **Request Comments:** Public and internal communication.
- **Request Attachments:** Supporting documents and images.
- **Request Status History:** Historical record of request status changes.
- **Work Logs:** Records of work performed.
- **SLA Policies:** Service-level rules and response targets.
- **SLA Tracking:** Monitoring request deadlines and breaches.
- **Notifications:** Communication and system alerts.
- **Audit Logs:** Records of important system activities.

Better Auth maintains its authentication tables separately, including users, sessions, accounts, and verification records.

---

## Getting Started

### Prerequisites

Before running CivicTrack locally, ensure you have:

- Node.js (LTS recommended)
- npm
- A PostgreSQL database
- A Neon account or another PostgreSQL provider
- PostGIS installed and enabled on your database

### 1. Clone the repository

```bash
git clone https://github.com/NelsonMALGAS/civic-track.git
cd civic-track
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# Better Auth
BETTER_AUTH_SECRET="your_secret_key"
GOOGLE_CLIENT_ID="google-client-id"
GOOGLE_CLIENT_SECRET="google-client-secret"
GITHUB_CLIENT_ID="github-client-id"
GITHUB_CLIENT_SECRET="github-client-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

Generate a secure authentication secret and use your actual database connection string.

### 4. Enable PostGIS

Run the following SQL against your PostgreSQL database:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 5. Generate database migrations

```bash
npm run db:generate
```

### 6. Apply migrations

```bash
npm run db:migrate
```

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Goals

CivicTrack is being developed with the following long-term objectives:

1. **Improve accessibility:** Make it easier for residents to communicate service delivery issues to their municipalities.
2. **Promote accountability:** Establish traceable workflows for municipal service requests.
3. **Improve operational efficiency:** Help municipalities coordinate departments, teams, and staff.
4. **Enable data-driven decisions:** Provide structured service delivery data that can support planning and performance monitoring.
5. **Support scalable municipal operations:** Build a shared platform capable of supporting multiple municipalities.

---

## Development Roadmap

CivicTrack is actively being developed. Planned development areas include:

- [ ] Complete authentication and authorization workflows.
- [ ] Implement resident registration and profiles.
- [ ] Build service request submission and tracking.
- [ ] Implement municipal administration and onboarding.
- [ ] Complete department, team, and staff management.
- [ ] Implement request assignment and workflow management.
- [ ] Integrate SLA monitoring.
- [ ] Implement notifications and communication.
- [ ] Build administrative dashboards and reporting.
- [ ] Expand geospatial reporting and visualization.
- [ ] Add comprehensive testing and production deployment.

---

## Contributing

CivicTrack is currently under active development.

Contributions, suggestions, and constructive feedback are welcome as the project evolves.

For significant changes, consider opening an issue first to discuss the proposed implementation.

---

## License

The licensing terms for CivicTrack have not yet been finalized.

---

**CivicTrack — Connecting communities. Improving service delivery. Building accountability.**