import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, ArrowRight, CheckCircle2, Loader2, Building2, Check, Sparkles, ChevronDown, Pencil } from "lucide-react";
import api from "../utils/api";
import Button from "../components/ui/Button";
import CustomSelect from "../components/ui/CustomSelect";
import AutocompleteInput from "../components/ui/AutocompleteInput";

const currentQualifications = [
  { value: "O/L", label: "O/L (Ordinary Level)", desc: "6-10 subject passes", icon: GraduationCap },
  { value: "A/L", label: "A/L (Advanced Level)", desc: "3-4 subject passes", icon: GraduationCap },
  { value: "Diploma", label: "Diploma", desc: "Diploma or equivalent", icon: BookOpen },
  { value: "HND", label: "HND (Higher National Diploma)", desc: "HND or equivalent", icon: BookOpen },
  { value: "Bachelor", label: "Bachelor's Degree", desc: "Undergraduate degree", icon: Building2 },
];

const olSubjects = [
  "Mathematics", "Science", "English", "Sinhala", "Tamil",
  "History", "Geography", "Commerce", "ICT", "Music", "Art"
];

const alStreams = ["Arts", "Commerce", "Science", "Technology", "Any"];

const fieldsOfStudy = [
  "Any",
  "IT / Computing",
  "Business / Management",
  "Engineering",
  "Science",
  "Arts / Humanities",
  "Law",
  "Medicine / Health Sciences",
  "Hospitality / Tourism",
];

const commonQualificationNames = [
  "Pearson HND",
  "SLIATE HND",
  "NIBM Diploma",
  "ESOFT Diploma",
  "BCAS Diploma",
  "General Bachelor's Degree",
  "Honours Bachelor's Degree",
  "Foundation Certificate",
];

