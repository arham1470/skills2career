import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { BookOpen, Building2, ArrowLeft, GraduationCap, AlertCircle, Lightbulb, Filter, Star, SearchX, X, MapPin, Clock, Award, CheckCircle, ListChecks } from "lucide-react";
import Button from "../components/ui/Button";

const CareerPathwayResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], suggestions = [], formData = {} } = location.state || {};
  const [showAllLevels, setShowAllLevels] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <button onClick={() => navigate("/career-pathway")} className="flex items-center gap-2 text-primary-200 hover:text-white mb-5 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Career Pathway
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white/15 backdrop-blur-sm p-3 rounded-xl border border-white/20">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Your Next Academic Pathways</h1>
              <p className="text-sm text-primary-100 mt-1">
                {filteredResults.length > 0
                  ? `Found ${filteredResults.length} next-step course${filteredResults.length !== 1 ? "s" : ""} for ${formData.currentQualification || "your"} holders`
                  : "Here are courses you can explore based on your background"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Filter Toggle */}
        {results.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 relative z-10">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Showing {showAllLevels ? "all levels you qualify for" : "your next step only"}
              </span>
            </div>
            <div className="bg-gray-100 p-1 rounded-xl inline-flex">
              <button
                onClick={() => setShowAllLevels(false)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  !showAllLevels
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Next Step Only
              </button>
              <button
                onClick={() => setShowAllLevels(true)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  showAllLevels
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All Levels
              </button>
            </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {groupedResults[level].map((course) => (
                    <div
                      key={course._id}
                      onClick={() => setSelectedCourse(course)}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
                    >
                      {/* Top image */}
                      <div className="relative h-40 w-full bg-gray-100">
                        {course.institution?.image ? (
                          <img
                            src={course.institution.image}
                            alt={course.institution.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center">
                            <GraduationCap className="w-12 h-12 text-emerald-300" />
                          </div>
                        )}
                        {course.entryType && course.entryType !== "Normal Entry" && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-400 text-white shadow-sm border border-amber-500">
                            {course.entryType}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-4 flex flex-col flex-1">
                        {/* Org row */}
                        <div className="flex items-center gap-2 mb-2">
                          {course.institution?.image ? (
                            <img
                              src={course.institution.image}
                              alt=""
                              className="w-5 h-5 rounded-sm object-cover border border-gray-200"
                            />
                          ) : (
                            <Building2 className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-xs font-medium text-gray-700">{course.institution?.name}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2 line-clamp-2">
                          {course.name}
                        </h3>

                        {/* Skills */}
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          <span className="font-bold text-gray-800">Skills you&apos;ll gain:</span>{" "}
                          {course.acceptedFields?.length && course.acceptedFields[0] !== "Any"
                            ? course.acceptedFields.join(", ")
                            : course.description || "Relevant industry skills and certification pathways."}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-1">
                          <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                          <span className="text-sm font-bold text-gray-900">4.7</span>
                          <span className="text-xs text-gray-500">· Recommended pathway</span>
                        </div>

                        {/* Bottom meta */}
                        <div className="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-500">
                          {course.educationLevel} · {course.entryType || "Course"} · {course.duration || "Varied"}
                        </div>
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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center relative z-10">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No next-step courses found</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              We did not find any higher-level courses for your {formData.currentQualification || "current"} qualification. You may still qualify for same-level or lower-level options.
            </p>
            <button
              onClick={() => setShowAllLevels(true)}
              className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
            >
              Show All Levels
            </button>
          </div>
        )}

        {/* No matches at all — with fallback suggestions */}
        {results.length === 0 && (
          <div className="space-y-6 relative z-10">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <SearchX className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No direct matches found</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-2">
                We could not find any courses matching your {formData.currentQualification || "current"} qualification right now.
              </p>
              <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
                Try adjusting your GPA, qualification name, or field. New courses are added regularly.
              </p>
              <Button variant="primary" onClick={() => navigate("/career-pathway")} className="shadow-lg shadow-primary-600/20">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {suggestions.map((course) => (
                    <div
                      key={course._id}
                      onClick={() => setSelectedCourse(course)}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
                    >
                      {/* Top image */}
                      <div className="relative h-40 w-full bg-gray-100">
                        {course.institution?.image ? (
                          <img
                            src={course.institution.image}
                            alt={course.institution.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center">
                            <GraduationCap className="w-12 h-12 text-emerald-300" />
                          </div>
                        )}
                        {course.entryType && course.entryType !== "Normal Entry" && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-400 text-white shadow-sm border border-amber-500">
                            {course.entryType}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-4 flex flex-col flex-1">
                        {/* Org row */}
                        <div className="flex items-center gap-2 mb-2">
                          {course.institution?.image ? (
                            <img
                              src={course.institution.image}
                              alt=""
                              className="w-5 h-5 rounded-sm object-cover border border-gray-200"
                            />
                          ) : (
                            <Building2 className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="text-xs font-medium text-gray-700">{course.institution?.name}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2 line-clamp-2">
                          {course.name}
                        </h3>

                        {/* Skills */}
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          <span className="font-bold text-gray-800">Skills you&apos;ll gain:</span>{" "}
                          {course.acceptedFields?.length && course.acceptedFields[0] !== "Any"
                            ? course.acceptedFields.join(", ")
                            : course.description || "Relevant industry skills and certification pathways."}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-1">
                          <Star className="w-4 h-4 text-gray-900 fill-gray-900" />
                          <span className="text-sm font-bold text-gray-900">4.7</span>
                          <span className="text-xs text-gray-500">· Recommended pathway</span>
                        </div>

                        {/* Bottom meta */}
                        <div className="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-500">
                          {course.educationLevel} · {course.entryType || "Course"} · {course.duration || "Varied"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCourse(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal header image */}
            <div className="relative h-52 w-full bg-gray-100 rounded-t-2xl overflow-hidden">
              {selectedCourse.institution?.image ? (
                <img
                  src={selectedCourse.institution.image}
                  alt={selectedCourse.institution.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 text-emerald-300" />
                </div>
              )}
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Title + institution */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {selectedCourse.institution?.image ? (
                    <img
                      src={selectedCourse.institution.image}
                      alt=""
                      className="w-5 h-5 rounded-sm object-cover border border-gray-200"
                    />
                  ) : (
                    <Building2 className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm font-medium text-gray-700">{selectedCourse.institution?.name}</span>
                  {selectedCourse.institution?.location && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 ml-1">
                      <MapPin className="w-3 h-3" /> {selectedCourse.institution.location}
                    </span>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{selectedCourse.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 border border-primary-200">
                    {selectedCourse.educationLevel}
                  </span>
                  {selectedCourse.entryType && selectedCourse.entryType !== "Normal Entry" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      {selectedCourse.entryType}
                    </span>
                  )}
                  {selectedCourse.duration && (
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3.5 h-3.5" /> {selectedCourse.duration}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedCourse.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">About this course</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedCourse.description}</p>
                </div>
              )}

              {/* Skills / Accepted fields */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary-600" /> Skills / Accepted Fields
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.acceptedFields?.length && selectedCourse.acceptedFields[0] !== "Any"
                    ? selectedCourse.acceptedFields.map((f) => (
                        <span key={f} className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {f}
                        </span>
                      ))
                    : <span className="text-sm text-gray-600">Any field accepted</span>
                  }
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-primary-600" /> Entry Requirements
                </h3>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2">
                  {selectedCourse.requirements?.olPasses != null && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{selectedCourse.requirements.olPasses}+ O/L passes required</span>
                    </div>
                  )}
                  {selectedCourse.requirements?.olMandatorySubjects?.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Mandatory subjects: {selectedCourse.requirements.olMandatorySubjects.join(", ")}</span>
                    </div>
                  )}
                  {selectedCourse.requirements?.alStream && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>A/L Stream: {selectedCourse.requirements.alStream}</span>
                    </div>
                  )}
                  {selectedCourse.requirements?.alPasses != null && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{selectedCourse.requirements.alPasses}+ A/L passes required</span>
                    </div>
                  )}
                  {selectedCourse.requirements?.gpa != null && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Minimum GPA: {selectedCourse.requirements.gpa}</span>
                    </div>
                  )}
                  {selectedCourse.requirements?.requiredField && selectedCourse.requirements.requiredField !== "Any" && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Required field: {selectedCourse.requirements.requiredField}</span>
                    </div>
                  )}
                  {selectedCourse.requirements?.otherRequirements && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{selectedCourse.requirements.otherRequirements}</span>
                    </div>
                  )}
                  {selectedCourse.acceptedQualificationTypes?.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Accepted qualifications: {selectedCourse.acceptedQualificationTypes.join(", ")}</span>
                    </div>
                  )}
                  {selectedCourse.acceptedQualificationNames?.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Recognized qualification names: {selectedCourse.acceptedQualificationNames.join(", ")}</span>
                    </div>
                  )}
                  {!selectedCourse.requirements?.olPasses &&
                   !selectedCourse.requirements?.olMandatorySubjects?.length &&
                   !selectedCourse.requirements?.alStream &&
                   !selectedCourse.requirements?.alPasses &&
                   !selectedCourse.requirements?.gpa &&
                   !selectedCourse.requirements?.requiredField &&
                   !selectedCourse.requirements?.otherRequirements &&
                   !selectedCourse.acceptedQualificationTypes?.length &&
                   !selectedCourse.acceptedQualificationNames?.length && (
                    <p className="text-sm text-gray-500">No specific requirements listed.</p>
                  )}
                </div>
              </div>

              {/* Why matched */}
              {selectedCourse.matchedBecause?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Why this matched you</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.matchedBecause.map((reason, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Close button */}
              <div className="pt-2">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="w-full py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPathwayResults;
