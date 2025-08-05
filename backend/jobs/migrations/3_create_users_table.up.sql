CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  location TEXT,
  bio TEXT,
  skills TEXT[],
  experience_level TEXT,
  preferred_salary_min INTEGER,
  preferred_salary_max INTEGER,
  preferred_job_types TEXT[],
  preferred_categories TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_skills ON users USING GIN(skills);
