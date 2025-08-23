import { Browser, Page } from 'puppeteer';
import { JobPost } from './types.js';
import { ScraperUtils } from './utils.js';

export class NdangiraScraper {
  private static readonly BASE_URL = 'https://www.ndangira.net/';
  private static readonly TIMEOUT = 30000;
  private static readonly RETRIES = 3;

  static async scrape(): Promise<JobPost[]> {
    let browser: Browser | null = null;
    
    try {
      browser = await ScraperUtils.createBrowser();
      const page = await ScraperUtils.createPage(browser, this.TIMEOUT);
      
      console.log('Navigating to ndangira.net...');
      await page.goto(this.BASE_URL, { waitUntil: 'networkidle2' });
      
      // Wait for content to load
      await ScraperUtils.waitForTimeout(page, 3000);
      
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

      console.log(`Scraped ${jobs.length} jobs from ndangira.net`);
      return jobs;

    } catch (error) {
      console.error('Error scraping ndangira.net:', error);
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
      
      // Look for job articles - ndangira.net is blog-style
      const jobElements = document.querySelectorAll(
        'article, .post, [class*="post"], .entry, [class*="entry"], h2 a, h3 a'
      );

      jobElements.forEach((element) => {
        try {
          let title = '';
          let url = '';
          let company = 'Various Organizations';
          let snippet = '';

          // If element is a link (h2 a, h3 a)
          if (element.tagName === 'A') {
            title = element.textContent?.trim() || '';
            url = (element as HTMLAnchorElement).href;
            
            // Look for snippet in parent or nearby elements
            const parentElement = element.closest('article, .post, [class*="post"], .entry, [class*="entry"]');
            if (parentElement) {
              const snippetElement = parentElement.querySelector('p, .excerpt, [class*="excerpt"], .summary, [class*="summary"]');
              snippet = snippetElement?.textContent?.trim() || '';
            }
          } else {
            // If element is an article/post container
            const titleElement = element.querySelector('h1, h2, h3, h4, .title, [class*="title"], a[href*="job"], a[href*="recruitment"]');
            title = titleElement?.textContent?.trim() || '';
            
            const linkElement = element.querySelector('a[href]') as HTMLAnchorElement;
            url = linkElement?.href || window.location.href;
            
            const snippetElement = element.querySelector('p, .excerpt, [class*="excerpt"], .summary, [class*="summary"], .content, [class*="content"]');
            snippet = snippetElement?.textContent?.trim() || '';
          }
          
          if (!title || title.length < 5) return;

          // Extract company from title if possible
          const companyPatterns = [
            /at\s+([^(]+)/i,
            /(\w+\s+\w+)\s+is\s+hiring/i,
            /(\w+\s+\w+)\s+recruitment/i,
            /(\w+\s+\w+)\s+jobs/i
          ];

          for (const pattern of companyPatterns) {
            const match = title.match(pattern);
            if (match && match[1]) {
              company = match[1].trim();
              break;
            }
          }

          // Extract deadline from snippet or title
          let deadline: string | undefined;
          const deadlinePatterns = [
            /deadline[:\s]+([^.]+)/i,
            /apply\s+by[:\s]+([^.]+)/i,
            /closes[:\s]+([^.]+)/i,
            /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}/i,
            /\d{1,2}[-\/]\d{1,2}[-\/]\d{4}/
          ];

          const searchText = `${title} ${snippet}`;
          for (const pattern of deadlinePatterns) {
            const match = searchText.match(pattern);
            if (match) {
              deadline = match[1] || match[0];
              break;
            }
          }

          jobs.push({
            title: title,
            company: company,
            location: 'Rwanda',
            deadline: deadline,
            url: url,
            source: 'ndangira.net',
            snippet: snippet.substring(0, 200) // Limit snippet length
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
      // Look for pagination - typical WordPress/blog pagination
      const nextButton = await page.$('a[href*="page"]:contains("Next"), .next, [class*="next"], a[rel="next"]');
      
      if (nextButton) {
        await nextButton.click();
        await ScraperUtils.waitForTimeout(page, 3000);
        return true;
      }
      
      // Try to find numbered pagination
      const pageLinks = await page.$$('a[href*="page/"]');
      if (pageLinks.length > 0) {
        // Find the next page number
        const currentUrl = page.url();
        const currentPageMatch = currentUrl.match(/page\/(\d+)/);
        const currentPageNum = currentPageMatch ? parseInt(currentPageMatch[1]) : 1;
        
        for (const link of pageLinks) {
          const href = await link.evaluate(el => (el as HTMLAnchorElement).href);
          const pageMatch = href.match(/page\/(\d+)/);
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

