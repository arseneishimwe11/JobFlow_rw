import { api } from "encore.dev/api";
import { jobsDB } from "./db";
import type { ScrapingLog } from "./types";

interface ScrapeJobsParams {
  source?: string;
}

interface ScrapeJobsResponse {
  message: string;
  logs: ScrapingLog[];
}

// Triggers job scraping from specified sources or all sources.
export const scrape = api<ScrapeJobsParams, ScrapeJobsResponse>(
  { expose: true, method: "POST", path: "/jobs/scrape" },
  async (params) => {
    const sources = params.source ? [params.source] : [
      "rwandajob.com",
      "kora.rw",
      "jobwebrwanda.com",
      "newtimes.co.rw",
      "jobinrwanda.com",
      "jobboardfinder.com",
      "ndangira.net",
      "greatrwandajobs.com"
    ];

    const logs: ScrapingLog[] = [];

    for (const source of sources) {
      const logId = await jobsDB.queryRow`
        INSERT INTO scraping_logs (source_name, status)
        VALUES (${source}, 'started')
        RETURNING id
      `;

      try {
        const result = await scrapeJobsFromSource(source);
        
        await jobsDB.exec`
          UPDATE scraping_logs 
          SET jobs_found = ${result.found}, 
              jobs_added = ${result.added},
              jobs_updated = ${result.updated},
              status = 'completed',
              completed_at = CURRENT_TIMESTAMP
          WHERE id = ${logId.id}
        `;

        const log = await jobsDB.queryRow`
          SELECT * FROM scraping_logs WHERE id = ${logId.id}
        `;
        
        logs.push({
          ...log,
          started_at: new Date(log.started_at),
          completed_at: log.completed_at ? new Date(log.completed_at) : undefined,
        });

      } catch (error) {
        await jobsDB.exec`
          UPDATE scraping_logs 
          SET status = 'failed',
              error_message = ${error.message},
              completed_at = CURRENT_TIMESTAMP
          WHERE id = ${logId.id}
        `;

        const log = await jobsDB.queryRow`
          SELECT * FROM scraping_logs WHERE id = ${logId.id}
        `;
        
        logs.push({
          ...log,
          started_at: new Date(log.started_at),
          completed_at: log.completed_at ? new Date(log.completed_at) : undefined,
        });
      }
    }

    return {
      message: `Scraping completed for ${sources.length} source(s)`,
      logs,
    };
  }
);

async function scrapeJobsFromSource(source: string): Promise<{found: number, added: number, updated: number}> {
  // Mock scraping implementation - in a real app, this would use Puppeteer/Playwright
  // to scrape actual job sites
  
  const mockJobs = [
    {
      title: `Software Developer - ${source}`,
      company: `Tech Company ${source}`,
      location: "Kigali, Rwanda",
      description: "We are looking for a talented software developer...",
      requirements: "Bachelor's degree in Computer Science, 3+ years experience",
      salary_range: "500,000 - 800,000 RWF",
      job_type: "Full-time",
      category: "Technology",
      source_url: `https://${source}/job-1`,
      source_name: source,
      posted_date: new Date(),
    },
    {
      title: `Marketing Manager - ${source}`,
      company: `Marketing Agency ${source}`,
      location: "Kigali, Rwanda",
      description: "Seeking an experienced marketing manager...",
      requirements: "Bachelor's degree in Marketing, 5+ years experience",
      salary_range: "600,000 - 1,000,000 RWF",
      job_type: "Full-time",
      category: "Marketing",
      source_url: `https://${source}/job-2`,
      source_name: source,
      posted_date: new Date(),
    }
  ];

  let added = 0;
  let updated = 0;

  for (const job of mockJobs) {
    const existing = await jobsDB.queryRow`
      SELECT id FROM jobs WHERE source_url = ${job.source_url}
    `;

    if (existing) {
      await jobsDB.exec`
        UPDATE jobs 
        SET title = ${job.title},
            company = ${job.company},
            location = ${job.location},
            description = ${job.description},
            requirements = ${job.requirements},
            salary_range = ${job.salary_range},
            job_type = ${job.job_type},
            category = ${job.category},
            posted_date = ${job.posted_date},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing.id}
      `;
      updated++;
    } else {
      await jobsDB.exec`
        INSERT INTO jobs (
          title, company, location, description, requirements,
          salary_range, job_type, category, source_url, source_name, posted_date
        ) VALUES (
          ${job.title}, ${job.company}, ${job.location}, ${job.description},
          ${job.requirements}, ${job.salary_range}, ${job.job_type}, ${job.category},
          ${job.source_url}, ${job.source_name}, ${job.posted_date}
        )
      `;
      added++;
    }
  }

  return { found: mockJobs.length, added, updated };
}
