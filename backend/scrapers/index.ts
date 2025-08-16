import { JobPost } from './types.js';
import { JobwebRwandaScraper } from './jobwebrwanda.js';
import { JobinRwandaScraper } from './jobinrwanda.js';
import { KoraScraper } from './kora.js';
import { BagWorkScraper } from './bagwork.js';
import { NdangiraScraper } from './ndangira.js';
import { GreatRwandaJobsScraper } from './greatrwandajobs.js';

export interface ScraperModule {
  name: string;
  scraper: () => Promise<JobPost[]>;
}

export class JobScraperManager {
  private static readonly scrapers: ScraperModule[] = [
    // Jobweb Rwanda
    {
      name: 'jobwebrwanda.com',
      scraper: JobwebRwandaScraper.scrape
    },
    // Jobin Rwanda
    {
      name: 'jobinrwanda.com',
      scraper: JobinRwandaScraper.scrape
    },
    {
      name: 'kora.rw',
      scraper: KoraScraper.scrape
    },
    {
      name: 'bag.work',
      scraper: BagWorkScraper.scrape
    },
    {
      name: 'ndangira.net',
      scraper: NdangiraScraper.scrape
    },
    {
      name: 'greatrwandajobs.com',
      scraper: GreatRwandaJobsScraper.scrape
    }
  ];

  /**
   * Scrape jobs from all available sources
   */
  static async scrapeAll(): Promise<JobPost[]> {
    console.log('Starting job scraping from all sources...');
    const allJobs: JobPost[] = [];
    const results: { [key: string]: { jobs: JobPost[], error?: string } } = {};

    // Run scrapers in parallel for better performance
    const scraperPromises = this.scrapers.map(async (scraperModule) => {
      try {
        console.log(`Starting scraper for ${scraperModule.name}...`);
        const jobs = await scraperModule.scraper();
        results[scraperModule.name] = { jobs };
        console.log(`✓ ${scraperModule.name}: Found ${jobs.length} jobs`);
        return jobs;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`✗ ${scraperModule.name}: ${errorMessage}`);
        results[scraperModule.name] = { jobs: [], error: errorMessage };
        return [];
      }
    });

    const scraperResults = await Promise.all(scraperPromises);
    
    // Combine all results
    scraperResults.forEach(jobs => {
      allJobs.push(...jobs);
    });

    // Remove duplicates based on title and company
    const uniqueJobs = this.removeDuplicates(allJobs);
    
    // Sort by most recently posted (if posting date is available)
    const sortedJobs = this.sortByDate(uniqueJobs);

    console.log(`\n=== Scraping Summary ===`);
    Object.entries(results).forEach(([source, result]) => {
      if (result.error) {
        console.log(`${source}: ERROR - ${result.error}`);
      } else {
        console.log(`${source}: ${result.jobs.length} jobs`);
      }
    });
    console.log(`Total unique jobs: ${sortedJobs.length}`);
    console.log(`========================\n`);

    return sortedJobs;
  }

  /**
   * Scrape jobs from specific sources
   */
  static async scrapeFromSources(sourceNames: string[]): Promise<JobPost[]> {
    console.log(`Starting job scraping from sources: ${sourceNames.join(', ')}`);
    const allJobs: JobPost[] = [];

    const selectedScrapers = this.scrapers.filter(scraper => 
      sourceNames.some(name => scraper.name.includes(name) || name.includes(scraper.name))
    );

    if (selectedScrapers.length === 0) {
      console.warn('No matching scrapers found for the specified sources');
      return [];
    }

    // Run selected scrapers in parallel
    const scraperPromises = selectedScrapers.map(async (scraperModule) => {
      try {
        console.log(`Starting scraper for ${scraperModule.name}...`);
        const jobs = await scraperModule.scraper();
        console.log(`✓ ${scraperModule.name}: Found ${jobs.length} jobs`);
        return jobs;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`✗ ${scraperModule.name}: ${errorMessage}`);
        return [];
      }
    });

    const scraperResults = await Promise.all(scraperPromises);
    
    // Combine all results
    scraperResults.forEach(jobs => {
      allJobs.push(...jobs);
    });

    // Remove duplicates and sort
    const uniqueJobs = this.removeDuplicates(allJobs);
    const sortedJobs = this.sortByDate(uniqueJobs);

    console.log(`Total unique jobs from selected sources: ${sortedJobs.length}`);
    return sortedJobs;
  }

  /**
   * Remove duplicate jobs based on title and company
   */
  private static removeDuplicates(jobs: JobPost[]): JobPost[] {
    const seen = new Set<string>();
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase().trim()}-${job.company.toLowerCase().trim()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Sort jobs by posting date (most recent first)
   * If no date is available, sort by title
   */
  private static sortByDate(jobs: JobPost[]): JobPost[] {
    return jobs.sort((a, b) => {
      // If both have deadlines, sort by deadline (closest first)
      if (a.deadline && b.deadline) {
        const dateA = this.parseDate(a.deadline);
        const dateB = this.parseDate(b.deadline);
        if (dateA && dateB) {
          return dateA.getTime() - dateB.getTime();
        }
      }
      
      // If only one has a deadline, prioritize it
      if (a.deadline && !b.deadline) return -1;
      if (!a.deadline && b.deadline) return 1;
      
      // Otherwise sort alphabetically by title
      return a.title.localeCompare(b.title);
    });
  }

  /**
   * Parse various date formats
   */
  private static parseDate(dateString: string): Date | null {
    try {
      // Clean the date string
      const cleaned = dateString.replace(/deadline[:\s]*/i, '').trim();
      
      // Try parsing as-is first
      let date = new Date(cleaned);
      if (!isNaN(date.getTime())) {
        return date;
      }
      
      // Try common patterns
      const patterns = [
        /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/,
        /(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/,
        /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i
      ];
      
      for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match) {
          date = new Date(match[0]);
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get list of available scrapers
   */
  static getAvailableScrapers(): string[] {
    return this.scrapers.map(scraper => scraper.name);
  }
}

