import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { BookOpen, Building2, MapPin, CheckCircle2, ArrowLeft, GraduationCap, AlertCircle, Sparkles, Lightbulb, Filter } from "lucide-react";
import Button from "../components/ui/Button";

const CareerPathwayResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], suggestions = [], formData = {} } = location.state || {};
  const [showAllLevels, setShowAllLevels] = useState(false);

  // Determine which levels are "next step" (higher than current qualification)
  const currentLevel = formData.currentQualification || "";
  const levelRank = { "O/L": 0, "A/L": 1, "Diploma": 2, "HND": 3, "Bachelor": 4 };
  const currentRank = levelRank[currentLevel] ?? -1;

  // Filter results: by default only show courses at a HIGHER level
  const filteredResults = showAllLevels
    ? results
    : results.filter((c) => (levelRank[c.educationLevel] ?? -1) > currentRank);

  // Group results by education level for cleaner display
  const groupedResults = filteredResults.reduce((acc, course) => {
    const level = course.educationLevel || "Other";
    if (!acc[level]) acc[level] = [];
    acc[level].push(course);
    return acc;
  }, {});

  const levelOrder = ["Bachelor", "HND", "Diploma", "A/L", "O/L"];
  const sortedLevels = Object.keys(groupedResults).sort(
    (a, b) => (levelOrder.indexOf(b) - levelOrder.indexOf(a))
  );

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

  const entryTypeBadge = (type) => {
    if (!type || type === "Normal Entry") return null;
    const colors = {
      "Top-Up": "bg-amber-50 text-amber-700 border-amber-200",
      "Final Year Entry": "bg-violet-50 text-violet-700 border-violet-200",
      "Direct Entry": "bg-sky-50 text-sky-700 border-sky-200",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors[type] || colors["Direct Entry"]}`}>
        {type}
      </span>
    );
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
              <h1 className="text-xl font-bold text-gray-900">Your Next Academic Pathways</h1>
              <p className="text-sm text-gray-500">
                {filteredResults.length > 0
                  ? `Found ${filteredResults.length} next-step course${filteredResults.length !== 1 ? "s" : ""} for ${formData.currentQualification || "your"} holders`
                  : "Here are courses you can explore based on your background"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Filter Toggle */}
        {results.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Showing {showAllLevels ? "all levels you qualify for" : "your next step only"}
              </span>
            </div>
            <button
              onClick={() => setShowAllLevels((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showAllLevels
                  ? "bg-primary-100 text-primary-700 border border-primary-300"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              {showAllLevels ? "Next Step Only" : "Show All Levels"}
            </button>
          </div>
        )}

        {/* Grouped Direct Matches */}
        {filteredResults.length > 0 && (
          <div className="space-y-8">
            {sortedLevels.map((level) => (
              <div key={level}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 text-primary-800 border border-primary-200">
                    {level === "Bachelor" ? "Bachelor's Degrees" : level}
                  </span>
                  <span className="text-sm text-gray-400">{groupedResults[level].length} course{groupedResults[level].length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedResults[level].map((course) => (
                    <div
                      key={course._id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-primary-100 p-2.5 rounded-lg shrink-0">
                          <GraduationCap className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">{course.name}</h3>
                            {entryTypeBadge(course.entryType)}
                          </div>
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

                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        {/* Why they qualify */}
                        {course.matchedBecause && course.matchedBecause.length > 0 && (
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">You Qualify Because</p>
                              <ul className="mt-1 space-y-0.5">
                                {course.matchedBecause.map((reason, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Requirements summary */}
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Requirements</p>
                            <p className="text-sm text-gray-600 mt-0.5">{getRequirementsSummary(course)}</p>
                          </div>
                        </div>

                        {course.duration && (
                          <p className="text-xs text-gray-400">Duration: {course.duration}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No next-step matches — but lower-level options may exist */}
        {results.length > 0 && filteredResults.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No next-step courses found</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              We did not find any higher-level courses for your {formData.currentQualification || "current"} qualification. You may still qualify for same-level or lower-level options.
            </p>
            <button
              onClick={() => setShowAllLevels(true)}
              className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              Show All Levels
            </button>
          </div>
        )}

        {/* No matches at all — with fallback suggestions */}
        {results.length === 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No direct matches found</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-2">
                We could not find any courses matching your {formData.currentQualification || "current"} qualification right now.
              </p>
              <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
                Try adjusting your GPA, qualification name, or field. New courses are added regularly.
              </p>
              <Button variant="primary" onClick={() => navigate("/career-pathway")}>
                Adjust Details
              </Button>
            </div>

            {/* Fallback suggestions */}
            {suggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-gray-900">You may also qualify for</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-2.5 rounded-lg shrink-0">
                          <GraduationCap className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">{course.name}</h3>
                            {entryTypeBadge(course.entryType)}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 text-sm text-gray-500">
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{course.institution?.name}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-sm text-gray-500">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{course.institution?.location}</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 mt-2">
                            {course.educationLevel}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600">{getRequirementsSummary(course)}</p>
                        {course.duration && (
                          <p className="text-xs text-gray-400 mt-1">Duration: {course.duration}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPathwayResults;
