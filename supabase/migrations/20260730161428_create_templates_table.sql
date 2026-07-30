/*
# Create templates table for CSRGO Wishes

1. Purpose
   Stores the catalog of wishes website templates that visitors can browse,
   search, filter by category, and order via WhatsApp.

2. New Tables
   - `templates`
     - `id` (uuid, primary key)
     - `name` (text, not null) — display name of the template
     - `slug` (text, unique, not null) — URL-friendly identifier
     - `category` (text, not null) — e.g. Birthday, Wedding, Anniversary
     - `tagline` (text) — short one-line marketing copy
     - `description` (text) — longer description shown on the detail view
     - `price` (numeric, not null, default 0) — price in INR
     - `image_url` (text) — preview/hero image URL
     - `gallery` (jsonb, default '[]') — array of additional image URLs
     - `features` (jsonb, default '[]') — array of feature strings
     - `tags` (text[], default '{}') — searchable tags
     - `is_featured` (boolean, default false) — shown in the featured row
     - `is_active` (boolean, default true) — soft-hide from the catalog
     - `sort_order` (int, default 0) — manual ordering
     - `created_at` (timestamptz, default now())

3. Indexes
   - `templates_category_idx` on `category` for category filtering
   - `templates_slug_idx` (unique) on `slug`
   - `templates_active_featured_idx` on `(is_active, is_featured)` for the featured row

4. Security
   - Enable RLS on `templates`.
   - This is a no-auth public catalog: visitors (anon + authenticated) can READ
     all active templates. Writes are intentionally NOT exposed to the anon
     role — the catalog is managed server-side / via the Supabase dashboard.
*/

CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  tagline text,
  description text,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  image_url text,
  gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS templates_category_idx ON templates(category);
CREATE INDEX IF NOT EXISTS templates_active_featured_idx ON templates(is_active, is_featured);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Public read access for the catalog (no-auth app).
DROP POLICY IF EXISTS "public_read_templates" ON templates;
CREATE POLICY "public_read_templates" ON templates FOR SELECT
  TO anon, authenticated USING (true);
