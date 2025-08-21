import { Browser, Page } from 'puppeteer';
import { JobPost } from './types.js';
import { ScraperUtils } from './utils.js';

export class GreatRwandaJobsScraper {
  private static readonly BASE_URL = 'https://www.greatrwandajobs.com/';
  private static readonly JOBS_URL = 'https://www.greatrwandajobs.com/jobs/';
  private static readonly TIMEOUT = 30000;
  private static readonly RETRIES = 3;

  static async scrape(): Promise<JobPost[]> {
    let browser: Browser | null = null;
    
    try {
      browser = await ScraperUtils.createBrowser();
      const page = await ScraperUtils.createPage(browser, this.TIMEOUT);
      
      console.log('Navigating to greatrwandajobs.com...');
      await page.goto(this.JOBS_URL, { waitUntil: 'networkidle2' });
      
      // Wait for content to load
      await ScraperUtils.waitForTimeout(page, 3000);
      
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

      console.log(`Scraped ${jobs.length} jobs from greatrwandajobs.com`);
      return jobs;

    } catch (error) {
      console.error('Error scraping greatrwandajobs.com:', error);
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
      
      // Look for job listings - greatrwandajobs has specific structure
      const jobElements = document.querySelectorAll(
        '.job-listing, .job-item, [class*="job"], .position, [class*="position"], .opportunity, [class*="opportunity"]'
      );

      jobElements.forEach((element) => {
        try {
          // Extract job title
          const titleElement = element.querySelector('h1, h2, h3, h4, .title, [class*="title"], a[href*="job"]');
          const title = titleElement?.textContent?.trim();
          
          if (!title || title.length < 3) return;

          // Extract company name
          let company = 'Not specified';
          const companyElement = element.querySelector('.company, [class*="company"], .employer, [class*="employer"], .organization, [class*="organization"]');
          if (companyElement) {
            company = companyElement.textContent?.trim() || company;
          }

          // Extract location
          let location: string | undefined;
          const locationElement = element.querySelector('.location, [class*="location"], .place, [class*="place"], .city, [class*="city"]');
          if (locationElement) {
            location = locationElement.textContent?.trim();
          }

          // Extract deadline
          let deadline: string | undefined;
          const deadlineElement = element.querySelector('.deadline, [class*="deadline"], .date, [class*="date"], .expires, [class*="expires"]');
          if (deadlineElement) {
            deadline = deadlineElement.textContent?.trim();
          }

          // Extract URL
          let url = window.location.href;
          const linkElement = element.querySelector('a[href]') as HTMLAnchorElement;
          if (linkElement && linkElement.href) {
            url = linkElement.href;
          }

          // Extract snippet
          let snippet: string | undefined;
          const snippetElement = element.querySelector('.description, [class*="description"], .summary, [class*="summary"], .excerpt, [class*="excerpt"], p');
          if (snippetElement) {
            snippet = snippetElement.textContent?.trim();
          }

          jobs.push({
            title: title,
            company: company,
            location: location,
            deadline: deadline,
            url: url,
            source: 'greatrwandajobs.com',
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
      // Look for pagination
      const nextButton = await page.$('a[href*="page"]:contains("Next"), .next, [class*="next"], a[rel="next"]');
      
      if (nextButton) {
        await nextButton.click();
        await ScraperUtils.waitForTimeout(page, 3000);
        return true;
      }
      
      // Try to find numbered pagination
      const pageLinks = await page.$$('a[href*="page="], a[href*="/page/"]');
      if (pageLinks.length > 0) {
        const currentUrl = page.url();
        let currentPageNum = 1;
        
        // Extract current page number
        const pageMatch = currentUrl.match(/page[=\/](\d+)/);
        if (pageMatch) {
          currentPageNum = parseInt(pageMatch[1]);
        }
        
        // Find next page
        for (const link of pageLinks) {
          const href = await link.evaluate(el => (el as HTMLAnchorElement).href);
          const linkPageMatch = href.match(/page[=\/](\d+)/);
          if (linkPageMatch) {
            const pageNum = parseInt(linkPageMatch[1]);
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

