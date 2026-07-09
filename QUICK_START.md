# Quick Start Guide

## 5-Minute Setup

### 1. Configure Environment
```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# JWT_SECRET=your-secret-key
```

### 2. Install & Run
```bash
pnpm install
pnpm dev
```

### 3. Access the Application

**Public Feedback Form**: http://localhost:3000
- Submit feedback anonymously or with account
- Select category, rate experience, add comments

**Admin Registration**: http://localhost:3000/auth/register
- Create admin account with email/password
- Password minimum 8 characters

**Admin Dashboard**: http://localhost:3000/dashboard
- View analytics and feedback statistics
- Manage feedback status (Pending → In Progress → Resolved/Rejected)
- Search and filter feedback

## Database Setup

The system automatically initializes the database on first request:
- Creates tables: users, categories, feedback
- Inserts default categories:
  - Bug Report
  - Feature Request
  - Improvement
  - Documentation
  - Other
- Creates performance indexes

## File Structure Quick Reference

```
Feedback Form → app/page.tsx + components/feedback/FeedbackForm.tsx
Auth Pages → app/auth/login/page.tsx + app/auth/register/page.tsx
Dashboard → app/dashboard/page.tsx
API Endpoints → app/api/**/route.ts
Backend Logic → lib/**/*.ts
Frontend Hooks → useAuth.ts
Database → lib/db/connection.ts + schema.ts
```

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| DATABASE_URL | PostgreSQL connection | postgresql://user:pass@localhost/db |
| JWT_SECRET | Token signing key | 32-char random string |
| JWT_EXPIRATION | Token lifespan | 7d |
| NEXT_PUBLIC_API_URL | API base URL | http://localhost:3000 |
| LOG_LEVEL | Logging verbosity | info |
| NODE_ENV | Environment | development |

## Common Tasks

### Create Admin User
1. Visit http://localhost:3000/auth/register
2. Enter email, password (8+ chars), full name
3. Click Create Account
4. Redirects to dashboard

### Submit Feedback
1. Visit http://localhost:3000
2. Fill form: email, category, title, description
3. Optionally add 1-5 rating
4. Click Submit

### Manage Feedback
1. Login to dashboard
2. Go to "Feedback List" tab
3. Use search/status filter
4. Click status dropdown to change status

### View Analytics
1. Login to dashboard
2. Go to "Analytics" tab
3. View key metrics and trends

## API Testing

```bash
# Health Check
curl http://localhost:3000/api/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123","fullName":"Admin User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}'

# Submit Feedback
curl -X POST http://localhost:3000/api/feedback/submit \
  -H "Content-Type: application/json" \
  -d '{"categoryId":1,"title":"Great app","description":"This feedback system works great!","email":"user@test.com","rating":5}'

# Get Categories
curl http://localhost:3000/api/feedback/categories

# List Feedback (requires auth token)
curl http://localhost:3000/api/feedback/list?page=1&pageSize=10 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use managed PostgreSQL database
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure rate limiting
- [ ] Enable CORS headers if needed
- [ ] Set up backups
- [ ] Test all endpoints
- [ ] Deploy to Vercel/preferred platform

## Troubleshooting

**Can't connect to database**
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Confirm credentials
- Test connection: `psql $DATABASE_URL`

**Login fails**
- Check JWT_SECRET is set
- Clear browser localStorage
- Re-register account

**API returns 500**
- Check console for errors
- Visit /api/health to verify server
- Check database connection

## Next Steps

1. **Add Users**: Create multiple admin accounts for team
2. **Customize Categories**: Modify default categories in schema.ts
3. **Setup Email Notifications**: Integrate email service for new feedback
4. **Add Exports**: Export feedback data to CSV/PDF
5. **Mobile Optimization**: Already responsive, test on devices
6. **Deployment**: Deploy to Vercel using GitHub integration

## Resources

- Full documentation: See README_SETUP.md
- API endpoints: Check app/api directory
- Database schema: View src/lib/db/schema.ts
- Component examples: Check components directory
- Type definitions: See types.ts
