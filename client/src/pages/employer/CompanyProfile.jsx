import PageLoader from "../../components/ui/PageLoader";
import React, { useState, useEffect } from "react";
import { Camera, CheckCircle, AlertCircle, Building2, Globe, MapPin, Phone, Mail, ShieldCheck, ShieldAlert, Lock, Pencil, X, FileText } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import CustomSelect from "../../components/ui/CustomSelect";
import { getImageUrl } from "../../utils/getImageUrl";

const CATEGORIES = [
  "Business & Administration", "Design & Creative Industries", "Education & Training",
  "Engineering & Manufacturing", "Finance & Accounting", "Government & Public Sector",
  "Healthcare & Wellness", "Hospitality & Tourism", "Legal & Compliance",
  "Marketing & Communications", "Media & Entertainment", "Research & Development",
  "Sales & Retail", "Social Services & Non-Profit", "Technology & IT",
  "Architecture and Town Planning", "Environmental and Occupational Health",
  "Creative Writing, Content & Translation", "Other"
];

const CompanyProfile = () => {
  const [form, setForm] = useState({ companyName: "", industry: "", description: "", website: "", contactEmail: "", contactPhone: "", location: "" });
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [verified, setVerified] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/company/profile");
        const { profile, email: userEmail } = res.data;
        setForm({
          companyName: profile.companyName || "",
          industry: profile.industry || "",
          description: profile.description || "",
          website: profile.website || "",
          contactEmail: profile.contactEmail || "",
          contactPhone: profile.contactPhone || "",
          location: profile.location || ""
        });
        setEmail(userEmail);
        setLogo(profile.logo || "");
        setVerified(profile.verified ?? false);

        // Calculate completion locally for UI lock logic
        const fields = [
          profile.companyName, profile.industry, profile.description,
          profile.website, profile.contactEmail, profile.contactPhone,
          profile.location, profile.logo
        ];
        const filled = fields.filter(Boolean).length;
        setProfileCompletion(Math.round((filled / fields.length) * 100));
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load profile" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isLocked = profileCompletion === 100 && !verified;

  const handleImageChange = (e) => {
    if (isLocked) return;
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      uploadLogo(file);
    }
  };

  const uploadLogo = async (file) => {
  if (isLocked) return;
  setUploading(true);
  const formData = new FormData();
  formData.append("logo", file);
  try {
    const res = await api.post("/company/profile/logo", formData, { headers: { "Content-Type": "multipart/form-data" } });
    setLogo(res.data.logoUrl);
    setPreview(null);
    setMessage({ type: "success", text: "Logo updated successfully" });
  } catch (err) {
    setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
  } finally {
    setUploading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.put("/company/profile", form);
      setMessage({ type: "success", text: "Company profile saved successfully" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  const InfoRow = ({ label, value, isEmpty }) => (
    <div className="p-3 rounded-lg bg-gray-50/50 border border-transparent hover:border-primary-200 hover:bg-primary-50/30 hover:shadow-sm transition-all duration-300 cursor-default">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {isEmpty ? (
        <span className="text-sm text-gray-400 italic flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" /> Not set
        </span>
      ) : (
        <p className="text-sm font-medium text-gray-900">{value}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-500 mt-1">Manage your business details and branding.</p>
        </div>
        {!isEditing && !isLocked && (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
        )}
      </div>

      {/* Messages */}
      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {isLocked && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">Profile Locked</p>
            <p className="text-sm text-amber-700 mt-1">
              Your company profile is complete and pending admin verification. Editing is locked until approved.
            </p>
          </div>
        </div>
      )}

      {/* Identity Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600" />
        <div className="px-6 pb-6 relative text-center">
          <div className="relative -mt-12 mb-4 inline-block">
            <img
              src={preview || getImageUrl(logo, form.companyName || "Company")}
              alt="Company Logo"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&name=${encodeURIComponent(form.companyName || "Company")}`; }}
            />
            <label className={`absolute bottom-0 right-0 text-white p-2 rounded-full shadow-lg transition-colors ${isLocked ? "bg-gray-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700 cursor-pointer"}`}>
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} disabled={uploading || isLocked} />
            </label>
            {uploading && <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center"><FileText className="w-5 h-5 animate-pulse text-white" /></div>}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{form.companyName || "Your Company"}</h2>
          <p className="text-sm text-gray-500">{email}</p>
          {isLocked ? (
            <span className="inline-flex items-center gap-1 mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <ShieldAlert className="w-3 h-3" /> Pending Verification
            </span>
          ) : verified ? (
            <span className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          ) : null}
        </div>
      </div>

      {/* Company Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Company Information</h3>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" name="companyName" value={form.companyName} onChange={handleChange} disabled={isLocked} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-gray-100 disabled:text-gray-500" placeholder="Your Company Ltd." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <CustomSelect
                  value={form.industry}
                  onChange={(value) => !isLocked && setForm({ ...form, industry: value })}
                  options={CATEGORIES}
                  placeholder="Select Industry"
                  disabled={isLocked}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows="3" value={form.description} onChange={handleChange} disabled={isLocked} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-gray-100 disabled:text-gray-500" placeholder="Brief overview of your company..." />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-gray-400" /> Website
                </label>
                <input type="text" name="website" value={form.website} onChange={handleChange} disabled={isLocked} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-gray-100 disabled:text-gray-500" placeholder="https://website.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> Location
                </label>
                <input type="text" name="location" value={form.location} onChange={handleChange} disabled={isLocked} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-gray-100 disabled:text-gray-500" placeholder="Colombo, Sri Lanka" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> Contact Email
                </label>
                <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} disabled={isLocked} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-gray-100 disabled:text-gray-500" placeholder="hr@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> Contact Phone
                </label>
                <input type="tel" name="contactPhone" value={form.contactPhone} onChange={handleChange} disabled={isLocked} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:bg-gray-100 disabled:text-gray-500" placeholder="+94 11 234 5678" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" disabled={saving || isLocked} className="min-w-[120px]">
                {saving ? <FileText className="w-5 h-5 animate-pulse" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow label="Company Name" value={form.companyName} isEmpty={!form.companyName} />
              <InfoRow label="Industry" value={form.industry} isEmpty={!form.industry} />
            </div>
            <InfoRow label="Description" value={form.description} isEmpty={!form.description} />
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow label="Website" value={form.website} isEmpty={!form.website} />
              <InfoRow label="Location" value={form.location} isEmpty={!form.location} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow label="Contact Email" value={form.contactEmail} isEmpty={!form.contactEmail} />
              <InfoRow label="Contact Phone" value={form.contactPhone} isEmpty={!form.contactPhone} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;