import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, ArrowRight, ChevronDown, CheckCircle2, Loader2, Building2 } from "lucide-react";
import api from "../utils/api";
import Button from "../components/ui/Button";

const educationLevels = [
  { value: "O/L", label: "O/L (Ordinary Level)", icon: GraduationCap },
  { value: "A/L", label: "A/L (Advanced Level)", icon: GraduationCap },
  { value: "Diploma", label: "Diploma", icon: BookOpen },
  { value: "HND", label: "HND (Higher National Diploma)", icon: BookOpen },
  { value: "Bachelor", label: "Bachelor's Degree", icon: Building2 },
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

const CareerPathway = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    educationLevel: "",
    olPasses: "",
    olMandatorySubjects: [],
    alStream: "",
    alPasses: "",
    gpa: "",
    fieldOfStudy: "",
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
        educationLevel: formData.educationLevel,
      };

      if (formData.educationLevel === "O/L") {
        payload.olPasses = formData.olPasses ? parseInt(formData.olPasses) : null;
        payload.olMandatorySubjects = formData.olMandatorySubjects;
      } else if (formData.educationLevel === "A/L") {
        payload.alStream = formData.alStream;
        payload.alPasses = formData.alPasses ? parseInt(formData.alPasses) : null;
      } else {
        payload.gpa = formData.gpa ? parseFloat(formData.gpa) : null;
        payload.fieldOfStudy = formData.fieldOfStudy || "Any";
      }

      const res = await api.post("/career-pathway/match", payload);
      navigate("/career-pathway/results", { state: { results: res.data.courses, formData } });
    } catch (error) {
      console.error("Failed to match courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (!formData.educationLevel) return false;
    if (formData.educationLevel === "O/L") {
      return formData.olPasses !== "";
    }
    if (formData.educationLevel === "A/L") {
      return formData.alStream !== "" && formData.alPasses !== "";
    }
    return formData.fieldOfStudy !== "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
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

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step 1: Select Education Level */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${formData.educationLevel ? "bg-emerald-100 text-emerald-700" : "bg-primary-100 text-primary-700"}`}>
              {formData.educationLevel ? <CheckCircle2 className="w-4 h-4" /> : "1"}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Select Your Education Level</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {educationLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => handleChange("educationLevel", level.value)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  formData.educationLevel === level.value
                    ? "border-primary-500 bg-primary-50/50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`p-2 rounded-lg ${formData.educationLevel === level.value ? "bg-primary-100" : "bg-gray-100"}`}>
                  <level.icon className={`w-5 h-5 ${formData.educationLevel === level.value ? "text-primary-600" : "text-gray-500"}`} />
                </div>
                <span className={`font-medium ${formData.educationLevel === level.value ? "text-primary-900" : "text-gray-700"}`}>
                  {level.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Enter Details */}
        {formData.educationLevel && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="text-lg font-semibold text-gray-900">Enter Your Details</h2>
            </div>

            {/* O/L Fields */}
            {formData.educationLevel === "O/L" && (
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
                    {olSubjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => toggleSubject(subject)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          formData.olMandatorySubjects.includes(subject)
                            ? "bg-primary-100 text-primary-700 border border-primary-300"
                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Select the subjects you have passed</p>
                </div>
              </div>
            )}

            {/* A/L Fields */}
            {formData.educationLevel === "A/L" && (
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

            {/* HND / Bachelor / Diploma Fields */}
            {["HND", "Bachelor", "Diploma"].includes(formData.educationLevel) && (
              <div className="space-y-4">
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
                  <p className="text-xs text-gray-400 mt-2">
                    Select the field of your {formData.educationLevel}. This helps match courses that require a specific background.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        {formData.educationLevel && (
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleFindCourses}
              disabled={!isStepValid() || loading}
              className="px-8 py-3 text-base"
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
    </div>
  );
};

export default CareerPathway;
