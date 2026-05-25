import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ShieldCheck, Rocket, Check, ArrowRight, Clock, Zap, BadgeCheck } from "lucide-react";

const steps = [
  { label: "Complete Profile", icon: Building2, route: "/employer/profile" },
  { label: "Verification", icon: ShieldCheck, route: null },
  { label: "Ready to Post", icon: Rocket, route: "/employer/post" },
];

const getStepStates = (profileCompletion, verified) => {
  return steps.map((_, i) => {
    if (i === 0) {
      return profileCompletion >= 100 ? "completed" : "current";
    }
    if (i === 1) {
      if (verified) return "completed";
      return profileCompletion >= 100 ? "current" : "pending";
    }
    if (i === 2) {
      if (profileCompletion >= 100 && verified) return "completed";
      return "pending";
    }
    return "pending";
  });
};

const getSubtext = (index, state, profileCompletion) => {
  if (index === 0) {
    return state === "completed" ? "Profile complete" : `${profileCompletion}% complete`;
  }
  if (index === 1) {
    if (state === "completed") return "Verified by admin";
    if (state === "current") return "Awaiting review";
    return "Requires profile";
  }
  if (index === 2) {
    if (state === "completed") return "You're all set!";
    return "Post internships";
  }
  return "";
};

const EmployerOnboardingTimeline = ({ profileCompletion = 0, verified = false }) => {
  const navigate = useNavigate();
  const states = getStepStates(profileCompletion, verified);
  const allDone = states.every((s) => s === "completed");
  const currentIndex = states.indexOf("current");

  if (allDone) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Getting Started</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {allDone
                ? "Your account is fully set up and ready to go!"
                : "Complete these steps to start posting internships."}
            </p>
          </div>
          <div className={`px-3 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
            allDone
              ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25"
              : "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-500/25"
          }`}>
            {allDone ? <BadgeCheck className="w-5 h-5" /> : `${states.filter((s) => s === "completed").length}/${steps.length}`}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 py-6">

        {/* Mobile: vertical */}
        <div className="flex flex-col sm:hidden">
          {steps.map((step, index) => {
            const state = states[index];
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            const clickable = step.route && state !== "pending";

            return (
              <div
                key={step.label}
                className={`flex items-start gap-3 ${clickable ? "cursor-pointer group" : ""}`}
                onClick={() => clickable && navigate(step.route)}
              >
                {/* Circle + connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 relative ${
                    state === "completed"
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30"
                      : state === "current"
                      ? "bg-white border-2 border-primary-500 text-primary-600 shadow-sm shadow-primary-500/20 scale-110"
                      : "bg-gray-100 border-2 border-gray-200 text-gray-400"
                  }`}>
                    {state === "completed" ? <Check className="w-4 h-4" strokeWidth={3} /> : <Icon className="w-3.5 h-3.5" />}
                    {state === "current" && <span className="absolute inset-0 rounded-full border-2 border-primary-400 animate-ping opacity-40" />}
                  </div>
                  {!isLast && (
                    <div className="w-0.5 my-1 flex-1 min-h-[20px] rounded-full overflow-hidden bg-gray-200">
                      <div className={`w-full transition-all duration-700 ease-out ${state === "completed" ? "bg-emerald-400 h-full" : "h-0"}`} />
                    </div>
                  )}
                </div>

                {/* Label + subtext */}
                <div className="pt-1 pb-5">
                  <p className={`text-sm font-medium transition-colors ${
                    state === "completed" ? "text-emerald-700"
                    : state === "current" ? "text-primary-600 font-semibold"
                    : "text-gray-400"
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {getSubtext(index, state, profileCompletion)}
                  </p>
                  {/* Mini progress bar for profile step */}
                  {index === 0 && state === "current" && (
                    <div className="mt-2 w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden sm:flex items-start justify-between">
          {steps.map((step, index) => {
            const state = states[index];
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            const clickable = step.route && state !== "pending";

            return (
              <React.Fragment key={step.label}>
                <div
                  className={`flex flex-col items-center gap-2 min-w-[80px] flex-shrink-0 ${clickable ? "cursor-pointer group" : ""}`}
                  onClick={() => clickable && navigate(step.route)}
                >
                  <div className={`relative w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${
                    state === "completed"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30 group-hover:scale-110"
                      : state === "current"
                      ? "bg-white border-2 border-primary-500 text-primary-600 shadow-md shadow-primary-500/20 scale-110"
                      : "bg-gray-100 border-2 border-gray-200 text-gray-400"
                  }`}>
                    {state === "completed" ? <Check className="w-5 h-5" strokeWidth={3} /> : <Icon className="w-4 h-4" />}
                    {state === "current" && (
                      <span className="absolute inset-0 rounded-full border-2 border-primary-400 animate-ping opacity-40" />
                    )}
                  </div>
                  <span className={`text-xs font-medium text-center leading-tight transition-colors ${
                    state === "completed" ? "text-emerald-700"
                    : state === "current" ? "text-primary-600 font-semibold"
                    : "text-gray-400"
                  }`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-gray-400 text-center leading-tight">
                    {getSubtext(index, state, profileCompletion)}
                  </span>
                  {/* Mini progress bar for profile step */}
                  {index === 0 && state === "current" && (
                    <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                  )}
                </div>

                {!isLast && (
                  <div className="flex-1 h-0.5 mt-5 mx-2 relative min-w-[20px]">
                    <div className="absolute inset-0 bg-gray-200 rounded-full" />
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
                        state === "completed" ? "bg-emerald-400" : "bg-gray-200"
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
      {!allDone && (
        <div className="px-6 pb-6">
          {currentIndex === 0 && (
            <div className="bg-primary-50 rounded-xl p-4 flex items-center gap-3 border border-primary-100">
              <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">Complete your company profile</p>
                <p className="text-xs text-gray-500 truncate">
                  Fill in all details to submit for verification.
                </p>
              </div>
              <button
                onClick={() => navigate("/employer/profile")}
                className="text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-primary-500/20 flex-shrink-0 inline-flex items-center gap-1"
              >
                Complete
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {currentIndex === 1 && (
            <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-3 border border-amber-100">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">Verification in progress</p>
                <p className="text-xs text-gray-500 truncate">
                  Our team is reviewing your company profile. This usually takes 1–2 business days.
                </p>
              </div>
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg flex-shrink-0 inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pending
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployerOnboardingTimeline;
