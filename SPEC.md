# Insurance Claim Index - Full Project Specification

## Overview

**Insurance Claim Index** is an information-only web platform where Michigan residents can anonymously share and browse aggregated insurance claim experiences. The platform provides educational resources about the claims process without offering personalized advice, legal guidance, or claims assistance.

### Mission Statement
To empower Michigan homeowners and policyholders with transparent, crowd-sourced information about insurance claim experiences, enabling informed decision-making through education and aggregated data—never advice.

---

## Core Principles & Legal Guardrails

### What This Platform IS
- An anonymous experience-sharing platform for insurance claims
- An educational resource about insurance terminology, processes, and rights
- An aggregated data viewer showing trends, timelines, and outcomes
- A community-driven information repository

### What This Platform IS NOT (Enforced in Code)
- **NOT** a source of claim-specific advice ("you should do X")
- **NOT** legal counsel or a substitute for an attorney
- **NOT** public adjusting or claims advocacy services
- **NOT** a document review service
- **NOT** personalized guidance based on individual circumstances

### Mandatory Disclaimers
Every page must display a persistent disclaimer banner:
> "Insurance Claim Index provides general information only. This is not legal advice, claims advice, or a recommendation for your specific situation. Consult a licensed professional for guidance on your claim."

Claim submission forms must require acknowledgment of:
1. Information shared is for educational purposes only
2. No attorney-client or professional relationship is formed
3. User consents to anonymized data aggregation
4. User confirms no expectation of personalized advice

---

## Target Jurisdiction

**Primary Focus: Michigan**
- All educational content focuses on Michigan insurance law and regulations
- Claim experiences are tagged by Michigan county/region
- References to DIFS (Michigan Department of Insurance and Financial Services)
- Future expansion to other states is possible but out of scope for v1

---

## User Roles & Authentication

### Roles
1. **Anonymous Visitor** - Can browse public aggregated data and education library
2. **Registered User** - Can submit claims, view own submissions, receive updates
3. **Moderator** - Can review flagged content, approve/reject submissions
4. **Admin** - Full access including user management, system settings, analytics

### Authentication Requirements
- Email/password authentication (NextAuth.js recommended)
- Email verification required for submission privileges
- Optional: OAuth providers (Google) for convenience
- Session-based with secure cookies
- Role stored in database, checked server-side

---

## Data Models (Prisma Schema)

### Core Entities

#### User
```
- id: UUID
- email: String (unique, encrypted at rest)
- passwordHash: String
- role: Enum (VISITOR, USER, MODERATOR, ADMIN)
- emailVerified: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

#### ClaimExperience
```
- id: UUID
- userId: UUID (FK, nullable for legacy/anonymous)
- status: Enum (PENDING_REVIEW, APPROVED, REJECTED, FLAGGED)

// Claim Details (all optional, user shares what they want)
- claimType: Enum (HOMEOWNERS, AUTO, HEALTH, LIFE, OTHER)
- insurerName: String (sanitized, no specific agent names)
- countyRegion: String (Michigan county)
- claimYear: Int
- claimMonth: Int (optional)

// Experience Data
- initialResponseDays: Int (nullable)
- totalResolutionDays: Int (nullable)
- outcome: Enum (FULLY_PAID, PARTIALLY_PAID, DENIED, PENDING, WITHDRAWN)
- satisfactionRating: Int (1-5)

// Narrative (heavily sanitized)
- experienceNarrative: Text (sanitized, max 2000 chars)
- lessonsLearned: Text (sanitized, max 1000 chars)

