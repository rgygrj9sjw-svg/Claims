# Insurance Claim Index

A crowdsourced, anonymized platform for sharing and learning from insurance claim experiences. Built with Next.js 14, Prisma, and PostgreSQL.

**Live Site:** [insuranceclaimindex.com](https://insuranceclaimindex.com)

## Overview

Insurance Claim Index enables policyholders to:
- Share their insurance claim experiences anonymously
- Browse aggregated claim data and outcomes
- Access educational resources about the claims process
- View trends across carriers, claim types, and regions

### Important Disclaimer

This platform provides **general information only** and is not legal advice, claims advice, or a substitute for professional consultation. Always consult qualified professionals for guidance on your specific situation.

## Features

- **Claim Submission** - Multi-step form with automatic PII sanitization
- **Claims Browser** - Filter and search published claim experiences
- **Data Dashboards** - Aggregated statistics and visualizations
- **Education Library** - Articles on insurance claims, terminology, and processes
- **Admin Moderation** - Review queue for submitted claims and reports
- **Privacy First** - Server-side PII detection and redaction

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Charts:** Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/insurance-claim-index.git
   cd insurance-claim-index
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/insurance_claim_index"
   DIRECT_URL="postgresql://user:password@localhost:5432/insurance_claim_index"

   # Auth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Optional: Admin email for seed script
   ADMIN_EMAIL="admin@example.com"

   # Optional: Base URL for SEO
   NEXT_PUBLIC_BASE_URL="https://insuranceclaimindex.com"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma db push

   # Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Default Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| User | user@example.com | password123 |

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Login, register pages
│   ├── (main)/            # Public pages (claims, education, etc.)
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── actions/               # Server actions
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── seo/              # SEO components (JSON-LD)
│   └── submit-form/      # Multi-step form components
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── sanitize.ts       # PII sanitization
│   ├── moderation.ts     # Content moderation
│   └── validators.ts     # Zod schemas
├── prisma/               # Database schema and migrations
│   ├── schema.prisma
│   └── seed.ts
└── types/                # TypeScript definitions
```

## Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run db:push     # Push schema changes to database
npm run db:seed     # Seed database with sample data
```

## Key Routes

### Public
- `/` - Landing page
- `/claims` - Browse published claims
- `/claims/[id]` - View claim details
- `/dashboards` - Aggregated data visualizations
- `/education` - Education library
- `/education/[slug]` - Article page

### User Dashboard
- `/dashboard` - User overview
- `/dashboard/submissions` - User's submitted claims
- `/submit` - Submit a new claim

### Admin
- `/admin` - Admin dashboard
- `/admin/submissions` - Moderation queue
- `/admin/reports` - User reports
- `/admin/education` - Manage articles

## Privacy & Security

### PII Sanitization

All user-submitted text passes through a sanitization pipeline that detects and redacts:
- Email addresses
- Phone numbers
- Social Security Numbers
- Street addresses
- Names (near identifying keywords)
- Policy/claim numbers
- Dates of birth

### Moderation

- Profanity detection and flagging
- Defamation indicator detection
- Manual review queue for flagged content
- Report system for published claims

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary. All rights reserved.

## Support

For questions or issues, please open a GitHub issue or contact support@insuranceclaimindex.com.
