// ─── Project Types ───────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  completion_date: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  project_images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

// ─── Gallery Types ───────────────────────────────────────────────

export interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  category: string;
  display_order: number;
  created_at: string;
}

// ─── Service Types ───────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  image_url: string;
  benefits: string[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Testimonial Types ──────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  photo_url: string | null;
  is_approved: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ─── Enquiry Types ──────────────────────────────────────────────

export type EnquiryStatus = 'new' | 'contacted' | 'converted';
export type EnquirySource = 'contact' | 'consultation' | 'review';

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  budget: string;
  message: string;
  status: EnquiryStatus;
  source: EnquirySource;
  created_at: string;
  updated_at: string;
}

// ─── Homepage Content Types ─────────────────────────────────────

export interface HomepageContent {
  id: string;
  section_key: string;
  content: Record<string, any>;
  updated_at: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  hero_image_url: string;
}

export interface IntroContent {
  heading: string;
  description: string;
}

export interface CTAContent {
  heading: string;
  description: string;
  button_text: string;
  button_link: string;
}

export interface StatsContent {
  items: Array<{
    number: string;
    label: string;
  }>;
}

export interface AboutStoryContent {
  heading: string;
  paragraphs: string[];
}

export interface VisionMissionContent {
  vision: string;
  mission: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo_url?: string;
}

// ─── Dashboard Stats ────────────────────────────────────────────

export interface DashboardStats {
  total_projects: number;
  total_enquiries: number;
  new_enquiries: number;
  total_testimonials: number;
  total_gallery_images: number;
  total_services: number;
}
