import React, { useState } from "react";
import {
  Loader2, X, CheckCircle, AlertCircle, Building2, MapPin, Clock,
  BadgeDollarSign, Zap, Target, Sparkles, Send, Briefcase
} from "lucide-react";
import api from "../../utils/api";
import Button from "./Button";

const getMatchColor = (match) => {
  if (match >= 75) return { bg: "bg-emerald-500", text: "text-emerald-700", light: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-500" };
  if (match >= 50) return { bg: "bg-amber-500", text: "text-amber-700", light: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-500" };
  return { bg: "bg-red-500", text: "text-red-700", light: "bg-red-50", border: "border-red-200", bar: "bg-red-500" };
};

const MatchRing = ({ match }) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (match / 100) * circumference;
  const colors = getMatchColor(match);

  return (
    <div className="relative flex items-center justify-center">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={radius} stroke="#e5e7eb" strokeWidth="5" fill="none" />
        <circle
          cx="32" cy="32" r={radius}
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colors.text} transition-all duration-1000 ease-out`}
        />
      </svg>
      <span className={`absolute text-sm font-bold ${colors.text}`}>{match}%</span>
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, children, className = "" }) => (
  <div className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm ${className}`}>
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h4>
    </div>
    {children}
  </div>
);

const ApplyModal = ({ isOpen, onClose, internship }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  if (!isOpen || !internship) return null;

  const handleApply = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await api.post("/applications", { internshipId: internship._id });
      setMessage({ type: "success", text: "Application submitted successfully!" });
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to apply" });
    } finally {
      setLoading(false);
    }
  };

  const match = internship.matchPercentage ?? 0;
  const colors = getMatchColor(match);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-hidden flex flex-col animate-fade-up">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold leading-tight truncate">{internship.title}</h3>
              <p className="text-primary-100 text-sm mt-0.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> {internship.company}
              </p>
            </div>
          </div>

          {/* Match Ring */}
          <div className="absolute bottom-0 right-6 translate-y-1/2">
            <div className={`${colors.light} border ${colors.border} rounded-full p-1 shadow-lg`}>
              <MatchRing match={match} />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 pt-10 space-y-4">
          {/* Quick Info Chips */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm border border-gray-100">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> {internship.location}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm border border-gray-100">
              <Clock className="w-3.5 h-3.5 text-gray-400" /> {internship.mode}
            </span>
            {(internship.salaryMin || internship.salaryMax) && (
              <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm border border-gray-100">
                <BadgeDollarSign className="w-3.5 h-3.5 text-gray-400" />
                LKR {internship.salaryMin?.toLocaleString() || 0} - {internship.salaryMax?.toLocaleString() || 0}
              </span>
            )}
          </div>

          {/* Description */}
          {internship.description && (
            <SectionCard icon={Sparkles} title="About the Role">
              <p className="text-sm text-gray-600 leading-relaxed text-justify">{internship.description}</p>
            </SectionCard>
          )}

          {/* Skills */}
          <SectionCard icon={Zap} title="Required Skills">
            <div className="space-y-3">
              {(internship.coreSkills || []).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <Target className="w-3 h-3" /> Core — must have
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {internship.coreSkills.map(skill => (
                      <span key={skill} className="text-xs font-semibold bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(internship.additionalSkills || []).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Additional — nice to have
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {internship.additionalSkills.map(skill => (
                      <span key={skill} className="text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(internship.coreSkills || []).length === 0 && (internship.additionalSkills || []).length === 0 && (
                <p className="text-sm text-gray-400 italic">No specific skills listed for this role.</p>
              )}
            </div>
          </SectionCard>

          {/* Match Score Bar */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Your Match Score</span>
              <span className={`text-sm font-bold ${colors.text}`}>{match}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full ${colors.bar} transition-all duration-1000 ease-out`}
                style={{ width: `${match}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {match >= 75
                ? "Great fit! Your core skills align well with this role."
                : match >= 50
                ? "Decent match. Consider highlighting relevant experience in your profile."
                : "Low match. You may want to build more relevant skills before applying."}
            </p>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              {message.text}
            </div>
          )}

          {/* Info Note */}
          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3.5">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Your Resume and full profile will be shared with the employer. Make sure your profile is complete and up to date before applying.
            </p>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 p-5 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1 py-2.5">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleApply}
              disabled={loading}
              className="flex-1 py-2.5 gap-2 shadow-lg shadow-primary-500/25"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Apply Now
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;