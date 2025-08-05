import { api } from "encore.dev/api";
import { jobsDB } from "./db";

interface JobStats {
  total_jobs: number;
  active_jobs: number;
  jobs_by_source: Array<{ source_name: string; count: number }>;
  jobs_by_category: Array<{ category: string; count: number }>;
  recent_jobs: number;
}

// Retrieves platform statistics and analytics.
export const stats = api<void, JobStats>(
  { expose: true, method: "GET", path: "/jobs/stats" },
  async () => {
    const totalJobs = await jobsDB.queryRow`
      SELECT COUNT(*) as count FROM jobs
    `;

    const activeJobs = await jobsDB.queryRow`
      SELECT COUNT(*) as count FROM jobs WHERE is_active = TRUE
    `;

    const jobsBySource = await jobsDB.queryAll`
      SELECT source_name, COUNT(*) as count 
      FROM jobs 
      WHERE is_active = TRUE 
      GROUP BY source_name 
      ORDER BY count DESC
    `;

    const jobsByCategory = await jobsDB.queryAll`
      SELECT category, COUNT(*) as count 
      FROM jobs 
      WHERE is_active = TRUE AND category IS NOT NULL 
      GROUP BY category 
      ORDER BY count DESC
      LIMIT 10
    `;

    const recentJobs = await jobsDB.queryRow`
      SELECT COUNT(*) as count 
      FROM jobs 
      WHERE is_active = TRUE 
      AND created_at >= NOW() - INTERVAL '7 days'
    `;

    return {
      total_jobs: parseInt(totalJobs.count),
      active_jobs: parseInt(activeJobs.count),
      jobs_by_source: jobsBySource.map(row => ({
        source_name: row.source_name,
        count: parseInt(row.count)
      })),
      jobs_by_category: jobsByCategory.map(row => ({
        category: row.category,
        count: parseInt(row.count)
      })),
      recent_jobs: parseInt(recentJobs.count),
    };
  }
);
