import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Clock, Target } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import heroImage from "@/assets/hero-living-room.jpg";
import { getHomepageSection } from "@/services/homepageService";

const fallbackStats = [
  { number: "150+", label: "Projects Completed" },
  { number: "12+", label: "Years Experience" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "25+", label: "Design Awards" },
];

const fallbackTeam = [
  { name: "Sanjay Lakhani", role: "Founder & Lead Designer", bio: "With 15 years of experience in luxury interiors, Sanjay brings a unique blend of traditional craftsmanship and contemporary design." },
  { name: "Riya Mehta", role: "Senior Interior Architect", bio: "Riya specializes in creating functional, beautiful spaces that maximize every square foot." },
  { name: "Arjun Patel", role: "3D Visualization Lead", bio: "Arjun transforms concepts into photorealistic renders that help clients envision their dream spaces." },
];

const About = () => {
  const [story, setStory] = useState<any>(null);
  const [vision, setVision] = useState<any>(null);
  const [stats, setStats] = useState(fallbackStats);
  const [team, setTeam] = useState(fallbackTeam);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, v, st, t] = await Promise.allSettled([
          getHomepageSection('about_story'),
          getHomepageSection('vision_mission'),
          getHomepageSection('stats'),
          getHomepageSection('team'),
        ]);
        if (s.status === 'fulfilled' && s.value) setStory(s.value);
        if (v.status === 'fulfilled' && v.value) setVision(v.value);
        if (st.status === 'fulfilled' && st.value?.items) setStats(st.value.items);
        if (t.status === 'fulfilled' && t.value?.members) setTeam(t.value.members);
      } catch { /* fallback */ }
    };
    fetchData();
  }, []);

  return (
    <div>
      <section className="relative h-[60vh] overflow-hidden">
        <img src={heroImage} alt="Interior design studio" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/50" />
        <div className="absolute inset-0 flex items-center"><div className="container-luxury"><div className="gold-line mb-6" /><h1 className="font-display text-5xl md:text-7xl text-primary-foreground">About Us</h1></div></div>
      </section>

      <section className="section-padding">
        <div className="container-luxury"><AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div><div className="gold-line mb-6" /><h2 className="text-4xl md:text-5xl leading-tight">{story?.heading || "Our Story"}</h2></div>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              {(story?.paragraphs || [
                "Founded in 2012, SL Interiors began with a simple belief: that great design should be accessible without compromising on quality. What started as a small studio in Mumbai has grown into one of India's most sought-after interior design firms.",
                "Our approach is deeply personal. We listen first, design second. Every project begins with understanding our client's lifestyle, aspirations, and the emotions they want their space to evoke.",
              ]).map((p: string, i: number) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </AnimatedSection></div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-luxury"><div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <AnimatedSection><div className="p-10 border border-border"><Target className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} /><h3 className="font-display text-2xl mb-4">Our Vision</h3><p className="text-muted-foreground leading-relaxed">{vision?.vision || "To redefine the Indian interior design landscape by creating spaces that are timeless, sustainable, and deeply reflective of the people who inhabit them."}</p></div></AnimatedSection>
          <AnimatedSection delay={0.15}><div className="p-10 border border-border"><Award className="w-8 h-8 text-accent mb-6" strokeWidth={1.5} /><h3 className="font-display text-2xl mb-4">Our Mission</h3><p className="text-muted-foreground leading-relaxed">{vision?.mission || "To deliver exceptional interior design experiences through a client-first approach, innovative thinking, and an unwavering commitment to quality craftsmanship."}</p></div></AnimatedSection>
        </div></div>
      </section>

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-luxury"><div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat: any, i: number) => (<AnimatedSection key={stat.label} delay={i * 0.1} className="text-center"><p className="font-display text-4xl md:text-5xl text-accent">{stat.number}</p><p className="text-primary-foreground/50 text-sm mt-2 tracking-[0.1em] uppercase">{stat.label}</p></AnimatedSection>))}
        </div></div>
      </section>

      <section className="section-padding">
        <div className="container-luxury"><AnimatedSection><div className="text-center mb-16"><div className="gold-line mx-auto mb-6" /><h2 className="text-4xl md:text-5xl">Meet Our Team</h2></div></AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member: any, i: number) => (<AnimatedSection key={member.name} delay={i * 0.1}><div className="p-8 bg-card border border-border"><div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6"><Users className="w-7 h-7 text-accent" strokeWidth={1.5} /></div><h3 className="font-display text-xl">{member.name}</h3><p className="text-accent text-sm mt-1">{member.role}</p><p className="text-muted-foreground text-sm mt-4 leading-relaxed">{member.bio}</p></div></AnimatedSection>))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-card">
        <div className="container-luxury text-center"><AnimatedSection>
          <h2 className="text-4xl md:text-5xl max-w-xl mx-auto">Let's Work Together</h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">Ready to transform your space? We'd love to hear about your project.</p>
          <Link to="/book" className="inline-flex items-center gap-2 mt-8 bg-accent text-accent-foreground px-10 py-4 text-sm tracking-[0.15em] uppercase hover:bg-gold-light transition-colors duration-300">Start Your Project <ArrowRight className="w-4 h-4" /></Link>
        </AnimatedSection></div>
      </section>
    </div>
  );
};

export default About;
