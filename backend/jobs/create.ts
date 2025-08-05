import { api } from "encore.dev/api";
import { jobsDB } from "./db";
import type { CreateJobRequest, Job } from "./types";

// Creates a new job listing.
export const create = api<CreateJobRequest, Job>(
  { expose: true, method: "POST", path: "/jobs" },
  async (req) => {
    const job = await jobsDB.queryRow`
      INSERT INTO jobs (
        title, company, location, description, requirements,
        salary_range, job_type, category, source_url, source_name, posted_date
      ) VALUES (
        ${req.title}, ${req.company}, ${req.location}, ${req.description},
        ${req.requirements}, ${req.salary_range}, ${req.job_type}, ${req.category},
        ${req.source_url}, ${req.source_name}, ${req.posted_date}
      )
      RETURNING *
    `;

    return {
      ...job,
      posted_date: job.posted_date ? new Date(job.posted_date) : undefined,
      scraped_at: new Date(job.scraped_at),
      created_at: new Date(job.created_at),
      updated_at: new Date(job.updated_at),
    };
  }
);
