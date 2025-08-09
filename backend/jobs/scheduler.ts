import * as cron from 'node-cron';
import { JobScraperManager } from '../scrapers';
import { jobsDB } from './db';

export class JobScheduler {
  private static isRunning = false;
  private static scheduledTask: cron.ScheduledTask | null = null;

  /**
   * Start the job scheduler to run every 6 hours
   */
  static start(): void {
    if (this.scheduledTask) {
      console.log('Job scheduler is already running');
      return;
    }

    // Schedule to run every 6 hours (at 00:00, 06:00, 12:00, 18:00)
    this.scheduledTask = cron.schedule('0 */6 * * *', async () => {
      if (this.isRunning) {
        console.log('Previous scraping job is still running, skipping this cycle');
        return;
      }

      console.log('Starting scheduled job scraping...');
      this.isRunning = true;

      try {
        await this.runScheduledScraping();
      } catch (error) {
        console.error('Error in scheduled scraping:', error);
      } finally {
        this.isRunning = false;
      }
    }, {
      scheduled: true,
      timezone: "Africa/Kigali"
    });

    console.log('Job scheduler started - will run every 6 hours');
  }

  /**
   * Stop the job scheduler
   */
  static stop(): void {
    if (this.scheduledTask) {
      this.scheduledTask.stop();
      this.scheduledTask = null;
      console.log('Job scheduler stopped');
    }
  }

  /**
   * Run scraping manually
   */
  static async runManual(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Scraping is already in progress');
    }

    console.log('Starting manual job scraping...');
    this.isRunning = true;

    try {
      await this.runScheduledScraping();
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Check if scraping is currently running
   */
  static isScrapingRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get scheduler status
   */
  static getStatus(): { isScheduled: boolean, isRunning: boolean, nextRun?: Date } {
    return {
      isScheduled: this.scheduledTask !== null,
      isRunning: this.isRunning,
      nextRun: this.scheduledTask ? new Date(this.scheduledTask.nextDate().toISOString()) : undefined
    };
  }

  /**
   * Internal method to run the actual scraping
   */
  private static async runScheduledScraping(): Promise<void> {
    const startTime = new Date();
    console.log(`=== Scheduled Scraping Started at ${startTime.toISOString()} ===`);

    const sources = [
      "jobwebrwanda.com",
      "jobinrwanda.com", 
      "kora.rw",
      "bag.work",
      "ndangira.net",
      "greatrwandajobs.com"
    ];

    let totalFound = 0;
    let totalAdded = 0;
    let totalUpdated = 0;
    const results: { [key: string]: { found: number, added: number, updated: number, error?: string } } = {};

    for (const source of sources) {
      const sourceStartTime = new Date();
      
      // Log scraping start
      const logId = await jobsDB.queryRow`
        INSERT INTO scraping_logs (source_name, status)
        VALUES (${source}, 'started')
        RETURNING id
      `;

      try {
        console.log(`Starting scraping for ${source}...`);
        
        // Scrape jobs from this source
        const scrapedJobs = await JobScraperManager.scrapeFromSources([source]);
        
        let added = 0;
        let updated = 0;

        // Process each job
        for (const job of scrapedJobs) {
          try {
            // Check if job already exists
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

            // Determine job category and type
            const category = this.determineJobCategory(job.title);
            const jobType = this.determineJobType(job.title, job.snippet);

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

        // Update scraping log with success
        await jobsDB.exec`
          UPDATE scraping_logs 
          SET jobs_found = ${scrapedJobs.length}, 
              jobs_added = ${added},
              jobs_updated = ${updated},
              status = 'completed',
              completed_at = CURRENT_TIMESTAMP
          WHERE id = ${logId.id}
        `;

        results[source] = { found: scrapedJobs.length, added, updated };
        totalFound += scrapedJobs.length;
        totalAdded += added;
        totalUpdated += updated;

        const duration = Date.now() - sourceStartTime.getTime();
        console.log(`✓ ${source}: ${scrapedJobs.length} found, ${added} added, ${updated} updated (${duration}ms)`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`✗ ${source}: ${errorMessage}`);

        // Update scraping log with error
        await jobsDB.exec`
          UPDATE scraping_logs 
          SET status = 'failed',
              error_message = ${errorMessage},
              completed_at = CURRENT_TIMESTAMP
          WHERE id = ${logId.id}
        `;

        results[source] = { found: 0, added: 0, updated: 0, error: errorMessage };
      }
    }

    const endTime = new Date();
    const totalDuration = endTime.getTime() - startTime.getTime();

    console.log(`\n=== Scheduled Scraping Completed ===`);
    console.log(`Started: ${startTime.toISOString()}`);
    console.log(`Ended: ${endTime.toISOString()}`);
    console.log(`Duration: ${Math.round(totalDuration / 1000)}s`);
    console.log(`Total: ${totalFound} found, ${totalAdded} added, ${totalUpdated} updated`);
    console.log(`\nResults by source:`);
    Object.entries(results).forEach(([source, result]) => {
      if (result.error) {
        console.log(`  ${source}: ERROR - ${result.error}`);
      } else {
        console.log(`  ${source}: ${result.found} found, ${result.added} added, ${result.updated} updated`);
      }
    });
    console.log(`=====================================\n`);
  }

  private static determineJobCategory(title: string): string {
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

  private static determineJobType(title: string, snippet?: string): string {
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
}

