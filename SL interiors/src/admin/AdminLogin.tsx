import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await signIn(email, password);
    if (authError) {
      setError(authError.message || 'Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white text-2xl font-bold mb-6 shadow-lg shadow-amber-500/20">
            SL
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">SL INTERIORS</h1>
          <p className="text-zinc-500 text-sm mt-2">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-1">Welcome back</h2>
          <p className="text-sm text-zinc-500 mb-8">Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@slinteriors.com"
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg pl-10 pr-12 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg text-sm font-medium tracking-wide hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Protected admin area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
