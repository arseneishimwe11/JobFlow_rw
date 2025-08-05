import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { jobsDB } from "./db";
import type { JobsResponse, JobFilters } from "./types";

interface ListJobsParams {
  page?: Query<number>;
  limit?: Query<number>;
  search?: Query<string>;
  location?: Query<string>;
  category?: Query<string>;
  job_type?: Query<string>;
  source_name?: Query<string>;
  date_range?: Query<string>;
}

// Retrieves all job listings with filtering and pagination support.
export const list = api<ListJobsParams, JobsResponse>(
  { expose: true, method: "GET", path: "/jobs" },
  async (params) => {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const offset = (page - 1) * limit;

    let whereClause = "WHERE is_active = TRUE";
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (params.search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR company ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(`%${params.search}%`);
      paramIndex++;
    }

    if (params.location) {
      whereClause += ` AND location ILIKE $${paramIndex}`;
      queryParams.push(`%${params.location}%`);
      paramIndex++;
    }

    if (params.category) {
      whereClause += ` AND category ILIKE $${paramIndex}`;
      queryParams.push(`%${params.category}%`);
      paramIndex++;
    }

    if (params.job_type) {
      whereClause += ` AND job_type ILIKE $${paramIndex}`;
      queryParams.push(`%${params.job_type}%`);
      paramIndex++;
    }

    if (params.source_name) {
      whereClause += ` AND source_name = $${paramIndex}`;
      queryParams.push(params.source_name);
      paramIndex++;
    }

    if (params.date_range) {
      const days = parseInt(params.date_range);
      if (!isNaN(days)) {
        whereClause += ` AND posted_date >= NOW() - INTERVAL '${days} days'`;
      }
    }

    const countQuery = `SELECT COUNT(*) as total FROM jobs ${whereClause}`;
    const totalResult = await jobsDB.rawQueryRow(countQuery, ...queryParams);
    const total = parseInt(totalResult?.total || "0");

    const jobsQuery = `
      SELECT * FROM jobs 
      ${whereClause}
      ORDER BY posted_date DESC NULLS LAST, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const jobs = await jobsDB.rawQueryAll(
      jobsQuery,
      ...queryParams,
      limit,
      offset
    );

    return {
      jobs: jobs.map(job => ({
        ...job,
        posted_date: job.posted_date ? new Date(job.posted_date) : undefined,
        scraped_at: new Date(job.scraped_at),
        created_at: new Date(job.created_at),
        updated_at: new Date(job.updated_at),
      })),
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }
);
