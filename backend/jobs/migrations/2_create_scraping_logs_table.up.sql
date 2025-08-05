CREATE TABLE scraping_logs (
  id BIGSERIAL PRIMARY KEY,
  source_name TEXT NOT NULL,
  jobs_found INTEGER DEFAULT 0,
  jobs_added INTEGER DEFAULT 0,
  jobs_updated INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  error_message TEXT,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX idx_scraping_logs_source ON scraping_logs(source_name);
CREATE INDEX idx_scraping_logs_started_at ON scraping_logs(started_at DESC);
