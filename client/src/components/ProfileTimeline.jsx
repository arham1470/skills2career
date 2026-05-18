import React from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, Zap, GraduationCap, Settings, Check, BadgeCheck, ArrowRight } from "lucide-react";

const steps = [
  { label: "Profile", icon: User, route: "/seeker/profile" },
  { label: "Resume", icon: FileText, route: "/seeker/resume" },
  { label: "Skills", icon: Zap, route: "/seeker/resume" },
  { label: "Experience", icon: GraduationCap, route: "/seeker/resume" },
  { label: "Preferences", icon: Settings, route: "/seeker/preferences" },
];

const getStepState = (index, completion) => {
  const stepSize = 100 / steps.length;
  if (completion >= (index + 1) * stepSize) return "completed";
  if (completion > index * stepSize) return "current";
  return "pending";
};

const ProfileTimeline = ({ completion = 0 }) => {
  const navigate = useNavigate();
  const isComplete = completion >= 100;
  const currentIndex = steps.findIndex((_, i) => getStepState(i, completion) === "current");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Profile Completion</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isComplete
                ? "Your profile is fully set up!"
                : "Complete your profile to get better internship matches."}
            </p>
          </div>
          <div className="w-20 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-500/25">
            {isComplete ? <BadgeCheck className="w-5 h-5" /> : `${completion}%`}
          </div>
        </div>
      </div>

      {/* Timeline — vertical on mobile, horizontal on sm+ */}
      <div className="px-6 py-6">

        {/* ── Mobile: vertical list ── */}
        <div className="flex flex-col sm:hidden">
          {steps.map((step, index) => {
            const state = getStepState(index, completion);
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={step.label} className="flex items-start gap-3 group cursor-pointer" onClick={() => navigate(step.route)}>
                {/* Left: circle + vertical connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 relative ${
                    state === "completed"
                      ? "bg-primary-600 text-white shadow-sm shadow-primary-500/30"
                      : state === "current"
                      ? "bg-white border-2 border-primary-500 text-primary-600 shadow-sm shadow-primary-500/20 scale-110"
                      : "bg-gray-100 border-2 border-gray-200 text-gray-400 group-hover:border-primary-300 group-hover:text-primary-500"
                  }`}>
                    {state === "completed" ? <Check className="w-4 h-4" strokeWidth={3} /> : <Icon className="w-3.5 h-3.5" />}
                    {state === "current" && <span className="absolute inset-0 rounded-full border-2 border-primary-400 animate-ping opacity-40" />}
                  </div>
                  {!isLast && (
                    <div className="w-0.5 my-1 flex-1 min-h-[20px] rounded-full overflow-hidden bg-gray-200">
                      <div className={`w-full transition-all duration-700 ease-out ${state === "completed" ? "bg-primary-400 h-full" : "h-0"}`} />
                    </div>
                  )}
                </div>
                {/* Right: label */}
                <p className={`pt-1.5 pb-5 text-sm font-medium transition-colors ${
                  state === "completed" ? "text-primary-700"
                  : state === "current" ? "text-primary-600 font-semibold"
                  : "text-gray-400 group-hover:text-gray-600"
                }`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Desktop: horizontal ── */}
        <div className="hidden sm:flex items-start justify-between">
          {steps.map((step, index) => {
            const state = getStepState(index, completion);
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.label}>
                <div
                  className="flex flex-col items-center gap-2 cursor-pointer group min-w-[64px] flex-shrink-0"
                  onClick={() => navigate(step.route)}
                >
                  <div className={`relative w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${
                    state === "completed"
                      ? "bg-primary-600 text-white shadow-md shadow-primary-500/30 group-hover:scale-110"
                      : state === "current"
                      ? "bg-white border-2 border-primary-500 text-primary-600 shadow-md shadow-primary-500/20 scale-110"
                      : "bg-gray-100 border-2 border-gray-200 text-gray-400 group-hover:border-primary-300 group-hover:text-primary-500"
                  }`}>
                    {state === "completed" ? <Check className="w-5 h-5" strokeWidth={3} /> : <Icon className="w-4 h-4" />}
                    {state === "current" && (
                      <span className="absolute inset-0 rounded-full border-2 border-primary-400 animate-ping opacity-40" />
                    )}
                  </div>
                  <span className={`text-xs font-medium text-center leading-tight transition-colors ${
                    state === "completed" ? "text-primary-700"
                    : state === "current" ? "text-primary-600 font-semibold"
                    : "text-gray-400 group-hover:text-gray-600"
                  }`}>
                    {step.label}
                  </span>
                </div>

                {!isLast && (
                  <div className="flex-1 h-0.5 mt-5 mx-2 relative min-w-[20px]">
                    <div className="absolute inset-0 bg-gray-200 rounded-full" />
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
                        state === "completed" ? "bg-primary-400" : "bg-gray-200"
                      }`}
                      style={{ width: state === "completed" ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>

      {/* Footer CTA */}
      {!isComplete && currentIndex >= 0 && (
        <div className="px-6 pb-6">
          <div className="bg-primary-50 rounded-xl p-4 flex items-center gap-3 border border-primary-100">
            <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Continue where you left off</p>
              <p className="text-xs text-gray-500 truncate">
                Complete <span className="font-medium text-primary-600">{steps[currentIndex].label}</span> to unlock recommendations.
              </p>
            </div>
            <button
              onClick={() => navigate(steps[currentIndex].route)}
              className="text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-primary-500/20 flex-shrink-0 inline-flex items-center gap-1"
            >
              Continue
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTimeline;
