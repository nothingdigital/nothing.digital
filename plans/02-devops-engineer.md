# Nothing.Digital — DevOps & Infrastructure Plan

> **Version:** 1.0  
> **Date:** 2026-08-04  
> **Owner:** DevOps Engineer  
> **Stack:** Next.js 14 · Vercel · Cloudflare · Supabase · Resend

---

## Table of Contents

1. [Repository Setup](#1-repository-setup)
2. [CI/CD Pipeline](#2-cicd-pipeline)
3. [Environment Configuration](#3-environment-configuration)
4. [DNS & Domain Configuration](#4-dns--domain-configuration)
5. [Infrastructure Services](#5-infrastructure-services)
6. [Monitoring & Observability](#6-monitoring--observability)
7. [Security](#7-security)
8. [Backup & Disaster Recovery](#8-backup--disaster-recovery)
9. [Cost Estimation](#9-cost-estimation)

---

## 1. Repository Setup

### 1.1 GitHub Repository Structure

```
nothing-digital/
├── .github/
│   ├── workflows/          # GitHub Actions
│   ├── CODEOWNERS
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.yml
│       └── feature_request.yml
├── apps/
│   └── web/                # Next.js 14 application
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── config/             # Shared config (eslint, tsconfig)
│   └── utils/              # Shared utilities
├── supabase/
│   ├── migrations/         # Database migrations
│   └── seed.sql
├── infra/
│   ├── vercel.json
│   ├── cloudflare/
│   └── terraform/          # IaC (future)
├── docs/
│   ├── runbooks/
│   └── architecture/
├── scripts/
├── .env.example
├── .env.local.example
├── turbo.json              # Monorepo orchestration
├── package.json
└── README.md
```

### 1.2 Branching Strategy: Trunk-Based Development

**Recommendation:** Trunk-based development (TBD) with short-lived feature branches.

| Branch | Purpose | Deploy Target |
|---|---|---|
| `main` | Production source of truth | Production (nothing.digital) |
| `staging` | Pre-production validation | Staging (staging.nothing.digital) |
| `feature/*` | Short-lived features (≤2 days) | Preview (Vercel) |
| `hotfix/*` | Emergency production fixes | Production (bypass staging) |

**Why TBD over GitFlow:**
- Faster iteration cycles for a distributed team
- Reduced merge conflict complexity
- Native compatibility with Vercel preview deployments
- Simpler mental model for a small-to-medium team

### 1.3 Branch Protection Rules

**`main` branch:**
- [ ] Require a pull request before merging
- [ ] Require 2 approvals for `main`
- [ ] Require 1 approval for `staging`
- [ ] Dismiss stale PR approvals when new commits are pushed
- [ ] Require status checks to pass (Lint, Type Check, Build, Lighthouse)
- [ ] Require branches to be up to date before merging
- [ ] Require signed commits
- [ ] Include administrators
- [ ] Restrict pushes that create files larger than 100MB

**`staging` branch:**
- [ ] Require 1 approval
- [ ] Require status checks to pass
- [ ] Allow force pushes: **No**

### 1.4 CODEOWNERS

```text
# Global fallback
*                           @nothing-digital/frontend-leads

# Critical paths
/apps/web/app/api/          @nothing-digital/backend-leads @nothing-digital/security
/apps/web/middleware.ts     @nothing-digital/security
/infra/                     @nothing-digital/devops
/supabase/migrations/       @nothing-digital/backend-leads
.github/workflows/          @nothing-digital/devops

# Docs
/docs/runbooks/             @nothing-digital/devops
```

### 1.5 PR Template

```markdown
## Description
<!-- Describe your changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Changes tested locally
- [ ] Unit tests added/updated
- [ ] No new console errors
- [ ] Lighthouse CI passes

## Screenshots (if UI)
<!-- Add screenshots -->

## Related Issues
Closes #
```

### 1.6 Issue Templates

**Bug Report (`.github/ISSUE_TEMPLATE/bug_report.yml`):**
```yaml
name: Bug Report
description: File a bug report
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: "## Bug Report"
  - type: input
    id: url
    attributes:
      label: URL
      placeholder: https://nothing.digital/...
  - type: textarea
    id: reproduction
    attributes:
      label: Reproduction Steps
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
  - type: dropdown
    id: severity
    attributes:
      label: Severity
      options:
        - Low
        - Medium
        - High
        - Critical
```

---

## 2. CI/CD Pipeline

### 2.1 GitHub Actions Workflows

#### Workflow 1: PR Validation (`pr-validation.yml`)

```yaml
name: PR Validation

on:
  pull_request:
    branches: [main, staging]

jobs:
  lint-and-type:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: lint-and-type
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: lint-and-type
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:ci

  lighthouse:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v4
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: './lighthouserc.json'

  accessibility:
    name: Accessibility (axe-core)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm dlx @axe-core/cli http://localhost:3000 --exit
```

#### Workflow 2: Production Deploy (`deploy-production.yml`)

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Vercel Production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### Workflow 3: Preview Deploy (`deploy-preview.yml`)

```yaml
name: Deploy Preview

on:
  pull_request:
    branches: [main]

jobs:
  deploy-preview:
    name: Vercel Preview
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 2.2 Lighthouse CI Configuration (`lighthouserc.json`)

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/", "http://localhost:3000/contact"],
      "startServerCommand": "pnpm start",
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:best-practices": ["warn", { "minScore": 0.92 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 1800 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### 2.3 Vercel Integration

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Build Command | `turbo run build` |
| Output Directory | `apps/web/.next` |
| Install Command | `pnpm install` |
| Node Version | 20.x |

**Vercel Project Settings:**
- [ ] Enable Git Connection (GitHub)
- [ ] Production Branch: `main`
- [ ] Enable Preview Deployments for PRs
- [ ] Enable Commenting on PRs with preview links
- [ ] Enable "Auto-Assign Custom Domains" for production

### 2.4 Environment Promotion Strategy

```
Developer Local → Feature Branch PR (Preview) → staging branch (Staging) → main branch (Production)
       ↑                                                                              |
       └──────────────────── Hotfix bypass (emergency only) ←─────────────────────────┘
```

- **Preview:** Every PR gets a unique Vercel preview URL
- **Staging:** Auto-deploy on merge to `staging`
- **Production:** Auto-deploy on merge to `main` (requires 2 approvals)
- **Hotfix:** Emergency PRs to `main` with post-merge review

---

## 3. Environment Configuration

### 3.1 Environment Variable Management

**Strategy:** Use Vercel's native environment variable UI for runtime secrets, GitHub Secrets for CI/CD, and `.env.example` files for local development documentation.

### 3.2 Required Environment Variables

| Variable | Description | Scope | Provider |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | All | Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | All | Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | All | Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (server-only) | Server | Vercel |
| `RESEND_API_KEY` | Resend API key (server-only) | Server | Vercel |
| `SENTRY_DSN` | Sentry error tracking DSN | All | Vercel |
| `SENTRY_AUTH_TOKEN` | Sentry auth for source maps | Build | GitHub Secrets |
| `VERCEL_TOKEN` | Vercel API token | CI/CD | GitHub Secrets |
| `VERCEL_ORG_ID` | Vercel organization ID | CI/CD | GitHub Secrets |
| `VERCEL_PROJECT_ID` | Vercel project ID | CI/CD | GitHub Secrets |

### 3.3 Secret Management Matrix

| Secret Type | GitHub Secrets | Vercel Env Vars | Notes |
|---|---|---|---|
| Build-time secrets | ✅ | ❌ | SENTRY_AUTH_TOKEN |
| Runtime secrets | ❌ | ✅ | SUPABASE_SERVICE_ROLE_KEY |
| Public config | ❌ | ✅ | NEXT_PUBLIC_* |
| CI/CD tokens | ✅ | ❌ | VERCEL_TOKEN |

### 3.4 Per-Environment Config

**`apps/web/src/lib/env.ts`:**
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
```

---

## 4. DNS & Domain Configuration

### 4.1 Cloudflare DNS Records

| Type | Name | Content | TTL | Proxy |
|---|---|---|---|---|
| A | `@` | `76.76.21.21` | Auto | ✅ (Orange cloud) |
| CNAME | `www` | `cname.vercel-dns.com` | Auto | ✅ |
| CNAME | `staging` | `cname.vercel-dns.com` | Auto | ✅ |
| TXT | `_vercel` | `vc-domain-verify=...` | Auto | ❌ |
| MX | `@` | (Resend/Email provider) | Auto | ❌ |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@nothing.digital` | Auto | ❌ |

### 4.2 WWW Redirect

**Vercel `vercel.json`:**
```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "www.nothing.digital"
        }
      ],
      "destination": "https://nothing.digital/:path*",
      "permanent": true
    }
  ]
}
```

### 4.3 SSL/TLS Configuration

**Cloudflare:**
- SSL/TLS mode: **Full (strict)**
- Minimum TLS Version: **1.2**
- TLS 1.3: **Enabled**
- HSTS: Enabled (max-age: 31536000, includeSubDomains, preload)
- Always Use HTTPS: **Enabled**
- Automatic HTTPS Rewrites: **Enabled**

**Vercel:**
- SSL Certificate: Auto-provisioned by Vercel
- Force HTTPS: Enabled by default

### 4.4 DNSSEC

**Recommendation:** Enable DNSSEC on Cloudflare for `nothing.digital`.

**Steps:**
1. Cloudflare Dashboard → DNS → DNSSEC
2. Enable DNSSEC
3. Copy DS record to domain registrar
4. Verify with `dig +dnssec nothing.digital DNSKEY`

### 4.5 Edge Caching Rules

**Cloudflare Page Rules:**

| URL | Setting | Value |
|---|---|---|
| `*nothing.digital/_next/static/*` | Cache Level | Cache Everything |
| `*nothing.digital/_next/static/*` | Edge Cache TTL | 1 month |
| `*nothing.digital/api/*` | Cache Level | Bypass |
| `*nothing.digital/api/og-image*` | Cache Level | Cache Everything |
| `*nothing.digital/api/og-image*` | Edge Cache TTL | 1 day |

---

## 5. Infrastructure Services

### 5.1 Supabase

**Project Setup:**
- Region: `us-east-1` (closest to primary audience)
- Database: PostgreSQL 15
- Connection Pooling: Enabled (PgBouncer on port 6543)

**Row Level Security (RLS):**
```sql
-- Example: Contact form submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only service role can insert
CREATE POLICY "Service role can insert" ON contact_submissions
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- No public reads
CREATE POLICY "No public reads" ON contact_submissions
  FOR SELECT USING (false);
```

**Connection Pooling Config:**
- Pool Mode: Transaction
- Default Pool Size: 20
- Max Client Conn: 200

### 5.2 Resend

**Domain Verification:**
1. Add domain `nothing.digital` in Resend dashboard
2. Add DKIM and SPF records to Cloudflare DNS
3. Verify domain ownership
4. Generate API key with "Sending Access" only

**Webhook Handling:**
```typescript
// app/api/webhooks/resend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  
  switch (payload.type) {
    case 'email.sent':
      // Log sent email
      break;
    case 'email.delivered':
      // Update analytics
      break;
    case 'email.bounced':
      // Alert team, suppress email
      break;
  }
  
  return NextResponse.json({ received: true });
}
```

### 5.3 Vercel

**Project Settings:**
| Setting | Value |
|---|---|
| Build & Development Settings | Next.js |
| Node.js Version | 20.x |
| Package Manager | pnpm |
| Framework Preset | Next.js |

**Edge Function Config:**
```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}
```

**Image Optimization:**
```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.nothing.digital' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};
```

### 5.4 Cloudflare

**Security Headers (Transform Rules):**

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://*.supabase.co https://*.sentry.io; frame-ancestors 'none';` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

**WAF Rules:**
- Enable Cloudflare OWASP Core Ruleset
- Rate limiting: 100 requests/minute per IP
- Challenge suspicious traffic (Bot Fight Mode: ON)

---

## 6. Monitoring & Observability

### 6.1 Vercel Analytics

**Setup:**
- Enable Web Analytics in Vercel dashboard
- Enable Speed Insights for Core Web Vitals
- Track custom events for business metrics

### 6.2 Error Tracking (Sentry)

**Installation:**
```bash
pnpm add @sentry/nextjs
```

**Configuration (`sentry.client.config.ts`):**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

**Sentry Alert Rules:**
| Condition | Action |
|---|---|
| New issue in `production` | Slack #alerts |
| Error rate > 1% in 5 min | PagerDuty (on-call) |
| First appearance of error | Email team lead |

### 6.3 Uptime Monitoring

**Services:**
| Service | URL | Check Interval | Alert |
|---|---|---|---|
| UptimeRobot | https://nothing.digital | 1 min | Email + Slack |
| Vercel Status | Native | Real-time | Dashboard |

### 6.4 Performance Monitoring (Core Web Vitals)

| Metric | Target | Alert Threshold |
|---|---|---|
| LCP | ≤ 2.5s | > 4.0s |
| INP | ≤ 200ms | > 500ms |
| CLS | ≤ 0.1 | > 0.25 |
| TTFB | ≤ 600ms | > 1.0s |

**Reporting:**
- Weekly automated report via GitHub Actions
- Dashboard: Vercel Speed Insights + Sentry Performance

### 6.5 Log Aggregation

**Strategy:** Use Vercel's native logs for real-time, Sentry for errors, and Supabase logs for database.

| Log Type | Tool | Retention |
|---|---|---|
| Application logs | Vercel | 1 hour (free), 3 days (pro) |
| Error logs | Sentry | 90 days |
| Database logs | Supabase | 7 days (free), 30 days (pro) |

---

## 7. Security

### 7.1 Security Headers

Implemented via Cloudflare Transform Rules and Next.js middleware (see section 5.4).

### 7.2 CORS Configuration

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://nothing.digital' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Content-Type' },
        ],
      },
    ];
  },
};
```

### 7.3 Rate Limiting Strategy

**Vercel Edge + Upstash Redis:**
```typescript
// middleware.ts or API route
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  
  return NextResponse.next();
}
```

### 7.4 DDoS Protection (Cloudflare)

| Layer | Protection |
|---|---|
| L3/L4 | Cloudflare Magic Transit (auto-enabled) |
| L7 | Cloudflare WAF + Rate Limiting |
| DNS | Cloudflare DNS + DNSSEC |

### 7.5 Dependency Scanning (Dependabot)

**`.github/dependabot.yml`:**
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "automated"
    reviewers:
      - "nothing-digital/frontend-leads"
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 7.6 Secret Scanning

**GitHub Native:**
- Secret scanning: **Enabled**
- Push protection: **Enabled**
- Partner patterns: All enabled

**Additional:**
- Install `trufflehog` in pre-commit hooks
- Run `gitleaks` in CI/CD for PRs

---

## 8. Backup & Disaster Recovery

### 8.1 Database Backup Strategy (Supabase)

| Backup Type | Frequency | Retention | Method |
|---|---|---|---|
| Automated (Point-in-Time) | Continuous | 7 days (free) / 30 days (pro) | Supabase native |
| Manual dump | Weekly | 90 days | `pg_dump` to S3 |
| Logical backup | Daily | 30 days | Supabase CLI |

**Backup Command:**
```bash
supabase db dump --db-url $SUPABASE_DB_URL -f backup_$(date +%Y%m%d).sql
```

### 8.2 Code Backup

| Source | Backup Method | Frequency |
|---|---|---|
| GitHub | Mirrored to secondary repo | Real-time (via GitHub Actions) |
| Vercel | Deployment history | Automatic (immutable) |

### 8.3 Recovery Procedures

**Scenario 1: Database Corruption**
1. Identify last known good backup timestamp
2. Pause application (maintenance mode)
3. Restore from PITR or manual dump
4. Verify data integrity
5. Resume application

**Scenario 2: Production Deployment Failure**
1. Vercel: Instant rollback to previous deployment (1-click)
2. Verify rollback success
3. Hotfix branch from last known good commit

**Scenario 3: DNS/Domain Compromise**
1. Cloudflare: Audit audit log for unauthorized changes
2. Revert DNS records from version history
3. Rotate all API keys
4. Force password resets for all team members

### 8.4 RTO/RPO Targets

| Metric | Target | Justification |
|---|---|---|
| RTO (Recovery Time Objective) | 1 hour | Vercel instant rollback + Supabase PITR |
| RPO (Recovery Point Objective) | 15 minutes | Supabase PITR on paid tier |

---

## 9. Cost Estimation

### 9.1 Monthly Cost Breakdown (Startup Phase)

| Service | Tier | Monthly Cost |
|---|---|---|
| **Vercel** | Pro | $20 |
| **Cloudflare** | Pro | $20 |
| **Supabase** | Pro | $25 |
| **Resend** | Free (6k emails/mo) | $0 |
| **Sentry** | Developer (5k errors/mo) | $0 |
| **UptimeRobot** | Pro (100 monitors) | $8 |
| **Upstash Redis** | Pay-as-you-go | ~$5 |
| **GitHub** | Team | $4/user |
| **Domain** | nothing.digital | ~$12/year ≈ $1/mo |

**Total Estimated Monthly Cost: ~$83** (for a 3-person team: ~$95)

### 9.2 Free Tier vs Paid Tier Analysis

| Service | Free Tier Limit | Paid Tier Benefit | Recommendation |
|---|---|---|---|
| Vercel | 100GB bandwidth, 10s functions | 1TB bandwidth, 60s functions | **Pro** (required for custom domains) |
| Cloudflare | All features free | Advanced analytics, WAF rules | **Pro** (for page rules) |
| Supabase | 500MB DB, 2GB transfer | 8GB DB, 100GB transfer | **Pro** (required for production) |
| Resend | 3,000 emails/day | Higher limits, dedicated IPs | Free initially |
| Sentry | 5,000 errors/mo | 50k errors, performance | Free initially |

### 9.3 Scaling Cost Projections

| Traffic Level | Page Views/Month | Est. Cost |
|---|---|---|
| Startup (current) | < 100K | ~$95/mo |
| Growth | 500K - 1M | ~$200-300/mo |
| Scale | 1M - 5M | ~$500-800/mo |
| Enterprise | 5M+ | $1,000+/mo (negotiate enterprise plans) |

**Scaling Triggers:**
- Vercel: Upgrade when bandwidth > 1TB or function execution > 1M
- Supabase: Upgrade when DB > 8GB or connections > 500
- Cloudflare: Upgrade when WAF rules > 20 or need advanced bot management

---

## Appendix A: Quick Start Checklist

### Day 1: Foundation
- [ ] Create GitHub repo with structure from Section 1
- [ ] Add CODEOWNERS, PR template, issue templates
- [ ] Configure branch protection rules
- [ ] Set up Vercel project and connect GitHub
- [ ] Add all environment variables to Vercel

### Day 2: CI/CD
- [ ] Create GitHub Actions workflows (lint, build, test, lighthouse, a11y)
- [ ] Configure Lighthouse CI budgets
- [ ] Verify preview deployments work on PRs
- [ ] Test production deployment from `main`

### Day 3: Infrastructure
- [ ] Set up Supabase project and run initial migrations
- [ ] Verify RLS policies are active
- [ ] Configure Resend domain and verify DNS
- [ ] Set up Cloudflare DNS records and SSL

### Day 4: Security & Monitoring
- [ ] Configure Cloudflare security headers and WAF
- [ ] Implement rate limiting
- [ ] Set up Sentry error tracking
- [ ] Enable Vercel Analytics
- [ ] Configure Dependabot

### Day 5: Documentation
- [ ] Document runbooks for incident response
- [ ] Share environment access with team
- [ ] Schedule first disaster recovery drill

---

## Key Recommendations Summary

1. **Use Trunk-Based Development** with short-lived feature branches. It's simpler than GitFlow and works natively with Vercel's preview deployments.

2. **Invest in CI/CD quality gates.** The lint → type-check → build → test → lighthouse → accessibility pipeline ensures nothing broken reaches `main`.

3. **Security-first DNS setup.** Enable DNSSEC, use Full (strict) SSL, and implement comprehensive security headers via Cloudflare Transform Rules.

4. **RLS is non-negotiable on Supabase.** Every table must have RLS enabled with explicit policies. The service role key is for server-side edge functions only.

5. **Start on paid tiers for production.** Vercel Pro, Supabase Pro, and Cloudflare Pro are essential for a professional deployment. The total cost (~$95/mo for a 3-person team) is reasonable.

6. **Monitor Core Web Vitals aggressively.** Lighthouse CI fails the build if LCP > 2.5s or CLS > 0.1. Performance is a feature.

7. **Have a 1-click rollback plan.** Vercel's immutable deployments mean every push is a rollback target. Practice the rollback procedure.

8. **Automate dependency updates.** Dependabot + Trunk-Based Development means small, frequent updates instead of painful quarterly upgrades.
