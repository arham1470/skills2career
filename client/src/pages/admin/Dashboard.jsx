import PageLoader from "../../components/ui/PageLoader";
import React, { useState, useEffect } from "react";
import {  Users, Briefcase, FileText, Ban } from "lucide-react";
import api from "../../utils/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats").then(res => setStats(res.data.stats)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const cards = [
    { label: "Seekers", value: stats.totalSeekers, icon: Users, color: "text-blue-600 bg-blue-50", gradient: "from-blue-500 to-blue-600" },
    { label: "Employers", value: stats.totalEmployers, icon: Users, color: "text-purple-600 bg-purple-50", gradient: "from-purple-500 to-purple-600" },
    { label: "Active Internships", value: stats.activeInternships, icon: Briefcase, color: "text-emerald-600 bg-emerald-50", gradient: "from-emerald-500 to-emerald-600" },
    { label: "Applications", value: stats.totalApplications, icon: FileText, color: "text-amber-600 bg-amber-50", gradient: "from-amber-500 to-amber-600" },
    { label: "Suspended Users", value: stats.suspendedUsers, icon: Ban, color: "text-red-600 bg-red-50", gradient: "from-red-500 to-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and key metrics.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color} group-hover:scale-110 transition-transform duration-300`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;