// Metadata
- createdAt: DateTime
- updatedAt: DateTime
- moderatedAt: DateTime (nullable)
- moderatedBy: UUID (FK, nullable)
- moderationNotes: Text (internal only)
- flagReasons: String[] (if flagged)
```

#### ModerationLog
```
- id: UUID
- claimId: UUID (FK)
- moderatorId: UUID (FK)
- action: Enum (APPROVED, REJECTED, FLAGGED, EDITED)
- reason: Text
- previousContent: JSON (for audit trail)
- createdAt: DateTime
```

#### EducationArticle
```
- id: UUID
- slug: String (unique)
- title: String
- category: Enum (PROCESS, TERMINOLOGY, RIGHTS, TIPS, FAQ)
- content: Text (Markdown)
- michiganSpecific: Boolean
- published: Boolean
- authorId: UUID (FK, admin who wrote it)
- createdAt: DateTime
- updatedAt: DateTime
```

#### Report (for flagging content)
```
- id: UUID
- claimId: UUID (FK)
- reporterId: UUID (FK, nullable for anonymous)
- reason: Enum (PII_DETECTED, DEFAMATORY, PROFANITY, SPAM, OTHER)
- details: Text
- status: Enum (PENDING, REVIEWED, DISMISSED)
- reviewedBy: UUID (FK, nullable)
- createdAt: DateTime
```

---

## Privacy & PII Protection

### Server-Side Sanitization Pipeline

All user-submitted text MUST pass through a sanitization pipeline before storage:

#### Step 1: PII Detection & Removal
Detect and redact:
- Phone numbers (regex + validation)
- Email addresses
- Social Security Numbers (even partial)
- Street addresses (number + street name patterns)
- Full names (NLP-based detection + common name lists)
- Policy numbers (alphanumeric patterns)
- Claim numbers
- License plate numbers
- Bank account / routing numbers
- IP addresses

Replacement format: `[REDACTED-TYPE]` (e.g., `[REDACTED-PHONE]`)

#### Step 2: Named Entity Recognition
Use a lightweight NER approach to detect:
- Person names → redact
- Specific business names (agents, adjusters) → redact
- Keep insurer company names (these are allowed)

#### Step 3: Defamation/Profanity Flagging
- Profanity filter (word list + patterns)
- Defamation indicators (accusations of fraud, criminal behavior)
- If detected: auto-flag for moderation, do NOT publish immediately

#### Step 4: Content Validation
- Max length enforcement
- HTML/script stripping
- Unicode normalization

### Safe Public Views
- Public aggregated views NEVER show raw narratives
- Only approved, sanitized content appears publicly
- Aggregations always require minimum threshold (e.g., 5+ entries) to prevent identification

---

## Moderation Workflow

### Submission Flow
1. User submits claim experience
2. Server sanitizes all text fields
3. System runs automated checks (PII, profanity, defamation)
4. If clean: status = PENDING_REVIEW
5. If flagged: status = FLAGGED with reasons
6. Moderator reviews in admin dashboard
7. Moderator can: APPROVE, REJECT, or REQUEST_EDIT
8. Approved claims become publicly visible in aggregations

### Moderation Dashboard Features
- Queue of pending/flagged submissions
- Side-by-side: original (sanitized) vs. highlighted concerns
- One-click approve/reject with required reason
- Edit capability for minor fixes (logged)
- Bulk actions for spam
- Search/filter by status, date, claim type

### Report Handling
- Any user can report a published claim
- Reports queue separately from new submissions
- Moderator reviews report + original claim
- Can: dismiss report, flag claim, remove claim

---

## Application Routes & Pages

### Public Routes (No Auth Required)
```
/                       → Landing page with mission, disclaimers, quick stats
/explore                → Aggregated data explorer (charts, filters)
/explore/[claimType]    → Filtered view by claim type
/education              → Education library index
/education/[slug]       → Individual article
/about                  → About the platform, team, mission
/privacy                → Privacy policy
/terms                  → Terms of service
/disclaimer             → Full legal disclaimer
```

### Authenticated Routes (User)
```
/login                  → Login form
/register               → Registration form
/verify-email           → Email verification flow
/dashboard              → User's personal dashboard
/dashboard/submissions  → User's submitted experiences
/dashboard/submit       → Submit new claim experience
/dashboard/settings     → Account settings
```

### Admin/Moderator Routes
```
/admin                  → Admin dashboard overview
/admin/moderation       → Moderation queue
/admin/moderation/[id]  → Individual claim review
/admin/reports          → Report queue
/admin/users            → User management (admin only)
/admin/education        → Manage education articles
/admin/analytics        → Platform analytics (admin only)
```

---

## UI Components

### Core Components
- `DisclaimerBanner` - Persistent site-wide disclaimer
- `ClaimCard` - Display a sanitized claim summary
- `AggregationChart` - Visualize aggregated data (bar, pie, timeline)
- `FilterPanel` - Filter claims by type, county, year, outcome
- `SubmissionForm` - Multi-step claim submission with validation
- `ModerationPanel` - Admin claim review interface
- `ArticleRenderer` - Markdown article display
- `StatCard` - Display key metrics

### Form Validation (Zod Schemas)
- All forms validated client-side AND server-side
- Submission form enforces:
  - Required acknowledgment checkboxes
  - Character limits
  - Enum values for dropdowns
  - No required PII fields

### Accessibility
- WCAG 2.1 AA compliance target
- Semantic HTML
- Keyboard navigation
- Screen reader friendly
- Color contrast compliance

---

## Aggregated Data & Analytics

### Public Aggregations (Explore Page)
- Average response time by insurer
- Average resolution time by claim type
- Outcome distribution (pie chart)
- Satisfaction ratings distribution
- Claims by Michigan county (map or bar chart)
- Trends over time (submissions per month/year)

### Privacy Rules for Aggregations
- Minimum 5 claims required to show any aggregation
- Never show individual narratives in public views
- County-level is the most granular geographic display
- Insurer names shown only with 3+ claims

### Admin Analytics
- Submission volume over time
- Moderation queue health
- User registration trends
- Most reported content patterns

---

## Education Library

### Categories
1. **Process** - How insurance claims work in Michigan
2. **Terminology** - Glossary of insurance terms
3. **Rights** - Policyholder rights in Michigan
4. **Tips** - General best practices (not advice)
5. **FAQ** - Common questions

### Sample Articles (Seed Content)
- "Understanding the Michigan Insurance Claims Process"
- "Common Insurance Terms Explained"
- "Your Rights as a Michigan Policyholder"
- "What to Expect: Typical Claims Timeline"
- "Documentation Best Practices"

### Article Management
- Markdown content with frontmatter
- Admin can create/edit/publish/unpublish
- Michigan-specific flag for filtering
- SEO metadata support

---

## Tech Stack

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (optional, recommended)
- React Hook Form + Zod
- Recharts or Chart.js for visualizations

### Backend
- Next.js Server Actions + API Routes
- Prisma ORM
- PostgreSQL database
- NextAuth.js for authentication

### Infrastructure
- Vercel deployment (recommended)
- PostgreSQL (Vercel Postgres, Supabase, or similar)
- Environment variables for secrets

### Development
- ESLint + Prettier
- TypeScript strict mode
- Jest + React Testing Library
- Playwright for E2E (optional)

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Optional: OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Optional: Email (for verification)
SMTP_HOST="..."
SMTP_PORT="..."
SMTP_USER="..."
SMTP_PASS="..."
EMAIL_FROM="noreply@insuranceclaimindex.com"
```