const CareerPathway = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [expandedStep, setExpandedStep] = useState(1);
  const [formData, setFormData] = useState({
    currentQualification: "",
    olPasses: "",
    olMandatorySubjects: [],
    alStream: "",
    alPasses: "",
    gpa: "",
    fieldOfStudy: "",
    qualificationName: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSubject = (subject) => {
    setFormData((prev) => {
      const exists = prev.olMandatorySubjects.includes(subject);
      return {
        ...prev,
        olMandatorySubjects: exists
          ? prev.olMandatorySubjects.filter((s) => s !== subject)
          : [...prev.olMandatorySubjects, subject],
      };
    });
  };

  const handleFindCourses = async () => {
    setLoading(true);
    try {
      const payload = {
        currentQualification: formData.currentQualification,
      };

      if (formData.currentQualification === "O/L") {
        payload.olPasses = formData.olPasses ? parseInt(formData.olPasses) : null;
        payload.olMandatorySubjects = formData.olMandatorySubjects;
      } else if (formData.currentQualification === "A/L") {
        payload.alStream = formData.alStream;
        payload.alPasses = formData.alPasses ? parseInt(formData.alPasses) : null;
      } else {
        payload.gpa = formData.gpa ? parseFloat(formData.gpa) : null;
        payload.fieldOfStudy = formData.fieldOfStudy || "Any";
        payload.qualificationName = formData.qualificationName || "";
      }

      const res = await api.post("/career-pathway/match", payload);
      navigate("/career-pathway/results", { state: { results: res.data.courses, suggestions: res.data.suggestions, formData } });
    } catch (error) {
      console.error("Failed to match courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (!formData.currentQualification) return false;
    if (formData.currentQualification === "O/L") {
      return formData.olPasses !== "";
    }
    if (formData.currentQualification === "A/L") {
      return formData.alStream !== "" && formData.alPasses !== "";
    }
    return formData.fieldOfStudy !== "";
  };

  // Stepper logic
  const steps = [
    { label: "Qualification", completed: !!formData.currentQualification },
    { label: "Details", completed: isStepValid() },
  ];

  // Summary sidebar content
  const getSummaryItems = () => {
    const items = [];
    if (formData.currentQualification) {
      items.push({ label: "Qualification", value: formData.currentQualification });
    }
    if (formData.currentQualification === "O/L" && formData.olPasses) {
      items.push({ label: "O/L Passes", value: `${formData.olPasses} passes` });
      if (formData.olMandatorySubjects.length > 0) {
        items.push({ label: "Subjects", value: formData.olMandatorySubjects.join(", ") });
      }
    }
    if (formData.currentQualification === "A/L") {
      if (formData.alStream) items.push({ label: "A/L Stream", value: formData.alStream });
      if (formData.alPasses !== "") items.push({ label: "A/L Passes", value: `${formData.alPasses} passes` });
    }
    if (["Diploma", "HND", "Bachelor"].includes(formData.currentQualification)) {
      if (formData.qualificationName) items.push({ label: "Qualification", value: formData.qualificationName });
      if (formData.fieldOfStudy) items.push({ label: "Field", value: formData.fieldOfStudy });
      if (formData.gpa) items.push({ label: "GPA", value: formData.gpa });
    }
    return items;
  };

  const summaryItems = getSummaryItems();

  // Auto-collapse Step 1 and expand Step 2 when qualification is selected
  useEffect(() => {
    if (formData.currentQualification && expandedStep === 1) {
      setExpandedStep(2);
    }
  }, [formData.currentQualification]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Immersive Hero Header */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 overflow-hidden shadow-lg pb-16 pt-16 z-10">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mb-6 shadow-xl border border-white/20">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
              Discover Your Pathway
            </h1>
            <p className="text-lg text-primary-100 max-w-2xl font-medium">
              Tell us where you are, and we'll show you exactly where you can go. Unlock courses tailored to your education.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Select Education Level */}
            <div className={`bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-gray-200/50 transition-all duration-500 ${expandedStep === 1 ? "p-8" : "p-0 overflow-hidden"}`}>
              {/* Header */}
              <button
                onClick={() => setExpandedStep(1)}
                className={`w-full flex items-center justify-between text-left transition-all duration-300 ${expandedStep === 1 ? "" : "p-6 hover:bg-gray-50/80"}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold shadow-sm transition-colors ${formData.currentQualification ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-primary-100 text-primary-700"}`}>
                    {formData.currentQualification ? <CheckCircle2 className="w-5 h-5" /> : "1"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">What qualification do you hold?</h2>
                    {expandedStep !== 1 && formData.currentQualification && (
                      <p className="text-sm font-medium text-emerald-600 mt-1">
                        {currentQualifications.find((q) => q.value === formData.currentQualification)?.label}
                      </p>
                    )}
                  </div>
                </div>
                {expandedStep !== 1 && formData.currentQualification && (
                  <div className="flex items-center gap-2 text-sm text-primary-600 font-bold bg-primary-50 px-4 py-2 rounded-xl transition-colors hover:bg-primary-100">
                    <Pencil className="w-4 h-4" />
                    <span>Change</span>
                  </div>
                )}
              </button>

              {/* Expanded content */}
              {expandedStep === 1 && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQualifications.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => handleChange("currentQualification", level.value)}
                        className={`group relative flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                          formData.currentQualification === level.value
                            ? "border-primary-500 bg-primary-50/80 shadow-lg shadow-primary-500/20 scale-[1.02]"
                            : "border-gray-100 bg-white hover:border-primary-200 hover:bg-gray-50 hover:shadow-md hover:-translate-y-1"
                        }`}
                      >
                        {formData.currentQualification === level.value && (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-transparent opacity-50 pointer-events-none" />
                        )}
                        
                        <div className={`relative p-3.5 rounded-xl transition-all duration-300 shadow-sm ${
                          formData.currentQualification === level.value 
                            ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white" 
                            : "bg-gray-100 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600"
                        }`}>
                          <level.icon className="w-6 h-6" />
                        </div>
                        
                        <div className="relative z-10 pt-1">
                          <span className={`block font-bold text-base mb-0.5 ${
                            formData.currentQualification === level.value ? "text-primary-900" : "text-gray-900"
                          }`}>
                            {level.label}
                          </span>
                          <span className={`text-xs ${
                            formData.currentQualification === level.value ? "text-primary-700 font-medium" : "text-gray-500"
                          }`}>{level.desc}</span>
                        </div>
                        
                        {formData.currentQualification === level.value && (
                          <div className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300 shadow-sm">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Enter Details */}
            {formData.currentQualification && (
              <div className={`bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-gray-200/50 transition-all duration-500 ${expandedStep === 2 ? "p-8" : "p-0 overflow-hidden"}`}>
                <button
                  onClick={() => setExpandedStep(2)}
                  className={`w-full flex items-center justify-between text-left transition-all duration-300 ${expandedStep === 2 ? "" : "p-6 hover:bg-gray-50/80"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold shadow-sm transition-colors ${isStepValid() ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-primary-100 text-primary-700"}`}>
                      {isStepValid() ? <CheckCircle2 className="w-5 h-5" /> : "2"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Enter Your Details</h2>
                      {expandedStep !== 2 && (
                        <p className="text-sm font-medium text-gray-500 mt-1">
                          {isStepValid() ? "Ready to find courses" : "Waiting for details..."}
                        </p>
                      )}
                    </div>
                  </div>
                  {expandedStep !== 2 && (
                    <div className="flex items-center gap-2 text-sm text-primary-600 font-bold bg-primary-50 px-4 py-2 rounded-xl transition-colors hover:bg-primary-100">
                      <Pencil className="w-4 h-4" />
                      <span>Edit</span>
                    </div>
                  )}
                </button>

                {expandedStep === 2 && (
                  <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* O/L Fields */}
                    {formData.currentQualification === "O/L" && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">Number of O/L Passes</label>
                          <CustomSelect
                            value={formData.olPasses}
                            onChange={(val) => handleChange("olPasses", val)}
                            placeholder="Select passes"
                            options={[...Array(10)].map((_, i) => ({ value: String(i), label: `${i} passes` }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-3">Subjects Passed (Optional)</label>
                          <div className="flex flex-wrap gap-2.5">
                            {olSubjects.map((subject) => {
                              const selected = formData.olMandatorySubjects.includes(subject);
                              return (
                                <button
                                  key={subject}
                                  onClick={() => toggleSubject(subject)}
                                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 flex items-center ${
                                    selected
                                      ? "bg-primary-50 text-primary-700 border-primary-500 shadow-sm shadow-primary-100"
                                      : "bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  {selected && <Check className="w-4 h-4 mr-1.5 text-primary-600" />}
                                  {subject}
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-xs text-gray-400 mt-3 font-medium">Select the key subjects you have passed</p>
                        </div>
                      </div>
                    )}

                    {/* A/L Fields */}
                    {formData.currentQualification === "A/L" && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">A/L Stream</label>
                          <CustomSelect
                            value={formData.alStream}
                            onChange={(val) => handleChange("alStream", val)}
                            placeholder="Select your stream"
                            options={alStreams}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">Number of A/L Passes</label>
                          <CustomSelect
                            value={formData.alPasses}
                            onChange={(val) => handleChange("alPasses", val)}
                            placeholder="Select passes"
                            options={[0, 1, 2, 3, 4].map((num) => ({ value: String(num), label: `${num} passes` }))}
                          />
                        </div>
                      </div>
                    )}

                    {/* Higher Education Fields */}
                    {["Diploma", "HND", "Bachelor"].includes(formData.currentQualification) && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">Qualification Name (Optional)</label>
                          <AutocompleteInput
                            value={formData.qualificationName}
                            onChange={(val) => handleChange("qualificationName", val)}
                            placeholder="e.g., Pearson HND, SLIATE HND, NIBM Diploma"
                            options={commonQualificationNames}
                          />
                          <p className="text-xs text-gray-400 mt-2 font-medium">
                            Enter the specific qualification name if known to improve match accuracy.
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">Field of Study</label>
                          <CustomSelect
                            value={formData.fieldOfStudy}
                            onChange={(val) => handleChange("fieldOfStudy", val)}
                            placeholder="Select your field"
                            options={fieldsOfStudy}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-800 mb-2">GPA (Optional)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            value={formData.gpa}
                            onChange={(e) => handleChange("gpa", e.target.value)}
                            placeholder="Enter your GPA or leave blank"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-gray-900"
                          />
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 animate-in fade-in duration-700">
                      <Button
                        variant="primary"
                        onClick={handleFindCourses}
                        disabled={!isStepValid() || loading}
                        className="group relative overflow-hidden px-8 py-4 text-base font-bold shadow-xl shadow-primary-600/30 hover:shadow-2xl hover:shadow-primary-600/40 hover:-translate-y-1 transition-all duration-300 rounded-xl w-full sm:w-auto disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          {loading ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Matching Pathways...</>
                          ) : (
                            <>Find My Pathway <Sparkles className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" /></>
                          )}
                        </span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Summary (Timeline) */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-gray-200/50 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-primary-100 text-primary-600 rounded-xl">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900">Your Profile</h3>
                </div>

                {summaryItems.length > 0 ? (
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-gray-100">
                    {summaryItems.map((item, idx) => (
                      <div key={idx} className="relative animate-in slide-in-from-left-4 fade-in duration-500" style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                        <div className="absolute -left-6 top-2 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-white shadow-sm" />
                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-gray-100 transition-all hover:bg-primary-50/50 hover:border-primary-100">
                          <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wider mb-1 block">
                            {item.label}
                          </span>
                          <p className="text-sm font-bold text-gray-900">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 px-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                      <GraduationCap className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                      Select your education level to start building your profile timeline.
                    </p>
                  </div>
                )}

                {summaryItems.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100 animate-in fade-in duration-500">
                    <div className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-sm transition-colors ${
                      isStepValid() 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-gray-50 text-gray-500 border border-gray-100"
                    }`}>
                      <CheckCircle2 className={`w-5 h-5 ${isStepValid() ? "text-emerald-500" : "text-gray-400"}`} />
                      {isStepValid() ? "Ready to find your matches!" : "Please complete all required fields"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CareerPathway;
