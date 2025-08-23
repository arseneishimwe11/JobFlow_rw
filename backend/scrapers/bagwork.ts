import { Browser, Page } from 'puppeteer';
import { JobPost } from './types.js';
import { ScraperUtils } from './utils.js';

// bag.work scraper
export class BagWorkScraper {
  private static readonly BASE_URL = 'https://app.bag.work/';
  private static readonly JOB_BOARD_URL = 'https://app.bag.work/job-board';
  private static readonly TIMEOUT = 30000;
  private static readonly RETRIES = 3;

  // Scrape jobs from bag.work
  static async scrape(): Promise<JobPost[]> {
    let browser: Browser | null = null;
    
    try {
      // Create browser and page
      browser = await ScraperUtils.createBrowser();
      const page = await ScraperUtils.createPage(browser, this.TIMEOUT);
      
      console.log('Navigating to app.bag.work...');
      
      // Try to navigate to job board directly
      try {
        await page.goto(this.JOB_BOARD_URL, { waitUntil: 'networkidle2' });
      } catch (error) {
        console.log('Direct job board access failed, trying main page...');
        await page.goto(this.BASE_URL, { waitUntil: 'networkidle2' });
        
        // Look for job board link
        const jobBoardLink = await page.$('a[href*="job"], a:contains("JOB BOARD"), [class*="job"]');
        if (jobBoardLink) {
          await jobBoardLink.click();
          await ScraperUtils.waitForTimeout(page, 5000);
        }
      }
      
      // Wait for content to load
      await ScraperUtils.waitForTimeout(page, 5000);
      
      const jobs: JobPost[] = [];
      
      // Extract jobs from current page
      const pageJobs = await this.extractJobsFromPage(page);
      jobs.push(...pageJobs);
      
      // Try to load more content if it's a dynamic page
      try {
        // Scroll to load more content
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await ScraperUtils.waitForTimeout(page, 3000);
        
        // Extract additional jobs after scrolling
        const additionalJobs = await this.extractJobsFromPage(page);
        const newJobs = additionalJobs.filter(job => 
          !jobs.some(existingJob => existingJob.title === job.title && existingJob.company === job.company)
        );
        jobs.push(...newJobs);
      } catch (error) {
        console.warn('Error loading additional content:', error);
      }

      // Successful scrape
      console.log(`Scraped ${jobs.length} jobs from bag.work`);
      return jobs;

    } catch (error) {
      console.error('Error scraping bag.work:', error);
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
      
      // Look for job listings - BAG uses card-based layout
      const jobElements = document.querySelectorAll(
        '.job-card, [class*="job"], .card, [class*="card"], .opportunity, [class*="opportunity"], .position, [class*="position"]'
      );

      jobElements.forEach((element) => {
        try {
          // Extract job title - look for various title patterns
          let title = '';
          const titleSelectors = [
            'h1, h2, h3, h4, h5, h6',
            '.title, [class*="title"]',
            '.job-title, [class*="job-title"]',
            '.position, [class*="position"]',
            'a[href*="job"]'
          ];
          
          for (const selector of titleSelectors) {
            const titleElement = element.querySelector(selector);
            if (titleElement) {
              title = titleElement.textContent?.trim() || '';
              if (title && title.length > 3) break;
            }
          }
          
          if (!title || title.length < 3) return;

          // Extract company name
          let company = 'Not specified';
          const companySelectors = [
            '.company, [class*="company"]',
            '.employer, [class*="employer"]',
            '.organization, [class*="organization"]',
            '.brand, [class*="brand"]'
          ];
          
          for (const selector of companySelectors) {
            const companyElement = element.querySelector(selector);
            if (companyElement) {
              const companyText = companyElement.textContent?.trim();
              if (companyText && companyText.length > 1) {
                company = companyText;
                break;
              }
            }
          }

          // Extract location
          let location: string | undefined;
          const locationSelectors = [
            '.location, [class*="location"]',
            '.place, [class*="place"]',
            '.city, [class*="city"]',
            '.address, [class*="address"]'
          ];
          
          for (const selector of locationSelectors) {
            const locationElement = element.querySelector(selector);
            if (locationElement) {
              location = locationElement.textContent?.trim();
              if (location) break;
            }
          }

          // Extract deadline
          let deadline: string | undefined;
          const deadlineSelectors = [
            '.deadline, [class*="deadline"]',
            '.date, [class*="date"]',
            '.expires, [class*="expires"]',
            '.due, [class*="due"]'
          ];
          
          for (const selector of deadlineSelectors) {
            const deadlineElement = element.querySelector(selector);
            if (deadlineElement) {
              deadline = deadlineElement.textContent?.trim();
              if (deadline) break;
            }
          }

          // Extract URL
          let url = window.location.href;
          const linkElement = element.querySelector('a[href]') as HTMLAnchorElement;
          if (linkElement && linkElement.href) {
            url = linkElement.href;
          }

          // Extract snippet
          let snippet: string | undefined;
          const snippetSelectors = [
            '.description, [class*="description"]',
            '.summary, [class*="summary"]',
            '.excerpt, [class*="excerpt"]',
            'p'
          ];
          
          for (const selector of snippetSelectors) {
            const snippetElement = element.querySelector(selector);
            if (snippetElement) {
              snippet = snippetElement.textContent?.trim();
              if (snippet && snippet.length > 10) break;
            }
          }

          jobs.push({
            title: title,
            company: company,
            location: location,
            deadline: deadline,
            url: url,
            source: 'bag.work',
            snippet: snippet
          });

        } catch (error) {
          console.warn('Error extracting job data:', error);
        }
      });

      return jobs;
    });
  }
}

