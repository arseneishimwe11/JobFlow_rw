import express from 'express';
import { prisma } from '../server';
import { authenticateToken, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { 
  createJobSchema, 
  updateJobSchema, 
  jobQuerySchema, 
  bulkCreateJobsSchema,
  CreateJobInput,
  JobQueryInput 
} from '../schemas/job';

const router = express.Router();

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: List jobs with filtering and pagination
 *     description: Retrieve a paginated list of jobs with optional filtering
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in job title, company, and description
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by job category
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [Full-time, Part-time, Contract, Freelance, Internship, Remote]
 *         description: Filter by job type
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter by job source
 *       - in: query
 *         name: dateRange
 *         schema:
 *           type: string
 *           enum: [today, week, month, all]
 *         description: Filter by date range
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Show only featured jobs
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *         description: Number of jobs per page
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         jobs:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Job'
 *                         pagination:
 *                           $ref: '#/components/schemas/PaginationResponse'
 */
// GET /api/jobs - List jobs with filtering and pagination
router.get('/', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const query = jobQuerySchema.parse(req.query);
    
    const where: any = {
      isActive: true,
    };

    // Apply filters
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { company: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' };
    }

    if (query.category) {
      where.category = { contains: query.category, mode: 'insensitive' };
    }

    if (query.jobType) {
      where.jobType = query.jobType;
    }

    if (query.source) {
      where.source = { contains: query.source, mode: 'insensitive' };
    }

    if (query.featured) {
      where.isFeatured = true;
    }

    // Date range filter
    if (query.dateRange && query.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (query.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(0);
      }

      where.createdAt = { gte: startDate };
    }

    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await prisma.job.count({ where });

    // Get jobs
    const jobs = await prisma.job.findMany({
      where,
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        description: true,
        salaryRange: true,
        jobType: true,
        category: true,
        deadline: true,
        source: true,
        url: true,
        postedDate: true,
        isFeatured: true,
        createdAt: true,
        updatedAt: true,
        company_rel: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true,
          },
        },
        savedBy: req.user ? {
          where: { userId: req.user.id },
          select: { id: true },
        } : false,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
    });

    // Transform jobs to include saved status
    const transformedJobs = jobs.map(job => ({
      ...job,
      posted_date: job.postedDate,
      job_type: job.jobType,
      salary_range: job.salaryRange,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
      is_featured: job.isFeatured,
      is_saved: req.user ? job.savedBy.length > 0 : false,
      company_info: job.company_rel,
    }));

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        jobs: transformedJobs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs/:id - Get single job
router.get('/:id', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const jobId = parseInt(req.params.id);
    
    if (isNaN(jobId)) {
      throw createError('Invalid job ID', 400);
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId, isActive: true },
      include: {
        company_rel: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true,
            description: true,
            location: true,
            industry: true,
          },
        },
        savedBy: req.user ? {
          where: { userId: req.user.id },
          select: { id: true },
        } : false,
      },
    });

    if (!job) {
      throw createError('Job not found', 404);
    }

    const transformedJob = {
      ...job,
      posted_date: job.postedDate,
      job_type: job.jobType,
      salary_range: job.salaryRange,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
      is_featured: job.isFeatured,
      is_saved: req.user ? job.savedBy.length > 0 : false,
      company_info: job.company_rel,
    };

    res.json({
      success: true,
      data: transformedJob,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: Create new job (Admin only)
 *     description: Create a new job posting. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobRequest'
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// POST /api/jobs - Create new job (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const jobData = createJobSchema.parse(req.body);
    
    // Find or create company
    let company = await prisma.company.findFirst({
      where: { name: { equals: jobData.company, mode: 'insensitive' } },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: jobData.company,
          location: jobData.location,
        },
      });
    }

    const job = await prisma.job.create({
      data: {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        description: jobData.description,
        requirements: jobData.requirements,
        salaryRange: jobData.salaryRange,
        jobType: jobData.jobType,
        category: jobData.category,
        deadline: jobData.deadline ? new Date(jobData.deadline) : null,
        source: jobData.source,
        url: jobData.url,
        isFeatured: jobData.isFeatured,
        postedDate: new Date(),
        companyId: company.id,
      },
      include: {
        company_rel: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true,
          },
        },
      },
    });

    const transformedJob = {
      ...job,
      posted_date: job.postedDate,
      job_type: job.jobType,
      salary_range: job.salaryRange,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
      is_featured: job.isFeatured,
      company_info: job.company_rel,
    };

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: transformedJob,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/jobs/bulk - Create multiple jobs (Admin only)
router.post('/bulk', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const { jobs } = bulkCreateJobsSchema.parse(req.body);
    
    const createdJobs = [];
    const errors = [];

    for (let i = 0; i < jobs.length; i++) {
      try {
        const jobData = jobs[i];
        
        // Find or create company
        let company = await prisma.company.findFirst({
          where: { name: { equals: jobData.company, mode: 'insensitive' } },
        });

        if (!company) {
          company = await prisma.company.create({
            data: {
              name: jobData.company,
              location: jobData.location,
            },
          });
        }

        const job = await prisma.job.create({
          data: {
            title: jobData.title,
            company: jobData.company,
            location: jobData.location,
            description: jobData.description,
            requirements: jobData.requirements,
            salaryRange: jobData.salaryRange,
            jobType: jobData.jobType,
            category: jobData.category,
            deadline: jobData.deadline ? new Date(jobData.deadline) : null,
            source: jobData.source,
            url: jobData.url,
            isFeatured: jobData.isFeatured,
            postedDate: new Date(),
            companyId: company.id,
          },
        });

        createdJobs.push(job);
      } catch (error) {
        errors.push({
          index: i,
          job: jobs[i],
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Created ${createdJobs.length} jobs successfully`,
      data: {
        created: createdJobs.length,
        errors: errors.length,
        jobs: createdJobs,
        failedJobs: errors,
      },
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/jobs/:id - Update job (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const jobId = parseInt(req.params.id);
    
    if (isNaN(jobId)) {
      throw createError('Invalid job ID', 400);
    }

    const jobData = updateJobSchema.parse(req.body);
    
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...jobData,
        deadline: jobData.deadline ? new Date(jobData.deadline) : undefined,
        updatedAt: new Date(),
      },
      include: {
        company_rel: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true,
          },
        },
      },
    });

    const transformedJob = {
      ...job,
      posted_date: job.postedDate,
      job_type: job.jobType,
      salary_range: job.salaryRange,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
      is_featured: job.isFeatured,
      company_info: job.company_rel,
    };

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: transformedJob,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/jobs/:id - Delete job (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res, next) => {
  try {
    const jobId = parseInt(req.params.id);
    
    if (isNaN(jobId)) {
      throw createError('Invalid job ID', 400);
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
