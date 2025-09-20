# JobFlow API Documentation with Swagger

## 📚 Overview

The JobFlow backend now includes comprehensive Swagger/OpenAPI 3.0 documentation that provides:

- **Interactive API Explorer**: Test endpoints directly from the browser
- **Complete Schema Documentation**: All request/response models documented
- **Authentication Support**: JWT token authentication built-in
- **Real-time Testing**: Try out API calls with live data
- **Export Capabilities**: Download OpenAPI spec as JSON

## 🌐 Access Points

Once the backend server is running, access the documentation at:

- **Swagger UI**: http://localhost:4000/api/docs
- **OpenAPI JSON**: http://localhost:4000/api/docs.json

## 🔧 Features Included

### 1. **Complete API Coverage**
All endpoints are documented with:
- Request/response schemas
- Parameter descriptions
- Example values
- Error responses
- Authentication requirements

### 2. **Interactive Testing**
- **Try It Out**: Execute API calls directly from the documentation
- **Authentication**: Built-in JWT token support
- **Real Responses**: See actual data from your database
- **Parameter Validation**: Input validation with helpful error messages

### 3. **Comprehensive Schemas**
Documented models include:
- `User` - User account information
- `Job` - Job posting details
- `Company` - Company profiles
- `SavedJob` - User saved jobs
- `LoginRequest/Response` - Authentication
- `CreateJobRequest` - Job creation
- `BulkCreateJobsRequest` - Bulk operations
- `ApiResponse` - Standard response format
- `ErrorResponse` - Error handling
- `PaginationResponse` - Pagination metadata

### 4. **Security Documentation**
- **JWT Bearer Authentication**: Documented security scheme
- **Protected Endpoints**: Clear indication of auth requirements
- **Admin-only Routes**: Proper role-based access documentation

## 🚀 Getting Started

### 1. **Start the Backend Server**
```bash
cd backend
npm run dev
```

### 2. **Access Swagger UI**
Navigate to: http://localhost:4000/api/docs

### 3. **Authenticate (for protected endpoints)**
1. Click the "Authorize" button in Swagger UI
2. Login via `/api/auth/login` endpoint to get a JWT token
3. Copy the token from the response
4. Paste it in the authorization dialog (format: `Bearer your-token-here`)
5. Click "Authorize"

### 4. **Test Endpoints**
- Browse available endpoints by category
- Click "Try it out" on any endpoint
- Fill in required parameters
- Execute the request
- View the response

## 📋 API Categories

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### **Jobs**
- `GET /api/jobs` - List jobs with filtering
- `GET /api/jobs/{id}` - Get single job
- `POST /api/jobs` - Create job (Admin only)
- `POST /api/jobs/bulk` - Bulk create jobs (Admin only)
- `PUT /api/jobs/{id}` - Update job (Admin only)
- `DELETE /api/jobs/{id}` - Delete job (Admin only)

### **Companies**
- `GET /api/companies` - List companies
- `GET /api/companies/{id}` - Get company details
- `GET /api/companies/top/featured` - Get top companies

### **Saved Jobs**
- `GET /api/saved-jobs/{userId}` - Get user's saved jobs
- `POST /api/saved-jobs` - Save a job
- `DELETE /api/saved-jobs` - Unsave a job
- `GET /api/saved-jobs/check/{jobId}` - Check if job is saved

### **Users**
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/{id}` - Get user by ID (Admin only)

### **Statistics**
- `GET /api/stats` - Platform statistics
- `GET /api/stats/dashboard` - Admin dashboard stats

### **Health**
- `GET /health` - API health check

## 🔐 Authentication Examples

### **Admin Login**
```json
POST /api/auth/login
{
  "email": "admin@akazi.rw",
  "password": "admin123"
}
```

### **Regular User Login**
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

## 📝 Example API Calls

### **Create a Job (Admin)**
```json
POST /api/jobs
Authorization: Bearer your-jwt-token

{
  "title": "Senior React Developer",
  "company": "Tech Solutions Rwanda",
  "location": "Kigali, Rwanda",
  "description": "We are looking for an experienced React developer...",
  "requirements": "5+ years React experience, TypeScript knowledge",
  "salaryRange": "$60,000 - $80,000",
  "jobType": "Full-time",
  "category": "Technology",
  "deadline": "2024-02-15T23:59:59Z",
  "source": "Manual",
  "url": "https://techsolutions.rw/careers/react-dev",
  "isFeatured": true
}
```

### **Search Jobs**
```
GET /api/jobs?search=developer&location=kigali&category=technology&jobType=Full-time&page=1&limit=12
```

### **Save a Job**
```json
POST /api/saved-jobs
Authorization: Bearer your-jwt-token

{
  "jobId": 1,
  "userId": 2
}
```

## 🎨 Swagger UI Customization

The Swagger UI includes custom styling:
- **Clean Interface**: Removed unnecessary topbar
- **Brand Colors**: JobFlow blue theme
- **Enhanced UX**: Better spacing and readability
- **Persistent Auth**: Remembers your authentication
- **Request Duration**: Shows API response times

## 📊 Response Formats

### **Success Response**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### **Error Response**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### **Paginated Response**
```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "totalPages": 9,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🔧 Development Tips

### **Adding New Endpoints**
1. Add JSDoc comments above route handlers
2. Use `@swagger` tags for OpenAPI specification
3. Reference existing schemas or create new ones
4. Include all possible response codes
5. Document authentication requirements

### **Testing with Swagger**
1. Use the admin credentials to test protected endpoints
2. Try different filter combinations on the jobs endpoint
3. Test error scenarios (invalid data, unauthorized access)
4. Verify pagination works correctly
5. Check that all response formats match documentation

### **Exporting Documentation**
- Download the OpenAPI spec from `/api/docs.json`
- Import into other tools like Postman or Insomnia
- Generate client SDKs using OpenAPI generators
- Share with frontend developers for integration

## 🚀 Production Considerations

### **Security**
- The documentation is available in development
- Consider restricting access in production environments
- JWT tokens are properly documented and secured
- All sensitive endpoints require authentication

### **Performance**
- Swagger UI is served efficiently
- Documentation generation is optimized
- No impact on API performance
- Caching headers are properly set

### **Maintenance**
- Keep documentation in sync with code changes
- Update examples when API changes
- Validate schemas match actual responses
- Test documentation regularly

## 📚 Additional Resources

- **OpenAPI Specification**: https://swagger.io/specification/
- **Swagger UI Documentation**: https://swagger.io/tools/swagger-ui/
- **JSDoc to OpenAPI**: https://github.com/Surnet/swagger-jsdoc

---

**The JobFlow API documentation is now complete and ready for use! 🎉**
