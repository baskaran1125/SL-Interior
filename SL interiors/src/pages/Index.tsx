import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Ruler, Palette, Home, Building2, Star, Plus } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Supabase dynamic imports
import { getHomepageSection } from "@/services/homepageService";
import { getFeaturedProjects } from "@/services/projectService";
import { getServices } from "@/services/serviceService";
import { getTestimonials, createTestimonial } from "@/services/testimonialService";
import type { Project, Service, Testimonial, HeroContent, IntroContent, CTAContent } from "@/lib/types";

// Fallback static assets
import heroImage from "@/assets/hero-living-room.jpg";
import projectKitchen from "@/assets/project-kitchen.jpg";
import projectBedroom from "@/assets/project-bedroom.jpg";
import projectOffice from "@/assets/project-office.jpg";
import projectLiving2 from "@/assets/project-living2.jpg";
import projectBathroom from "@/assets/project-bathroom.jpg";

// Fallback data (used when Supabase is not connected)
const fallbackProjects = [
  { id: "1", title: "The Serene Villa", category: "Living Room", image: projectLiving2, className: "md:col-span-2 md:row-span-2" },
  { id: "2", title: "Marble Kitchen", category: "Kitchen", image: projectKitchen, className: "" },
  { id: "3", title: "Zen Bedroom", category: "Bedroom", image: projectBedroom, className: "" },
  { id: "4", title: "Modern Office", category: "Office", image: projectOffice, className: "md:col-span-2" },
  { id: "5", title: "Luxury Bath", category: "Bathroom", image: projectBathroom, className: "" },
];

const fallbackServices = [
  { icon: Home, title: "Residential Design", desc: "Creating warm, functional living spaces tailored to your lifestyle." },
  { icon: Building2, title: "Commercial Design", desc: "Elevating workspaces that inspire productivity and creativity." },
  { icon: Palette, title: "Furniture & Decor", desc: "Curating furniture and decor that bring your vision to life." },
  { icon: Ruler, title: "3D Visualization", desc: "Photorealistic renders to see your space before construction." },
];

const fallbackTestimonials = [
  { name: "Priya Sharma", role: "Homeowner, Mumbai", text: "SL Interiors transformed our apartment into a space we're truly proud of. The attention to detail is remarkable.", rating: 5 },
  { name: "Rajesh Kapoor", role: "CEO, TechStart", text: "Our new office designed by SL Interiors has completely changed how our team feels about coming to work.", rating: 5 },
  { name: "Ananya Desai", role: "Architect", text: "Working with SL Interiors was seamless. Their design sensibility is unmatched in the industry.", rating: 5 },
];

const iconMap: Record<string, any> = { Home, Building2, Palette, Ruler };

