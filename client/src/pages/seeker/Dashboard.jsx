import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Briefcase, CheckCircle, Target, ArrowRight } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/seeker/dashboard-stats");
        setStats(res.data);
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
    </div>
  );
};

export default Dashboard;