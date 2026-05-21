import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
