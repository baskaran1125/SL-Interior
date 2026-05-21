import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { getProjects, getProjectCategories } from "@/services/projectService";
import type { Project } from "@/lib/types";
import { Loader2 } from "lucide-react";

// Fallback assets
import projectKitchen from "@/assets/project-kitchen.jpg";
import projectBedroom from "@/assets/project-bedroom.jpg";
import projectOffice from "@/assets/project-office.jpg";
import projectLiving2 from "@/assets/project-living2.jpg";
import projectBathroom from "@/assets/project-bathroom.jpg";
import heroImage from "@/assets/hero-living-room.jpg";

const fallbackProjects = [
  { id: "1", title: "The Serene Villa", category: "Living Room", image: projectLiving2, desc: "A contemporary living room blending warmth and sophistication with natural materials and curated art." },
  { id: "2", title: "Marble Kitchen Suite", category: "Kitchen", image: projectKitchen, desc: "A chef's dream kitchen featuring Italian marble countertops and integrated smart appliances." },
  { id: "3", title: "Zen Bedroom Retreat", category: "Bedroom", image: projectBedroom, desc: "A tranquil bedroom sanctuary with natural wood, soft textiles, and ambient lighting." },
  { id: "4", title: "Executive Office", category: "Office", image: projectOffice, desc: "A premium workspace designed for focus and productivity with elegant furnishings." },
  { id: "5", title: "Luxury Spa Bathroom", category: "Bathroom", image: projectBathroom, desc: "A hotel-inspired bathroom with marble walls, freestanding tub, and gold fixtures." },
  { id: "6", title: "Grand Living Room", category: "Living Room", image: heroImage, desc: "A double-height living space with floor-to-ceiling windows and bespoke furniture." },
];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDb, setUseDb] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projects, cats] = await Promise.all([getProjects(), getProjectCategories()]);
        if (projects.length > 0) { setDbProjects(projects); setCategories(cats); setUseDb(true); }
      } catch { /* use fallbacks */ }
      setLoading(false);
    };
    fetchData();
  }, []);

  const allCategories = useDb ? ["All", ...categories] : ["All", "Living Room", "Kitchen", "Bedroom", "Office", "Bathroom"];

  const getFilteredProjects = () => {
    if (useDb) {
      if (activeCategory === "All") return dbProjects;
      return dbProjects.filter((p) => p.category === activeCategory);
    }
    if (activeCategory === "All") return fallbackProjects;
    return fallbackProjects.filter((p) => p.category === activeCategory);
  };

  const filtered = getFilteredProjects();

  const getProjectImage = (project: any) => {
    if (useDb) {
      const img = project.project_images?.find((i: any) => i.is_primary) || project.project_images?.[0];
      return img?.image_url || '';
    }
    return project.image;
  };

  const getProjectDesc = (project: any) => useDb ? project.description : project.desc;

  return (
    <div>
      <section className="relative h-[50vh] overflow-hidden bg-primary">
        <div className="absolute inset-0 flex items-center">
          <div className="container-luxury">
            <div className="gold-line mb-6" />
            <h1 className="font-display text-5xl md:text-7xl text-primary-foreground">Our Projects</h1>
            <p className="text-primary-foreground/60 mt-4 max-w-lg text-lg">Explore our portfolio of thoughtfully designed interiors.</p>
          </div>
        </div>
      </section>

      <section className="py-10 border-b border-border">
        <div className="container-luxury">
          <div className="flex flex-wrap gap-4 justify-center">
            {allCategories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-sm tracking-[0.1em] uppercase px-5 py-2 transition-all duration-300 ${activeCategory === cat ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground border border-border"}`}>{cat}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-luxury">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-accent animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project: any, i: number) => (
                <AnimatedSection key={project.id} delay={i * 0.1}>
                  <button onClick={() => setSelectedProject(project)} className="group relative w-full aspect-[4/3] overflow-hidden text-left">
                    <img src={getProjectImage(project)} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-xs tracking-[0.15em] uppercase text-accent">{project.category}</p>
                      <h3 className="font-display text-xl text-primary-foreground mt-1">{project.title}</h3>
                    </div>
                  </button>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
          <div className="bg-card max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <img src={getProjectImage(selectedProject)} alt={selectedProject.title} className="w-full h-[400px] object-cover" />
            <div className="p-8 md:p-12">
              <p className="text-xs tracking-[0.15em] uppercase text-accent">{selectedProject.category}</p>
              <h2 className="font-display text-3xl md:text-4xl mt-2">{selectedProject.title}</h2>
              {selectedProject.location && <p className="text-muted-foreground text-sm mt-2">{selectedProject.location}</p>}
              <p className="text-muted-foreground mt-6 leading-relaxed">{getProjectDesc(selectedProject)}</p>
              {/* Show all project images if available */}
              {useDb && selectedProject.project_images?.length > 1 && (
                <div className="grid grid-cols-3 gap-2 mt-6">
                  {selectedProject.project_images.map((img: any) => (
                    <img key={img.id} src={img.image_url} alt={img.alt_text} className="w-full aspect-square object-cover" loading="lazy" />
                  ))}
                </div>
              )}
              <button onClick={() => setSelectedProject(null)} className="mt-8 border border-border px-6 py-3 text-sm tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
