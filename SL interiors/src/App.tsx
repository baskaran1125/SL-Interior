import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import BookConsultation from "./pages/BookConsultation";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ProjectsAdmin from "./admin/ProjectsAdmin";
import GalleryAdmin from "./admin/GalleryAdmin";
import ServicesAdmin from "./admin/ServicesAdmin";
import TestimonialsAdmin from "./admin/TestimonialsAdmin";
import EnquiriesAdmin from "./admin/EnquiriesAdmin";
import HomepageAdmin from "./admin/HomepageAdmin";
import QuotationsAdmin from "./admin/QuotationsAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Client Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/book" element={<BookConsultation />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/projects" element={<AdminLayout><ProjectsAdmin /></AdminLayout>} />
            <Route path="/admin/gallery" element={<AdminLayout><GalleryAdmin /></AdminLayout>} />
            <Route path="/admin/services" element={<AdminLayout><ServicesAdmin /></AdminLayout>} />
            <Route path="/admin/testimonials" element={<AdminLayout><TestimonialsAdmin /></AdminLayout>} />
            <Route path="/admin/enquiries" element={<AdminLayout><EnquiriesAdmin /></AdminLayout>} />
            <Route path="/admin/homepage" element={<AdminLayout><HomepageAdmin /></AdminLayout>} />
            <Route path="/admin/quotations" element={<AdminLayout><QuotationsAdmin /></AdminLayout>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
