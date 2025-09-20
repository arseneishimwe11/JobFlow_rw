import express from 'express';
import { prisma } from '../server';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { saveJobSchema, unsaveJobSchema } from '../schemas/savedJob';

const router = express.Router();

/**
 * @swagger
 * /api/saved-jobs/{userId}:
 *   get:
 *     tags: [Saved Jobs]
 *     summary: Get user's saved jobs
 *     description: Retrieve all saved jobs for a specific user with pagination. Users can only access their own saved jobs unless they are admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
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
 *         description: Number of saved jobs per page
 *     responses:
 *       200:
 *         description: Saved jobs retrieved successfully
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
 *                         savedJobs:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/SavedJob'
 *                         pagination:
 *                           $ref: '#/components/schemas/PaginationResponse'
 *       400:
 *         description: Invalid user ID
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
 *         description: Access denied - Users can only access their own saved jobs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// GET /api/saved-jobs/:userId - Get all saved jobs for a user
router.get('/:userId', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      throw createError('Invalid user ID', 400);
    }

    // Users can only access their own saved jobs, unless they're admin
    if (req.user!.id !== userId && req.user!.role !== 'ADMIN') {
      throw createError('Access denied', 403);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 12, 50);
    const skip = (page - 1) * limit;

    const total = await prisma.savedJob.count({
      where: { userId },
    });

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: {
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
            postedDate: true,
            isFeatured: true,
            isActive: true,
            createdAt: true,
            company_rel: {
              select: {
                id: true,
                name: true,
                logo: true,
                website: true,
              },
            },
          },
        },
      },
      orderBy: { savedAt: 'desc' },
      skip,
      take: limit,
    });

    const transformedSavedJobs = savedJobs
      .filter(savedJob => savedJob.job.isActive) // Only return active jobs
      .map(savedJob => ({
        id: savedJob.id,
        savedAt: savedJob.savedAt,
        saved_at: savedJob.savedAt,
        job: {
          ...savedJob.job,
          posted_date: savedJob.job.postedDate,
          job_type: savedJob.job.jobType,
          salary_range: savedJob.job.salaryRange,
          created_at: savedJob.job.createdAt,
          is_featured: savedJob.job.isFeatured,
          is_saved: true,
          company_info: savedJob.job.company_rel,
        },
      }));

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        savedJobs: transformedSavedJobs,
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
 * /api/saved-jobs:
 *   post:
 *     tags: [Saved Jobs]
 *     summary: Save a job for user
 *     description: Add a job to user's saved jobs list. Users can only save jobs for themselves unless they are admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveJobRequest'
 *     responses:
 *       201:
 *         description: Job saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SavedJob'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied - Users can only save jobs for themselves
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Job already saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// POST /api/saved-jobs - Save a job
router.post('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { jobId, userId } = saveJobSchema.parse(req.body);

    // Users can only save jobs for themselves, unless they're admin
    if (req.user!.id !== userId && req.user!.role !== 'ADMIN') {
      throw createError('Access denied', 403);
    }

    // Check if job exists and is active
    const job = await prisma.job.findUnique({
      where: { id: jobId, isActive: true },
    });

    if (!job) {
      throw createError('Job not found', 404);
    }

    // Check if already saved
    const existingSavedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (existingSavedJob) {
      throw createError('Job already saved', 409);
    }

    const savedJob = await prisma.savedJob.create({
      data: {
        userId,
        jobId,
      },
      include: {
        job: {
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
            postedDate: true,
            isFeatured: true,
            createdAt: true,
            company_rel: {
              select: {
                id: true,
                name: true,
                logo: true,
                website: true,
              },
            },
          },
        },
      },
    });

    const transformedSavedJob = {
      id: savedJob.id,
      savedAt: savedJob.savedAt,
      saved_at: savedJob.savedAt,
      job: {
        ...savedJob.job,
        posted_date: savedJob.job.postedDate,
        job_type: savedJob.job.jobType,
        salary_range: savedJob.job.salaryRange,
        created_at: savedJob.job.createdAt,
        is_featured: savedJob.job.isFeatured,
        is_saved: true,
        company_info: savedJob.job.company_rel,
      },
    };

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: transformedSavedJob,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/saved-jobs:
 *   delete:
 *     tags: [Saved Jobs]
 *     summary: Unsave a job for user
 *     description: Remove a job from user's saved jobs list. Users can only unsave jobs for themselves unless they are admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveJobRequest'
 *     responses:
 *       200:
 *         description: Job unsaved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied - Users can only unsave jobs for themselves
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Saved job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// DELETE /api/saved-jobs - Unsave a job
router.delete('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { jobId, userId } = unsaveJobSchema.parse(req.body);

    // Users can only unsave jobs for themselves, unless they're admin
    if (req.user!.id !== userId && req.user!.role !== 'ADMIN') {
      throw createError('Access denied', 403);
    }

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    if (!savedJob) {
      throw createError('Saved job not found', 404);
    }

    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });

    res.json({
      success: true,
      message: 'Job unsaved successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/saved-jobs/check/{jobId}:
 *   get:
 *     tags: [Saved Jobs]
 *     summary: Check if job is saved by current user
 *     description: Check whether a specific job is saved by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID to check
 *     responses:
 *       200:
 *         description: Check completed successfully
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
 *                         isSaved:
 *                           type: boolean
 *                           description: Whether the job is saved by the user
 *                         savedAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           description: When the job was saved (null if not saved)
 *       400:
 *         description: Invalid job ID
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
 */
// GET /api/saved-jobs/check/:jobId - Check if job is saved by current user
router.get('/check/:jobId', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const jobId = parseInt(req.params.jobId);
    
    if (isNaN(jobId)) {
      throw createError('Invalid job ID', 400);
    }

    const savedJob = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: req.user!.id,
          jobId,
        },
      },
    });

    res.json({
      success: true,
      data: {
        isSaved: !!savedJob,
        savedAt: savedJob?.savedAt || null,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
