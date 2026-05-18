import React, { useState, useEffect } from "react";
import { Camera, Loader2, CheckCircle, AlertCircle, Pencil, X, User } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import { getImageUrl } from "../../utils/getImageUrl";

const InfoRow = ({ label, value, isEmpty }) => (
  <div className="p-3 rounded-lg bg-gray-50/50 border border-transparent hover:border-primary-200 hover:bg-primary-50/30 hover:shadow-sm transition-all duration-300 cursor-default">
    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
      {label}
    </label>
    {isEmpty ? (
      <span className="text-sm text-gray-400 italic flex items-center gap-1.5">
        <AlertCircle className="w-3 h-3" />
        Not set — add to improve matches
      </span>
    ) : (
      <p className="text-sm font-medium text-gray-900">{value}</p>
    )}
  </div>
);

const Profile = () => {
  const [form, setForm] = useState({ fullName: "", phone: "", address: "" });
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/seeker/profile");
        const { profile, email: userEmail } = res.data;
        setForm({
          fullName: profile.fullName || "",
          phone: profile.phone || "",
          address: profile.address || "",
        });
        setEmail(userEmail);
        setProfileImage(profile.profileImage || "");
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load profile" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("profileImage", file);
    try {
      const res = await api.post("/seeker/profile/image", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setProfileImage(res.data.imageUrl);
      setPreview(null);
      setMessage({ type: "success", text: "Profile image updated" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.put("/seeker/profile", form);
      setMessage({ type: "success", text: "Profile saved successfully" });
      setIsEditing(false);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="animate-fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 mt-1">Manage your personal information and profile photo.</p>
        </div>
        {!isEditing && (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`animate-fade-up animate-delay-100 flex items-center gap-2 p-4 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Identity Card */}
      <div className="animate-fade-up animate-delay-200 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Cover banner */}
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600" />
        <div className="px-6 pb-6 relative text-center">
          {/* Avatar */}
          <div className="relative -mt-12 mb-4 inline-block">
            <img
              src={preview || getImageUrl(profileImage, form.fullName || "Student")}
              alt="Profile"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&name=${encodeURIComponent(form.fullName || "Student")}`;
              }}
            />
            <label className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
                disabled={uploading}
              />
            </label>
            {uploading && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900">{form.fullName || "Your Name"}</h2>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="animate-fade-up animate-delay-300 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Personal Information</h3>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="+94 7X XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="City, District"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" disabled={saving} className="min-w-[120px]">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow label="Full Name" value={form.fullName} isEmpty={!form.fullName} />
              <InfoRow label="Email Address" value={email} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow label="Phone Number" value={form.phone} isEmpty={!form.phone} />
              <InfoRow label="Address" value={form.address} isEmpty={!form.address} />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;