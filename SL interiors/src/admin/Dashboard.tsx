import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Image,
  MessageSquare,
  Star,
  Wrench,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import StatsCard from './components/StatsCard';
import { supabase } from '@/lib/supabase';
import type { DashboardStats, Enquiry } from '@/lib/types';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_projects: 0,
    total_enquiries: 0,
    new_enquiries: 0,
    total_testimonials: 0,
    total_gallery_images: 0,
    total_services: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projects, enquiries, testimonials, gallery, services] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
      ]);

      const newEnquiries = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      const recent = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        total_projects: projects.count || 0,
        total_enquiries: enquiries.count || 0,
        new_enquiries: newEnquiries.count || 0,
        total_testimonials: testimonials.count || 0,
        total_gallery_images: gallery.count || 0,
        total_services: services.count || 0,
      });

      setRecentEnquiries(recent.data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { label: 'Add Project', path: '/admin/projects', icon: FolderKanban, color: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' },
    { label: 'Upload Images', path: '/admin/gallery', icon: Image, color: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' },
    { label: 'View Enquiries', path: '/admin/enquiries', icon: MessageSquare, color: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' },
    { label: 'Manage Services', path: '/admin/services', icon: Wrench, color: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-zinc-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Welcome to SL Interiors admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={stats.total_projects}
          icon={FolderKanban}
          color="blue"
        />
        <StatsCard
          title="New Enquiries"
          value={stats.new_enquiries}
          icon={MessageSquare}
          description={`${stats.total_enquiries} total`}
          color="green"
        />
        <StatsCard
          title="Testimonials"
          value={stats.total_testimonials}
          icon={Star}
          color="amber"
        />
        <StatsCard
          title="Gallery Images"
          value={stats.total_gallery_images}
          icon={Image}
          color="purple"
        />
      </div>

      {/* Quick Actions + Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${link.color}`}
                >
                  <link.icon className="w-4 h-4" />
                  <span className="flex-1">{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Recent Enquiries
              </h2>
              <Link to="/admin/enquiries" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                View All →
              </Link>
            </div>

            {recentEnquiries.length === 0 ? (
              <p className="text-sm text-zinc-500 py-8 text-center">No enquiries yet</p>
            ) : (
              <div className="space-y-3">
                {recentEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-amber-400 text-xs font-semibold shrink-0">
                      {enq.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{enq.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{enq.message || enq.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                        enq.status === 'new'
                          ? 'bg-blue-500/15 text-blue-400'
                          : enq.status === 'contacted'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-emerald-500/15 text-emerald-400'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          enq.status === 'new' ? 'bg-blue-400' : enq.status === 'contacted' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        {enq.status}
                      </span>
                      <p className="text-[10px] text-zinc-600 mt-1">{formatDate(enq.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
