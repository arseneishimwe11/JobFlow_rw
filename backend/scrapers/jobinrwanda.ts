import { Browser, Page } from 'puppeteer';
import { JobPost } from './types.js';
import { ScraperUtils } from './utils.js';

export class JobinRwandaScraper {
  private static readonly BASE_URL = 'https://www.jobinrwanda.com/';
  private static readonly TIMEOUT = 30000;
  private static readonly RETRIES = 3;

  static async scrape(): Promise<JobPost[]> {
    let browser: Browser | null = null;
    
    try {
      browser = await ScraperUtils.createBrowser();
      const page = await ScraperUtils.createPage(browser, this.TIMEOUT);
      
      console.log('Navigating to jobinrwanda.com...');
      await page.goto(this.BASE_URL, { waitUntil: 'networkidle2' });
      
      // Wait for job listings to load
      const jobsLoaded = await ScraperUtils.waitForSelector(page, 'a[href*="job"], .job, [class*="job"]', 5000);
      if (!jobsLoaded) {
        console.warn('No job listings found on jobinrwanda.com');
        return [];
      }

      const jobs: JobPost[] = [];
      let currentPage = 1;
      const maxPages = 10; // Limit to prevent infinite loops

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

      console.log(`Scraped ${jobs.length} jobs from jobinrwanda.com`);
      return jobs;

    } catch (error) {
      console.error('Error scraping jobinrwanda.com:', error);
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
      
      // Look for job listings - jobinrwanda has a specific structure
      const jobElements = document.querySelectorAll('a[href*="job"], .job-item, [class*="job"]');

      jobElements.forEach((element) => {
        try {
          // Extract job title
          let title = '';
          if (element.tagName === 'A') {
            title = element.textContent?.trim() || '';
          } else {
            const titleElement = element.querySelector('h1, h2, h3, h4, .title, [class*="title"], a');
            title = titleElement?.textContent?.trim() || '';
          }
          
          if (!title || title.length < 3) return;

          // Extract company name - look in nearby elements or parent containers
          let company = 'Not specified';
          const parentElement = element.closest('.job-container, .job-listing, .post, article') || element.parentElement;
          if (parentElement) {
            const companyElement = parentElement.querySelector('.company, [class*="company"], .employer, [class*="employer"]');
            if (companyElement) {
              company = companyElement.textContent?.trim() || company;
            }
          }

          // Extract location - look for location indicators
          let location: string | undefined;
          if (parentElement) {
            const locationElement = parentElement.querySelector('.location, [class*="location"], .place, [class*="place"]');
            if (locationElement) {
              location = locationElement.textContent?.trim();
            }
          }

          // Extract deadline - look for date patterns
          let deadline: string | undefined;
          if (parentElement) {
            const deadlineElement = parentElement.querySelector('.deadline, [class*="deadline"], .date, [class*="date"]');
            if (deadlineElement) {
              deadline = deadlineElement.textContent?.trim();
            }
          }

          // Extract URL
          let url = '';
          if (element.tagName === 'A') {
            url = (element as HTMLAnchorElement).href;
          } else {
            const linkElement = element.querySelector('a[href]') as HTMLAnchorElement;
            url = linkElement?.href || window.location.href;
          }

          // Extract snippet
          let snippet: string | undefined;
          if (parentElement) {
            const snippetElement = parentElement.querySelector('.description, [class*="description"], .summary, [class*="summary"], p');
            if (snippetElement) {
              snippet = snippetElement.textContent?.trim();
            }
          }

          jobs.push({
            title: title,
            company: company,
            location: location,
            deadline: deadline,
            url: url,
            source: 'jobinrwanda.com',
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
      // Look for pagination - jobinrwanda typically has numbered pagination
      const nextButton = await page.$('a[href*="page"]:contains("Next"), .next, [class*="next"], a[href*="page"]:not([href*="page=1"])');
      
      if (nextButton) {
        await nextButton.click();
        await ScraperUtils.waitForTimeout(page, 3000);
        return true;
      }
      
      // Try to find numbered pagination
      const pageLinks = await page.$$('a[href*="page="]');
      if (pageLinks.length > 0) {
        // Find the highest page number and click it if it's not the current page
        const currentUrl = page.url();
        const currentPageMatch = currentUrl.match(/page=(\d+)/);
        const currentPageNum = currentPageMatch ? parseInt(currentPageMatch[1]) : 1;
        
        for (const link of pageLinks) {
          const href = await link.evaluate(el => (el as HTMLAnchorElement).href);
          const pageMatch = href.match(/page=(\d+)/);
          if (pageMatch) {
            const pageNum = parseInt(pageMatch[1]);
            if (pageNum === currentPageNum + 1) {
              await link.click();
              await ScraperUtils.waitForTimeout(page, 3000);
              return true;
            }
          }
        }
      }
      
      return false;
    } catch (error) {
      console.warn('Error navigating to next page:', error);
      return false;
    }
  }
}

