import express from 'express';
import { prisma } from '../server';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/stats:
 *   get:
 *     tags: [Statistics]
 *     summary: Get platform statistics
 *     description: Retrieve comprehensive platform statistics including job counts, categories, types, locations, top companies, trends, and user-specific data if authenticated
 *     responses:
 *       200:
 *         description: Platform statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/PlatformStatistics'
 */
// GET /api/stats - Get platform statistics
router.get('/', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    // Get basic counts
    const [
      totalJobs,
      activeJobs,
      totalCompanies,
      totalUsers,
      featuredJobs,
      recentJobs,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.company.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.job.count({ where: { isActive: true, isFeatured: true } }),
      prisma.job.count({
        where: {
          isActive: true,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    // Get job statistics by category
    const jobsByCategory = await prisma.job.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Get job statistics by type
    const jobsByType = await prisma.job.groupBy({
      by: ['jobType'],
      where: { isActive: true },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Get job statistics by location
    const jobsByLocation = await prisma.job.groupBy({
      by: ['location'],
      where: { isActive: true },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Get top companies by job count
    const topCompanies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        logo: true,
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
      take: 10,
    });

    // Get recent job posting trends (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const jobTrends = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM jobs 
      WHERE created_at >= ${thirtyDaysAgo} AND is_active = true
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    ` as Array<{ date: Date; count: bigint }>;

    // Get user engagement stats (if user is authenticated)
    let userStats = null;
    if (req.user) {
      const savedJobsCount = await prisma.savedJob.count({
        where: { userId: req.user.id },
      });

      userStats = {
        savedJobs: savedJobsCount,
        isAdmin: req.user.role === 'ADMIN',
      };
    }

    const stats = {
      overview: {
        totalJobs,
        activeJobs,
        totalCompanies,
        totalUsers,
        featuredJobs,
        recentJobs,
      },
      categories: jobsByCategory.map(item => ({
        name: item.category,
        count: item._count.id,
      })),
      jobTypes: jobsByType.map(item => ({
        name: item.jobType,
        type: item.jobType,
        count: item._count.id,
      })),
      locations: jobsByLocation.map(item => ({
        name: item.location,
        count: item._count.id,
      })),
      topCompanies: topCompanies.map(company => ({
        id: company.id,
        name: company.name,
        logo: company.logo,
        jobCount: company._count.jobs,
      })),
      trends: jobTrends.map(trend => ({
        date: trend.date,
        count: Number(trend.count),
      })),
      userStats,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/stats/dashboard:
 *   get:
 *     tags: [Statistics]
 *     summary: Get admin dashboard statistics
 *     description: Retrieve detailed administrative statistics including job metrics, user counts, and recent activity for dashboard display
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
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
 *                         overview:
 *                           type: object
 *                           properties:
 *                             jobs:
 *                               type: object
 *                               properties:
 *                                 total: { type: 'integer', example: 1250 }
 *                                 active: { type: 'integer', example: 980 }
 *                                 inactive: { type: 'integer', example: 270 }
 *                                 featured: { type: 'integer', example: 45 }
 *                                 today: { type: 'integer', example: 8 }
 *                                 thisWeek: { type: 'integer', example: 28 }
 *                                 thisMonth: { type: 'integer', example: 134 }
 *                             companies:
 *                               type: object
 *                               properties:
 *                                 total: { type: 'integer', example: 156 }
 *                             users:
 *                               type: object
 *                               properties:
 *                                 total: { type: 'integer', example: 543 }
 *                                 admins: { type: 'integer', example: 3 }
 *                                 regular: { type: 'integer', example: 540 }
 *                         recentActivity:
 *                           type: object
 *                           properties:
 *                             jobs:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/Job'
 *                             users:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/User'
 */
// GET /api/stats/dashboard - Get admin dashboard statistics
router.get('/dashboard', optionalAuth, async (req: AuthRequest, res, next) => {
  try {
    // Basic admin dashboard stats
    const [
      totalJobs,
      activeJobs,
      inactiveJobs,
      totalCompanies,
      totalUsers,
      adminUsers,
      featuredJobs,
      todayJobs,
      weekJobs,
      monthJobs,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.job.count({ where: { isActive: false } }),
      prisma.company.count(),
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.job.count({ where: { isActive: true, isFeatured: true } }),
      prisma.job.count({
        where: {
          isActive: true,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.job.count({
        where: {
          isActive: true,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.job.count({
        where: {
          isActive: true,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Recent activity
    const recentJobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        jobType: true,
        category: true,
        isFeatured: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const dashboardStats = {
      overview: {
        jobs: {
          total: totalJobs,
          active: activeJobs,
          inactive: inactiveJobs,
          featured: featuredJobs,
          today: todayJobs,
          thisWeek: weekJobs,
          thisMonth: monthJobs,
        },
        companies: {
          total: totalCompanies,
        },
        users: {
          total: totalUsers,
          admins: adminUsers,
          regular: totalUsers - adminUsers,
        },
      },
      recentActivity: {
        jobs: recentJobs.map(job => ({
          ...job,
          job_type: job.jobType,
          is_featured: job.isFeatured,
          is_active: job.isActive,
          created_at: job.createdAt,
        })),
        users: recentUsers.map(user => ({
          ...user,
          is_verified: user.isVerified,
          created_at: user.createdAt,
        })),
      },
    };

    res.json({
      success: true,
      data: dashboardStats,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
