CREATE TABLE job_applications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'applied', -- applied, viewed, interview, rejected, hired
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  cover_letter TEXT,
  resume_url TEXT,
  notes TEXT,
  UNIQUE(user_id, job_id)
);

CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
