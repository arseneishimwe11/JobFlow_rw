import { Browser, Page } from 'puppeteer';
import { JobPost } from './types.js';
import { ScraperUtils } from './utils.js';

export class KoraScraper {
  private static readonly BASE_URL = 'https://jobportal.kora.rw/';
  private static readonly TIMEOUT = 30000;
  private static readonly RETRIES = 3;

  static async scrape(): Promise<JobPost[]> {
    let browser: Browser | null = null;
    
    try {
      browser = await ScraperUtils.createBrowser();
      const page = await ScraperUtils.createPage(browser, this.TIMEOUT);
      
      console.log('Navigating to jobportal.kora.rw...');
      await page.goto(this.BASE_URL, { waitUntil: 'networkidle2' });
      
      // Wait for the page to load
      await ScraperUtils.waitForTimeout(page, 3000);
      
      const jobs: JobPost[] = [];
      
      // First, try to search for all jobs by clicking search without filters
      try {
        const searchButton = await page.$('button[type="submit"], button:contains("Search"), [class*="search"]');
        if (searchButton) {
          await searchButton.click();
          await ScraperUtils.waitForTimeout(page, 5000);
        }
      } catch (error) {
        console.warn('Could not perform search, continuing with current page');
      }

      // Look for job categories or job listings
      const jobCategories = await page.$$('a[href*="job"], .job-category, [class*="category"]');
      
      if (jobCategories.length > 0) {
        console.log(`Found ${jobCategories.length} job categories/listings`);
        
        // Extract jobs from categories
        for (let i = 0; i < Math.min(jobCategories.length, 10); i++) {
          try {
            const category = jobCategories[i];
            const categoryText = await category.evaluate(el => el.textContent?.trim());
            const categoryHref = await category.evaluate(el => (el as HTMLAnchorElement).href);
            
            if (categoryText && categoryHref) {
              // Navigate to category page
              await page.goto(categoryHref, { waitUntil: 'networkidle2' });
              await ScraperUtils.waitForTimeout(page, 3000);
              
              const categoryJobs = await this.extractJobsFromPage(page);
              jobs.push(...categoryJobs);
              
              // Go back to main page for next category
              await page.goBack();
              await ScraperUtils.waitForTimeout(page, 2000);
            }
          } catch (error) {
            console.warn(`Error processing category ${i}:`, error);
          }
        }
      } else {
        // Try to extract jobs from current page
        const pageJobs = await this.extractJobsFromPage(page);
        jobs.push(...pageJobs);
      }

      console.log(`Scraped ${jobs.length} jobs from kora.rw`);
      return jobs;

    } catch (error) {
      console.error('Error scraping kora.rw:', error);
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
      
      // Look for job listings - Kora might have different structures
      const jobElements = document.querySelectorAll(
        '.job-listing, .job-item, [class*="job"], .opportunity, [class*="opportunity"], .position, [class*="position"]'
      );

      jobElements.forEach((element) => {
        try {
          // Extract job title
          const titleElement = element.querySelector('h1, h2, h3, h4, .title, [class*="title"], a[href*="job"]');
          const title = titleElement?.textContent?.trim();
          
          if (!title) return;

          // Extract company name
          const companyElement = element.querySelector('.company, [class*="company"], .employer, [class*="employer"], .organization, [class*="organization"]');
          const company = companyElement?.textContent?.trim() || 'Government of Rwanda';

          // Extract location
          const locationElement = element.querySelector('.location, [class*="location"], .place, [class*="place"]');
          const location = locationElement?.textContent?.trim() || 'Rwanda';

          // Extract deadline
          const deadlineElement = element.querySelector('.deadline, [class*="deadline"], .date, [class*="date"], .expires, [class*="expires"]');
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
            source: 'kora.rw',
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

