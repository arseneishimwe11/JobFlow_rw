# JobFlow Backend API

A robust Node.js backend for the JobFlow job posting platform built with Express, TypeScript, and Prisma.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with admin/user roles
- 💼 **Job Management**: CRUD operations with advanced filtering and search
- 🏢 **Company Management**: Company profiles with job listings
- 💾 **Saved Jobs**: Users can save and manage favorite jobs
- 📊 **Analytics**: Platform statistics and insights
- 🔍 **Advanced Search**: Full-text search with filters
- 📄 **Pagination**: Efficient data loading
- 🛡️ **Security**: Helmet, CORS, input validation
- 🗄️ **Database**: PostgreSQL with Prisma ORM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, bcryptjs

## Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database URL and other configurations:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/jobflow_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=4000
   ADMIN_EMAIL="admin@akazi.rw"
   ADMIN_PASSWORD="admin123"
   ```

3. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Jobs
- `GET /api/jobs` - List jobs (with filtering)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Admin only)
- `POST /api/jobs/bulk` - Bulk create jobs (Admin only)
- `PUT /api/jobs/:id` - Update job (Admin only)
- `DELETE /api/jobs/:id` - Delete job (Admin only)

### Companies
- `GET /api/companies` - List companies
- `GET /api/companies/:id` - Get company with jobs
- `GET /api/companies/top/featured` - Get top companies

### Saved Jobs
- `GET /api/saved-jobs/:userId` - Get user's saved jobs
- `POST /api/saved-jobs` - Save a job
- `DELETE /api/saved-jobs` - Unsave a job
- `GET /api/saved-jobs/check/:jobId` - Check if job is saved

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)

### Statistics
- `GET /api/stats` - Platform statistics
- `GET /api/stats/dashboard` - Admin dashboard stats

### Health Check
- `GET /health` - API health status

## Job Filtering

The jobs endpoint supports advanced filtering:

```
GET /api/jobs?search=developer&location=kigali&category=technology&jobType=Full-time&page=1&limit=12
```

**Available filters:**
- `search` - Search in title, company, description
- `location` - Filter by location
- `category` - Filter by job category
- `jobType` - Filter by job type
- `source` - Filter by job source
- `dateRange` - Filter by date (today, week, month, all)
- `featured` - Show only featured jobs
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12, max: 50)

## Admin Features

### Admin Authentication
- Email: `admin@akazi.rw`
- Password: `admin123`

### Admin Capabilities
- Create, update, delete jobs
- Bulk job creation (up to 50 jobs at once)
- View all users and statistics
- Manage featured jobs

### Bulk Job Creation
```json
POST /api/jobs/bulk
{
  "jobs": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "Kigali, Rwanda",
      "description": "Job description...",
      "jobType": "Full-time",
      "category": "Technology"
    }
  ]
}
```

## Database Schema

### Users
- Authentication and profile information
- Role-based access (USER/ADMIN)

### Jobs
- Complete job information with company relations
- Support for featured jobs and soft deletion

### Companies
- Company profiles with metadata
- Automatic creation when jobs are posted

### SavedJobs
- Many-to-many relationship between users and jobs
- Timestamp tracking

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Zod schemas for request validation
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Rate Limiting**: Built-in Express rate limiting
- **SQL Injection Protection**: Prisma ORM prevents SQL injection

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

### Project Structure
```
src/
├── middleware/     # Express middleware
├── routes/         # API route handlers
├── schemas/        # Zod validation schemas
├── scripts/        # Database scripts
└── server.ts       # Main application file
```

## Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

4. **Start the production server**:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
