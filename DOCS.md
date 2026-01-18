# Insurance Claim Index - Technical Documentation

## Architecture Overview

Insurance Claim Index is built on Next.js 14's App Router with a clear separation between public, authenticated, and admin routes. The application follows a server-first approach with Server Components and Server Actions for data fetching and mutations.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client                                │
├─────────────────────────────────────────────────────────────┤
│  Next.js App Router                                          │
│  ├── Server Components (default)                             │
│  ├── Client Components ('use client')                        │
│  └── Server Actions ('use server')                           │
├─────────────────────────────────────────────────────────────┤
│  Middleware Layer                                            │
│  ├── Authentication (NextAuth)                               │
│  └── Role-based Access Control                               │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ├── Prisma ORM                                              │
│  ├── PostgreSQL Database                                     │
│  └── Sanitization Pipeline                                   │
└─────────────────────────────────────────────────────────────┘
```

## Data Models

### User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  claims    Claim[]
  reports   Report[]
}

enum UserRole {
  USER
  ADMIN
}
```

### Claim
```prisma
model Claim {
  id         String      @id @default(cuid())
  userId     String
  carrierId  String
  status     ClaimStatus @default(PENDING_REVIEW)
  viewCount  Int         @default(0)
  flagReason String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  user       User        @relation(...)
  carrier    Carrier     @relation(...)
  metadata   ClaimMetadata?
  timeline   ClaimTimelineEvent[]
  outcome    ClaimOutcome?
  reports    Report[]
}

enum ClaimStatus {
  PUBLISHED
  PENDING_REVIEW
  REJECTED
}
```

### Supporting Models
- **Carrier** - Insurance company information
- **ClaimMetadata** - Policy type, loss type, location, dates
- **ClaimTimelineEvent** - Chronological claim events
- **ClaimOutcome** - Payment amounts and resolution flags
- **Report** - User-submitted reports on claims
- **EducationArticle** - Educational content

## Authentication Flow

### NextAuth.js Configuration
```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Validate credentials against database
        // Return user object or null
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) { /* Add role to token */ },
    session({ session, token }) { /* Add role to session */ }
  }
}
```

### Protected Routes
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')

  // Protect /admin routes - require ADMIN role
  // Protect /dashboard routes - require authentication
  // Protect /submit - require authentication
}
```

## Server Actions

### Claim Submission Flow

```typescript
// actions/claims.ts
export async function submitClaim(data: unknown) {
  // 1. Authenticate user
  const user = await getCurrentUser()
  if (!user) return { error: 'Unauthorized' }

  // 2. Validate input with Zod
  const validation = ClaimSubmissionSchema.safeParse(data)
  if (!validation.success) return { error: '...' }

  // 3. Sanitize text fields (PII removal)
  const sanitized = sanitizeClaimSubmission(validation.data)

  // 4. Run moderation check (profanity, defamation)
  const moderation = moderateClaimSubmission(sanitized)

  // 5. Create claim in database
  const claim = await prisma.claim.create({
    data: {
      userId: user.id,
      status: moderation.requiresReview ? 'PENDING_REVIEW' : 'PUBLISHED',
      ...
    }
  })

  // 6. Revalidate cache
  revalidatePath('/claims')

  return { success: true, claimId: claim.id }
}
```

## Sanitization Pipeline

### PII Detection Patterns

```typescript
// lib/sanitize.ts

// Email: user@domain.com
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

// Phone: Various US formats
const PHONE_PATTERNS = [
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  /\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/g,
  /\b1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
]

// SSN: XXX-XX-XXXX
const SSN_PATTERN = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g

// Address: 123 Main Street
const ADDRESS_PATTERN = /\b\d{1,5}\s+(?:[NSEW]\s+)?(?:\w+\s+){1,3}(?:Street|St|Avenue|Ave|...)\b/gi

// Policy numbers: Long digit sequences
const POLICY_NUMBER_PATTERN = /\b\d{8,}\b/g
```

### Name Detection
Names are detected contextually when appearing after keywords like:
- "adjuster", "agent", "representative"
- "Mr.", "Mrs.", "Ms."
- "spoke with", "contacted by"

### Sanitization Function
```typescript
export function sanitizeText(text: string): string {
  let sanitized = text

  sanitized = sanitized.replace(EMAIL_PATTERN, '[REDACTED EMAIL]')
  sanitized = sanitized.replace(SSN_PATTERN, '[REDACTED SSN]')
  // ... more patterns

  return sanitized
}
```

## Moderation System

### Automated Checks
```typescript
// lib/moderation.ts
export function moderateClaimSubmission(data: any) {
  const flags: string[] = []

  // Profanity check
  if (containsProfanity(data)) {
    flags.push('PROFANITY_DETECTED')
  }

  // Defamation indicators
  if (containsDefamation(data)) {
    flags.push('POTENTIAL_DEFAMATION')
  }

  return {
    requiresReview: flags.length > 0,
    flagReason: flags.join(', ') || null
  }
}
```

### Moderation Workflow
1. **Submission** - Claim enters `PENDING_REVIEW` if flagged
2. **Review** - Admin views in moderation queue
3. **Decision** - Approve (publish) or reject with reason
4. **Publication** - Approved claims visible in public browser

## SEO Implementation

### Metadata
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Insurance Claim Index | Michigan Insurance Claim Experiences',
    template: '%s | Insurance Claim Index'
  },
  description: '...',
  keywords: ['michigan insurance claims', ...],
  openGraph: { ... },
  twitter: { ... },
}
```

### Dynamic Sitemap
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [ /* landing, claims, education, etc. */ ]

  const articles = await prisma.educationArticle.findMany({
    where: { published: true }
  })

  return [
    ...staticPages,
    ...articles.map(a => ({
      url: `${BASE_URL}/education/${a.slug}`,
      lastModified: a.updatedAt,
    }))
  ]
}
```

### JSON-LD Structured Data
```typescript
// components/seo/json-ld.tsx
export function OrganizationJsonLd() {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Insurance Claim Index',
        ...
      })}
    </script>
  )
}
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Data (via Server Actions)
All data operations use Server Actions instead of API routes for:
- Type safety
- Automatic revalidation
- Simplified error handling

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DIRECT_URL` | Yes | Direct database connection (for migrations) |
| `NEXTAUTH_SECRET` | Yes | Secret for JWT signing |
| `NEXTAUTH_URL` | Yes | Base URL for auth callbacks |
| `ADMIN_EMAIL` | No | Default admin email for seeding |
| `NEXT_PUBLIC_BASE_URL` | No | Public URL for SEO |

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations (`prisma db push`)
- [ ] Seed initial data (`npm run db:seed`)
- [ ] Verify admin access
- [ ] Test claim submission flow
- [ ] Check SEO (sitemap, robots.txt)
- [ ] Verify SSL/HTTPS
- [ ] Configure domain DNS

## Performance Considerations

1. **Static Generation** - Public pages use ISR where possible
2. **Image Optimization** - Next.js Image component
3. **Font Optimization** - next/font for Geist
4. **Database Queries** - Pagination, indexed fields
5. **Caching** - Next.js data cache with revalidation

## Security Measures

1. **Input Validation** - Zod schemas on all inputs
2. **PII Sanitization** - Server-side before storage
3. **CSRF Protection** - Built into Server Actions
4. **Rate Limiting** - Consider adding for production
5. **SQL Injection** - Prisma parameterized queries
6. **XSS Prevention** - React's automatic escaping
