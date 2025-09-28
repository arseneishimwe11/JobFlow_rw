# JobFlow Deployment Guide

## Railway Deployment

### Prerequisites
- Railway account
- GitHub repository connected to Railway
- PostgreSQL database (Railway provides this)

### Backend Deployment

1. **Connect Repository**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Backend Service**
   - Railway will auto-detect the backend folder
   - Set the root directory to `backend`
   - Add environment variables:
     ```
     DATABASE_URL=postgresql://postgres:password@host:port/database
     JWT_SECRET=your-super-secure-jwt-secret-key
     PORT=4000
     NODE_ENV=production
     ADMIN_EMAIL=admin@akazi.rw
     ADMIN_PASSWORD=your-secure-admin-password
     CORS_ORIGINS=https://your-frontend-domain.com
     ```

3. **Database Setup**
   - Railway will provide a PostgreSQL database
   - Copy the DATABASE_URL from Railway
   - Run migrations: `npm run db:push`
   - Seed data: `npm run db:seed`

### Frontend Deployment

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Railway**
   - Create a new service for frontend
   - Set root directory to `frontend`
   - Add environment variable:
     ```
     VITE_API_BASE_URL=https://your-backend-railway-url.railway.app/api
     ```

3. **Static File Serving**
   - Railway will serve the built files from the `dist` folder
   - Configure custom domain if needed

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secure-jwt-secret-key"
PORT=4000
NODE_ENV=production
ADMIN_EMAIL="admin@akazi.rw"
ADMIN_PASSWORD="your-secure-admin-password"
CORS_ORIGINS="https://your-frontend-domain.com"
```

#### Frontend (.env.production)
```env
VITE_API_BASE_URL="https://your-backend-railway-url.railway.app/api"
```

### Production Checklist

- [ ] Change default admin credentials
- [ ] Set secure JWT secret
- [ ] Configure CORS origins
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Test all functionality
- [ ] Set up CI/CD pipeline

### Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use Railway's environment variable management
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Regular backups

3. **API Security**
   - Rate limiting
   - Input validation
   - CORS configuration
   - JWT token expiration

### Monitoring

Railway provides built-in monitoring:
- Application logs
- Performance metrics
- Error tracking
- Resource usage

### Troubleshooting

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build scripts

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database is running

3. **CORS Issues**
   - Verify CORS_ORIGINS configuration
   - Check frontend URL matches

### Support

For Railway-specific issues:
- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway Support: https://railway.app/support
