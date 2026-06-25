import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, ArrowRight, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, verifyOTP, resetPassword } = useAuth();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setSuccess(res.message);
      setStep(2);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const otpString = otp.join("");
      const res = await verifyOTP(email, otpString);
      setSuccess(res.message);
      setStep(3);
      setTimeout(() => setSuccess(""), 5000);
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
    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setError("Passwords do not match");
    }
    if (passwords.newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    
    setError("");
    setLoading(true);
    try {
      const otpString = otp.join("");
      const res = await resetPassword(email, otpString, passwords.newPassword);
      setSuccess(res.message);
      setStep(4); // Success step
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100/50 relative px-4 sm:px-6 lg:px-8">
      {/* Decorative backgrounds */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-up">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/80 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-primary-300/12"></div>
            <div className="relative z-10 flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                {step === 4 ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : (
                  <KeyRound className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white relative z-10">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Enter OTP"}
              {step === 3 && "Reset Password"}
              {step === 4 && "Password Reset"}
            </h2>
            <p className="text-primary-100 mt-2 text-sm relative z-10">
              {step === 1 && "Enter your email to receive a reset link."}
              {step === 2 && "We sent a 6-digit code to your email."}
              {step === 3 && "Create a new, strong password."}
              {step === 4 && "You can now log in with your new password."}
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                {error}
              </div>
            )}
            
            {success && step !== 4 && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                {success}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-gray-900"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg shadow-primary-500/30 bg-primary-600 hover:bg-primary-700 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send OTP"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
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
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-gray-900"
                      />
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg shadow-primary-500/30 bg-primary-600 hover:bg-primary-700 disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={handleSendOTP} 
                    disabled={loading}
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-gray-900"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-gray-900"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !passwords.newPassword || !passwords.confirmPassword}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg shadow-primary-500/30 bg-primary-600 hover:bg-primary-700 disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                  {!loading && <CheckCircle2 className="w-5 h-5" />}
                </button>
              </form>
            )}

            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="text-emerald-600 bg-emerald-50 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-gray-600">{success}</p>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all shadow-lg shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-700"
                >
                  Back to Login
                </Link>
              </div>
            )}
            
            {step < 4 && (
              <div className="mt-8 text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
