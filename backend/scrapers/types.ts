export interface JobPost {
  title: string;
  company: string;
  location?: string;
  deadline?: string;
  url: string;
  source: string; // site name
  snippet?: string;
}

export interface ScrapingResult {
  found: number;
  added: number;
  updated: number;
  jobs: JobPost[];
}

export interface ScraperConfig {
  name: string;
  baseUrl: string;
  timeout: number;
  retries: number;
}

