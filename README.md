# Feedback Management System

A production-ready feedback management system built with Next.js 16, TypeScript, React, and PostgreSQL.

## Features

- **Public Feedback Form**: Users can submit feedback with category selection and optional rating
- **Admin Dashboard**: Secure admin dashboard with authentication
- **Analytics**: Real-time analytics with feedback trends and statistics
- **Full Authentication**: JWT-based authentication with role-based access
- **Database**: PostgreSQL with structured schema and indexes
- **API**: RESTful API with validation and error handling
- **Security**: Password hashing, JWT tokens, input validation, and parameterized queries

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with `pg` driver
- **Authentication**: JWT with `jsonwebtoken`
- **Password Hashing**: `bcryptjs`
- **Validation**: Zod schema validation
- **Logging**: Winston structured logging

### Frontend
- **Framework**: React with TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React hooks with localStorage for auth persistence

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── feedback/
│   │   │   ├── submit/route.ts
│   │   │   ├── list/route.ts
│   │   │   ├── [id]/route.ts
│   │   │   └── categories/route.ts
│   │   ├── analytics/
│   │   │   └── stats/route.ts
│   │   └── health/route.ts
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── page.tsx (public feedback form)
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── feedback/
│   │   └── FeedbackForm.tsx
│   └── dashboard/
│       ├── FeedbackTable.tsx
│       └── AnalyticsDashboard.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts (API client utilities)
│   │   └── withValidation.ts (Zod validation helper)
│   ├── auth/
│   │   ├── jwt.ts (JWT token management)
│   │   └── password.ts (Password hashing)
│   ├── db/
│   │   ├── connection.ts (Database connection)
│   │   └── schema.ts (Database initialization)
│   ├── logger/
│   │   └── logger.ts (Winston logger)
│   └── validation/
│       └── schemas.ts (Zod validation schemas)
├── useAuth.ts (Authentication hook)
├── types.ts (TypeScript types)
├── .env.example
└── README_SETUP.md
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Git

### 2. Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Configure environment variables in `.env.local`:
   ```bash
   DATABASE_URL=postgresql://user:password@hostname:5432/database_name
   JWT_SECRET=generate-a-random-secret-key
   NEXT_PUBLIC_API_URL=http://localhost:3000  # For development
   ```

   To generate a secure JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Initialize Database

The database schema is automatically initialized on first API call. The system will:
- Create `users`, `categories`, and `feedback` tables
- Insert default feedback categories
- Create necessary indexes

### 5. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new admin account
- `POST /api/auth/login` - Login with email and password

### Feedback

- `POST /api/feedback/submit` - Submit feedback (public or authenticated)
- `GET /api/feedback/categories` - Get all feedback categories (public)
- `GET /api/feedback/list` - Get paginated feedback list (admin only)
- `GET /api/feedback/[id]` - Get specific feedback (admin only)
- `PATCH /api/feedback/[id]` - Update feedback status (admin only)

### Analytics

- `GET /api/analytics/stats` - Get analytics and statistics (admin only)

### Health Check

- `GET /api/health` - Check API and database health

## Usage

### 1. Submit Feedback (Public)

Visit `http://localhost:3000` to submit feedback:
- Select feedback category
- Enter title (5-255 characters)
- Enter description (10-5000 characters)
- Provide email address
- Optionally rate the experience (1-5)

### 2. Admin Dashboard

1. **Create Admin Account**: Visit `http://localhost:3000/auth/register`
   - Provide email, password (minimum 8 characters), and full name
   - Create account

2. **Login**: Visit `http://localhost:3000/auth/login`
   - Use your admin credentials

3. **Manage Feedback**: In dashboard, access the "Feedback List" tab
   - View all feedback entries
   - Search and filter by status
   - Update feedback status (Pending → In Progress → Resolved/Rejected)
   - See feedback ratings and categories

