# JobFlow - Complete Job Posting Platform

A modern, full-stack job posting platform built with React, Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

### For Job Seekers
- **Browse Jobs**: Search and filter through thousands of job opportunities
- **Advanced Filtering**: Filter by location, category, job type, salary range, and more
- **Save Jobs**: Bookmark interesting positions for later
- **Company Profiles**: Explore company information and all their job listings
- **Job Sharing**: Generate and share professional job cards on social media
- **Responsive Design**: Perfect experience on desktop and mobile

### For Admins
- **Job Management**: Complete CRUD operations for job postings
- **Bulk Operations**: Upload multiple jobs via JSON with validation
- **Analytics Dashboard**: Real-time platform statistics and insights
- **User Management**: Monitor user activity and engagement
- **Company Management**: Manage company profiles and information

### Universal Job Sharing System
- **Image Generation**: Create professional job cards in multiple formats
- **Social Media Integration**: Direct sharing to WhatsApp, LinkedIn, Twitter, Facebook
- **Multiple Formats**: Square (1080x1080), Landscape (1200x630), Story (1080x1920)
- **Copy Link**: Quick link copying for easy sharing
- **Download**: Save generated images for offline use

### Technical Features
- **Modern UI**: Built with React 19, TypeScript, and Tailwind CSS
- **Real-time Updates**: Powered by TanStack Query for efficient data fetching
- **Secure Authentication**: JWT-based auth with role-based access control
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **API**: RESTful API with comprehensive validation and error handling

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **TanStack Query** for state management and caching
- **Tailwind CSS** + **Radix UI** for styling
- **React Router** for navigation
- **Vite** for build tooling

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Prisma ORM** with **PostgreSQL**
- **JWT** for authentication
- **Zod** for validation
- **bcryptjs** for password hashing

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v13 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd JobFlow_rw

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Create a PostgreSQL database
createdb jobflow_db

# Or using psql
psql -U postgres -c "CREATE DATABASE jobflow_db;"
```

### 3. Environment Configuration

**Backend Environment** (`backend/.env`):
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/jobflow_db"

# JWT Secret (change in production)
JWT_SECRET="jobflow-super-secret-jwt-key-2024-development"

# Server Configuration
PORT=4000
NODE_ENV=development

# Admin Credentials
ADMIN_EMAIL="admin@akazi.rw"
ADMIN_PASSWORD="admin123"

# CORS Origins
CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
```

**Frontend Environment** (`frontend/.env.development`):
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 4. Database Setup

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **API Health**: http://localhost:4000/health

## 👤 Default Admin Access

- **Email**: `admin@akazi.rw`
- **Password**: `admin123`

## 📁 Project Structure

```
JobFlow_rw/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── scripts/         # Database scripts
│   │   └── server.ts        # Main server file
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities and API client
│   │   └── pages/           # Page components
│   └── package.json
└── package.json            # Root package.json
```

## 🔧 Development

### Backend Development

```bash
cd backend

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:migrate     # Run migrations
npm run db:seed        # Seed sample data
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Built with ❤️ for the Rwandan job market**