const Index = () => {
  // Dynamic state
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [introContent, setIntroContent] = useState<IntroContent | null>(null);
  const [ctaContent, setCTAContent] = useState<CTAContent | null>(null);
  const [dynamicProjects, setDynamicProjects] = useState<Project[]>([]);
  const [dynamicServices, setDynamicServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<any[]>(fallbackTestimonials);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", role: "", text: "", rating: 5 });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Fetch dynamic data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hero, intro, cta, projects, services, testimonials] = await Promise.allSettled([
          getHomepageSection('hero'),
          getHomepageSection('intro'),
          getHomepageSection('cta'),
          getFeaturedProjects(),
          getServices(),
          getTestimonials(true),
        ]);

        if (hero.status === 'fulfilled' && hero.value) setHeroContent(hero.value as HeroContent);
        if (intro.status === 'fulfilled' && intro.value) setIntroContent(intro.value as IntroContent);
        if (cta.status === 'fulfilled' && cta.value) setCTAContent(cta.value as CTAContent);
        if (projects.status === 'fulfilled' && projects.value.length > 0) setDynamicProjects(projects.value);
        if (services.status === 'fulfilled' && services.value.length > 0) setDynamicServices(services.value);
        if (testimonials.status === 'fulfilled' && testimonials.value.length > 0) {
          setReviews(testimonials.value.map((t: Testimonial) => ({ name: t.name, role: t.role, text: t.text, rating: t.rating })));
        }
      } catch {
        // Silently use fallbacks
      }
      setDataLoaded(true);
    };
    fetchData();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTestimonial({ ...reviewForm, is_approved: false, display_order: 0, photo_url: null });
    } catch {
      // If Supabase not connected, still add locally
    }
    setReviews([reviewForm, ...reviews]);
    setIsReviewModalOpen(false);
    setReviewForm({ name: "", role: "", text: "", rating: 5 });
    toast.success("Thank you for your review!");
  };

  // Display data (prefer dynamic, fallback to static)
  const displayHeroTitle = heroContent?.title || "Designing Spaces That Inspire";
  const displayHeroSubtitle = heroContent?.subtitle || "Premium interior design for homes and businesses that value elegance, comfort, and timeless aesthetics.";
  const displayHeroImage = heroContent?.hero_image_url || heroImage;
  const displayIntroHeading = introContent?.heading || "Where Vision Meets Craftsmanship";
  const displayIntroDesc = introContent?.description || "At SL Interiors, we believe every space tells a story. With over a decade of experience, we transform ordinary rooms into extraordinary environments that reflect your personality and elevate your everyday living. Our approach blends timeless elegance with modern functionality.";
  const displayCTAHeading = ctaContent?.heading || "Ready to Transform Your Space?";
  const displayCTADesc = ctaContent?.description || "Let's create something extraordinary together. Book your free consultation today.";
  const displayCTAText = ctaContent?.button_text || "Book a Consultation";

  // Projects: use dynamic if available
  const useDynamicProjects = dynamicProjects.length > 0;
  const projectGridClasses = ["md:col-span-2 md:row-span-2", "", "", "md:col-span-2", ""];

  // Services: use dynamic if available
  const useDbServices = dynamicServices.length > 0;

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        <motion.div style={{ y }} initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }} className="absolute inset-0">
          <img src={displayHeroImage} alt="Luxury living room interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/40 backdrop-grayscale-[0.2]" />
        </motion.div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container-luxury">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}>
              <div className="gold-line mb-8" />
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground leading-[1.1] max-w-3xl">{displayHeroTitle}</h1>
              <p className="mt-6 text-primary-foreground/70 text-lg md:text-xl max-w-lg font-light">{displayHeroSubtitle}</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/book" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 text-sm tracking-[0.15em] uppercase hover:bg-gold-light transition-colors duration-300">Book Consultation <ArrowRight className="w-4 h-4" /></Link>
                <Link to="/projects" className="inline-flex items-center gap-2 border border-primary-foreground/30 text-primary-foreground px-8 py-4 text-sm tracking-[0.15em] uppercase hover:bg-primary-foreground/10 transition-colors duration-300">View Projects</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section-padding">
        <div className="container-luxury">
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div><div className="gold-line mb-6" /><h2 className="text-4xl md:text-5xl leading-tight">{displayIntroHeading}</h2></div>
              <div><p className="text-muted-foreground leading-relaxed text-lg">{displayIntroDesc}</p><Link to="/about" className="inline-flex items-center gap-2 mt-8 text-accent text-sm tracking-[0.1em] uppercase hover:gap-3 transition-all duration-300">Learn More About Us <ArrowRight className="w-4 h-4" /></Link></div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-card">
        <div className="container-luxury">
          <AnimatedSection>
            <div className="text-center mb-16"><div className="gold-line mx-auto mb-6" /><h2 className="text-4xl md:text-5xl">Featured Projects</h2><p className="text-muted-foreground mt-4 max-w-md mx-auto">A curated selection of our finest interior transformations.</p></div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
            {useDynamicProjects
              ? dynamicProjects.slice(0, 5).map((project, i) => {
                  const img = project.project_images?.find((x) => x.is_primary) || project.project_images?.[0];
                  return (
                    <AnimatedSection key={project.id} delay={i * 0.1} className={projectGridClasses[i] || ""}>
                      <Link to="/projects" className="group relative block w-full h-full overflow-hidden">
                        {img && <img src={img.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                        <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/20 transition-all duration-700 m-4" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-accent mb-2 font-medium">Explore {project.category}</p>
                          <h3 className="font-display text-2xl text-primary-foreground leading-tight">{project.title}</h3>
                          <div className="w-0 group-hover:w-12 h-[1px] bg-accent mt-4 transition-all duration-700" />
                        </div>
                      </Link>
                    </AnimatedSection>
                  );
                })
              : fallbackProjects.map((project, i) => (
                  <AnimatedSection key={project.id} delay={i * 0.1} className={project.className}>
                    <Link to="/projects" className="group relative block w-full h-full overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                      <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/20 transition-all duration-700 m-4" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-accent mb-2 font-medium">Explore {project.category}</p>
                        <h3 className="font-display text-2xl text-primary-foreground leading-tight">{project.title}</h3>
                        <div className="w-0 group-hover:w-12 h-[1px] bg-accent mt-4 transition-all duration-700" />
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
          </div>
          <AnimatedSection className="text-center mt-12">
            <Link to="/projects" className="inline-flex items-center gap-2 border border-accent text-accent px-8 py-4 text-sm tracking-[0.15em] uppercase hover:bg-accent hover:text-accent-foreground transition-all duration-300">View All Projects <ArrowRight className="w-4 h-4" /></Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="container-luxury">
          <AnimatedSection><div className="text-center mb-16"><div className="gold-line mx-auto mb-6" /><h2 className="text-4xl md:text-5xl">Our Services</h2></div></AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useDbServices
              ? dynamicServices.slice(0, 4).map((service, i) => {
                  const IconComp = iconMap[service.icon_name] || Home;
                  return (
                    <AnimatedSection key={service.id} delay={i * 0.1}>
                      <div className="group p-8 bg-card border border-border hover:border-accent/30 transition-colors duration-500">
                        <IconComp className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} />
                        <h3 className="font-display text-xl mb-3">{service.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </AnimatedSection>
                  );
                })
              : fallbackServices.map((service, i) => (
                  <AnimatedSection key={service.title} delay={i * 0.1}>
                    <div className="group p-8 bg-card border border-border hover:border-accent/30 transition-colors duration-500">
                      <service.icon className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} />
                      <h3 className="font-display text-xl mb-3">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
                    </div>
                  </AnimatedSection>
                ))}
          </div>
          <AnimatedSection className="text-center mt-12"><Link to="/services" className="inline-flex items-center gap-2 text-accent text-sm tracking-[0.1em] uppercase hover:gap-3 transition-all duration-300">Explore All Services <ArrowRight className="w-4 h-4" /></Link></AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-luxury">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 text-center md:text-left">
              <div><div className="gold-line md:mx-0 mx-auto mb-6" /><h2 className="text-4xl md:text-5xl">What Our Clients Say</h2></div>
              <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
                <DialogTrigger asChild><button className="inline-flex items-center gap-2 border border-primary-foreground/30 px-6 py-3 text-sm tracking-[0.15em] uppercase hover:bg-primary-foreground/10 transition-colors duration-300"><Plus className="w-4 h-4" /> Write a Review</button></DialogTrigger>
                <DialogContent className="bg-background border-border sm:max-w-md">
                  <DialogHeader><DialogTitle className="font-display text-2xl text-foreground mb-4">Share Your Experience</DialogTitle></DialogHeader>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex gap-2 justify-center py-2">{[1, 2, 3, 4, 5].map((star) => (<button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="focus:outline-none transition-transform hover:scale-110"><Star className={`w-8 h-8 ${reviewForm.rating >= star ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} /></button>))}</div>
                    <input type="text" placeholder="Your Name" required value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent" />
                    <input type="text" placeholder="Your Role / Location" required value={reviewForm.role} onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent" />
                    <textarea placeholder="Your Review" rows={4} required value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent resize-none" />
                    <button type="submit" className="w-full bg-accent text-accent-foreground px-6 py-3 text-sm tracking-[0.15em] uppercase hover:bg-gold-light transition-colors">Post Review</button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.slice(0, 3).map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="p-8 border border-primary-foreground/10 h-full flex flex-col">
                  <div className="flex gap-1 mb-6">{[...Array(t.rating || 5)].map((_, j) => (<Star key={j} className="w-4 h-4 fill-accent text-accent" />))}</div>
                  <p className="text-primary-foreground/70 leading-relaxed mb-8 italic font-display text-lg">"{t.text}"</p>
                  <div className="mt-auto"><p className="font-medium text-sm">{t.name}</p><p className="text-primary-foreground/40 text-xs mt-1">{t.role}</p></div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-luxury text-center">
          <AnimatedSection>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl max-w-2xl mx-auto leading-tight">{displayCTAHeading}</h2>
            <p className="text-muted-foreground mt-6 max-w-md mx-auto text-lg">{displayCTADesc}</p>
            <Link to="/book" className="inline-flex items-center gap-2 mt-10 bg-accent text-accent-foreground px-10 py-4 text-sm tracking-[0.15em] uppercase hover:bg-gold-light transition-colors duration-300">{displayCTAText} <ArrowRight className="w-4 h-4" /></Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
