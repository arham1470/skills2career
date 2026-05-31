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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Immersive Hero Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 overflow-hidden shadow-lg pb-16 pt-12 z-10">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <button onClick={() => navigate("/career-pathway")} className="inline-flex items-center gap-2 text-primary-200 hover:text-white mb-6 transition-colors text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
            <ArrowLeft className="w-4 h-4" /> Back to Career Pathway
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 shrink-0 self-start">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
                Your Academic Pathways
              </h1>
              <p className="text-base text-primary-100 max-w-2xl font-medium">
                {filteredResults.length > 0
                  ? `Found ${filteredResults.length} next-step course${filteredResults.length !== 1 ? "s" : ""} for ${formData.currentQualification || "your"} holders.`
                  : "Here are courses you can explore based on your background."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-8 pb-24 space-y-8">
        
        {/* Filter Toggle (iOS Pill Style) */}
        {results.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-gray-200/50 p-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                <Filter className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-gray-700">
                Showing {showAllLevels ? "all levels you qualify for" : "your next step only"}
              </span>
            </div>
            
            <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex relative w-full sm:w-auto shadow-inner border border-gray-200/50">
              {/* Highlight Pill */}
              <div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white rounded-xl shadow-sm border border-gray-200/50 transition-transform duration-300 ease-out"
                style={{ transform: showAllLevels ? "translateX(100%)" : "translateX(0)" }}
              />
              
              <button
                onClick={() => setShowAllLevels(false)}
                className={`relative z-10 flex-1 sm:w-32 py-2 rounded-xl text-sm font-bold transition-colors duration-300 ${
                  !showAllLevels ? "text-primary-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Next Step
              </button>
              <button
                onClick={() => setShowAllLevels(true)}
                className={`relative z-10 flex-1 sm:w-32 py-2 rounded-xl text-sm font-bold transition-colors duration-300 ${
                  showAllLevels ? "text-primary-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All Levels
              </button>
            </div>
          </div>
        )}

        {/* Grouped Direct Matches */}
        {filteredResults.length > 0 && (
          <div className="space-y-12">
            {sortedLevels.map((level, levelIdx) => (
              <div key={level} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${levelIdx * 100}ms`, animationFillMode: 'both' }}>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-primary-100 text-primary-800 border border-primary-200 shadow-sm">
                      {level === "Bachelor" ? "Bachelor's Degrees" : level}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {groupedResults[level].length} course{groupedResults[level].length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedResults[level].map((course) => (
                    <div
                      key={course._id}
                      onClick={() => setSelectedCourse(course)}
                      className="group bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-gray-200/40 hover:shadow-2xl hover:shadow-primary-500/15 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
                    >
                      {/* Top image */}
                      <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                        {course.institution?.image ? (
                          <>
                            <img
                              src={course.institution.image}
                              alt={course.institution.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center">
                            <GraduationCap className="w-12 h-12 text-emerald-400" />
                          </div>
                        )}
                        {course.entryType && course.entryType !== "Normal Entry" && (
                          <span className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-amber-950 shadow-md border border-amber-300 backdrop-blur-md">
                            {course.entryType}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-6 flex flex-col flex-1">
                        {/* Org row */}
                        <div className="flex items-center gap-2.5 mb-3">
                          {course.institution?.image ? (
                            <img
                              src={course.institution.image}
                              alt=""
                              className="w-6 h-6 rounded-md object-cover border border-gray-200 shadow-sm"
                            />
                          ) : (
                            <div className="p-1 bg-gray-100 rounded-md">
                              <Building2 className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{course.institution?.name}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-extrabold text-gray-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors">
                          {course.name}
                        </h3>

                        {/* Skills */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          <span className="font-bold text-gray-900">Skills:</span>{" "}
                          {course.acceptedFields?.length && course.acceptedFields[0] !== "Any"
                            ? course.acceptedFields.join(", ")
                            : course.description || "Relevant industry skills and certification pathways."}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-4">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-bold text-gray-900">4.7</span>
                          <span className="text-xs font-medium text-gray-500">· Recommended pathway</span>
                        </div>

                        {/* Bottom meta */}
                        <div className="mt-auto pt-4 border-t border-gray-100/80 flex items-center justify-between text-xs font-semibold text-gray-500">
                          <span className="bg-gray-100 px-3 py-1.5 rounded-lg">{course.educationLevel}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration || "Varied"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No next-step matches */}
        {results.length > 0 && filteredResults.length === 0 && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-gray-200/50 p-12 text-center relative z-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-100 shadow-sm">
              <SearchX className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">No next-step courses found</h2>
            <p className="text-gray-500 text-base max-w-md mx-auto mb-8 font-medium">
              We did not find any strictly higher-level courses for your {formData.currentQualification || "current"} qualification. However, you may still qualify for same-level options.
            </p>
            <button
              onClick={() => setShowAllLevels(true)}
              className="px-8 py-3.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary-600/30"
            >
              View Available Courses
            </button>
          </div>
        )}

        {/* No matches at all */}
        {results.length === 0 && (
          <div className="space-y-8 relative z-10">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-gray-200/50 p-12 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-gray-100 shadow-sm">
                <SearchX className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">No direct matches found</h2>
              <p className="text-gray-500 text-base max-w-md mx-auto mb-2 font-medium">
                We could not find any courses perfectly matching your {formData.currentQualification || "current"} qualification right now.
              </p>
              <p className="text-sm text-gray-400 max-w-md mx-auto mb-8 font-medium">
                Try adjusting your GPA, qualification name, or field. New courses are added regularly.
              </p>
              <button 
                onClick={() => navigate("/career-pathway")} 
                className="px-8 py-3.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary-600/30"
              >
                Adjust Details
              </button>
            </div>

            {/* Fallback suggestions */}
            {suggestions.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-both">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900">You may also qualify for</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suggestions.map((course) => (
                    <div
                      key={course._id}
                      onClick={() => setSelectedCourse(course)}
                      className="group bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-lg shadow-gray-200/40 hover:shadow-2xl hover:shadow-primary-500/15 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
                    >
                      {/* Suggestion cards use same rich UI as main results */}
                      <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                        {course.institution?.image ? (
                          <>
                            <img
                              src={course.institution.image}
                              alt={course.institution.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center">
                            <GraduationCap className="w-12 h-12 text-emerald-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2.5 mb-3">
                          {course.institution?.image ? (
                            <img src={course.institution.image} alt="" className="w-6 h-6 rounded-md object-cover border border-gray-200 shadow-sm" />
                          ) : (
                            <div className="p-1 bg-gray-100 rounded-md"><Building2 className="w-4 h-4 text-gray-500" /></div>
                          )}
                          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{course.institution?.name}</span>
                        </div>
                        <h3 className="font-extrabold text-gray-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors">
                          {course.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          <span className="font-bold text-gray-900">Skills:</span> {course.description || "Relevant industry skills."}
                        </p>
                        <div className="mt-auto pt-4 border-t border-gray-100/80 flex items-center justify-between text-xs font-semibold text-gray-500">
                          <span className="bg-gray-100 px-3 py-1.5 rounded-lg">{course.educationLevel}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration || "Varied"}</span>
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

      {/* Modern Glassmorphic Course Detail Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCourse(null);
          }}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 border border-white">
            
            {/* Modal Header Image with Gradient */}
            <div className="relative h-56 w-full bg-gray-100 rounded-t-3xl overflow-hidden">
              {selectedCourse.institution?.image ? (
                <>
                  <img
                    src={selectedCourse.institution.image}
                    alt={selectedCourse.institution.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center">
                  <GraduationCap className="w-16 h-16 text-emerald-300" />
                </div>
              )}
              
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-gray-900 rounded-full p-2.5 backdrop-blur-md transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title overlay on image if there is an image */}
              <div className="absolute bottom-4 left-6 right-6">
                 <div className="flex items-center gap-2 mb-1">
                   <span className="text-sm font-bold text-white/90 drop-shadow-md">{selectedCourse.institution?.name}</span>
                 </div>
                 <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md">{selectedCourse.name}</h2>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary-100 text-primary-800 border border-primary-200">
                  {selectedCourse.educationLevel}
                </span>
                {selectedCourse.entryType && selectedCourse.entryType !== "Normal Entry" && (
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {selectedCourse.entryType}
                  </span>
                )}
                {selectedCourse.duration && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl">
                    <Clock className="w-4 h-4" /> {selectedCourse.duration}
                  </span>
                )}
                {selectedCourse.institution?.location && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl">
                    <MapPin className="w-4 h-4" /> {selectedCourse.institution.location}
                  </span>
                )}
              </div>

              {/* Description */}
              {selectedCourse.description && (
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 mb-2">About this course</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{selectedCourse.description}</p>
                </div>
              )}

              {/* Requirements & Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Requirements */}
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-primary-600" /> Entry Requirements
                  </h3>
                  <div className="bg-slate-50 rounded-2xl border border-gray-100 p-5 space-y-3">
                    {selectedCourse.requirements?.olPasses != null && (
                      <div className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>{selectedCourse.requirements.olPasses}+ O/L passes required</span>
                      </div>
                    )}
                    {selectedCourse.requirements?.olMandatorySubjects?.length > 0 && (
                      <div className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>Mandatory subjects: <strong className="text-gray-900">{selectedCourse.requirements.olMandatorySubjects.join(", ")}</strong></span>
                      </div>
                    )}
                    {selectedCourse.requirements?.alStream && (
                      <div className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>A/L Stream: <strong className="text-gray-900">{selectedCourse.requirements.alStream}</strong></span>
                      </div>
                    )}
                    {selectedCourse.requirements?.alPasses != null && (
                      <div className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>{selectedCourse.requirements.alPasses}+ A/L passes required</span>
                      </div>
                    )}
                    {selectedCourse.requirements?.gpa != null && (
                      <div className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>Minimum GPA: <strong className="text-gray-900">{selectedCourse.requirements.gpa}</strong></span>
                      </div>
                    )}
                    {selectedCourse.requirements?.requiredField && selectedCourse.requirements.requiredField !== "Any" && (
                      <div className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>Required field: <strong className="text-gray-900">{selectedCourse.requirements.requiredField}</strong></span>
                      </div>
                    )}
                    {selectedCourse.requirements?.otherRequirements && (
                      <div className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>{selectedCourse.requirements.otherRequirements}</span>
                      </div>
                    )}
                    {selectedCourse.acceptedQualificationTypes?.length > 0 && (
                      <div className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>Accepted types: <strong className="text-gray-900">{selectedCourse.acceptedQualificationTypes.join(", ")}</strong></span>
                      </div>
                    )}
                    {selectedCourse.acceptedQualificationNames?.length > 0 && (
                      <div className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>Recognizes: <strong className="text-gray-900">{selectedCourse.acceptedQualificationNames.join(", ")}</strong></span>
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
                      <p className="text-sm text-gray-500 font-medium">No strict specific requirements listed.</p>
                    )}
                  </div>
                </div>

                {/* Skills & Match Reason */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary-600" /> Accepted Fields / Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.acceptedFields?.length && selectedCourse.acceptedFields[0] !== "Any"
                        ? selectedCourse.acceptedFields.map((f) => (
                            <span key={f} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border-2 border-gray-100 text-gray-700 shadow-sm">
                              {f}
                            </span>
                          ))
                        : <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border-2 border-gray-100 text-gray-700 shadow-sm">Any field accepted</span>
                      }
                    </div>
                  </div>

                  {selectedCourse.matchedBecause?.length > 0 && (
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" /> Why this matches you
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.matchedBecause.map((reason, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Close CTA */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all hover:-translate-y-0.5 shadow-lg shadow-gray-900/20"
                >
                  Close Details
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
