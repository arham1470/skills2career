import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Building2, FileText } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import api from "../../utils/api";

const getMatchColor = (match) => {
  if (match >= 80) return "success";
  if (match >= 60) return "warning";
  return "danger";
};

const timeAgo = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} wk${diffWeeks > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const Trending = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get("/internships/browse?limit=6");
        setInternships(res.data.internships || []);
      } catch (err) {
        console.error("Failed to fetch trending internships:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <section id="internships" className="section-padding bg-white">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Trending Opportunities</h2>
          <p className="section-subtitle">Discover the latest jobs. Higher match percentages indicate stronger role compatibility.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FileText className="w-10 h-10 animate-pulse text-primary-500" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((job) => (
                <div key={job._id} className="group card p-6 hover:border-primary-200 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    {job.matchPercentage > 0 ? (
                      <Badge variant={getMatchColor(job.matchPercentage)} className="text-sm font-semibold px-3 py-1">
                        {job.matchPercentage}% Match
                      </Badge>
                    ) : (
                      <Badge variant="info" className="text-sm font-semibold px-3 py-1">
                        New
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400 font-medium">{timeAgo(job.createdAt)}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">{job.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span>{job.company}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                      <Clock className="w-3.5 h-3.5" /> {job.mode}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600"
                      onClick={() => navigate("/internships")}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button variant="secondary" onClick={() => navigate("/internships")}>
                View All Jobs
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Trending;