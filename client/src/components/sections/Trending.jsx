import React from "react";
import { MapPin, Clock, Building2 } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const internships = [
  { id: 1, title: "Software Engineering Intern", company: "TechNova Solutions", location: "Colombo", type: "Remote", match: 95, posted: "2 days ago" },
  { id: 2, title: "Marketing Assistant", company: "BrandLanka", location: "Kandy", type: "On-site", match: 82, posted: "1 day ago" },
  { id: 3, title: "Finance Intern", company: "Global Bank PLC", location: "Colombo", type: "Hybrid", match: 70, posted: "5 hours ago" },
];

const getMatchColor = (match) => {
  if (match >= 80) return "success";
  if (match >= 60) return "warning";
  return "danger";
};

const Trending = () => {
  return (
    <section id="internships" className="section-padding bg-white">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Trending Opportunities</h2>
          <p className="section-subtitle">Discover internships that align with your skills. Higher match percentages indicate stronger role compatibility.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((job) => (
            <div key={job.id} className="group card p-6 hover:border-primary-200 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <Badge variant={getMatchColor(job.match)} className="text-sm font-semibold px-3 py-1">
                  {job.match}% Match
                </Badge>
                <span className="text-xs text-gray-400 font-medium">{job.posted}</span>
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
                  <Clock className="w-3.5 h-3.5" /> {job.type}
                </div>
              </div>

              <div className="mt-auto">
                <Button variant="outline" className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="secondary">View All Internships</Button>
        </div>
      </div>
    </section>
  );
};

export default Trending;