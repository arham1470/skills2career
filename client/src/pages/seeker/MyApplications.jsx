import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2, MapPin, Clock, Briefcase, Calendar, Video,
  Building2, AlertCircle, ArrowRight, Plus
} from "lucide-react";
import api from "../../utils/api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const STATUS_COLORS = {
  Pending: "warning",
  Shortlisted: "info",
  Selected: "success",
  Rejected: "danger"
};

const STATUS_BORDER = {
  Pending: "border-l-amber-400",
  Shortlisted: "border-l-blue-500",
  Selected: "border-l-emerald-500",
  Rejected: "border-l-red-500"
};

const InterviewBanner = ({ iv }) => {
  const isZoom = iv.type === "zoom";
  const cancelled = iv.status === "Cancelled";
  const completed = iv.status === "Completed";

  return (
    <div className={`mt-4 rounded-lg border px-4 py-3 text-xs flex flex-col sm:flex-row sm:items-center gap-2 ${
      cancelled ? "bg-red-50 border-red-200 text-red-700" :
      completed ? "bg-gray-50 border-gray-200 text-gray-500" :
      "bg-blue-50 border-blue-200 text-blue-800"
    }`}>
      <div className="flex items-center gap-1.5 font-semibold shrink-0">
        {cancelled ? <AlertCircle className="w-3.5 h-3.5" /> :
         isZoom ? <Video className="w-3.5 h-3.5" /> :
         <Building2 className="w-3.5 h-3.5" />}
        {cancelled ? "Interview Cancelled" :
         completed ? "Interview Completed" :
         `Interview Scheduled — ${isZoom ? "Online (Zoom)" : "Walk-in"}`}
      </div>
      {!cancelled && (
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {iv.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {iv.time}
          </span>
          {!isZoom && iv.address && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {iv.address}
            </span>
          )}
          {isZoom && iv.zoomLink && (
            <a href={iv.zoomLink} target="_blank" rel="noreferrer"
               className="underline font-medium hover:text-blue-900">
              Join Meeting
            </a>
          )}
        </div>
      )}
      {iv.notes && (
        <span className="italic text-gray-500 sm:ml-auto">"{iv.notes}"</span>
      )}
    </div>
  );
};

const CompanyAvatar = ({ name }) => {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 text-primary-700 flex items-center justify-center text-lg font-bold shrink-0">
      {initial}
    </div>
  );
};

const MyApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [interviewMap, setInterviewMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [appsRes, intRes] = await Promise.all([
          api.get("/applications/my"),
          api.get("/interviews/seeker")
        ]);
        setApplications(appsRes.data.applications);
        const map = {};
        intRes.data.interviews.forEach(iv => {
          map[iv.application?.toString()] = iv;
        });
        setInterviewMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-1">
            Track the status of your internship applications.
          </p>
        </div>
        <Button
          variant="primary"
          className="shrink-0"
          onClick={() => navigate("/internships")}
        >
          <Plus className="w-4 h-4 mr-2" /> Browse Internships
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No applications yet</h3>
          <p className="text-gray-500 mt-1 mb-6">
            Start browsing internships and apply to kickstart your career.
          </p>
          <Button variant="primary" onClick={() => navigate("/internships")}>
            Find Internships <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map(app => {
            const interview = interviewMap[app._id];
            const statusBorder = STATUS_BORDER[app.status] || "border-l-gray-300";
            return (
              <div
                key={app._id}
                className={`group bg-white rounded-xl border border-gray-200 border-l-4 ${statusBorder} p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary-300 transition-all duration-300 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-300 pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
                  <CompanyAvatar name={app.internship?.company} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                        {app.internship?.title || "Untitled Internship"}
                      </h3>
                      <Badge variant={STATUS_COLORS[app.status]}>
                        {app.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-3">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      {app.internship?.company || "Unknown Company"}
                    </p>

                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                        <MapPin className="w-3.5 h-3.5" />
                        {app.internship?.location || "N/A"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                        <Clock className="w-3.5 h-3.5" />
                        {app.internship?.mode || "N/A"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                        <Calendar className="w-3.5 h-3.5" />
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {interview && <InterviewBanner iv={interview} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;