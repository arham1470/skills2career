import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { BookOpen, Building2, MapPin, CheckCircle2, ArrowLeft, GraduationCap, AlertCircle } from "lucide-react";
import Button from "../components/ui/Button";

const CareerPathwayResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], formData = {} } = location.state || {};

  const getRequirementsSummary = (course) => {
    const req = course.requirements || {};
    const parts = [];
    if (req.olPasses != null) parts.push(`${req.olPasses} O/L passes`);
    if (req.olMandatorySubjects?.length > 0) parts.push(`${req.olMandatorySubjects.join(", ")} required`);
    if (req.alStream && req.alStream !== "Any") parts.push(`${req.alStream} stream`);
    if (req.alPasses != null) parts.push(`${req.alPasses} A/L passes`);
    if (req.gpa != null) parts.push(`GPA ${req.gpa}+`);
    if (req.requiredField && req.requiredField !== "Any") parts.push(`${req.requiredField} background`);
    if (req.otherRequirements) parts.push(req.otherRequirements);
    return parts.length > 0 ? parts.join(" | ") : "No specific requirements";
  };

  if (!location.state) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No results found</h2>
          <p className="text-gray-500 mb-6">Please fill out the Career Pathway form first.</p>
          <Link to="/career-pathway">
            <Button variant="primary">Go to Career Pathway</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <button onClick={() => navigate("/career-pathway")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Career Pathway
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2.5 rounded-xl">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Matched Courses</h1>
              <p className="text-sm text-gray-500">
                Found {results.length} course{results.length !== 1 ? "s" : ""} matching your profile
                {formData.educationLevel && ` (${formData.educationLevel})`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No matching courses found</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We could not find any courses matching your current education details. Try adjusting your inputs or check back later as new courses are added regularly.
            </p>
            <Button variant="primary" onClick={() => navigate("/career-pathway")}>
              Adjust Details
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-2.5 rounded-lg shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">{course.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5 text-sm text-gray-500">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{course.institution?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{course.institution?.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Requirements Met</p>
                      <p className="text-sm text-gray-600 mt-0.5">{getRequirementsSummary(course)}</p>
                    </div>
                  </div>
                  {course.duration && (
                    <p className="text-xs text-gray-400 mt-2">Duration: {course.duration}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPathwayResults;
