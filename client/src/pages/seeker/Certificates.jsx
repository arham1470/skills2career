import PageLoader from "../../components/ui/PageLoader";
import React, { useState, useEffect } from "react";
import {  CheckCircle, AlertCircle, Upload, FileText, Trash2, Download, Calendar, Plus, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal"; // Import Modal

const Certificates = () => {
  const [form, setForm] = useState({ name: "", description: "", issuedDate: "" });
  const [file, setFile] = useState(null);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Modal State
  const [isAdding, setIsAdding] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await api.get("/seeker/certificates");
        setCerts(res.data.certificates);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load certificates" });
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage({ type: "error", text: "Please select a certificate file" });
    setUploading(true);
    setMessage({ type: "", text: "" });
    const formData = new FormData();
    formData.append("certificateFile", file);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("issuedDate", form.issuedDate);

    try {
      const res = await api.post("/seeker/certificates", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setCerts([...certs, res.data.certificate]);
      setForm({ name: "", description: "", issuedDate: "" });
      setFile(null);
      setIsAdding(false);
      setMessage({ type: "success", text: "Certificate uploaded successfully" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  // Open Modal
  const requestDelete = (id) => {
    setCertToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm Action inside Modal
  const confirmDelete = async () => {
    if (!certToDelete) return;
    try {
      await api.delete(`/seeker/certificates/${certToDelete}`);
      setCerts(certs.filter(c => c._id !== certToDelete));
      setMessage({ type: "success", text: "Certificate deleted successfully" });
    } catch (err) {
      setMessage({ type: "error", text: "Deletion failed" });
    } finally {
      setShowDeleteModal(false);
      setCertToDelete(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-500 mt-1">Upload and manage your professional certifications.</p>
        </div>
        {!isAdding && (
          <Button variant="primary" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Certificate
          </Button>
        )}
      </div>

      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {isAdding && (
      <form onSubmit={handleUpload} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name</label>
            <input name="name" required value={form.name} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. AWS Cloud Practitioner" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issued Date</label>
            <div className="relative">
              <DatePicker
                selected={form.issuedDate ? new Date(form.issuedDate) : null}
                onChange={(date) => setForm({ ...form, issuedDate: date ? date.toISOString().split('T')[0] : "" })}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select issue date"
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-sm text-gray-900"
                wrapperClassName="w-full"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows="2" value={form.description} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Brief details about the certification..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certificate File (PNG, JPG, PDF)</label>
          <div className="flex items-center gap-4">
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">{file ? file.name : "Choose file..."}</span>
              <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => { setIsAdding(false); setFile(null); setForm({ name: "", description: "", issuedDate: "" }); }}>
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
          <Button type="submit" disabled={uploading} className="min-w-[120px]">
            {uploading ? <FileText className="w-5 h-5 animate-pulse" /> : "Upload"}
          </Button>
        </div>
      </form>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Uploaded Certificates</h2>
        {certs.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">No certificates uploaded yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {certs.map((cert) => (
              <div key={cert._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-50 p-2 rounded-lg"><FileText className="w-5 h-5 text-primary-600" /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{cert.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cert.description}</p>
                    <p className="text-xs text-gray-400 mt-2">Issued: {new Date(cert.issuedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                  <a href={`http://localhost:5000${cert.filePath}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 py-2 rounded-lg transition-colors">
                    <Download className="w-4 h-4" /> View
                  </a>
                  {/* Trigger Modal instead of window.confirm */}
                  <button onClick={() => requestDelete(cert._id)} className="flex items-center justify-center gap-1.5 text-sm font-medium text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Certificate?"
        message="Are you sure you want to delete this certificate? This action cannot be undone and the file will be permanently removed."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Certificates;