import { api } from "encore.dev/api";
import { jobsDB } from "./db";
import type { ScrapingLog } from "./types";
import { JobScraperManager } from "../scrapers";

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
      "jobwebrwanda.com",
      "jobinrwanda.com", 
      "kora.rw",
      "bag.work",
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
          WHERE id = ${logId?.id}
        `;

        const log = await jobsDB.queryRow`
          SELECT * FROM scraping_logs WHERE id = ${logId?.id}
        `;
        
        logs.push({
          id: log?.id,
          source_name: log?.source_name,
          jobs_found: log?.jobs_found,
          jobs_added: log?.jobs_added,
          jobs_updated: log?.jobs_updated,
          status: log?.status,
          error_message: log?.error_message,
          started_at: new Date(log?.started_at),
          completed_at: log?.completed_at ? new Date(log.completed_at) : undefined,
        });

      } catch (error) {
        await jobsDB.exec`
          UPDATE scraping_logs 
          SET status = 'failed',
              error_message = ${error instanceof Error ? error.message : 'Unknown error'},
              completed_at = CURRENT_TIMESTAMP
          WHERE id = ${logId?.id}
        `;

        const log = await jobsDB.queryRow`
          SELECT * FROM scraping_logs WHERE id = ${logId.id}
        `;
        
        logs.push({
          id: log?.id,
          source_name: log.source_name,
          jobs_found: log.jobs_found,
          jobs_added: log.jobs_added,
          jobs_updated: log.jobs_updated,
          status: log.status,
          error_message: log.error_message,
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
  console.log(`Starting scraping for source: ${source}`);
  
  try {
    // Use the new scraper system
    const scrapedJobs = await JobScraperManager.scrapeFromSources([source]);
    
    let added = 0;
    let updated = 0;

    for (const job of scrapedJobs) {
      try {
        // Check if job already exists based on source_url
        const existing = await jobsDB.queryRow`
          SELECT id FROM jobs WHERE source_url = ${job.url}
        `;

        // Parse deadline if available
        let deadlineDate: Date | null = null;
        if (job.deadline) {
          try {
            deadlineDate = new Date(job.deadline);
            if (isNaN(deadlineDate.getTime())) {
              deadlineDate = null;
            }
          } catch (error) {
            deadlineDate = null;
          }
        }

        // Determine job category based on title
        const category = determineJobCategory(job.title);
        
        // Determine job type (default to Full-time)
        const jobType = determineJobType(job.title, job.snippet);

        if (existing) {
          // Update existing job
          await jobsDB.exec`
            UPDATE jobs 
            SET title = ${job.title},
                company = ${job.company},
                location = ${job.location || 'Rwanda'},
                description = ${job.snippet || ''},
                requirements = ${job.snippet || ''},
                job_type = ${jobType},
                category = ${category},
                posted_date = ${deadlineDate},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${existing.id}
          `;
          updated++;
        } else {
          // Insert new job
          await jobsDB.exec`
            INSERT INTO jobs (
              title, company, location, description, requirements,
              job_type, category, source_url, source_name, posted_date
            ) VALUES (
              ${job.title}, ${job.company}, ${job.location || 'Rwanda'}, 
              ${job.snippet || ''}, ${job.snippet || ''}, ${jobType}, 
              ${category}, ${job.url}, ${job.source}, ${deadlineDate}
            )
          `;
          added++;
        }
      } catch (error) {
        console.error(`Error processing job "${job.title}":`, error);
      }
    }

    console.log(`Scraping completed for ${source}: ${scrapedJobs.length} found, ${added} added, ${updated} updated`);
    return { found: scrapedJobs.length, added, updated };

  } catch (error) {
    console.error(`Error scraping ${source}:`, error);
    throw error;
  }
}

function determineJobCategory(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('programmer') || titleLower.includes('it ') || titleLower.includes('tech')) {
    return 'Technology';
  } else if (titleLower.includes('marketing') || titleLower.includes('sales') || titleLower.includes('communication')) {
    return 'Marketing';
  } else if (titleLower.includes('finance') || titleLower.includes('accounting') || titleLower.includes('audit')) {
    return 'Finance';
  } else if (titleLower.includes('hr') || titleLower.includes('human resource') || titleLower.includes('recruitment')) {
    return 'Human Resources';
  } else if (titleLower.includes('health') || titleLower.includes('medical') || titleLower.includes('doctor') || titleLower.includes('nurse')) {
    return 'Healthcare';
  } else if (titleLower.includes('engineer') || titleLower.includes('construction') || titleLower.includes('civil')) {
    return 'Engineering';
  } else if (titleLower.includes('teacher') || titleLower.includes('education') || titleLower.includes('academic')) {
    return 'Education';
  } else if (titleLower.includes('manager') || titleLower.includes('director') || titleLower.includes('admin')) {
    return 'Management';
  } else {
    return 'Other';
  }
}

function determineJobType(title: string, snippet?: string): string {
  const text = `${title} ${snippet || ''}`.toLowerCase();
  
  if (text.includes('intern') || text.includes('internship')) {
    return 'Internship';
  } else if (text.includes('part-time') || text.includes('part time')) {
    return 'Part-time';
  } else if (text.includes('contract') || text.includes('temporary') || text.includes('freelance')) {
    return 'Contract';
  } else {
    return 'Full-time';
  }
}
