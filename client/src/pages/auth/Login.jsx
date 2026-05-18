import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Home, Mail, Lock, Loader2, Sparkles, ArrowRight, Briefcase, Globe, Award } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form.email, form.password);

      // FIX: Handle all three roles explicitly
      let dashboardPath = "/";
      if (res.user.role === "seeker") dashboardPath = "/seeker/dashboard";
      else if (res.user.role === "employer") dashboardPath = "/employer/dashboard";
      else if (res.user.role === "admin") dashboardPath = "/admin/dashboard";

      navigate(dashboardPath);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white relative">
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 hover:bg-white/20"
      >
        <Home className="w-4 h-4" />
        Home
      </button>

      {/* Left Panel - Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-800 relative overflow-hidden items-center justify-center p-12">
        {/* Subtle decorative orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        {/* Content */}
        <div className="relative z-10 max-w-sm text-white">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 text-sm text-white/70 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              Skills2Career Platform
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              Launch Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                Career
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Connect with top companies, discover internships, and build the future you deserve.
            </p>
          </div>

          {/* Stats / Trust */}
          <div className="space-y-4">
            <div className="group flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] cursor-default">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary-500/30">
                <Briefcase className="w-5 h-5 text-primary-400 transition-transform duration-300 group-hover:rotate-3" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm transition-colors duration-300 group-hover:text-primary-300">500+ Internships</p>
                <p className="text-white/50 text-xs">Posted by verified companies</p>
              </div>
            </div>
            <div className="group flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] cursor-default">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-500/30">
                <Globe className="w-5 h-5 text-purple-400 transition-transform duration-300 group-hover:rotate-3" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm transition-colors duration-300 group-hover:text-purple-300">Nationwide Reach</p>
                <p className="text-white/50 text-xs">Opportunities across Sri Lanka</p>
              </div>
            </div>
            <div className="group flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] cursor-default">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500/30">
                <Award className="w-5 h-5 text-emerald-400 transition-transform duration-300 group-hover:rotate-3" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm transition-colors duration-300 group-hover:text-emerald-300">AI-Powered Matching</p>
                <p className="text-white/50 text-xs">Smart recommendations for your profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile banner */}
      <div className="md:hidden bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-800 relative overflow-hidden px-6 pt-20 pb-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 text-sm text-white/70 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary-400" />
            Skills2Career
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Sign in to access your dashboard and continue your journey.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-0 bg-gradient-to-br from-gray-50 via-white to-gray-100/50 relative">
        {/* Decorative background blobs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-fade-up">
          {/* Desktop Header */}
          <div className="hidden md:block text-center space-y-3 mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 shadow-2xl p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-400">
                Do not have an account?{" "}
                <Link to="/role-select" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;