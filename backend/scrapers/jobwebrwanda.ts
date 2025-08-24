import { Browser, Page } from 'puppeteer';
import { JobPost, ScrapingResult } from './types.js';
import { ScraperUtils } from './utils.js';

export class JobwebRwandaScraper {
  private static readonly BASE_URL = 'https://jobwebrwanda.com/';
  private static readonly TIMEOUT = 30000;
  private static readonly RETRIES = 3;

  static async scrape(): Promise<JobPost[]> {
    let browser: Browser | null = null;
    
    try {
      browser = await ScraperUtils.createBrowser();
      const page = await ScraperUtils.createPage(browser, this.TIMEOUT);
      
      console.log('Navigating to jobwebrwanda.com...');
      await page.goto(this.BASE_URL, { waitUntil: 'networkidle2' });
      
      // Wait for job listings to load
      const jobsLoaded = await ScraperUtils.waitForSelector(page, '.job-listing, .job-item, [class*="job"]', 5000);
      if (!jobsLoaded) {
        console.warn('No job listings found on jobwebrwanda.com');
        return [];
      }

      const jobs: JobPost[] = [];
      let currentPage = 1;
      const maxPages = 5; // Limit to prevent infinite loops

      while (currentPage <= maxPages) {
        console.log(`Scraping page ${currentPage}...`);
        
        const pageJobs = await this.extractJobsFromPage(page);
        jobs.push(...pageJobs);
        
        // Try to navigate to next page
        const hasNextPage = await this.goToNextPage(page);
        if (!hasNextPage) {
          console.log('No more pages found');
          break;
        }
        
        currentPage++;
        await ScraperUtils.waitForTimeout(page, 2000); // Wait between page loads
      }

      console.log(`Scraped ${jobs.length} jobs from jobwebrwanda.com`);
      return jobs;

    } catch (error) {
      console.error('Error scraping jobwebrwanda.com:', error);
      return [];
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  private static async extractJobsFromPage(page: Page): Promise<JobPost[]> {
    return await page.evaluate(() => {
      const jobs: JobPost[] = [];
      
      // Look for job listings - try multiple selectors
      const jobElements = document.querySelectorAll(
        '.job-listing, .job-item, [class*="job"], .post, article'
      );

      jobElements.forEach((element) => {
        try {
          // Extract job title
          const titleElement = element.querySelector('h1, h2, h3, h4, .title, [class*="title"], a[href*="job"]');
          const title = titleElement?.textContent?.trim();
          
          if (!title) return;

          // Extract company name
          const companyElement = element.querySelector('.company, [class*="company"], .employer, [class*="employer"]');
          const company = companyElement?.textContent?.trim() || 'Not specified';

          // Extract location
          const locationElement = element.querySelector('.location, [class*="location"], .place, [class*="place"]');
          const location = locationElement?.textContent?.trim();

          // Extract deadline
          const deadlineElement = element.querySelector('.deadline, [class*="deadline"], .date, [class*="date"]');
          const deadline = deadlineElement?.textContent?.trim();

          // Extract URL
          const linkElement = element.querySelector('a[href]') as HTMLAnchorElement;
          const url = linkElement?.href || window.location.href;

          // Extract snippet
          const snippetElement = element.querySelector('.description, [class*="description"], .summary, [class*="summary"], p');
          const snippet = snippetElement?.textContent?.trim();

          jobs.push({
            title: title,
            company: company,
            location: location,
            deadline: deadline,
            url: url,
            source: 'jobwebrwanda.com',
            snippet: snippet
          });

        } catch (error) {
          console.warn('Error extracting job data:', error);
        }
      });

      return jobs;
    });
  }

  private static async goToNextPage(page: Page): Promise<boolean> {
    try {
      // Look for next page button
      const nextButton = await page.$('a[href*="page"]:contains("Next"), .next, [class*="next"], a[href*="page"]:last-child');
      
      if (nextButton) {
        await nextButton.click();
        await ScraperUtils.waitForTimeout(page, 3000);
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Error navigating to next page:', error);
      return false;
    }
  }
}

