import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Briefcase, CheckCircle, Target, ArrowRight, Flame, MapPin, Clock, Building2, BadgeDollarSign } from "lucide-react";
import api from "../../utils/api";
import ProfileTimeline from "../../components/ProfileTimeline";

const statConfig = [
  { key: "profileCompletion", label: "Profile Completion", suffix: "%", icon: Target, color: "text-blue-600 bg-blue-50", gradient: "from-blue-500 to-blue-600", action: "/seeker/profile" },
  { key: "totalApplications", label: "Applications Sent", icon: Briefcase, color: "text-purple-600 bg-purple-50", gradient: "from-purple-500 to-purple-600", action: "/seeker/applications" },
  { key: "shortlisted", label: "Shortlisted", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50", gradient: "from-emerald-500 to-emerald-600", action: "/seeker/applications" },
  { key: "skillMatches", label: "Skill Matches", icon: TrendingUp, color: "text-amber-600 bg-amber-50", gradient: "from-amber-500 to-amber-600", action: "/seeker/recommended" },
];

const AnimatedCounter = ({ value, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value) || 0;
    const duration = 1000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{displayValue}{suffix}</>;
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    profileCompletion: 0,
    totalApplications: 0,
    shortlisted: 0,
    skillMatches: 0,
  });
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, trendingRes, jobsRes] = await Promise.all([
          api.get("/seeker/dashboard-stats"),
          api.get("/seeker/trending-skills"),
          api.get("/seeker/recent-internships"),
        ]);
        setStats(statsRes.data);
        setTrendingSkills(trendingRes.data.skills || []);
        setRecentJobs(jobsRes.data.internships || []);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seeker Dashboard</h1>
        <p className="text-gray-500 mt-1">Track your applications, update your profile, and find matches.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfig.map((stat) => (
          <div
            key={stat.key}
            className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            onClick={() => stat.action && navigate(stat.action)}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? "—" : <AnimatedCounter value={stats[stat.key]} suffix={stat.suffix || ""} />}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            <div className="mt-3 flex items-center text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>View details</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        ))}
      </div>

      <ProfileTimeline completion={stats.profileCompletion} />

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Recent Jobs */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-600 bg-primary-50">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Recently Added Jobs</h2>
            </div>
            {recentJobs.length > 0 ? (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => navigate(`/internships`)}
                    className="group bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer
                      hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-primary-300
                      transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-700 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          {job.company}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                        <Clock className="w-3 h-3" /> {job.mode}
                      </span>
                      {(job.salaryMin || job.salaryMax) && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          <BadgeDollarSign className="w-3 h-3" />
                          LKR {(job.salaryMin || 0).toLocaleString()} - {(job.salaryMax || 0).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.coreSkills?.slice(0, 2).map((s) => (
                        <span key={s} className="text-[10px] font-medium bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-100">{s}</span>
                      ))}
                      {job.additionalSkills?.slice(0, 2).map((s) => (
                        <span key={s} className="text-[10px] font-medium bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded border border-primary-100">{s}</span>
                      ))}
                      {((job.coreSkills?.length || 0) + (job.additionalSkills?.length || 0)) > 4 && (
                        <span className="text-[10px] text-gray-400 px-1">+{((job.coreSkills?.length || 0) + (job.additionalSkills?.length || 0)) - 4}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-6 text-center">
                <Briefcase className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No recent jobs in your categories.</p>
              </div>
            )}
          </div>

          {/* Right: Trending Skills */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-600 bg-orange-50">
                <Flame className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Top Trending Skills</h2>
            </div>
            {trendingSkills.length > 0 ? (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {trendingSkills.map((item, index) => {
                  const maxCount = trendingSkills[0]?.count || 1;
                  const percentage = Math.round((item.count / maxCount) * 100);
                  return (
                    <div
                      key={item.skill}
                      onClick={() => navigate(`/internships?skill=${encodeURIComponent(item.skill)}`)}
                      className="group relative bg-white rounded-2xl border border-gray-200 p-4 cursor-pointer
                        hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-primary-300
                        transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm
                            ${index === 0 ? "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700" :
                              index === 1 ? "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600" :
                              index === 2 ? "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700" :
                              "bg-gray-50 text-gray-400"
                            }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-700 transition-colors">
                              {item.skill}
                            </h3>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {item.count} {item.count === 1 ? "company" : "companies"}
                            </p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                          percentage >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          percentage >= 50 ? "bg-primary-50 text-primary-700 border-primary-200" :
                          "bg-gray-50 text-gray-500 border-gray-200"
                        }`}>
                          {percentage}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mb-3">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                          role="progressbar"
                          aria-valuenow={percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-gray-400">Relative demand vs top skill</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg border border-primary-100
                          group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-300">
                          View Jobs
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">No trending skills yet</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Update your preferences or take the career assessment to discover what skills companies in your field are looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;