import { api, APIError } from "encore.dev/api";
import { jobsDB } from "./db";
import type { SavedJob } from "./types";

interface SaveJobRequest {
  user_id: number;
  job_id: number;
  notes?: string;
}

interface GetSavedJobsParams {
  user_id: number;
}

interface SavedJobsResponse {
  saved_jobs: SavedJob[];
}

// Saves a job for a user.
export const saveJob = api<SaveJobRequest, { success: boolean }>(
  { expose: true, method: "POST", path: "/jobs/save" },
  async (req) => {
    await jobsDB.exec`
      INSERT INTO saved_jobs (user_id, job_id, notes)
      VALUES (${req.user_id}, ${req.job_id}, ${req.notes})
      ON CONFLICT (user_id, job_id) DO UPDATE SET
        notes = EXCLUDED.notes,
        created_at = CURRENT_TIMESTAMP
    `;

    return { success: true };
  }
);

// Removes a saved job for a user.
export const unsaveJob = api<{ user_id: number; job_id: number }, { success: boolean }>(
  { expose: true, method: "DELETE", path: "/jobs/unsave" },
  async (req) => {
    await jobsDB.exec`
      DELETE FROM saved_jobs 
      WHERE user_id = ${req.user_id} AND job_id = ${req.job_id}
    `;

    return { success: true };
  }
);

// Retrieves all saved jobs for a user.
export const getSavedJobs = api<GetSavedJobsParams, SavedJobsResponse>(
  { expose: true, method: "GET", path: "/users/:user_id/saved-jobs" },
  async (params) => {
    const savedJobs = await jobsDB.queryAll`
      SELECT 
        sj.*,
        j.title, j.company, j.location, j.description, j.requirements,
        j.salary_range, j.job_type, j.category, j.source_url, j.source_name,
        j.posted_date, j.scraped_at, j.is_active, j.created_at as job_created_at,
        j.updated_at as job_updated_at
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      WHERE sj.user_id = ${params.user_id} AND j.is_active = TRUE
      ORDER BY sj.created_at DESC
    `;

    return {
      saved_jobs: savedJobs.map(row => ({
        id: row.id,
        user_id: row.user_id,
        job_id: row.job_id,
        notes: row.notes,
        created_at: new Date(row.created_at),
        job: {
          id: row.job_id,
          title: row.title,
          company: row.company,
          location: row.location,
          description: row.description,
          requirements: row.requirements,
          salary_range: row.salary_range,
          job_type: row.job_type,
          category: row.category,
          source_url: row.source_url,
          source_name: row.source_name,
          posted_date: row.posted_date ? new Date(row.posted_date) : undefined,
          scraped_at: new Date(row.scraped_at),
          is_active: row.is_active,
          created_at: new Date(row.job_created_at),
          updated_at: new Date(row.job_updated_at),
        },
      })),
    };
  }
);
