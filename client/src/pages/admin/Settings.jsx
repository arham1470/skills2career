import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, Trash2, X, Pencil, Shield, Eye, EyeOff, FileText } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false, delete: false });

  const toggleShow = (key) => setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError("");
    if (!deletePassword) {
      return setDeleteError("Please enter your current password to confirm");
    }
    setDeleting(true);
    try {
      await api.delete("/admin/account", { data: { currentPassword: deletePassword } });
      logout();
      navigate("/");
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete account");
      setDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (form.newPassword !== form.confirmPassword) {
      return setMessage({ type: "error", text: "New passwords do not match" });
    }
    if (form.newPassword.length < 6) {
      return setMessage({ type: "error", text: "New password must be at least 6 characters" });
    }

    setSaving(true);
    try {
      await api.put("/admin/password", { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setMessage({ type: "success", text: "Password updated successfully" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsEditingPassword(false);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">Update your password and security preferences.</p>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Security Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Security</h3>
          </div>
          {!isEditingPassword && (
            <Button variant="secondary" onClick={() => setIsEditingPassword(true)}>
              <Pencil className="w-4 h-4 mr-1.5" /> Change Password
            </Button>
          )}
        </div>

        {isEditingPassword ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input type={showPassword.current ? "text" : "password"} name="currentPassword" required value={form.currentPassword} onChange={handleChange} className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                <button type="button" onClick={() => toggleShow("current")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input type={showPassword.new ? "text" : "password"} name="newPassword" required value={form.newPassword} onChange={handleChange} className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                  <button type="button" onClick={() => toggleShow("new")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input type={showPassword.confirm ? "text" : "password"} name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
                  <button type="button" onClick={() => toggleShow("confirm")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => { setIsEditingPassword(false); setForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button type="submit" disabled={saving} className="min-w-[140px]">
                {saving ? <FileText className="w-5 h-5 animate-pulse" /> : "Update Password"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-gray-50/50 border border-transparent hover:border-primary-200 hover:bg-primary-50/30 hover:shadow-sm transition-all duration-300 cursor-default">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Password</label>
                <p className="text-sm font-medium text-gray-900">••••••••</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50/50 border border-transparent hover:border-primary-200 hover:bg-primary-50/30 hover:shadow-sm transition-all duration-300 cursor-default">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Last Updated</label>
                <p className="text-sm font-medium text-gray-400 italic">Unknown</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-gray-200 border-t-4 border-t-red-500 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Danger Zone</h3>
        </div>
        <p className="text-sm text-red-600/80 mb-4">
          Deleting your admin account will permanently remove your access to the admin panel. This action cannot be undone.
        </p>
        <Button
          variant="secondary"
          onClick={() => { setShowDeleteDialog(true); setDeletePassword(""); setDeleteError(""); }}
          className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 hover:text-red-800 focus:ring-red-500"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Delete Account?</h3>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={deleting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete your admin account and all associated data. Enter your current password to confirm.
            </p>
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword.delete ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="Enter current password"
                    disabled={deleting}
                  />
                  <button type="button" onClick={() => toggleShow("delete")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword.delete ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {deleteError && (
                <div className="flex items-center gap-2 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                  <AlertCircle className="w-4 h-4" />
                  {deleteError}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1"
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500"
                >
                  {deleting ? <FileText className="w-5 h-5 animate-pulse" /> : "Yes, Delete"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
