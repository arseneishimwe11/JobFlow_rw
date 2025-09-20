import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JobFlow API',
      version: '1.0.0',
      description: 'A comprehensive job posting platform API built with Node.js, Express, and TypeScript',
      contact: {
        name: 'JobFlow Team',
        email: 'admin@akazi.rw',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-production-domain.com/api' 
          : 'http://localhost:4000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
            avatar: { type: 'string', nullable: true, example: 'https://example.com/avatar.jpg' },
            isVerified: { type: 'boolean', example: true },
            isPro: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Senior Software Engineer' },
            company: { type: 'string', example: 'Tech Solutions Rwanda' },
            location: { type: 'string', example: 'Kigali, Rwanda' },
            description: { type: 'string', example: 'We are looking for a Senior Software Engineer...' },
            requirements: { type: 'string', nullable: true, example: 'Bachelor\'s degree in Computer Science...' },
            salaryRange: { type: 'string', nullable: true, example: '$50,000 - $70,000' },
            jobType: { 
              type: 'string', 
              enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'],
              example: 'Full-time' 
            },
            category: { type: 'string', example: 'Technology' },
            deadline: { type: 'string', format: 'date-time', nullable: true },
            source: { type: 'string', example: 'Manual' },
            url: { type: 'string', nullable: true, example: 'https://company.com/jobs/123' },
            postedDate: { type: 'string', format: 'date-time' },
            isFeatured: { type: 'boolean', example: false },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Company: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Tech Solutions Rwanda' },
            description: { type: 'string', nullable: true, example: 'Leading technology company in Rwanda' },
            logo: { type: 'string', nullable: true, example: 'https://example.com/logo.png' },
            website: { type: 'string', nullable: true, example: 'https://techsolutions.rw' },
            location: { type: 'string', nullable: true, example: 'Kigali, Rwanda' },
            industry: { type: 'string', nullable: true, example: 'Technology' },
            size: { type: 'string', nullable: true, example: '50-100' },
            founded: { type: 'integer', nullable: true, example: 2020 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        SavedJob: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
            jobId: { type: 'integer', example: 1 },
            savedAt: { type: 'string', format: 'date-time' },
            job: { $ref: '#/components/schemas/Job' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@akazi.rw' },
            password: { type: 'string', example: 'admin123' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
          },
        },
        CreateJobRequest: {
          type: 'object',
          required: ['title', 'company', 'location', 'description', 'jobType', 'category'],
          properties: {
            title: { type: 'string', example: 'Senior Software Engineer' },
            company: { type: 'string', example: 'Tech Solutions Rwanda' },
            location: { type: 'string', example: 'Kigali, Rwanda' },
            description: { type: 'string', example: 'We are looking for a Senior Software Engineer...' },
            requirements: { type: 'string', example: 'Bachelor\'s degree in Computer Science...' },
            salaryRange: { type: 'string', example: '$50,000 - $70,000' },
            jobType: { 
              type: 'string', 
              enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'],
              example: 'Full-time' 
            },
            category: { type: 'string', example: 'Technology' },
            deadline: { type: 'string', format: 'date-time' },
            source: { type: 'string', example: 'Manual' },
            url: { type: 'string', example: 'https://company.com/jobs/123' },
            isFeatured: { type: 'boolean', example: false },
          },
        },
        BulkCreateJobsRequest: {
          type: 'object',
          required: ['jobs'],
          properties: {
            jobs: {
              type: 'array',
              items: { $ref: '#/components/schemas/CreateJobRequest' },
              minItems: 1,
              maxItems: 50,
            },
          },
        },
        SaveJobRequest: {
          type: 'object',
          required: ['jobId', 'userId'],
          properties: {
            jobId: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 1 },
          },
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe' },
            avatar: { type: 'string', nullable: true, example: 'https://example.com/avatar.jpg' },
          },
        },
        PlatformStatistics: {
          type: 'object',
          properties: {
            overview: {
              type: 'object',
              properties: {
                totalJobs: { type: 'integer', example: 1250 },
                activeJobs: { type: 'integer', example: 980 },
                totalCompanies: { type: 'integer', example: 156 },
                totalUsers: { type: 'integer', example: 543 },
                featuredJobs: { type: 'integer', example: 45 },
                recentJobs: { type: 'integer', example: 28 },
              },
            },
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Technology' },
                  count: { type: 'integer', example: 234 },
                },
              },
            },
            jobTypes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Full-time' },
                  type: { type: 'string', example: 'Full-time' },
                  count: { type: 'integer', example: 567 },
                },
              },
            },
            locations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Kigali, Rwanda' },
                  count: { type: 'integer', example: 432 },
                },
              },
            },
            topCompanies: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  name: { type: 'string', example: 'Tech Solutions Rwanda' },
                  logo: { type: 'string', nullable: true, example: 'https://example.com/logo.png' },
                  jobCount: { type: 'integer', example: 23 },
                },
              },
            },
            trends: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date' },
                  count: { type: 'integer', example: 5 },
                },
              },
            },
            userStats: {
              type: 'object',
              nullable: true,
              properties: {
                savedJobs: { type: 'integer', example: 12 },
                isAdmin: { type: 'boolean', example: false },
              },
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        PaginationResponse: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 12 },
            total: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 9 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Jobs',
        description: 'Job management endpoints',
      },
      {
        name: 'Companies',
        description: 'Company management endpoints',
      },
      {
        name: 'Saved Jobs',
        description: 'User saved jobs management',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Statistics',
        description: 'Platform statistics and analytics',
      },
      {
        name: 'Health',
        description: 'API health check endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/server.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI options
  const swaggerUiOptions = {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6 }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
    `,
    customSiteTitle: 'JobFlow API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
  };

  // Serve swagger docs
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  
  // Serve swagger JSON
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(`📚 Swagger documentation available at: http://localhost:${process.env.PORT || 4000}/api/docs`);
};

export default specs;