---

## Seed Data Requirements

The seed script should create:
1. Admin user (for testing admin features)
2. Moderator user (for testing moderation)
3. 3-5 regular users
4. 20-30 sample claim experiences (varied types, outcomes, counties)
5. 5-10 education articles
6. Sample reports and moderation logs

All seed data should be realistic but obviously fake (no real PII).

---

## Development Phases

### Phase 1: Foundation
- Project setup (Next.js, Prisma, Tailwind)
- Database schema and migrations
- Authentication system
- Basic layout and navigation

### Phase 2: Core Features
- Sanitization pipeline
- Claim submission form
- User dashboard
- Moderation workflow

### Phase 3: Public Experience
- Landing page
- Explore page with aggregations
- Education library
- Disclaimer components

### Phase 4: Polish
- Admin analytics
- Seed script
- Testing
- Documentation

---

## Success Criteria

1. **Privacy**: No PII ever reaches public views
2. **Compliance**: All legal disclaimers present and enforced
3. **Usability**: Clean, accessible interface
4. **Moderation**: All content reviewed before publication
5. **Education**: Helpful resources without crossing into advice
6. **Performance**: Fast load times, responsive design
7. **Security**: Proper auth, CSRF protection, input sanitization

---

## SEO & Discoverability Strategy

### Technical SEO Requirements

#### Meta Tags (Every Page)
```tsx
// Required meta tags per page
<title>{pageTitle} | Insurance Claim Index - Michigan</title>
<meta name="description" content="{unique 150-160 char description}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="{canonical URL}" />

// Open Graph
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="{URL}" />
<meta property="og:image" content="{social share image}" />
<meta property="og:site_name" content="Insurance Claim Index" />

// Twitter Card
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{description}" />
```

#### Structured Data (JSON-LD)
Implement schema.org markup:

**Organization Schema** (site-wide):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Insurance Claim Index",
  "description": "Michigan insurance claim experience sharing platform",
  "url": "https://insuranceclaimindex.com",
  "areaServed": {
    "@type": "State",
    "name": "Michigan"
  }
}
```

**Article Schema** (education pages):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{description}",
  "author": {"@type": "Organization", "name": "Insurance Claim Index"},
  "datePublished": "{date}",
  "dateModified": "{date}"
}
```

**FAQ Schema** (FAQ pages):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

