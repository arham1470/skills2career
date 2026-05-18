import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Building2, ArrowRight, Sparkles, Home } from "lucide-react";

const RoleSelect = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: "seeker",
      title: "I am a Seeker",
      subtitle: "Looking for an internship",
      description: "Discover opportunities, build your resume, and connect with top companies hiring interns.",
      Icon: GraduationCap,
      iconBg: "bg-blue-100 text-blue-600",
      borderColor: "border-blue-200",
      hoverBorder: "hover:border-blue-400",
      gradient: "from-blue-50/80 via-white to-indigo-50/60",
      shadow: "hover:shadow-blue-100",
      accent: "text-blue-600",
    },
    {
      id: "employer",
      title: "I am an Employer",
      subtitle: "Looking to hire talent",
      description: "Post internships, review applications, and hire skilled students for your team.",
      Icon: Building2,
      iconBg: "bg-emerald-100 text-emerald-600",
      borderColor: "border-emerald-200",
      hoverBorder: "hover:border-emerald-400",
      gradient: "from-emerald-50/80 via-white to-teal-50/60",
      shadow: "hover:shadow-emerald-100",
      accent: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-start sm:items-center justify-center px-3 sm:px-4 py-6 sm:py-8 md:py-12">
      <div className="max-w-4xl w-full">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-2 shadow-sm hover:shadow-md mb-4 sm:mb-6"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary-500" />
            Welcome to Skills2Career
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Choose Your Path
          </h1>
          <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-lg mx-auto leading-relaxed px-2 sm:px-0">
            Select how you want to get started. Build your career or find the right talent for your team.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => navigate(`/register?role=${role.id}`)}
              className={`group relative p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl border-2 ${role.borderColor} ${role.hoverBorder} bg-gradient-to-br ${role.gradient} transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 text-left cursor-pointer`}
            >
              <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl ${role.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                  <role.Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${role.accent} mb-0.5 sm:mb-1`}>
                    {role.subtitle}
                  </p>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-gray-800 transition-colors">
                    {role.title}
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    {role.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 sm:mt-5 sm:pt-4 md:mt-6 md:pt-5 border-t border-gray-200/60 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                  Get Started
                </span>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-all duration-300 group-hover:border-gray-300 ${role.shadow}`}>
                  <ArrowRight className={`w-4 h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-gray-400 transition-all duration-300 group-hover:text-gray-800 group-hover:translate-x-0.5`} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;