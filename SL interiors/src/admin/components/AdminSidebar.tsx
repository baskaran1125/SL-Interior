import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Image,
  Home,
  MessageSquare,
  Star,
  Wrench,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  FileText,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { label: 'Gallery', path: '/admin/gallery', icon: Image },
  { label: 'Services', path: '/admin/services', icon: Wrench },
  { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
  { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  { label: 'Quotations', path: '/admin/quotations', icon: FileText },
  { label: 'Homepage', path: '/admin/homepage', icon: Home },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 overflow-hidden">
            <img src="/favicon.png" alt="SL Interior" className="w-full h-full object-contain scale-110" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-semibold text-white tracking-wider">SL INTERIORS</h2>
              <p className="text-[11px] text-zinc-400">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
              isActive(item.path)
                ? 'bg-amber-500/15 text-amber-400'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive(item.path) ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} strokeWidth={1.8} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 mb-1"
        >
          <ChevronLeft className="w-[18px] h-[18px] shrink-0" strokeWidth={1.8} />
          {!collapsed && <span>View Website</span>}
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.8} />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white shadow-lg"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-zinc-950 border-r border-white/[0.06] z-40 transition-all duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-[68px]' : 'w-64'}`}
      >
        {sidebarContent}
      </aside>

      {/* Collapse Toggle (desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex fixed z-50 items-center justify-center w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors"
        style={{ left: collapsed ? 55 : 248, top: 28 }}
      >
        <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </>
  );
};

export default AdminSidebar;
