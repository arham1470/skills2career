import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, AlertCircle, Plus, X, ArrowRight, Calendar, ShieldCheck, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import CustomSelect from "../../components/ui/CustomSelect";
import SkillsAutocomplete from "../../components/ui/SkillsAutocomplete";

const CATEGORIES = [
  "Business & Administration", "Design & Creative Industries", "Education & Training",
  "Engineering & Manufacturing", "Finance & Accounting", "Government & Public Sector",
  "Healthcare & Wellness", "Hospitality & Tourism", "Legal & Compliance",
  "Marketing & Communications", "Media & Entertainment", "Research & Development",
  "Sales & Retail", "Social Services & Non-Profit", "Technology & IT",
  "Architecture and Town Planning", "Environmental and Occupational Health",
  "Creative Writing, Content & Translation", "Other"
];

const LOCATIONS = [
  "Colombo", "Gampaha", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara",
  "Hambantota", "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu",
  "Batticaloa", "Ampara", "Trincomalee", "Polonnaruwa", "Badulla", "Moneragala",
  "Puttalam", "Anuradhapura", "Kurunegala", "Ratnapura", "Kegalle"
];

const MODES = ["On-site", "Remote", "Hybrid"];

const PostInternship = () => {
  const [form, setForm] = useState({
    title: "", category: "", location: "", mode: "On-site",
    salaryMin: "", salaryMax: "", description: "", responsibilities: "", deadline: "", status: "Draft"
  });
  const [coreSkills, setCoreSkills] = useState([]);
  const [additionalSkills, setAdditionalSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [profileCompletion, setProfileCompletion] = useState(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    api.get("/company/dashboard-stats")
      .then(res => {
        setProfileCompletion(res.data.profileCompletion);
        setVerified(res.data.verified);
      })
      .catch(() => {
        setProfileCompletion(0);
        setVerified(false);
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const removeCoreSkill = (skill) => setCoreSkills(coreSkills.filter(s => s !== skill));
  const removeAdditionalSkill = (skill) => setAdditionalSkills(additionalSkills.filter(s => s !== skill));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.title || !form.category || !form.location || !form.description) {
      return setMessage({ type: "error", text: "Please fill all required fields" });
    }
    if (coreSkills.length === 0) {
      return setMessage({ type: "error", text: "Add at least one core skill" });
    }
    if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax)) {
      return setMessage({ type: "error", text: "Minimum salary cannot exceed maximum salary" });
    }

    setLoading(true);
    try {
      await api.post("/internships", {
        ...form,
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
        coreSkills,
        additionalSkills
      });
      setMessage({ type: "success", text: "Internship posted successfully" });
      setForm({ title: "", category: "", location: "", mode: "On-site", salaryMin: "", salaryMax: "", description: "", responsibilities: "", deadline: "", status: "Draft" });
      setCoreSkills([]);
      setAdditionalSkills([]);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to post internship" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post New Internship</h1>
        <p className="text-gray-500 mt-1">Fill in the details to publish a new opportunity for students.</p>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {profileCompletion !== null && profileCompletion < 100 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">Profile Incomplete</p>
            <p className="text-sm text-amber-700 mt-1">
              Your company profile is <strong>{profileCompletion}%</strong> complete. You must complete it to <strong>100%</strong> before posting internships.
            </p>
            <div className="mt-3">
              <Link to="/provider/profile" className="inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:text-amber-900 underline">
                Complete Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {profileCompletion !== null && profileCompletion === 100 && !verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">Pending Admin Verification</p>
            <p className="text-sm text-amber-700 mt-1">
              Your company profile is complete and awaiting admin approval. You cannot post internships until verified.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 relative ${profileCompletion !== null && (profileCompletion < 100 || !verified) ? "opacity-60 pointer-events-none" : ""}`}>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Internship Title <span className="text-red-500">*</span></label>
            <input name="title" required value={form.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. Frontend Developer Intern" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
            <CustomSelect
              value={form.category}
              onChange={(value) => setForm({ ...form, category: value })}
              options={CATEGORIES}
              placeholder="Select Category"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
            <CustomSelect
              value={form.location}
              onChange={(value) => setForm({ ...form, location: value })}
              options={LOCATIONS}
              placeholder="Select Location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Working Mode</label>
            <CustomSelect
              value={form.mode}
              onChange={(value) => setForm({ ...form, mode: value })}
              options={MODES}
              placeholder="Select Mode"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
            <div className="relative">
              <DatePicker
                selected={form.deadline ? new Date(form.deadline) : null}
                onChange={(date) => setForm({ ...form, deadline: date ? date.toISOString().split('T')[0] : "" })}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select deadline"
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-sm text-gray-900"
                wrapperClassName="w-full"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={new Date()}
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min (LKR)</label>
            <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max (LKR)</label>
            <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="0" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Core Skills <span className="text-red-500">*</span></label>
            <SkillsAutocomplete
              selectedSkills={coreSkills}
              onAddSkill={(skill) => setCoreSkills([...coreSkills, skill])}
              onRemoveSkill={(skill) => setCoreSkills(coreSkills.filter(s => s !== skill))}
              skillType="core"
              category={form.category}
              placeholder="Type skill & press Enter"
            />
            <p className="text-xs text-gray-500 mt-1">Most important skills for this role (3-4 recommended).</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Skills</label>
            <SkillsAutocomplete
              selectedSkills={additionalSkills}
              onAddSkill={(skill) => setAdditionalSkills([...additionalSkills, skill])}
              onRemoveSkill={(skill) => setAdditionalSkills(additionalSkills.filter(s => s !== skill))}
              skillType="additional"
              category={form.category}
              placeholder="Type skill & press Enter"
            />
            <p className="text-xs text-gray-500 mt-1">Nice-to-have skills that improve a candidate&apos;s profile.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
          <textarea name="description" required rows="5" value={form.description} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Describe the internship overview, requirements, and benefits..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
          <textarea name="responsibilities" rows="4" value={form.responsibilities} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="List key responsibilities and duties..." />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => setForm({...form, status: "Draft"})}>Save as Draft</Button>
          <Button type="submit" disabled={loading} className="min-w-[140px]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
            Publish Internship
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostInternship;