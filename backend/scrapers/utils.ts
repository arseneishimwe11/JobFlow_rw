import puppeteer, { Browser, Page } from 'puppeteer';

export class ScraperUtils {
  static async createBrowser(): Promise<Browser> {
    return await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
  }

  static async createPage(browser: Browser, timeout: number = 30000): Promise<Page> {
    const page = await browser.newPage();
    await page.setDefaultTimeout(timeout);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    return page;
  }

  static async waitForSelector(page: Page, selector: string, timeout: number = 10000): Promise<boolean> {
    try {
      await page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.warn(`Selector ${selector} not found within ${timeout}ms`);
      return false;
    }
  }

  static async safeClick(page: Page, selector: string): Promise<boolean> {
    try {
      await page.click(selector);
      return true;
    } catch (error) {
      console.warn(`Failed to click selector ${selector}:`, error);
      return false;
    }
  }

  static async waitForTimeout(page: Page, timeout: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, timeout));
  }

  static cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  static extractDate(text: string): string | undefined {
    // Common date patterns
    const datePatterns = [
      /(\d{1,2}[-\/]\d{1,2}[-\/]\d{4})/,
      /(\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/,
      /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i,
      /(\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return undefined;
  }

  static async retryOperation<T>(
    operation: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === retries - 1) throw error;
        console.warn(`Operation failed, retrying in ${delay}ms... (${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('All retries failed');
  }
}

