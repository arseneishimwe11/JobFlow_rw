CREATE TABLE companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  industry TEXT,
  size TEXT,
  location TEXT,
  founded_year INTEGER,
  benefits TEXT[],
  culture_tags TEXT[],
  rating DECIMAL(3,2),
  total_jobs INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_location ON companies(location);
CREATE INDEX idx_companies_rating ON companies(rating DESC);

-- Add company_id to jobs table
ALTER TABLE jobs ADD COLUMN company_id BIGINT REFERENCES companies(id);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
