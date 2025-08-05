export interface Job {
  id: number;
  title: string;
  company: string;
  company_id?: number;
  location?: string;
  description?: string;
  requirements?: string;
  salary_range?: string;
  job_type?: string;
  category?: string;
  source_url: string;
  source_name: string;
  posted_date?: Date;
  scraped_at: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateJobRequest {
  title: string;
  company: string;
  location?: string;
  description?: string;
  requirements?: string;
  salary_range?: string;
  job_type?: string;
  category?: string;
  source_url: string;
  source_name: string;
  posted_date?: Date;
}

export interface JobFilters {
  search?: string;
  location?: string;
  category?: string;
  job_type?: string;
  source_name?: string;
  date_range?: string;
  salary_min?: number;
  salary_max?: number;
  company_id?: number;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ScrapingLog {
  id: number;
  source_name: string;
  jobs_found: number;
  jobs_added: number;
  jobs_updated: number;
  status: string;
  error_message?: string;
  started_at: Date;
  completed_at?: Date;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience_level?: string;
  preferred_salary_min?: number;
  preferred_salary_max?: number;
  preferred_job_types?: string[];
  preferred_categories?: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SavedJob {
  id: number;
  user_id: number;
  job_id: number;
  job: Job;
  notes?: string;
  created_at: Date;
}

export interface JobAlert {
  id: number;
  user_id: number;
  name: string;
  search_query?: string;
  location?: string;
  category?: string;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  is_active: boolean;
  frequency: string;
  last_sent_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Company {
  id: number;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  industry?: string;
  size?: string;
  location?: string;
  founded_year?: number;
  benefits?: string[];
  culture_tags?: string[];
  rating?: number;
  total_jobs: number;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface JobApplication {
  id: number;
  user_id: number;
  job_id: number;
  job: Job;
  status: string;
  applied_at: Date;
  cover_letter?: string;
  resume_url?: string;
  notes?: string;
}
