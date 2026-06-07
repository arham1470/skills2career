import PageLoader from "../../components/ui/PageLoader";
import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Save, Pencil, Briefcase, MapPin, Wallet, Monitor, FileText } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";

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

const SALARY_LABELS = {
  "0-25000": "0 - 25,000",
  "25000-50000": "25,000 - 50,000",
  "50000-75000": "50,000 - 75,000",
  "75000+": "75,000+",
  "Unpaid": "Unpaid / Volunteer",
  "": "Not set"
};

const PreviewTag = ({ label }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
    {label}
  </span>
);

const EmptyTag = ({ label }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-400 border border-gray-100">
    {label}
  </span>
);

const PreviewCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-400" />
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h2>
    </div>
    <div className="flex flex-wrap gap-2">
      {children}
    </div>
  </div>
);

const Preferences = () => {
  const [form, setForm] = useState({ categories: [], workingMode: [], expectedSalary: "", preferredLocations: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await api.get("/seeker/preferences");
        setForm({
          categories: res.data.preferences.categories || [],
          workingMode: res.data.preferences.workingMode || [],
          expectedSalary: res.data.preferences.expectedSalary || "",
          preferredLocations: res.data.preferences.preferredLocations || []
        });
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load preferences" });
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const toggleArray = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.put("/seeker/preferences", form);
      setMessage({ type: "success", text: "Preferences saved successfully" });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Internship Preferences</h1>
          <p className="text-gray-500 mt-1">Customize your search to get highly relevant recommendations.</p>
        </div>
        {!isEditing && (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
        )}
      </div>

      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2">
              {CATEGORIES.map(cat => (
                <label key={cat} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${form.categories.includes(cat) ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="checkbox" checked={form.categories.includes(cat)} onChange={() => toggleArray("categories", cat)} className="hidden" />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${form.categories.includes(cat) ? "bg-primary-600 border-primary-600" : "border-gray-300 bg-white"}`}>
                    {form.categories.includes(cat) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Working Mode</h2>
              <div className="flex flex-wrap gap-3">
                {MODES.map(mode => (
                  <button type="button" key={mode} onClick={() => toggleArray("workingMode", mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${form.workingMode.includes(mode) ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-700 border-gray-300 hover:border-primary-400"}`}>
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Expected Salary (LKR)</h2>
              <select value={form.expectedSalary} onChange={(e) => setForm({...form, expectedSalary: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
                <option value="">Select range</option>
                <option value="0-25000">0 - 25,000</option>
                <option value="25000-50000">25,000 - 50,000</option>
                <option value="50000-75000">50,000 - 75,000</option>
                <option value="75000+">75,000+</option>
                <option value="Unpaid">Unpaid / Volunteer</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Preferred Locations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-52 overflow-y-auto pr-2">
              {LOCATIONS.map(loc => (
                <label key={loc} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${form.preferredLocations.includes(loc) ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="checkbox" checked={form.preferredLocations.includes(loc)} onChange={() => toggleArray("preferredLocations", loc)} className="hidden" />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${form.preferredLocations.includes(loc) ? "bg-primary-600 border-primary-600" : "border-gray-300 bg-white"}`}>
                    {form.preferredLocations.includes(loc) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm text-gray-700">{loc}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="min-w-[160px]">
              {saving ? <FileText className="w-5 h-5 animate-pulse mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Save Preferences
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <PreviewCard title="Categories" icon={Briefcase}>
            {form.categories.length > 0
              ? form.categories.map(c => <PreviewTag key={c} label={c} />)
              : <EmptyTag label="No categories selected" />}
          </PreviewCard>

          <div className="grid md:grid-cols-2 gap-4">
            <PreviewCard title="Working Mode" icon={Monitor}>
              {form.workingMode.length > 0
                ? form.workingMode.map(m => <PreviewTag key={m} label={m} />)
                : <EmptyTag label="No mode selected" />}
            </PreviewCard>

            <PreviewCard title="Expected Salary" icon={Wallet}>
              <PreviewTag label={SALARY_LABELS[form.expectedSalary] || "Not set"} />
            </PreviewCard>
          </div>

          <PreviewCard title="Preferred Locations" icon={MapPin}>
            {form.preferredLocations.length > 0
              ? form.preferredLocations.map(l => <PreviewTag key={l} label={l} />)
              : <EmptyTag label="No locations selected" />}
          </PreviewCard>
        </div>
      )}
    </div>
  );
};

export default Preferences;