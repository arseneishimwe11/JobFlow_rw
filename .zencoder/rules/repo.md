---
description: Repository Information Overview
alwaysApply: true
---

# JobFlow Rwanda Information

## Summary
JobFlow Rwanda (Akazi Rwanda) is a comprehensive job aggregation platform that scrapes job listings from major Rwandan job websites. The project consists of a TypeScript-based backend using Encore.dev framework and a React-based frontend. The system features multi-source scraping, database integration, automated scheduling, and a REST API.

## Structure
- **backend/**: Encore.dev application with job scrapers and API endpoints
  - **scrapers/**: Modular scrapers for different job websites
  - **jobs/**: Job management, API endpoints, and database operations
- **frontend/**: React application with Vite and TailwindCSS
  - **components/**: UI components including job cards, filters, and search
  - **pages/**: Main application pages for jobs, companies, and analytics

## Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.8.3
**Build System**: Vite (frontend), Encore (backend)
**Package Manager**: Bun 1.0.25

## Dependencies
**Backend Dependencies**:
- encore.dev: ^1.48.12 (Backend framework)
- node-cron: ^4.2.1 (Job scheduling)
- puppeteer: ^24.16.0 (Web scraping)

**Frontend Dependencies**:
- react: ^19.1.0 (UI framework)
- react-dom: ^19.1.0
- react-router-dom: ^7.6.3 (Routing)
- @radix-ui/react-*: UI component primitives
- @tanstack/react-query: ^5.81.5 (Data fetching)
- tailwindcss: ^4.1.11 (Styling)
- vite: ^6.3.5 (Build tool)

## Build & Installation
```bash
# Install dependencies
bun install

# Backend setup
cd backend
encore run

# Frontend setup
cd frontend
npx vite dev

# Generate frontend client
cd backend
encore gen client --target leap
```

## Database
**Type**: PostgreSQL (managed by Encore)
**Migrations**: Located in backend/jobs/migrations
**Tables**:
- jobs: Stores scraped job listings
- scraping_logs: Logs scraping operations
- users: User information
- saved_jobs: User's saved job listings
- job_alerts: User's job alert preferences
- companies: Company information
- job_applications: User's job applications

## Testing
No specific testing framework configuration found in the repository.

## Deployment
**Self-hosting**:
- Docker build via Encore: `encore build docker`

**Encore Cloud Platform**:
```bash
# Login to Encore
encore auth login

# Add Encore remote
git remote add encore encore://rwanda-job-platform-etc2

# Deploy
git push encore
```

**GitHub Integration**:
- Connect GitHub repository to Encore Cloud
- Push to GitHub to trigger automatic deployments