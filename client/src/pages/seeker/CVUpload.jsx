import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, AlertCircle, Upload, FileText, Trash2 } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";

const CVUpload = () => {
  const [cv, setCv] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await api.get("/seeker/cv");
        setCv(res.data.cv);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load CV status" });
      } finally {
        setLoading(false);
      }
    };
    fetchCV();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg"];
      if (!allowed.includes(selected.type)) {
        return setMessage({ type: "error", text: "Invalid format. Allowed: PDF, DOC, DOCX, PNG, JPG, JPEG" });
      }
      setFile(selected);
      setMessage({ type: "", text: "" });
    }
  };

  const handleUpload = async () => {
    if (!file) return setMessage({ type: "error", text: "Please select a CV file" });
    setUploading(true);
    const formData = new FormData();
    formData.append("cvFile", file);
    try {
      const res = await api.post("/seeker/cv", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setCv(res.data.cv);
      setFile(null);
      setMessage({ type: "success", text: "CV uploaded successfully" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Curriculum Vitae (CV)</h1>
        <p className="text-gray-500 mt-1">Upload your latest CV. Allowed formats: PDF, DOC, DOCX, PNG, JPG, JPEG.</p>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
        {cv?.fileName ? (
          <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <FileText className="w-8 h-8 text-emerald-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{cv.fileName}</p>
              <p className="text-xs text-gray-500">Uploaded on {new Date(cv.uploadedAt).toLocaleString()}</p>
            </div>
            <a href={`http://localhost:5000${cv.filePath}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:underline">View CV</a>
          </div>
        ) : (
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No CV uploaded yet.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">{file ? file.name : "Choose new CV..."}</span>
            <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
          </label>
          <Button onClick={handleUpload} disabled={uploading || !file} className="min-w-[120px]">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload CV"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;