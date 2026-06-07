import { useState, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Home, Mail, Lock, KeyRound, Sparkles, UserPlus, ArrowRight, Briefcase, Globe, Award, FileText, CheckCircle } from "lucide-react";

const Register = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "seeker";
  const navigate = useNavigate();
  const { register, verifyRegistration } = useAuth();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSeeker = role === "seeker";
  const roleAccent = isSeeker ? "text-blue-600" : "text-emerald-600";
  const roleBg = isSeeker ? "bg-blue-50" : "bg-emerald-50";
  const roleBorder = isSeeker ? "border-blue-200" : "border-emerald-200";
  const roleGradient = isSeeker
    ? "from-blue-500 to-indigo-600"
    : "from-emerald-500 to-teal-600";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await register(form.email, form.password, role);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const otpString = otp.join("");
      await verifyRegistration(form.email, otpString);
      setStep(3);
      setTimeout(() => {
        navigate(role === "seeker" ? "/seeker/dashboard" : "/employer/dashboard");
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
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
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">500+ Internships</p>
                <p className="text-white/50 text-xs">Posted by verified companies</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Nationwide Reach</p>
                <p className="text-white/50 text-xs">Opportunities across Sri Lanka</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI-Powered Matching</p>
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
            Get Started
          </h1>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            Create your account and start your journey.
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
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {step === 1 ? "Create Account" : step === 2 ? "Verify Email" : "Welcome!"}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-500 text-sm">
                Registering as a{" "}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-semibold capitalize px-2.5 py-0.5 rounded-full border ${roleAccent} ${roleBg} ${roleBorder}`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                {role}
              </span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 shadow-2xl p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                {error}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
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
                      placeholder="Min. 6 characters"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Confirm Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                      placeholder="Repeat your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-r ${roleGradient} disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {loading ? (
                    <FileText className="w-5 h-5 animate-pulse" />
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyRegistration} className="space-y-5 animate-fade-in">
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm">We've sent a 6-digit verification code to <strong>{form.email}</strong>.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-4 text-center">Enter 6-Digit OTP</label>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-white/60 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-gray-900"
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-r ${roleGradient} disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {loading ? (
                    <FileText className="w-5 h-5 animate-pulse" />
                  ) : (
                    <>
                      Verify Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center flex flex-col items-center animate-fade-in py-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2">Account Created Successfully!</h3>
                <p className="text-gray-600 text-sm mb-6">Welcome to CareerBridge. You are being redirected to your dashboard...</p>
                <div className="mt-4 flex gap-1 justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="text-center pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;