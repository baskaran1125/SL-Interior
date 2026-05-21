-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  SL Interior — Supabase Database Schema                        ║
-- ║  Run this SQL in Supabase SQL Editor to initialize the database ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────
-- 1. PROJECTS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  completion_date DATE,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 2. PROJECT IMAGES
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_images_project_id ON project_images(project_id);

-- ─────────────────────────────────────────────────────────────────
-- 3. GALLERY
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 4. SERVICES
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon_name TEXT NOT NULL DEFAULT 'Home',
  image_url TEXT DEFAULT '',
  benefits JSONB DEFAULT '[]'::JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 5. TESTIMONIALS
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  photo_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 6. ENQUIRIES
-- ─────────────────────────────────────────────────────────────────
CREATE TYPE enquiry_status AS ENUM ('new', 'contacted', 'converted');
CREATE TYPE enquiry_source AS ENUM ('contact', 'consultation', 'review');

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  project_type TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  status enquiry_status DEFAULT 'new',
  source enquiry_source DEFAULT 'contact',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 7. HOMEPAGE CONTENT
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────
-- 8. UPDATED_AT TRIGGER
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enquiries_updated_at
  BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_content_updated_at
  BEFORE UPDATE ON homepage_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────────
-- 9. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Public read access for client website
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read project_images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read approved testimonials" ON testimonials FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read homepage_content" ON homepage_content FOR SELECT USING (true);

-- Public insert for enquiries (contact forms) and testimonials (reviews)
CREATE POLICY "Public insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert testimonials" ON testimonials FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access project_images" ON project_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access enquiries" ON enquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access homepage_content" ON homepage_content FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────
-- 10. STORAGE BUCKETS
-- ─────────────────────────────────────────────────────────────────
-- Run these in Supabase Dashboard > Storage or via the API:
--
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-images', 'gallery-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('testimonial-images', 'testimonial-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('homepage-images', 'homepage-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);
--
-- Storage policies (allow public read, authenticated write):
--
-- CREATE POLICY "Public read storage" ON storage.objects FOR SELECT USING (true);
-- CREATE POLICY "Auth upload storage" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Auth update storage" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Auth delete storage" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────
-- 11. SEED DEFAULT HOMEPAGE CONTENT
-- ─────────────────────────────────────────────────────────────────
INSERT INTO homepage_content (section_key, content) VALUES
  ('hero', '{"title": "Designing Spaces That Inspire", "subtitle": "Premium interior design for homes and businesses that value elegance, comfort, and timeless aesthetics.", "cta_text": "Book Consultation", "cta_link": "/book", "hero_image_url": ""}'),
  ('intro', '{"heading": "Where Vision Meets Craftsmanship", "description": "At SL Interiors, we believe every space tells a story. With over a decade of experience, we transform ordinary rooms into extraordinary environments that reflect your personality and elevate your everyday living. Our approach blends timeless elegance with modern functionality."}'),
  ('cta', '{"heading": "Ready to Transform Your Space?", "description": "Let''s create something extraordinary together. Book your free consultation today.", "button_text": "Book a Consultation", "button_link": "/book"}'),
  ('stats', '{"items": [{"number": "150+", "label": "Projects Completed"}, {"number": "12+", "label": "Years Experience"}, {"number": "98%", "label": "Client Satisfaction"}, {"number": "25+", "label": "Design Awards"}]}'),
  ('about_story', '{"heading": "Our Story", "paragraphs": ["Founded in 2012, SL Interiors began with a simple belief: that great design should be accessible without compromising on quality. What started as a small studio in Mumbai has grown into one of India''s most sought-after interior design firms.", "Our approach is deeply personal. We listen first, design second. Every project begins with understanding our client''s lifestyle, aspirations, and the emotions they want their space to evoke."]}'),
  ('vision_mission', '{"vision": "To redefine the Indian interior design landscape by creating spaces that are timeless, sustainable, and deeply reflective of the people who inhabit them.", "mission": "To deliver exceptional interior design experiences through a client-first approach, innovative thinking, and an unwavering commitment to quality craftsmanship."}'),
  ('team', '{"members": [{"name": "Sanjay Lakhani", "role": "Founder & Lead Designer", "bio": "With 15 years of experience in luxury interiors, Sanjay brings a unique blend of traditional craftsmanship and contemporary design."}, {"name": "Riya Mehta", "role": "Senior Interior Architect", "bio": "Riya specializes in creating functional, beautiful spaces that maximize every square foot."}, {"name": "Arjun Patel", "role": "3D Visualization Lead", "bio": "Arjun transforms concepts into photorealistic renders that help clients envision their dream spaces."}]}')
ON CONFLICT (section_key) DO NOTHING;