**BreadcrumbList Schema** (all pages):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

#### URL Structure
- Clean, descriptive URLs
- `/education/michigan-insurance-claims-process` not `/education/123`
- `/explore/homeowners` not `/explore?type=1`
- No trailing slashes (consistent)
- All lowercase, hyphens for spaces

#### Sitemap & Robots
- Auto-generated `sitemap.xml` at `/sitemap.xml`
- Include all public pages, education articles
- Update sitemap on new content publish
- `robots.txt` allowing all public routes

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Sitemap: https://insuranceclaimindex.com/sitemap.xml
```

### Content SEO Strategy

#### Target Keywords (Long-tail Focus)
Primary:
- "michigan insurance claim experience"
- "michigan homeowners insurance claims"
- "insurance claim timeline michigan"
- "michigan insurance claim denied"
- "how long do insurance claims take michigan"

Secondary:
- "michigan policyholder rights"
- "insurance claim process explained"
- "average insurance claim payout michigan"
- "michigan insurance company reviews"
- "homeowners insurance claim tips"

#### Page-Specific SEO

**Landing Page** `/`
- H1: "Michigan Insurance Claim Experiences & Education"
- Focus: Trust, mission, quick stats
- Keywords: michigan insurance claims, claim experiences, policyholder information

**Explore Page** `/explore`
- H1: "Explore Michigan Insurance Claim Data"
- Focus: Aggregated insights, trends
- Keywords: insurance claim statistics, average claim time, claim outcomes

**Education Library** `/education`
- H1: "Insurance Claims Education Library"
- Focus: Comprehensive resource hub
- Keywords: insurance claims guide, claims process, policyholder rights

**Individual Articles** `/education/[slug]`
- H1: Article title (keyword-rich)
- Focus: Deep, authoritative content (1500+ words)
- Include FAQ sections where relevant
- Internal linking to related articles

#### Content Quality Guidelines
- Every education article: 1000-2000 words
- Clear headings hierarchy (H1 > H2 > H3)
- Bulleted lists for scanability
- Statistics and data citations where possible
- Updated date displayed
- Author attribution

### Performance SEO

#### Core Web Vitals Targets
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

#### Implementation
- Next.js Image optimization (WebP, lazy loading)
- Font optimization (next/font)
- Code splitting (automatic with App Router)
- Static generation for public pages
- Edge caching for API routes
- Minimize JavaScript bundle

### Local SEO (Michigan Focus)

#### Geographic Targeting
- Michigan mentioned naturally in content
- County-specific pages where data permits
- Michigan-specific educational content
- References to DIFS and Michigan regulations

#### NAP Consistency
If physical presence: consistent Name, Address, Phone across all pages

### Internal Linking Strategy
- Education articles link to related articles
- Explore page links to relevant education content
- Contextual anchor text (not "click here")
- Breadcrumb navigation on all pages
- Related content sections

### External SEO Considerations
- Social sharing buttons (generate backlinks)
- Press/media page for coverage
- Embeddable widgets for aggregated stats
- Partnerships with Michigan consumer advocacy groups

---

## Accessibility (WCAG 2.1 AA Compliance)

### Semantic HTML
- Proper heading hierarchy (single H1, logical H2-H6)
- Landmark elements (`<main>`, `<nav>`, `<aside>`, `<footer>`)
- Lists for list content (`<ul>`, `<ol>`)
- Tables for tabular data with proper headers
- Forms with associated labels

### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Skip-to-content link
- No keyboard traps

### Screen Reader Support
- Alt text for all images
- ARIA labels where needed
- Live regions for dynamic content
- Form error announcements
- Chart data in accessible format (table alternative)

### Visual Accessibility
- Color contrast ratio: 4.5:1 minimum (text)
- Don't rely on color alone for information
- Resizable text (up to 200%)
- Responsive design (no horizontal scroll)
- Reduced motion support (`prefers-reduced-motion`)

### Forms
- Clear labels (not placeholder-only)
- Error messages linked to fields
- Required field indicators
- Input purpose attributes (autocomplete)
- Validation feedback accessible

### Testing Requirements
- Automated: axe-core in CI/CD
- Manual: keyboard-only navigation test
- Screen reader testing (VoiceOver/NVDA)
- Color contrast checker

---

## Out of Scope (v1)

- Mobile native apps
- Multi-state support (Michigan only)
- Real-time chat or messaging
- Integration with insurance company APIs
- AI-powered claim analysis
- Paid features or subscriptions
- Document upload/storage
