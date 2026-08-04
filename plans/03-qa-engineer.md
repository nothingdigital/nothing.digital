# QA & Testing Strategy — Nothing.Digital

> **Project:** Nothing.Digital  
> **Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Hook Form + Zod  
> **Hosting:** Vercel  
> **Pages:** Homepage, 4× Service Pages, Portfolio, About, Blog, Contact  
> **Standard:** WCAG 2.1 AA  
> **Last Updated:** 2025-01-15

---

## Table of Contents

1. [Testing Pyramid](#1-testing-pyramid)
2. [Test Cases by Page](#2-test-cases-by-page)
3. [Accessibility Compliance (WCAG 2.1 AA)](#3-accessibility-compliance-wcag-21-aa)
4. [Performance Budgets](#4-performance-budgets)
5. [Cross-Browser & Device Matrix](#5-cross-browser--device-matrix)
6. [Form Validation Testing](#6-form-validation-testing)
7. [Animation & Interaction Testing](#7-animation--interaction-testing)
8. [SEO Testing](#8-seo-testing)
9. [Security Testing](#9-security-testing)
10. [CI Integration](#10-ci-integration)
11. [Appendix: Tooling & Environment](#appendix-tooling--environment)

---

## 1. Testing Pyramid

Our testing strategy follows the standard Testing Pyramid with additional layers for visual, accessibility, and performance validation.

```
        ╱╲
       ╱  ╲     E2E (Playwright)
      ╱────╲
     ╱      ╲   Visual Regression + A11y + Performance
    ╱────────╲
   ╱          ╲  Integration (API + Component)
  ╱────────────╲
 ╱              ╲ Unit (Jest + React Testing Library)
╱────────────────╲
```

### 1.1 Unit Tests — Jest + React Testing Library

| Aspect | Specification |
|--------|---------------|
| **Runner** | Jest (`next/jest`) |
| **DOM** | jsdom |
| **Coverage Target** | ≥ 80% (branches, functions, lines) |
| **Location** | `__tests__/unit/` or co-located `*.test.ts(x)` |

**What to Test:**
- [ ] Utility functions (date formatters, URL builders, validators)
- [ ] Zod schema validations
- [ ] Custom React hooks (with `@testing-library/react-hooks`)
- [ ] Component logic (state, callbacks, refs)
- [ ] API route handlers (Next.js App Router Route Handlers)

**Example: Zod Schema Validation Test**

```typescript
// lib/validations/contact.test.ts
import { contactSchema } from './contact';

describe('contactSchema', () => {
  const validData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    company: 'Acme Inc',
    message: 'Interested in your services',
    budget: '10k-25k',
  };

  it('accepts valid contact data', () => {
    expect(contactSchema.parse(validData)).toEqual(validData);
  });

  it('requires a valid email', () => {
    expect(() =>
      contactSchema.parse({ ...validData, email: 'invalid' })
    ).toThrow(/Invalid email/);
  });

  it('enforces message minimum length', () => {
    expect(() =>
      contactSchema.parse({ ...validData, message: 'Hi' })
    ).toThrow(/minimum/);
  });
});
```

**Example: Custom Hook Test**

```typescript
// hooks/useMediaQuery.test.ts
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  it('returns true when media query matches', () => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });
});
```

### 1.2 Integration Tests — React Testing Library + MSW

| Aspect | Specification |
|--------|---------------|
| **Scope** | Component + API interactions, page-level flows |
| **API Mocking** | MSW (Mock Service Worker) |
| **Location** | `__tests__/integration/` |

**What to Test:**
- [ ] Form submission flows (validation → API call → success/error state)
- [ ] Data fetching components (loading, error, success states)
- [ ] Navigation between pages
- [ ] Context providers and consumers

**Example: Contact Form Integration Test**

```typescript
// app/contact/__tests__/contact-form.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '../components/ContactForm';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

describe('ContactForm', () => {
  it('submits form and shows success message', async () => {
    server.use(
      http.post('/api/contact', () => {
        return HttpResponse.json({ success: true });
      })
    );

    render(<ContactForm />);

    await userEvent.type(screen.getByLabelText(/name/i), 'Jane Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message here');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });
  });
});
```

### 1.3 E2E Tests — Playwright

| Aspect | Specification |
|--------|---------------|
| **Runner** | Playwright |
| **Browsers** | Chromium, Firefox, WebKit |
| **Viewport Sizes** | Desktop (1280×720), Tablet (768×1024), Mobile (375×667) |
| **Location** | `e2e/` |
| **Parallel** | 4 workers (CI) |

**Critical User Journeys (CUJs):**

| ID | Journey | Priority |
|----|---------|----------|
| E2E-01 | Navigate Homepage → View Services → Click CTA | P0 |
| E2E-02 | Submit Contact form with valid data | P0 |
| E2E-03 | Submit Contact form with invalid data (verify errors) | P0 |
| E2E-04 | Navigate to Portfolio → Filter by category → Open case study | P1 |
| E2E-05 | Navigate to Blog → Read article → Share | P1 |
| E2E-06 | Navigate to About → View team → Contact via team member | P2 |
| E2E-07 | Switch between Service pages via navigation | P1 |
| E2E-08 | 404 page handling for unknown routes | P1 |

**Example: Playwright Spec**

```typescript
// e2e/contact.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('successful form submission', async ({ page }) => {
    await page.fill('[name="name"]', 'Jane Doe');
    await page.fill('[name="email"]', 'jane@example.com');
    await page.fill('[name="company"]', 'Acme Inc');
    await page.selectOption('[name="budget"]', '25k-50k');
    await page.fill('[name="message"]', 'Interested in web design services');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('sent successfully');
  });

  test('form validation errors', async ({ page }) => {
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="error-name"]')).toContainText('required');
    await expect(page.locator('[data-testid="error-email"]')).toContainText('required');
  });
});
```

### 1.4 Visual Regression Tests — Chromatic / Playwright Snapshots

| Aspect | Specification |
|--------|---------------|
| **Primary Tool** | Chromatic (Storybook) |
| **Fallback** | Playwright screenshot comparisons |
| **Baseline** | `main` branch |
| **Threshold** | 0.2% pixel diff |

**Visual Test Coverage:**
- [ ] All pages at 3 breakpoints (mobile, tablet, desktop)
- [ ] Component states (default, hover, focus, active, disabled)
- [ ] Dark/light mode (if applicable)
- [ ] Animation mid-states (where deterministic)

**Example: Chromatic Storybook Setup**

```typescript
// components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    chromatic: { viewports: [320, 768, 1280] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary', children: 'Get Started' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Learn More' } };
export const Loading: Story = { args: { isLoading: true, children: 'Submitting' } };
export const Disabled: Story = { args: { disabled: true, children: 'Disabled' } };
```

### 1.5 Accessibility Tests — axe-core + Manual

| Aspect | Specification |
|--------|---------------|
| **Automated** | axe-core (jest-axe, @axe-core/playwright) |
| **Manual** | Keyboard navigation, screen reader (NVDA/VoiceOver) |
| **Standard** | WCAG 2.1 Level AA |

See [Section 3: Accessibility Compliance](#3-accessibility-compliance-wcag-21-aa) for full details.

### 1.6 Performance Tests — Lighthouse CI + Web Vitals

| Aspect | Specification |
|--------|---------------|
| **Tool** | Lighthouse CI, `web-vitals` library |
| **Frequency** | Every PR + nightly |
| **Metrics** | LCP, INP, CLS, TTFB, FCP |

See [Section 4: Performance Budgets](#4-performance-budgets) for thresholds.

### 1.7 SEO Tests — Automated + Manual

| Aspect | Specification |
|--------|---------------|
| **Tool** | Next.js built-in, Lighthouse SEO audit, Screaming Frog |
| **Coverage** | Meta tags, structured data, sitemap, robots.txt, canonicals |

See [Section 8: SEO Testing](#8-seo-testing) for full details.

---

## 2. Test Cases by Page

### 2.1 Homepage (`/`)

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| HP-01 | Hero section renders with headline, subhead, and CTA | Visual / E2E | P0 |
| HP-02 | CTA buttons navigate to correct pages | E2E | P0 |
| HP-03 | Services grid displays all 4 service cards | Visual / E2E | P0 |
| HP-04 | Service cards link to correct service pages | E2E | P1 |
| HP-05 | Featured portfolio items display correctly | Visual / E2E | P1 |
| HP-06 | Testimonials carousel/slider works (if applicable) | E2E | P1 |
| HP-07 | Blog preview section shows latest posts | E2E | P1 |
| HP-08 | Footer contains correct links and social icons | Visual / E2E | P1 |
| HP-09 | All animations (Framer Motion) trigger on scroll/view | Interaction | P1 |
| HP-10 | Navigation is sticky and functional | E2E | P0 |
| HP-11 | Mobile hamburger menu opens/closes | E2E | P0 |
| HP-12 | Page meets performance budget | Performance | P0 |
| HP-13 | No accessibility violations | A11y | P0 |
| HP-14 | Meta tags and Open Graph data are correct | SEO | P0 |
| HP-15 | Structured data (Organization) is present | SEO | P1 |

### 2.2 Service Pages (`/services/web-design`, `/services/development`, `/services/branding`, `/services/marketing`)

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| SP-01 | Hero section with service-specific headline renders | Visual / E2E | P0 |
| SP-02 | Service description content is accurate | E2E | P1 |
| SP-03 | Process/timeline section displays correctly | Visual | P1 |
| SP-04 | Related case studies from portfolio are shown | E2E | P1 |
| SP-05 | CTA to contact page is present and functional | E2E | P0 |
| SP-06 | Breadcrumb navigation is correct | E2E | P2 |
| SP-07 | Page meets performance budget | Performance | P0 |
| SP-08 | No accessibility violations | A11y | P0 |
| SP-09 | Service-specific meta tags and Open Graph data | SEO | P0 |
| SP-10 | Structured data (Service) is present | SEO | P1 |

### 2.3 Portfolio Page (`/portfolio`)

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| PF-01 | Portfolio grid renders with all case studies | Visual / E2E | P0 |
| PF-02 | Filter by category works (All, Web, Branding, etc.) | E2E | P1 |
| PF-03 | Filter state updates URL query parameters | E2E | P1 |
| PF-04 | Case study cards link to detail pages | E2E | P0 |
| PF-05 | Lazy loading / pagination works for large datasets | E2E | P1 |
| PF-06 | Hover effects on cards work correctly | Visual | P1 |
| PF-07 | Empty state displays when no results match filter | Visual / E2E | P2 |
| PF-08 | Page meets performance budget | Performance | P0 |
| PF-09 | No accessibility violations | A11y | P0 |
| PF-10 | Meta tags and Open Graph data are correct | SEO | P0 |

### 2.4 Case Study Pages (`/portfolio/[slug]`)

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| CS-01 | Case study content renders (hero, challenge, solution, results) | Visual / E2E | P0 |
| CS-02 | Images load and display correctly | Visual / E2E | P0 |
| CS-03 | Next/prev navigation between case studies works | E2E | P1 |
| CS-04 | Related case studies section displays | E2E | P2 |
| CS-05 | CTA to contact page is present | E2E | P1 |
| CS-06 | Page meets performance budget | Performance | P0 |
| CS-07 | No accessibility violations | A11y | P0 |
| CS-08 | Case study-specific meta tags and Open Graph data | SEO | P0 |
| CS-09 | Structured data (Article or CreativeWork) is present | SEO | P1 |

### 2.5 About Page (`/about`)

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| AP-01 | Company story/mission section renders | Visual / E2E | P1 |
| AP-02 | Team members grid displays with photos and bios | Visual / E2E | P1 |
| AP-03 | Team member modal/detail works (if applicable) | E2E | P2 |
| AP-04 | Company values/philosophy section displays | Visual | P2 |
| AP-05 | CTA to contact or careers is present | E2E | P1 |
| AP-06 | Page meets performance budget | Performance | P0 |
| AP-07 | No accessibility violations | A11y | P0 |
| AP-08 | Meta tags and Open Graph data are correct | SEO | P0 |
| AP-09 | Structured data (Organization) is present | SEO | P1 |

### 2.6 Blog Index (`/blog`)

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| BI-01 | Blog post list renders with excerpts | Visual / E2E | P0 |
| BI-02 | Category/tag filtering works | E2E | P1 |
| BI-03 | Pagination or infinite scroll works | E2E | P1 |
| BI-04 | Search functionality works (if applicable) | E2E | P1 |
| BI-05 | Each post card links to correct article | E2E | P0 |
| BI-06 | Published dates and author info display correctly | Visual | P1 |
| BI-07 | Page meets performance budget | Performance | P0 |
| BI-08 | No accessibility violations | A11y | P0 |
| BI-09 | Meta tags and Open Graph data are correct | SEO | P0 |
| BI-10 | RSS feed is accessible at `/feed.xml` | E2E | P2 |

### 2.7 Blog Post Pages (`/blog/[slug]`)

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| BP-01 | Article content renders (title, body, images, code blocks) | Visual / E2E | P0 |
| BP-02 | Table of contents works (if applicable) | E2E | P2 |
| BP-03 | Social share buttons work | E2E | P2 |
| BP-04 | Author bio and related posts display | Visual / E2E | P1 |
| BP-05 | Comments section works (if applicable) | E2E | P2 |
| BP-06 | Page meets performance budget | Performance | P0 |
| BP-07 | No accessibility violations | A11y | P0 |
| BP-08 | Article-specific meta tags and Open Graph data | SEO | P0 |
| BP-09 | Structured data (BlogPosting) is present | SEO | P0 |
| BP-10 | Reading time estimate is accurate | Unit | P2 |

### 2.8 Contact Page (`/contact`)

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| CP-01 | Contact form renders with all fields | Visual / E2E | P0 |
| CP-02 | Form validation works (empty fields, invalid email, etc.) | E2E | P0 |
| CP-03 | Successful submission shows confirmation | E2E | P0 |
| CP-04 | Error handling displays user-friendly messages | E2E | P0 |
| CP-05 | reCAPTCHA/honeypot works (if applicable) | E2E | P1 |
| CP-06 | Contact information (email, phone, address) displays correctly | Visual | P1 |
| CP-07 | Map embed loads correctly (if applicable) | E2E | P2 |
| CP-08 | Page meets performance budget | Performance | P0 |
| CP-09 | No accessibility violations | A11y | P0 |
| CP-10 | Meta tags and Open Graph data are correct | SEO | P0 |

### 2.9 Global / Shared Components

| ID | Test Case | Type | Priority |
|----|-----------|------|----------|
| GL-01 | Navigation renders on all pages | E2E | P0 |
| GL-02 | Navigation links are correct and functional | E2E | P0 |
| GL-03 | Footer renders on all pages | E2E | P0 |
| GL-04 | Footer links and social icons are correct | E2E | P1 |
| GL-05 | Cookie consent banner appears and functions | E2E | P1 |
| GL-06 | 404 page renders for unknown routes | E2E | P1 |
| GL-07 | Loading states display correctly | Visual | P1 |
| GL-08 | Error boundaries catch and display errors | E2E | P1 |
| GL-09 | Scroll-to-top button works (if applicable) | E2E | P2 |
| GL-10 | Analytics events fire correctly (if applicable) | Unit | P2 |

---

## 3. Accessibility Compliance (WCAG 2.1 AA)

### 3.1 Automated Accessibility Testing

| Tool | Scope | Integration |
|------|-------|-------------|
| **jest-axe** | Unit / Integration tests | Runs with Jest |
| **@axe-core/playwright** | E2E tests | Runs with Playwright |
| **Lighthouse** | Full page audits | CI + manual |
| **Storybook a11y addon** | Component-level | Development |

**Example: axe-core in Playwright**

```typescript
// e2e/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/services/web-design', '/portfolio', '/about', '/blog', '/contact'];

pages.forEach((path) => {
  test(`a11y check for ${path}`, async ({ page }) => {
    await page.goto(path);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

### 3.2 WCAG 2.1 AA Checklist

#### Perceivable

| Criterion | Requirement | Test Method |
|-----------|-------------|-------------|
| **1.1.1 Non-text Content** | All images have alt text; decorative images use `alt=""` | Automated (axe) + Manual |
| **1.2.1 Audio-only/Video-only** | Transcripts provided for audio-only content | Manual |
| **1.3.1 Info and Relationships** | Semantic HTML (`header`, `nav`, `main`, `section`, `article`, `footer`) | Automated (axe) + Manual |
| **1.3.2 Meaningful Sequence** | Content order is logical without CSS | Manual (disable CSS) |
| **1.4.3 Contrast (Minimum)** | Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large) | Automated (Lighthouse) + Manual |
| **1.4.4 Resize Text** | Content readable at 200% zoom | Manual |
| **1.4.10 Reflow** | No horizontal scroll at 320px equivalent | Manual |
| **1.4.11 Non-text Contrast** | UI components and icons have ≥ 3:1 contrast | Automated + Manual |
| **1.4.12 Text Spacing** | No content loss with increased spacing | Manual |
| **1.4.13 Content on Hover/Focus** | Hover content is dismissible, hoverable, persistent | Manual |

#### Operable

| Criterion | Requirement | Test Method |
|-----------|-------------|-------------|
| **2.1.1 Keyboard** | All functionality available via keyboard | Manual (Tab navigation) |
| **2.1.2 No Keyboard Trap** | Users can Tab away from all components | Manual |
| **2.2.1 Timing Adjustable** | No auto-updating content without pause/stop | Manual |
| **2.3.1 Three Flashes or Below** | No content flashes > 3 times per second | Automated |
| **2.4.1 Bypass Blocks** | Skip-to-content link present | Manual |
| **2.4.3 Focus Order** | Focus order matches visual order | Manual |
| **2.4.4 Link Purpose (In Context)** | Link text is descriptive | Automated + Manual |
| **2.4.6 Headings and Labels** | Headings describe topic; labels describe purpose | Automated + Manual |
| **2.4.7 Focus Visible** | Focus indicators are clearly visible | Manual |
| **2.5.2 Pointer Cancellation** | Actions don't fire on down-event only | Manual |
| **2.5.3 Label in Name** | Accessible name contains visible text | Automated |
| **2.5.4 Motion Actuation** | Motion-triggered actions have alternatives | Manual |

#### Understandable

| Criterion | Requirement | Test Method |
|-----------|-------------|-------------|
| **3.1.1 Language of Page** | `lang` attribute set on `<html>` | Automated |
| **3.1.2 Language of Parts** | Language changes marked with `lang` | Manual |
| **3.2.1 On Focus** | Focus doesn't cause context change | Manual |
| **3.2.2 On Input** | Input doesn't cause context change (unless expected) | Manual |
| **3.3.1 Error Identification** | Errors identified in text | Automated + Manual |
| **3.3.2 Labels or Instructions** | Input fields have labels | Automated (axe) |
| **3.3.3 Error Suggestion** | Error messages suggest corrections | Manual |
| **3.3.4 Error Prevention** | Review/correct for legal/financial/data submissions | Manual |

#### Robust

| Criterion | Requirement | Test Method |
|-----------|-------------|-------------|
| **4.1.1 Parsing** | Valid HTML (no duplicate IDs, closed tags) | Automated |
| **4.1.2 Name, Role, Value** | Custom components expose name/role/value | Automated (axe) + Manual |
| **4.1.3 Status Messages** | Status messages announced by screen readers | Manual |

### 3.3 Screen Reader Testing

| Screen Reader | Browser | Platform |
|--------------|---------|----------|
| NVDA | Chrome, Firefox | Windows |
| JAWS | Chrome, Edge | Windows |
| VoiceOver | Safari | macOS, iOS |
| TalkBack | Chrome | Android |

**Screen Reader Test Checklist:**
- [ ] Page title announces correctly on load
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Landmarks (banner, navigation, main, contentinfo) are announced
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced when form validation fails
- [ ] Dynamic content updates (loading, success, errors) are announced via live regions
- [ ] Button purposes are clear from context
- [ ] Skip link works and announces correctly

### 3.4 Keyboard Navigation Test

```
Test Procedure:
1. Unplug mouse / disable trackpad
2. Press Tab to navigate through entire page
3. Verify:
   - All interactive elements are reachable
   - Focus order is logical
   - Focus indicator is visible
   - Space/Enter activates buttons and links
   - Arrow keys work for custom widgets (tabs, menus)
   - Escape closes modals/dropdowns
   - Tab doesn't get trapped
```

---

## 4. Performance Budgets

### 4.1 Core Web Vitals Thresholds

| Metric | Good | Needs Improvement | Poor | Target |
|--------|------|-------------------|------|--------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s | ≤ 2.5s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms | ≤ 200ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 | ≤ 0.1 |
| **TTFB** (Time to First Byte) | ≤ 800ms | ≤ 1.8s | > 1.8s | ≤ 600ms |
| **FCP** (First Contentful Paint) | ≤ 1.8s | ≤ 3.0s | > 3.0s | ≤ 1.8s |
| **TBT** (Total Blocking Time) | ≤ 200ms | ≤ 600ms | > 600ms | ≤ 200ms |

### 4.2 Resource Budgets

| Resource Type | Budget | Enforcement |
|--------------|--------|-------------|
| **Total Page Weight** | < 1 MB (mobile), < 2 MB (desktop) | Lighthouse CI |
| **JavaScript** | < 200 KB (gzipped) | Bundle Analyzer |
| **CSS** | < 50 KB (gzipped) | Bundle Analyzer |
| **Images** | < 500 KB total per page | `next/image` + Lighthouse |
| **Third-party Scripts** | < 100 KB (gzipped) | Manual review |
| **Font Files** | < 100 KB (gzipped, per family) | Subset fonts |
| **HTTP Requests** | < 50 per page | Network panel audit |

### 4.3 Page-Specific Budgets

| Page | LCP Target | Total Weight Target |
|------|-----------|---------------------|
| Homepage | ≤ 2.0s | < 800 KB |
| Service Pages | ≤ 2.0s | < 600 KB |
| Portfolio | ≤ 2.5s | < 1 MB (images) |
| Portfolio Detail | ≤ 2.5s | < 1.2 MB |
| About | ≤ 2.0s | < 700 KB |
| Blog Index | ≤ 2.5s | < 800 KB |
| Blog Post | ≤ 2.5s | < 900 KB |
| Contact | ≤ 1.8s | < 500 KB |

### 4.4 Performance Testing Setup

**Lighthouse CI Configuration**

```json
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/services/web-design',
        'http://localhost:3000/portfolio',
        'http://localhost:3000/about',
        'http://localhost:3000/blog',
        'http://localhost:3000/contact',
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

**Web Vitals Monitoring (Vercel + `web-vitals` library)**

```typescript
// lib/vitals.ts
import { getCLS, getFCP, getFID, getLCP, getTTFB, getINP } from 'web-vitals';

export function reportWebVitals(onPerfEntry: (metric: any) => void) {
  getCLS(onPerfEntry);
  getFCP(onPerfEntry);
  getFID(onPerfEntry);
  getLCP(onPerfEntry);
  getTTFB(onPerfEntry);
  getINP(onPerfEntry);
}

// app/layout.tsx
import { reportWebVitals } from '@/lib/vitals';

if (typeof window !== 'undefined') {
  reportWebVitals((metric) => {
    // Send to analytics (Vercel Analytics, DataDog, etc.)
    console.log(metric);
  });
}
```

### 4.5 Performance Optimization Checklist

- [ ] Images use `next/image` with proper sizing and `priority` for LCP images
- [ ] Fonts use `next/font` with `display: swap`
- [ ] Third-party scripts loaded with `next/script` and `strategy` attribute
- [ ] CSS is purged (Tailwind handles this automatically)
- [ ] Code splitting via dynamic imports for heavy components
- [ ] Prefetching enabled for internal links
- [ ] Static generation (`generateStaticParams`) used where possible
- [ ] Edge runtime used for API routes where applicable

---

## 5. Cross-Browser & Device Matrix

### 5.1 Browser Matrix

| Browser | Desktop | Mobile | Minimum Version |
|---------|---------|--------|-----------------|
| **Chrome** | ✅ | ✅ | Last 2 versions |
| **Safari** | ✅ | ✅ | Last 2 versions |
| **Firefox** | ✅ | ✅ | Last 2 versions |
| **Edge** | ✅ | — | Last 2 versions |
| **Samsung Internet** | — | ✅ | Last 2 versions |

### 5.2 Device Matrix

| Device | OS | Viewport | Priority |
|--------|-----|----------|----------|
| iPhone 14 Pro | iOS 17 | 393×852 | P0 |
| iPhone SE | iOS 17 | 375×667 | P0 |
| iPad Pro | iPadOS 17 | 1024×1366 | P1 |
| Samsung Galaxy S23 | Android 14 | 360×780 | P0 |
| Google Pixel 7 | Android 14 | 412×915 | P1 |
| MacBook Pro 14" | macOS Sonoma | 1512×982 | P0 |
| Windows Laptop | Windows 11 | 1920×1080 | P0 |
| Desktop (various) | — | 2560×1440 | P1 |

### 5.3 Playwright Projects Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 14 Pro'] },
    },
    {
      name: 'webkit-tablet',
      use: { ...devices['iPad Pro 11'] },
    },
  ],
});
```

### 5.4 Manual Device Testing Checklist

- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Pinch-to-zoom works (not disabled unnecessarily)
- [ ] Horizontal scroll doesn't occur on mobile
- [ ] Font sizes are readable without zooming
- [ ] Sticky/fixed elements don't cover content on mobile
- [ ] Modal dialogs are fully visible and scrollable on small screens
- [ ] Form inputs trigger correct keyboards (email, tel, number)
- [ ] Safari bottom bar doesn't hide critical content
- [ ] 100vh works correctly on mobile browsers (use `dvh` where supported)

---

## 6. Form Validation Testing

### 6.1 Contact Form Validation Matrix

| Field | Type | Required | Validation Rules | Error Message |
|-------|------|----------|------------------|---------------|
| **Name** | Text | Yes | Min 2 chars, max 100 chars | "Name is required (2-100 characters)" |
| **Email** | Email | Yes | Valid email format | "Please enter a valid email address" |
| **Company** | Text | No | Max 100 chars | "Company name is too long" |
| **Budget** | Select | No | One of predefined options | — |
| **Message** | Textarea | Yes | Min 10 chars, max 5000 chars | "Message is required (10-5000 characters)" |
| **Privacy** | Checkbox | Yes | Must be checked | "You must agree to the privacy policy" |

### 6.2 Zod Schema Definition

```typescript
// lib/validations/contact.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z
    .string()
    .max(100, 'Company name is too long')
    .optional()
    .or(z.literal('')),
  budget: z.enum(['under-5k', '5k-10k', '10k-25k', '25k-50k', '50k+']).optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
  privacyAgreed: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the privacy policy' }),
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

### 6.3 Form Test Cases

| ID | Scenario | Expected Result |
|----|----------|----------------|
| FV-01 | Submit empty form | All required fields show errors, form not submitted |
| FV-02 | Invalid email format | Email field shows error, form not submitted |
| FV-03 | Name < 2 characters | Name field shows min-length error |
| FV-04 | Message < 10 characters | Message field shows min-length error |
| FV-05 | Message > 5000 characters | Message field shows max-length error |
| FV-06 | Unchecked privacy checkbox | Privacy field shows error |
| FV-07 | Valid form submission | Success message shown, form reset, API called |
| FV-08 | API returns error | User-friendly error message displayed |
| FV-09 | Network failure | Retry option or error message displayed |
| FV-10 | Spam/honeypot field filled | Form silently rejected |
| FV-11 | Rapid resubmission | Button disabled during submission, prevents duplicates |
| FV-12 | Autofill works correctly | Browser autofill populates all fields properly |

### 6.4 React Hook Form + Zod Integration Test

```typescript
// components/ContactForm/__tests__/ContactForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '../ContactForm';

describe('ContactForm Validation', () => {
  it('displays validation errors on empty submit', async () => {
    render(<ContactForm />);
    
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
    
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(await screen.findByText(/message is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<ContactForm />);
    
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
    
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it('clears errors when user corrects input', async () => {
    render(<ContactForm />);
    
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
    const error = await screen.findByText(/name is required/i);
    expect(error).toBeInTheDocument();
    
    await userEvent.type(screen.getByLabelText(/name/i), 'Jane');
    
    await waitFor(() => {
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });
});
```

### 6.5 Accessibility in Forms

- [ ] All inputs have associated `<label>` elements (or `aria-label`/`aria-labelledby`)
- [ ] Error messages are linked via `aria-describedby`
- [ ] Required fields indicated with `aria-required` and visual indicator
- [ ] `aria-invalid` set to `true` when validation fails
- [ ] Live region announces form submission result
- [ ] Focus moves to first error field on failed submission
- [ ] Fieldset/legend used for grouped controls

---

## 7. Animation & Interaction Testing

### 7.1 Framer Motion Testing Strategy

| Aspect | Approach |
|--------|----------|
| **Unit Tests** | Test animation config objects (variants, transitions) |
| **Integration** | Test component state changes trigger animations |
| **Visual Regression** | Capture animation keyframes with Chromatic |
| **Manual** | Verify animations feel right (timing, easing) |
| **Reduced Motion** | Test `prefers-reduced-motion` support |

### 7.2 Animation Test Cases

| ID | Animation | Trigger | Test |
|----|-----------|---------|------|
| AN-01 | Hero text reveal | Page load | Content visible even if JS fails; animates smoothly |
| AN-02 | Scroll-triggered fade-ins | Scroll into viewport | Elements animate when scrolled into view |
| AN-03 | Card hover effects | Mouse hover | Scale/shadow transitions smoothly |
| AN-04 | Mobile menu open/close | Hamburger click | Menu slides in/out, focus trapped |
| AN-05 | Page transitions | Navigation | Exit/enter animations play correctly |
| AN-06 | Loading skeletons | Data fetching | Skeletons pulse, replaced by content |
| AN-07 | Button press states | Click/tap | Scale down, return on release |
| AN-08 | Staggered list items | Render/scroll | Items appear sequentially |
| AN-09 | Parallax effects | Scroll | Layers move at different speeds |
| AN-10 | Image zoom on hover | Mouse hover | Smooth scale transition |

### 7.3 Reduced Motion Support

```typescript
// hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// Usage in component
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function AnimatedSection({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
    >
      {children}
    </motion.div>
  );
}
```

**Reduced Motion Test Checklist:**
- [ ] Enable "Reduce Motion" in OS settings
- [ ] Verify all animations are instant or disabled
- [ ] Ensure no content is hidden behind animations
- [ ] Check that auto-playing carousels stop or show controls

### 7.4 Interaction Testing with Playwright

```typescript
// e2e/interactions.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Animations & Interactions', () => {
  test('scroll-triggered animations play', async ({ page }) => {
    await page.goto('/');
    
    // Element should be hidden initially (or have starting state)
    const section = page.locator('[data-animate="fade-up"]').first();
    
    // Scroll to element
    await section.scrollIntoViewIfNeeded();
    
    // Wait for animation to complete
    await page.waitForTimeout(600);
    
    // Verify final state
    await expect(section).toHaveCSS('opacity', '1');
    await expect(section).toHaveCSS('transform', /matrix/);
  });

  test('mobile menu opens and traps focus', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.click('[aria-label="Open menu"]');
    
    // Menu should be visible
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Focus should be trapped inside menu
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.getAttribute('data-testid'));
    expect(focusedElement).toContain('menu');
  });
});
```

---

## 8. SEO Testing

### 8.1 Meta Tags & Open Graph Testing

**Example: Meta Tags Test**

```typescript
// e2e/seo.spec.ts
import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', title: 'Nothing.Digital — Premium Digital Services', description: /digital/ },
  { path: '/services/web-design', title: /Web Design/, description: /design/ },
  { path: '/portfolio', title: /Portfolio/, description: /work/ },
  { path: '/blog', title: /Blog/, description: /insights/ },
  { path: '/contact', title: /Contact/, description: /get in touch/ },
];

pages.forEach(({ path, title, description }) => {
  test(`SEO meta tags for ${path}`, async ({ page }) => {
    await page.goto(path);
    
    await expect(page).toHaveTitle(title);
    
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', description);
    
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
    
    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', /.+/);
    
    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
  });
});
```

### 8.2 Structured Data Testing

| Page | Schema Type | Required Properties |
|------|-------------|---------------------|
| Homepage | `Organization` | name, url, logo, sameAs |
| Service Pages | `Service` | name, description, provider, areaServed |
| Portfolio | `CollectionPage` | name, description, hasPart |
| Case Studies | `CreativeWork` or `Article` | headline, author, datePublished, image |
| Blog Index | `Blog` | name, description, blogPost |
| Blog Posts | `BlogPosting` | headline, author, datePublished, image, articleBody |
| About | `Organization`, `Person` (team) | name, jobTitle, image |
| Contact | `Organization` | name, url, contactPoint |

**Example: Structured Data Test**

```typescript
// e2e/structured-data.spec.ts
import { test, expect } from '@playwright/test';

test('Homepage has Organization structured data', async ({ page }) => {
  await page.goto('/');
  
  const jsonLd = await page.$eval('script[type="application/ld+json"]', (el) => el.textContent);
  const structuredData = JSON.parse(jsonLd!);
  
  expect(structuredData['@context']).toBe('https://schema.org');
  expect(structuredData['@type']).toBe('Organization');
  expect(structuredData.name).toBe('Nothing.Digital');
  expect(structuredData.url).toBe('https://nothing.digital');
});
```

### 8.3 SEO Checklist

#### Technical SEO
- [ ] Sitemap.xml generated and submitted to Search Console
- [ ] Robots.txt allows indexing of public pages
- [ ] Canonical URLs set on all pages
- [ ] HTTPS enforced (HSTS)
- [ ] No broken links (404s)
- [ ] Redirects set for changed URLs
- [ ] Hreflang tags (if multi-language)
- [ ] Pagination with `rel="prev"`/`rel="next"` (if applicable)

#### On-Page SEO
- [ ] Unique, descriptive `<title>` on every page (50-60 chars)
- [ ] Unique meta description on every page (150-160 chars)
- [ ] One H1 per page, descriptive
- [ ] Logical heading hierarchy (H1 → H2 → H3)
- [ ] Alt text on all images
- [ ] Internal linking between related pages
- [ ] Breadcrumb structured data (if applicable)
- [ ] Open Graph tags complete
- [ ] Twitter Card tags complete

#### Content SEO
- [ ] Keyword-optimized content (natural, not stuffed)
- [ ] Readable URLs with keywords
- [ ] Schema.org structured data implemented
- [ ] FAQ schema (if applicable)
- [ ] Article/BlogPosting schema for blog posts

### 8.4 SEO Testing Tools

| Tool | Purpose | Frequency |
|------|---------|-----------|
| Lighthouse SEO Audit | Basic technical SEO | Every PR |
| Screaming Frog | Full site crawl, broken links | Weekly |
| Google Search Console | Indexing, performance, errors | Weekly review |
| Google Rich Results Test | Structured data validation | After changes |
| Schema.org Validator | Schema markup validation | After changes |

---

## 9. Security Testing

### 9.1 OWASP Top 10 for Web Applications

| # | Vulnerability | Mitigation | Test |
|---|---------------|------------|------|
| A01 | Broken Access Control | Role-based access, least privilege | Attempt unauthorized access |
| A02 | Cryptographic Failures | HTTPS, secure cookies, encryption | SSL Labs scan, cookie inspection |
| A03 | Injection | Input validation, parameterized queries | Attempt SQLi, XSS payloads |
| A04 | Insecure Design | Threat modeling, secure patterns | Architecture review |
| A05 | Security Misconfiguration | Minimal features, secure defaults | Config audit |
| A06 | Vulnerable Components | Dependency scanning | npm audit, Dependabot |
| A07 | Auth Failures | Strong auth, MFA, session mgmt | Brute force, session tests |
| A08 | Data Integrity Failures | Integrity checks, signatures | Verify signatures |
| A09 | Logging Failures | Comprehensive logging, monitoring | Log review |
| A10 | SSRF | Whitelist URLs, disable redirects | Attempt SSRF payloads |

### 9.2 Next.js / React Specific Security

| Concern | Mitigation | Verification |
|---------|------------|--------------|
| **XSS** | Sanitize user input, `dangerouslySetInnerHTML` avoided | Code review, CSP headers |
| **CSRF** | CSRF tokens for state-changing operations | Test token validation |
| **Clickjacking** | `X-Frame-Options: DENY` or CSP `frame-ancestors` | Header check |
| **CSP** | Strict Content Security Policy | CSP evaluator |
| **Secure Headers** | HSTS, X-Content-Type-Options, Referrer-Policy | SecurityHeaders.com |
| **Environment Leaks** | No secrets in client bundle | `next.config.js` audit |
| **API Rate Limiting** | Vercel/Upstash rate limiting | Load test |
| **Dependency Vulns** | Regular `npm audit`, Dependabot alerts | Weekly scan |

### 9.3 Security Headers Configuration

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 9.4 Security Testing Checklist

- [ ] Run `npm audit` — 0 critical/high vulnerabilities
- [ ] Run OWASP ZAP baseline scan
- [ ] Verify HTTPS-only (HSTS enabled)
- [ ] Test for XSS payloads in form inputs
- [ ] Test for SQL injection in search/URL params
- [ ] Verify cookies are `HttpOnly`, `Secure`, `SameSite=Strict`
- [ ] Check for exposed environment variables in client bundle
- [ ] Verify API endpoints have proper authentication
- [ ] Test file upload restrictions (if applicable)
- [ ] Verify error pages don't leak stack traces
- [ ] Check for open redirects in URL parameters
- [ ] Test rate limiting on API endpoints

### 9.5 Dependency Security

```bash
# Weekly security audit script
# scripts/security-audit.sh

#!/bin/bash
set -e

echo "Running npm audit..."
npm audit --audit-level=moderate

echo "Checking for outdated packages..."
npm outdated

echo "Running Snyk test (if configured)..."
# snyk test

echo "Security audit complete."
```

---

## 10. CI Integration

### 10.1 GitHub Actions Workflow

```yaml
# .github/workflows/qa.yml
name: QA & Testing

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report
          path: coverage/

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  accessibility-tests:
    name: Accessibility Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run test:a11y

  performance-tests:
    name: Performance Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run test:perf

  lighthouse-ci:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  visual-regression:
    name: Visual Regression
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: Publish to Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}

  security-audit:
    name: Security Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm audit --audit-level=moderate
```

### 10.2 Vercel Preview Deployments

| Event | Action |
|-------|--------|
| PR Created | Deploy preview environment |
| PR Updated | Redeploy preview |
| E2E Tests | Run against preview URL |
| Lighthouse CI | Run against preview URL |
| PR Merged | Deploy to production |

### 10.3 Test Scripts (package.json)

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --selectProjects unit",
    "test:integration": "jest --selectProjects integration",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "playwright test e2e/a11y",
    "test:perf": "lhci autorun",
    "test:visual": "chromatic --project-token=$CHROMATIC_PROJECT_TOKEN",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "security:audit": "npm audit --audit-level=moderate"
  }
}
```

### 10.4 Pre-commit Hooks

```javascript
// .husky/pre-commit (or lint-staged config)
// Using lint-staged + husky

module.exports = {
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    () => 'tsc --noEmit',
  ],
  '*.{js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml}': ['prettier --write'],
};
```

### 10.5 CI Pipeline Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Push/PR   │────▶│    Lint     │────▶│ Type Check  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                       ┌────────────────────────┘
                       ▼
              ┌─────────────────┐
              │   Build App     │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │  Unit   │  │Integration│ │  E2E   │
   │  Tests  │  │  Tests   │  │ Tests  │
   └────┬────┘  └────┬────┘  └────┬────┘
        │            │            │
        └────────────┼────────────┘
                     ▼
            ┌─────────────────┐
            │  Accessibility  │
            │     Tests       │
            └────────┬────────┘
                     ▼
            ┌─────────────────┐
            │   Lighthouse    │
            │      CI         │
            └────────┬────────┘
                     ▼
            ┌─────────────────┐
            │Visual Regression│
            │   (Chromatic)   │
            └────────┬────────┘
                     ▼
            ┌─────────────────┐
            │ Security Audit  │
            │   (npm audit)   │
            └────────┬────────┘
                     ▼
              ┌─────────────┐
              │    Merge    │
              │   Allowed   │
              └─────────────┘
```

### 10.6 Failure Escalation

| Test Type | Block Merge? | Escalation |
|-----------|-------------|------------|
| Lint / Type Check | ✅ Yes | Fix immediately |
| Unit Tests | ✅ Yes | Fix immediately |
| Integration Tests | ✅ Yes | Fix immediately |
| E2E Tests (P0) | ✅ Yes | Fix immediately |
| E2E Tests (P1/P2) | ⚠️ Review required | Team decision |
| Accessibility | ✅ Yes | Fix immediately |
| Lighthouse (Performance) | ⚠️ Warn if < 0.9 | Review required |
| Lighthouse (A11y/SEO) | ✅ Yes | Fix immediately |
| Visual Regression | ⚠️ Review required | Designer review |
| Security Audit (Critical) | ✅ Yes | Fix immediately |
| Security Audit (Moderate) | ⚠️ Review required | Address within sprint |

---

## Appendix: Tooling & Environment

### Recommended Dependencies

```bash
# Testing Framework
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# E2E Testing
npm install -D @playwright/test

# Accessibility
npm install -D @axe-core/playwright jest-axe

# Mocking
npm install -D msw

# Visual Regression (optional if using Chromatic)
npm install -D chromatic

# Performance
npm install -D @lhci/cli

# Monitoring
npm install web-vitals
```

### Jest Configuration

```typescript
// jest.config.ts
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  projects: [
    {
      displayName: 'unit',
      testMatch: ['**/__tests__/unit/**/*.test.ts(x)?'],
    },
    {
      displayName: 'integration',
      testMatch: ['**/__tests__/integration/**/*.test.ts(x)?'],
    },
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default createJestConfig(customJestConfig);
```

### Environment Variables for Testing

```bash
# .env.test
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Disable analytics in tests
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

---

## Summary

| Category | Tools | Coverage Target | Frequency |
|----------|-------|----------------|-----------|
| **Unit** | Jest, React Testing Library | ≥ 80% | Every PR |
| **Integration** | Jest, MSW, RTL | Key flows | Every PR |
| **E2E** | Playwright | All CUJs | Every PR |
| **Visual** | Chromatic / Playwright | All components | Every PR |
| **Accessibility** | axe-core, manual | WCAG 2.1 AA | Every PR |
| **Performance** | Lighthouse CI, web-vitals | Budget compliance | Every PR + Nightly |
| **SEO** | Lighthouse, Screaming Frog | All pages | Weekly |
| **Security** | npm audit, OWASP ZAP | 0 critical | Weekly |
| **Cross-browser** | Playwright (Chromium, FF, WebKit) | Matrix above | Every PR |

---

> **Document Owner:** QA Engineering  
> **Review Cycle:** Monthly  
> **Next Review Date:** 2025-02-15
