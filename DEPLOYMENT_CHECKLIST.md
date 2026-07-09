# Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Configuration
- [ ] Set up PostgreSQL database (Neon, AWS RDS, or self-hosted)
- [ ] Generate JWT secret: `openssl rand -base64 32`
- [ ] Create `.env.local` with:
  ```
  DATABASE_URL=postgresql://user:password@host:port/database
  JWT_SECRET=your-generated-secret-here
  NODE_ENV=production
  ```

### 2. Database Initialization
- [ ] Run database schema initialization on first deploy
- [ ] The app automatically creates tables and default categories
- [ ] Verify connection with health check: `GET /api/health`

### 3. Create First Admin Account
- [ ] Go to `/auth/register`
- [ ] Create admin account (only first registration is needed)
- [ ] Login with `/auth/login`
- [ ] Access dashboard at `/dashboard`

## Running Locally

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your PostgreSQL connection

# Start dev server
pnpm dev

# App runs on http://localhost:3000
```

## Deployment to Vercel

### Option 1: Using Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy project
vercel

# Set environment variables in deployment
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV production
```

### Option 2: Using Git
1. Push code to GitHub
2. Connect repository to Vercel dashboard
3. Add environment variables in Vercel settings
4. Automatic deployment on push

## Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT token signing | `base64-encoded-32-bytes` |
| `NODE_ENV` | Environment name | `production` |

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/register` - Create admin account
- `POST /api/auth/login` - Admin login
- `POST /api/feedback/submit` - Submit feedback
- `GET /api/feedback/categories` - Get categories

### Admin Endpoints (require JWT auth)
- `GET /api/feedback/list` - List all feedback
- `GET /api/feedback/[id]` - Get feedback details
- `PATCH /api/feedback/[id]` - Update feedback status
- `GET /api/analytics/stats` - Get analytics

## Testing Checklist

### Feedback Submission
- [ ] Fill and submit feedback form
- [ ] Form validates required fields
- [ ] Success message appears
- [ ] Data appears in admin dashboard

### Authentication
- [ ] Register admin account successfully
- [ ] Login with correct credentials
- [ ] Login rejected with wrong credentials
- [ ] Dashboard is protected (redirects to login if not auth)
- [ ] Logout clears session

### Admin Dashboard
- [ ] View all feedback submissions
- [ ] Search feedback by text
- [ ] Filter by category
- [ ] Filter by status
- [ ] Pagination works correctly
- [ ] Change feedback status
- [ ] View analytics/statistics

### Analytics
- [ ] Total feedback count displays
- [ ] Status breakdown is accurate
- [ ] Category breakdown is accurate
- [ ] Average rating is calculated

## Performance Optimization

- [ ] Database indexes are in place for `status`, `created_at`, `category_id`
- [ ] Implement caching for categories (rarely change)
- [ ] Use pagination (default 10 items per page)
- [ ] Monitor database query performance

## Security Checklist

- [ ] Passwords are hashed with bcryptjs
- [ ] JWT tokens have 24-hour expiration
- [ ] All API inputs are validated with Zod
- [ ] SQL queries use parameterized statements (no injection risk)
- [ ] Admin endpoints require valid JWT token
- [ ] Sensitive errors don't leak to client
- [ ] HTTPS enabled on production
- [ ] CORS configured appropriately

## Monitoring & Logging

- [ ] Monitor server logs for errors
- [ ] Check `/api/health` periodically
- [ ] Monitor database connection pool
- [ ] Review structured logs from Winston
- [ ] Set up error tracking (optional: Sentry)

## Database Backup

- [ ] Enable automated backups (if using managed DB)
- [ ] Test backup restoration procedure
- [ ] Document backup schedule and retention policy

## First Run Experience

1. Deploy app
2. Visit app URL
3. Test feedback submission form
4. Go to `/auth/register` to create admin
5. Use `/auth/login` to access dashboard
6. Verify analytics data loads
7. Test feedback status updates

## Troubleshooting

### Database Connection Failed
- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running
- Check firewall/IP allowlist if using cloud DB
- Test with `pg_connect` tool

### JWT Errors
- Regenerate and update `JWT_SECRET`
- Clear browser cookies
- Check token isn't expired

### Feedback Not Saving
- Verify database tables exist
- Check database logs for SQL errors
- Ensure `DATABASE_URL` has write permissions

## Support

For issues or questions:
1. Check README_SETUP.md for detailed docs
2. Review QUICK_START.md for examples
3. Check API response error messages
4. Inspect server logs for details

---

**Deployment successfully completed when:**
- ✓ Public can submit feedback
- ✓ Admin can register and login
- ✓ Dashboard shows submitted feedback
- ✓ Analytics data is accurate
- ✓ All data persists in database
