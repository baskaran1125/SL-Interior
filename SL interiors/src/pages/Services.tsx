import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Home, Building2, Palette, Ruler, ChefHat, Sofa, Paintbrush, Lamp, Bath, Bed, Loader2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { getServices } from "@/services/serviceService";
import type { Service } from "@/lib/types";

import projectKitchen from "@/assets/project-kitchen.jpg";
import projectBedroom from "@/assets/project-bedroom.jpg";
import projectOffice from "@/assets/project-office.jpg";
import projectLiving2 from "@/assets/project-living2.jpg";
import projectBathroom from "@/assets/project-bathroom.jpg";

const iconMap: Record<string, any> = { Home, Building2, Palette, Ruler, ChefHat, Sofa, Paintbrush, Lamp, Bath, Bed };
const fallbackImages = [projectLiving2, projectOffice, projectKitchen, projectBedroom, projectBathroom];

const fallbackServices = [
  { icon: Home, title: "Residential Interior Design", desc: "We create personalized living spaces that reflect your lifestyle and preferences.", benefits: ["Custom floor plans", "Material & finish selection", "Lighting design", "Color consultation"], image: projectLiving2 },
  { icon: Building2, title: "Commercial Interior Design", desc: "Transform your workplace into a space that inspires.", benefits: ["Space optimization", "Brand-aligned design", "Ergonomic solutions", "Acoustic planning"], image: projectOffice },
  { icon: ChefHat, title: "Modular Kitchen Design", desc: "Functional, beautiful kitchens designed for the way you cook and live.", benefits: ["Modular cabinetry", "Countertop selection", "Appliance integration", "Storage solutions"], image: projectKitchen },
  { icon: Sofa, title: "Furniture & Decor Planning", desc: "Curated furniture and decor selections that bring cohesion and personality.", benefits: ["Custom furniture design", "Art & accessory sourcing", "Upholstery selection", "Styling services"], image: projectBedroom },
  { icon: Ruler, title: "3D Interior Visualization", desc: "See your space before it's built with photorealistic 3D renders.", benefits: ["Photorealistic renders", "Virtual walkthroughs", "Material previews", "Design iterations"], image: projectBathroom },
];

const Services = () => {
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDb, setUseDb] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServices();
        if (data.length > 0) { setDbServices(data); setUseDb(true); }
      } catch { /* fallback */ }
      setLoading(false);
    };
    fetchData();
  }, []);

  const displayServices = useDb
    ? dbServices.map((s, i) => ({ ...s, icon: iconMap[s.icon_name] || Home, image: s.image_url || fallbackImages[i % fallbackImages.length], benefits: s.benefits || [] }))
    : fallbackServices;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>;

  return (
    <div>
      <section className="relative h-[50vh] overflow-hidden bg-primary">
        <div className="absolute inset-0 flex items-center"><div className="container-luxury"><div className="gold-line mb-6" /><h1 className="font-display text-5xl md:text-7xl text-primary-foreground">Our Services</h1><p className="text-primary-foreground/60 mt-4 max-w-lg text-lg">Comprehensive interior design solutions tailored to your unique vision.</p></div></div>
      </section>

      {displayServices.map((service: any, i: number) => (
        <section key={service.title} className={`section-padding ${i % 2 === 0 ? "bg-background" : "bg-card"}`}>
          <div className="container-luxury"><AnimatedSection>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}>
              <div className={i % 2 === 1 ? "lg:order-2" : ""}><div className="overflow-hidden"><img src={service.image || service.image_url} alt={service.title} className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700" loading="lazy" /></div></div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <service.icon className="w-10 h-10 text-accent mb-6" strokeWidth={1.5} />
                <h2 className="text-3xl md:text-4xl mb-4">{service.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{service.description || service.desc}</p>
                <ul className="space-y-3">{(service.benefits || []).map((b: string) => (<li key={b} className="flex items-center gap-3 text-sm text-muted-foreground"><div className="w-1.5 h-1.5 bg-accent rounded-full" />{b}</li>))}</ul>
                <Link to="/book" className="inline-flex items-center gap-2 mt-8 text-accent text-sm tracking-[0.1em] uppercase hover:gap-3 transition-all duration-300">Get Started <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </AnimatedSection></div>
        </section>
      ))}
    </div>
  );
};

export default Services;
