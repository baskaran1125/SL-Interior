import { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { toast } from "sonner";
import { createEnquiry } from "@/services/enquiryService";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Save to Supabase
    try {
      await createEnquiry({
        name: form.name,
        email: form.email,
        phone: '',
        project_type: '',
        budget: '',
        message: form.message,
        status: 'new',
        source: 'contact',
      });
      toast.success("Message sent! We'll get back to you soon.");
    } catch {
      // Fallback to WhatsApp if Supabase fails
      const text = `Hi, I have an enquiry from the website.\n\nName: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`;
      const whatsappUrl = `https://wa.me/919043140047?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, "_blank");
      toast.success("Redirecting to WhatsApp...");
    }

    setForm({ name: "", email: "", message: "" });
    setLoading(false);
  };

  const inputClasses = "w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors";

  return (
    <div>
      <section className="relative h-[50vh] overflow-hidden bg-primary">
        <div className="absolute inset-0 flex items-center">
          <div className="container-luxury">
            <div className="gold-line mb-6" />
            <h1 className="font-display text-5xl md:text-7xl text-primary-foreground">Contact Us</h1>
            <p className="text-primary-foreground/60 mt-4 max-w-lg text-lg">
              We'd love to hear from you. Reach out to start a conversation.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <AnimatedSection>
              <div className="space-y-10">
                <div>
                  <div className="gold-line mb-6" />
                  <h2 className="text-3xl md:text-4xl mb-4">Get in Touch</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Whether you have a question, want to discuss a project, or simply say hello — our team is here for you.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-accent mt-1" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium">+91 9043140047 | +91 9444291009</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-accent mt-1" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium">slinterior07@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-accent mt-1" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Studio</p>
                      <p className="font-medium">21, MGR ST, M.G NAGAR, THARAMANI, CH-113</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Instagram</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Pinterest</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">LinkedIn</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Facebook</a>
                </div>
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection delay={0.2}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" placeholder="Your Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClasses} />
                <input type="email" placeholder="Email Address *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClasses} />
                <textarea placeholder="Your Message *" rows={6} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClasses + " resize-none"} />
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 text-sm tracking-[0.15em] uppercase hover:bg-gold-light transition-colors duration-300 disabled:opacity-50">
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[400px] bg-muted">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.2!2d72.83!3d19.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzM2LjAiTiA3MsKwNDknNDguMCJF!5e0!3m2!1sen!2sin!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="SL Interiors Location"
        />
      </section>
    </div>
  );
};

export default Contact;
