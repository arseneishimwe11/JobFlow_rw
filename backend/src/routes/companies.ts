import express from 'express';
import { prisma } from '../server';
import { createError } from '../middleware/errorHandler';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/companies:
 *   get:
 *     tags: [Companies]
 *     summary: List all companies with pagination and search
 *     description: Retrieve a paginated list of companies with optional search functionality
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in company name, description, industry, and location
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
 *           default: 20
 *         description: Number of companies per page
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
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
 *                         companies:
 *                           type: array
 *                           items:
 *                             allOf:
 *                               - $ref: '#/components/schemas/Company'
 *                               - type: object
 *                                 properties:
 *                                   jobCount:
 *                                     type: integer
 *                                     description: Number of active jobs
 *                         pagination:
 *                           $ref: '#/components/schemas/PaginationResponse'
 */
// GET /api/companies - List all companies
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const search = req.query.search as string;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.company.count({ where });

    const companies = await prisma.company.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        website: true,
        location: true,
        industry: true,
        size: true,
        founded: true,
        createdAt: true,
        _count: {
          select: {
            jobs: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: [
        { name: 'asc' },
      ],
      skip,
      take: limit,
    });

    const transformedCompanies = companies.map(company => ({
      ...company,
      jobCount: company._count.jobs,
      created_at: company.createdAt,
    }));

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        companies: transformedCompanies,
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

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Get single company with active jobs
 *     description: Retrieve detailed information about a specific company including all active job postings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Company'
 *                         - type: object
 *                           properties:
 *                             jobs:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Job'
 *                             jobCount:
 *                               type: integer
 *                               description: Total number of active jobs
 *       400:
 *         description: Invalid company ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// GET /api/companies/:id - Get single company with jobs
router.get('/:id', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    const companyId = parseInt(req.params.id);
    
    if (isNaN(companyId)) {
      throw createError('Invalid company ID', 400);
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        jobs: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            location: true,
            description: true,
            salaryRange: true,
            jobType: true,
            category: true,
            deadline: true,
            postedDate: true,
            isFeatured: true,
            createdAt: true,
            savedBy: req.user ? {
              where: { userId: req.user.id },
              select: { id: true },
            } : false,
          },
          orderBy: [
            { isFeatured: 'desc' },
            { createdAt: 'desc' },
          ],
        },
      },
    });

    if (!company) {
      throw createError('Company not found', 404);
    }

    const transformedJobs = company.jobs.map(job => ({
      ...job,
      posted_date: job.postedDate,
      job_type: job.jobType,
      salary_range: job.salaryRange,
      created_at: job.createdAt,
      is_featured: job.isFeatured,
      is_saved: req.user ? job.savedBy.length > 0 : false,
    }));

    const transformedCompany = {
      ...company,
      created_at: company.createdAt,
      updated_at: company.updatedAt,
      jobs: transformedJobs,
      jobCount: company.jobs.length,
    };

    res.json({
      success: true,
      data: transformedCompany,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/companies/top/featured:
 *   get:
 *     tags: [Companies]
 *     summary: Get top companies by job count
 *     description: Retrieve top companies ranked by number of active job postings
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *         description: Maximum number of companies to return
 *     responses:
 *       200:
 *         description: Top companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/Company'
 *                           - type: object
 *                             properties:
 *                               jobCount:
 *                                 type: integer
 *                                 description: Number of active jobs
 */
// GET /api/companies/top - Get top companies by job count
router.get('/top/featured', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 20);

    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        website: true,
        location: true,
        industry: true,
        size: true,
        _count: {
          select: {
            jobs: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: {
        jobs: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    const transformedCompanies = companies.map(company => ({
      ...company,
      jobCount: company._count.jobs,
    }));

    res.json({
      success: true,
      data: transformedCompanies,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