4. **View Analytics**: In dashboard, access the "Analytics" tab
   - Total feedback count
   - Pending and resolved feedback
   - Average rating
   - Feedback distribution by category and status
   - 7-day trend visualization

## Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. Users register or login to receive a JWT token
2. Token is stored in localStorage on the client
3. Token is sent with requests via `Authorization: Bearer <token>` header
4. Admin endpoints verify token and check `isAdmin` role
5. Tokens expire after 7 days (configurable via `JWT_EXPIRATION`)

## Data Validation

All inputs are validated using Zod schemas:

- **Email**: Valid email format
- **Password**: Minimum 8 characters
- **Feedback Title**: 5-255 characters
- **Feedback Description**: 10-5000 characters
- **Rating**: 1-5 (optional)
- **Status**: pending, in-progress, resolved, rejected

## Database Schema

### Users Table
```sql
- id: INTEGER (PK)
- email: VARCHAR(255) (UNIQUE, NOT NULL)
- password_hash: VARCHAR(255)
- full_name: VARCHAR(255)
- is_admin: BOOLEAN (default: false)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Categories Table
```sql
- id: INTEGER (PK)
- name: VARCHAR(100) (UNIQUE)
- description: TEXT
- created_at: TIMESTAMP
```

### Feedback Table
```sql
- id: INTEGER (PK)
- user_id: INTEGER (FK, nullable)
- category_id: INTEGER (FK)
- title: VARCHAR(255)
- description: TEXT
- email: VARCHAR(255)
- rating: INTEGER (1-5, nullable)
- status: VARCHAR(50) (default: 'pending')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

Indexes on: category_id, status, created_at, user email

## Error Handling

The system includes comprehensive error handling:

- **Validation Errors**: Return 400 with validation details
- **Authentication Errors**: Return 401 for missing/invalid tokens
- **Authorization Errors**: Return 403 for insufficient permissions
- **Not Found**: Return 404 for missing resources
- **Server Errors**: Return 500 with logged error details

All errors are logged with Winston logger for debugging.

## Security Features

1. **Password Security**: Passwords are hashed using bcryptjs with 10 salt rounds
2. **SQL Injection Prevention**: Parameterized queries throughout
3. **Input Validation**: Zod schema validation on all inputs
4. **JWT Security**: Tokens signed with secret key, expiration enforced
5. **CORS Ready**: API follows CORS-friendly patterns
6. **Rate Limiting Ready**: Architecture supports rate limiting middleware

## Development

### Adding New API Endpoints

1. Create route file in `app/api/[section]/[endpoint]/route.ts`
2. Define request validation schema in `src/lib/validation/schemas.ts`
3. Implement handler with proper error handling
4. Add client method in `src/lib/api/client.ts`

### Adding New Components

1. Create component in `components/[section]/Component.tsx`
2. Use existing UI components from shadcn/ui
3. Use hooks like `useAuth()` for authentication state
4. Follow TypeScript and component naming conventions

### Database Migrations

1. Modify schema in `src/lib/db/schema.ts`
2. The schema auto-initializes on first run
3. For production: manually run migration scripts

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check credentials and network access

### JWT Error
- Regenerate JWT_SECRET in .env.local
- Clear localStorage in browser
- Re-login with new credentials

### API Not Responding
- Check `GET /api/health` endpoint
- Review server logs in console
- Verify environment variables are set

## Production Deployment

1. **Environment Variables**: Set all required env vars on deployment platform
2. **Database**: Use managed PostgreSQL service (e.g., Neon, AWS RDS)
3. **Logging**: Enable file logging in production (Winston configured)
4. **JWT Secret**: Use strong random secret
5. **CORS**: Configure CORS headers if frontend is separate domain
6. **Rate Limiting**: Add rate limiting middleware for production
7. **Monitoring**: Set up error tracking and monitoring

## License

MIT

## Support

For issues or questions, refer to the code documentation in each module or check the comprehensive type definitions in `src/types/index.ts`.
