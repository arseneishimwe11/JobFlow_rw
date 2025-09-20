import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health',
      'GET /api/jobs',
      'POST /api/jobs',
      'GET /api/jobs/:id',
      'GET /api/companies',
      'GET /api/companies/:id',
      'POST /api/auth/login',
      'GET /api/stats',
      'GET /api/saved-jobs/:userId',
      'POST /api/saved-jobs',
      'DELETE /api/saved-jobs',
    ],
  });
};
