-- Sample portfolio items
INSERT INTO portfolio_items (
  slug,
  title,
  client,
  industry,
  services,
  summary,
  challenge,
  solution,
  results,
  tech_stack,
  testimonial,
  featured,
  published
) VALUES
(
  'velocity-ecommerce-launch',
  'Velocity E-Commerce Launch',
  'Velocity Apparel',
  'Retail',
  ARRAY['website-development', 'email-marketing'],
  'A headless Shopify storefront and launch email sequence that drove a 40% lift in first-month revenue.',
  'Velocity needed a fast, conversion-focused storefront for a seasonal product drop without rebuilding their operations stack.',
  'Built a Next.js storefront on Shopify Storefront API, integrated Klaviyo flows, and optimized core web vitals for mobile checkout.',
  '40% revenue lift, 2.1s LCP, 18% higher mobile conversion.',
  ARRAY['Next.js', 'Shopify', 'Tailwind CSS', 'Klaviyo'],
  'Nothing.Digital shipped exactly what we needed under a tight deadline.',
  true,
  true
),
(
  'apex-automation-platform',
  'Apex Automation Platform',
  'Apex Manufacturing',
  'Manufacturing',
  ARRAY['software-solutions'],
  'Custom workflow automation that reduced quote turnaround from days to minutes.',
  'Sales and operations teams were siloed in spreadsheets, causing quoting delays and errors.',
  'Designed a centralized quoting tool with approval workflows and ERP integration.',
  'Quote time reduced by 85%, data entry errors cut by 60%.',
  ARRAY['Next.js', 'PostgreSQL', 'Node.js', 'REST API'],
  'The new platform changed how we work.',
  true,
  true
),
(
  'pulse-health-app',
  'Pulse Health Companion App',
  'Pulse Health',
  'Healthcare',
  ARRAY['applications'],
  'A React Native companion app for patients to track medication and appointments.',
  'Patients struggled to adhere to complex medication schedules between visits.',
  'Shipped a cross-platform mobile app with reminders, scheduling, and provider messaging.',
  '72% daily active users, 35% improvement in medication adherence.',
  ARRAY['React Native', 'TypeScript', 'Supabase', 'Push Notifications'],
  'Our patients love the simplicity.',
  false,
  true
);

-- Sample newsletter subscriber
INSERT INTO newsletter_subscribers (email, subscribed_at)
VALUES ('demo@nothing.digital', now())
ON CONFLICT (email) DO NOTHING;
