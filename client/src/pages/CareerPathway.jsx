import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, ArrowRight, CheckCircle2, Loader2, Building2, Check, Sparkles } from "lucide-react";
import api from "../utils/api";
import Button from "../components/ui/Button";

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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 p-2.5 rounded-xl">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Career Pathway</h1>
              <p className="text-sm text-gray-500">Find courses you qualify for based on your education</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center max-w-md mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step.completed
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                      : index === (formData.currentQualification ? 1 : 0)
                      ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={`text-xs font-medium mt-2 ${
                    step.completed ? "text-emerald-600" : index === (formData.currentQualification ? 1 : 0) ? "text-primary-700" : "text-gray-400"
                  }`}>{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 mb-5 transition-all duration-500 ${
                    steps[index].completed ? "bg-emerald-400" : "bg-gray-200"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
        {/* Step 1: Select Education Level */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${formData.currentQualification ? "bg-emerald-100 text-emerald-700" : "bg-primary-100 text-primary-700"}`}>
              {formData.currentQualification ? <CheckCircle2 className="w-4 h-4" /> : "1"}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">What qualification do you currently hold?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQualifications.map((level) => (
              <button
                key={level.value}
                onClick={() => handleChange("currentQualification", level.value)}
                className={`group relative flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                  formData.currentQualification === level.value
                    ? "border-primary-500 bg-primary-50/50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm hover:-translate-y-0.5"
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${
                  formData.currentQualification === level.value ? "bg-primary-100" : "bg-gray-100 group-hover:bg-gray-200"
                }`}>
                  <level.icon className={`w-6 h-6 transition-colors ${
                    formData.currentQualification === level.value ? "text-primary-600" : "text-gray-500 group-hover:text-gray-700"
                  }`} />
                </div>
                <div>
                  <span className={`block font-semibold text-sm ${
                    formData.currentQualification === level.value ? "text-primary-900" : "text-gray-900"
                  }`}>
                    {level.label}
                  </span>
                  <span className="text-xs text-gray-500">{level.desc}</span>
                </div>
                {formData.currentQualification === level.value && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Enter Details */}
        {formData.currentQualification && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-fade-up animate-delay-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="text-lg font-semibold text-gray-900">Enter Your Details</h2>
            </div>

            {/* O/L Fields */}
            {formData.currentQualification === "O/L" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of O/L Passes</label>
                  <select
                    value={formData.olPasses}
                    onChange={(e) => handleChange("olPasses", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  >
                    <option value="">Select passes</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i}>{i} passes</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjects Passed (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {olSubjects.map((subject) => {
                      const selected = formData.olMandatorySubjects.includes(subject);
                      return (
                        <button
                          key={subject}
                          onClick={() => toggleSubject(subject)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                            selected
                              ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />}
                          {subject}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Select the subjects you have passed</p>
                </div>
              </div>
            )}

            {/* A/L Fields */}
            {formData.currentQualification === "A/L" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">A/L Stream</label>
                  <select
                    value={formData.alStream}
                    onChange={(e) => handleChange("alStream", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  >
                    <option value="">Select stream</option>
                    {alStreams.map((stream) => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of A/L Passes</label>
                  <select
                    value={formData.alPasses}
                    onChange={(e) => handleChange("alPasses", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  >
                    <option value="">Select passes</option>
                    {[0, 1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>{num} passes</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Higher Education Fields (Diploma / HND / Bachelor) */}
            {["Diploma", "HND", "Bachelor"].includes(formData.currentQualification) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Qualification Name (Optional)</label>
                  <input
                    list="qualification-names"
                    value={formData.qualificationName}
                    onChange={(e) => handleChange("qualificationName", e.target.value)}
                    placeholder="e.g., Pearson HND, SLIATE HND, NIBM Diploma"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  />
                  <datalist id="qualification-names">
                    {commonQualificationNames.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                  <p className="text-xs text-gray-400 mt-2">
                    Enter the specific qualification name if known. This improves match accuracy.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Field of Study</label>
                  <select
                    value={formData.fieldOfStudy}
                    onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  >
                    <option value="">Select your field</option>
                    {fieldsOfStudy.map((field) => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">GPA (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.gpa}
                    onChange={(e) => handleChange("gpa", e.target.value)}
                    placeholder="Leave blank if not sure, or enter your GPA"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        {formData.currentQualification && (
          <div className="flex justify-end animate-fade-up animate-delay-200">
            <Button
              variant="primary"
              onClick={handleFindCourses}
              disabled={!isStepValid() || loading}
              className="px-8 py-3 text-base shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Matching...
                </>
              ) : (
                <>
                  Find Courses <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
          </div>

          {/* Summary Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-gray-900">Your Selections</h3>
                </div>
                {summaryItems.length > 0 ? (
                  <div className="space-y-3">
                    {summaryItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</span>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Select a qualification to see your choices here.</p>
                  </div>
                )}
                {summaryItems.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      isStepValid() ? "text-emerald-600" : "text-gray-400"
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                      {isStepValid() ? "Ready to find courses" : "Complete all required fields"}
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
