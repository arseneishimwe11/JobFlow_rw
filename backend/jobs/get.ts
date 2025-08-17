import { api, APIError } from "encore.dev/api";
import { jobsDB } from "./db";
import type { Job } from "./types";

interface GetJobParams {
  id: number;
}

// Retrieves a specific job by ID.
export const get = api<GetJobParams, Job>(
  { expose: true, method: "GET", path: "/jobs/:id" },
  async (params) => {
    const job = await jobsDB.queryRow`
      SELECT * FROM jobs
      WHERE id = ${params.id} AND is_active = TRUE
    `;

    if (!job) {
      throw APIError.notFound("Job not found");
    }

    return {
      id: job.id,
      title: job.title,
      company: job.company,
      company_id: job.company_id,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      salary_range: job.salary_range,
      job_type: job.job_type,
      category: job.category,
      source_url: job.source_url,
      source_name: job.source_name,
      posted_date: job.posted_date ? new Date(job.posted_date) : undefined,
      scraped_at: new Date(job.scraped_at),
      is_active: job.is_active,
      created_at: new Date(job.created_at),
      updated_at: new Date(job.updated_at),
    };
  }
);
