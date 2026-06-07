import PageLoader from "../../components/ui/PageLoader";
import React, { useState, useEffect } from "react";
import {  AlertCircle, MapPin, Clock, Building2, Briefcase } from "lucide-react";
import api from "../../utils/api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ApplyModal from "../../components/ui/ApplyModal";

const getMatchVariant = (match) => {
  if (match >= 75) return "success";
  if (match >= 50) return "warning";
  return "danger";
};

const Recommended = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyModal, setApplyModal] = useState({ isOpen: false, job: null });

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await api.get("/internships/recommended");
        setInternships(res.data.internships);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  if (loading) return <PageLoader />;

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
      <p className="font-medium">{error}</p>
      <p className="text-sm mt-1">Ensure you have added skills and preferences in your profile.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recommended Internships</h1>
        <p className="text-gray-500 mt-1">Opportunities matched with your skills and preferences.</p>
      </div>

      {internships.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No matches found yet</h3>
          <p className="text-gray-500 mt-1 max-w-md mx-auto">Update your skills and preferences to unlock personalized recommendations.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((job) => (
            <div key={job._id} className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <Badge variant={getMatchVariant(job.matchPercentage)} className="text-sm font-semibold px-3 py-1">
                  {job.matchPercentage}% Match
                </Badge>
                <span className="text-xs text-gray-400 font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">{job.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>{job.company}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                  <Clock className="w-3.5 h-3.5" /> {job.mode}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-1">Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.coreSkills?.slice(0, 2).map(skill => (
                    <span key={skill} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-md font-medium">{skill}</span>
                  ))}
                  {job.additionalSkills?.slice(0, 2).map(skill => (
                    <span key={skill} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md">{skill}</span>
                  ))}
                  {((job.coreSkills?.length || 0) + (job.additionalSkills?.length || 0)) > 4 && (
                    <span className="text-xs text-gray-400">+{((job.coreSkills?.length || 0) + (job.additionalSkills?.length || 0)) - 4}</span>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600"
                  onClick={() => setApplyModal({ isOpen: true, job })}
                >
                  View & Apply
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ApplyModal
        isOpen={applyModal.isOpen}
        onClose={() => setApplyModal({ isOpen: false, job: null })}
        internship={applyModal.job}
      />
    </div>
  );
};

export default Recommended;