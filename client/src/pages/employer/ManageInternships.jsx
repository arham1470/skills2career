import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2, AlertCircle, MapPin, Clock, Edit, Trash2,
  Plus, Briefcase, CheckCircle, X
} from "lucide-react";
import api from "../../utils/api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";

const STATUS_COLORS = { Active: "success", Draft: "warning", Closed: "danger" };

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

const ManageInternships = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "", category: "", location: "", mode: "On-site",
    salaryMin: "", salaryMax: "", description: "", responsibilities: "", deadline: "", status: "Draft"
  });
  const [editCoreSkills, setEditCoreSkills] = useState([]);
  const [editCoreSkillInput, setEditCoreSkillInput] = useState("");
  const [editAdditionalSkills, setEditAdditionalSkills] = useState([]);
  const [editAdditionalSkillInput, setEditAdditionalSkillInput] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/internships?status=${filter}`);
      setInternships(res.data.internships);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load internships" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInternships(); }, [filter]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Closed" : "Active";
    try {
      await api.patch(`/internships/${id}/status`, { status: newStatus });
      fetchInternships();
      setMessage({ type: "success", text: `Status changed to ${newStatus}` });
    } catch (err) {
      setMessage({ type: "error", text: "Status update failed" });
    }
  };

  const requestDelete = (id) => { setItemToDelete(id); setShowDeleteModal(true); };
  const confirmDelete = async () => {
    try {
      await api.delete(`/internships/${itemToDelete}`);
      setInternships(internships.filter(i => i._id !== itemToDelete));
      setMessage({ type: "success", text: "Internship deleted" });
    } catch (err) {
      setMessage({ type: "error", text: "Deletion failed" });
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  // EDIT HANDLERS
  const openEditModal = (job) => {
    setEditingInternship(job);
    setEditForm({
      title: job.title || "",
      category: job.category || "",
      location: job.location || "",
      mode: job.mode || "On-site",
      salaryMin: job.salaryMin || "",
      salaryMax: job.salaryMax || "",
      description: job.description || "",
      responsibilities: job.responsibilities || "",
      deadline: job.deadline ? job.deadline.split("T")[0] : "",
      status: job.status || "Draft"
    });
    setEditCoreSkills(job.coreSkills || []);
    setEditCoreSkillInput("");
    setEditAdditionalSkills(job.additionalSkills || []);
    setEditAdditionalSkillInput("");
    setShowEditModal(true);
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditCoreSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && editCoreSkillInput.trim()) {
      e.preventDefault();
      const newSkill = editCoreSkillInput.trim();
      if (!editCoreSkills.includes(newSkill)) setEditCoreSkills([...editCoreSkills, newSkill]);
      setEditCoreSkillInput("");
    }
  };

  const removeEditCoreSkill = (skill) => setEditCoreSkills(editCoreSkills.filter(s => s !== skill));

  const handleEditAdditionalSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && editAdditionalSkillInput.trim()) {
      e.preventDefault();
      const newSkill = editAdditionalSkillInput.trim();
      if (!editAdditionalSkills.includes(newSkill)) setEditAdditionalSkills([...editAdditionalSkills, newSkill]);
      setEditAdditionalSkillInput("");
    }
  };

  const removeEditAdditionalSkill = (skill) => setEditAdditionalSkills(editAdditionalSkills.filter(s => s !== skill));

  const submitEdit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!editForm.title || !editForm.category || !editForm.location || !editForm.description) {
      return setMessage({ type: "error", text: "Please fill all required fields" });
    }
    if (editCoreSkills.length === 0) {
      return setMessage({ type: "error", text: "Add at least one core skill" });
    }
    if (editForm.salaryMin && editForm.salaryMax && Number(editForm.salaryMin) > Number(editForm.salaryMax)) {
      return setMessage({ type: "error", text: "Minimum salary cannot exceed maximum salary" });
    }

    setEditLoading(true);
    try {
      await api.put(`/internships/${editingInternship._id}`, {
        ...editForm,
        salaryMin: Number(editForm.salaryMin) || 0,
        salaryMax: Number(editForm.salaryMax) || 0,
        coreSkills: editCoreSkills,
        additionalSkills: editAdditionalSkills
      });
      setMessage({ type: "success", text: "Internship updated successfully" });
      setShowEditModal(false);
      fetchInternships();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Internships</h1>
          <p className="text-gray-500 mt-1">View, edit, and control the visibility of your postings.</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/employer/post")}>
          <Plus className="w-4 h-4 mr-2" /> Post New
        </Button>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {["All", "Active", "Draft", "Closed"].map(status => (
          <button key={status} onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${filter === status ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"}`}>
            {status}
          </button>
        ))}
      </div>

      {internships.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No internships found</h3>
          <p className="text-gray-500 mt-1">Try changing the filter or post a new internship.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {internships.map(job => (
            <div key={job._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <Badge variant={STATUS_COLORS[job.status]}>{job.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.mode}</span>
                    <span className="flex items-center gap-1">LKR {job.salaryMin || 0} - {job.salaryMax || 0}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.coreSkills?.slice(0, 3).map(s => <span key={s} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded font-medium">{s}</span>)}
                    {job.additionalSkills?.slice(0, 2).map(s => <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">{s}</span>)}
                    {(job.coreSkills?.length + job.additionalSkills?.length) > 5 && <span className="text-xs text-gray-400">+{(job.coreSkills?.length || 0) + (job.additionalSkills?.length || 0) - 5}</span>}
                  </div>
                  {job.responsibilities && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Responsibilities:</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{job.responsibilities}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleStatus(job._id, job.status)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${job.status === "Active" ? "bg-emerald-500" : "bg-gray-300"}`}
                    title={job.status === "Active" ? "Click to close" : "Click to activate"}
                    aria-pressed={job.status === "Active"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${job.status === "Active" ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>
                  <button onClick={() => openEditModal(job)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => requestDelete(job._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Internship?"
        message="This will permanently remove the posting and all associated data. This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fade-up">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Internship</h2>
            
            {message.text && showEditModal && (
              <div className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-4 ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            )}

            <form onSubmit={submitEdit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <input name="title" required value={editForm.title} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <select name="category" required value={editForm.category} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white text-sm">
                    <option value="">Select</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                  <select name="location" required value={editForm.location} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white text-sm">
                    <option value="">Select</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <select name="mode" value={editForm.mode} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white text-sm">
                    {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input type="date" name="deadline" value={editForm.deadline} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min</label>
                  <input type="number" name="salaryMin" value={editForm.salaryMin} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max</label>
                  <input type="number" name="salaryMax" value={editForm.salaryMax} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Core Skills <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-primary-500 bg-white">
                    {editCoreSkills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-md text-xs font-medium">
                        {skill}
                        <button type="button" onClick={() => removeEditCoreSkill(skill)} className="text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={editCoreSkillInput}
                      onChange={(e) => setEditCoreSkillInput(e.target.value)}
                      onKeyDown={handleEditCoreSkillKeyDown}
                      className="flex-1 min-w-[100px] outline-none text-sm bg-transparent"
                      placeholder={editCoreSkills.length === 0 ? "Type & press Enter" : "Add more..."}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Skills</label>
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-primary-500 bg-white">
                    {editAdditionalSkills.map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md text-xs font-medium">
                        {skill}
                        <button type="button" onClick={() => removeEditAdditionalSkill(skill)} className="text-primary-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={editAdditionalSkillInput}
                      onChange={(e) => setEditAdditionalSkillInput(e.target.value)}
                      onKeyDown={handleEditAdditionalSkillKeyDown}
                      className="flex-1 min-w-[100px] outline-none text-sm bg-transparent"
                      placeholder={editAdditionalSkills.length === 0 ? "Type & press Enter" : "Add more..."}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea name="description" required rows="4" value={editForm.description} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                <textarea name="responsibilities" rows="3" value={editForm.responsibilities} onChange={handleEditChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="List key responsibilities..." />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button type="submit" disabled={editLoading} className="min-w-[120px]">
                  {editLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Update Internship"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInternships;