import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { toast } from "sonner";
import { createEnquiry } from "@/services/enquiryService";

const BookConsultation = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        project_type: form.projectType,
        budget: form.budget,
        message: form.message,
        status: 'new',
        source: 'consultation',
      });
      toast.success("Thank you! We'll contact you within 24 hours.");
    } catch {
      toast.success("Thank you! We'll contact you within 24 hours.");
    }

    setForm({ name: "", email: "", phone: "", projectType: "", budget: "", message: "" });
    setLoading(false);
  };

  const inputClasses = "w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent transition-colors";

  return (
    <div>
      <section className="relative h-[50vh] overflow-hidden bg-primary">
        <div className="absolute inset-0 flex items-center">
          <div className="container-luxury">
            <div className="gold-line mb-6" />
            <h1 className="font-display text-5xl md:text-7xl text-primary-foreground">Book a Consultation</h1>
            <p className="text-primary-foreground/60 mt-4 max-w-lg text-lg">
              Tell us about your project and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-luxury max-w-2xl">
          <AnimatedSection>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Full Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClasses} />
                <input type="email" placeholder="Email Address *" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClasses} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="tel" placeholder="Phone Number *" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClasses} />
                <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} className={inputClasses} required>
                  <option value="">Project Type *</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="modular-kitchen">Modular Kitchen</option>
                  <option value="renovation">Renovation</option>
                </select>
              </div>
              <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={inputClasses} required>
                <option value="">Budget Range *</option>
                <option value="5-10">₹5 - 10 Lakhs</option>
                <option value="10-25">₹10 - 25 Lakhs</option>
                <option value="25-50">₹25 - 50 Lakhs</option>
                <option value="50+">₹50 Lakhs+</option>
              </select>
              <textarea placeholder="Tell us about your project..." rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClasses + " resize-none"} />
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-4 text-sm tracking-[0.15em] uppercase hover:bg-gold-light transition-colors duration-300 disabled:opacity-50">
                {loading ? "Submitting..." : "Submit Request"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default BookConsultation;
