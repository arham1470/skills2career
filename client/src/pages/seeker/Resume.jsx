import React, { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle, AlertCircle, Plus, Trash2, Eye, Printer, MapPin, Phone, Mail, Calendar, Upload, FileText, Download, X, Link, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";
import SkillsAutocomplete from "../../components/ui/SkillsAutocomplete";
import { getImageUrl } from "../../utils/getImageUrl";

const Resume = () => {
  const [form, setForm] = useState({
    fullName: "", email: "", profileImage: "", profileTitle: "", summary: "", phone: "", address: "", availability: "Immediate",
    interests: [], skills: [], coreSkills: [], additionalSkills: [], languages: [],
    education: [{ institution: "", qualificationLevel: "", description: "", startDate: "", endDate: "", current: false }],
    experience: [{ company: "", role: "", description: "", startDate: "", endDate: "", current: false }],
    projects: [{ title: "", description: "", technologies: "", link: "", startDate: "", endDate: "", current: false }],
    references: [{ name: "", relationship: "", company: "", email: "", phone: "" }]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPreview, setShowPreview] = useState(true);
  const printRef = useRef();
  const [certificates, setCertificates] = useState([]);
  const [certForm, setCertForm] = useState({ name: "", description: "", issuedDate: "" });
  const [certFile, setCertFile] = useState(null);
  const [certUploading, setCertUploading] = useState(false);
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [showDeleteCertModal, setShowDeleteCertModal] = useState(false);
  const [certToDelete, setCertToDelete] = useState(null);
  const [expanded, setExpanded] = useState({
    basic: false,
    education: false,
    experience: false,
    projects: false,
    references: false,
    certificates: false
  });
  const toggleSection = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  
  const [skillsCategory, setSkillsCategory] = useState("Technology & IT");
  const [categories, setCategories] = useState([]);
  
  const CATEGORIES = [
    "Business & Administration", "Design & Creative Industries", "Education & Training",
    "Engineering & Manufacturing", "Finance & Accounting", "Government & Public Sector",
    "Healthcare & Wellness", "Hospitality & Tourism", "Legal & Compliance",
    "Marketing & Communications", "Media & Entertainment", "Research & Development",
    "Sales & Retail", "Social Services & Non-Profit", "Technology & IT",
    "Architecture and Town Planning", "Environmental and Occupational Health",
    "Creative Writing, Content & Translation", "Other"
  ];

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get("/seeker/resume");
        const data = res.data.resume;
        setForm({
          fullName: data.fullName || "",
          email: data.user?.email || "",
          profileImage: data.profileImage || "",
          profileTitle: data.profileTitle || "",
          summary: data.summary || "",
          phone: data.phone || "",
          address: data.address || "",
          availability: data.availability || "Immediate",
          interests: data.interests || [],
          skills: data.skills || [],
          coreSkills: data.coreSkills || [],
          additionalSkills: data.additionalSkills || [],
          languages: (data.languages || [])
            .map(l => {
              if (typeof l === "string") return { language: l, level: "Intermediate" };
              if (typeof l === "object" && l !== null) {
                return { language: l.language || null, level: l.level || "Intermediate" };
              }
              return { language: String(l), level: "Intermediate" };
            })
            .filter(l => l.language && l.language !== "Unknown"),
          education: data.education?.length ? data.education : form.education,
          experience: data.experience?.length ? data.experience : form.experience,
          projects: data.projects?.length ? data.projects : form.projects,
          references: data.references?.length ? data.references : form.references
        });
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load resume data" });
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
    const fetchCerts = async () => {
      try {
        const res = await api.get("/seeker/certificates");
        setCertificates(res.data.certificates || []);
      } catch (err) { /* silent */ }
    };
    fetchCerts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...form[section]];
    updated[index][field] = value;
    setForm({ ...form, [section]: updated });
  };

  const addItem = (section) => {
    const empty = section === "education"
      ? { institution: "", qualificationLevel: "", description: "", startDate: "", endDate: "", current: false }
      : section === "projects"
      ? { title: "", description: "", technologies: "", link: "", startDate: "", endDate: "", current: false }
      : section === "references"
      ? { name: "", relationship: "", company: "", email: "", phone: "" }
      : { company: "", role: "", description: "", startDate: "", endDate: "", current: false };
    setForm({ ...form, [section]: [...form[section], empty] });
  };

  const removeItem = (section, index) => {
    const updated = form[section].filter((_, i) => i !== index);
    setForm({ ...form, [section]: updated });
  };

  const [newSkill, setNewSkill] = useState("");
  const [newCoreSkill, setNewCoreSkill] = useState("");
  const [newAdditionalSkill, setNewAdditionalSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newLang, setNewLang] = useState("");
  const [newLangLevel, setNewLangLevel] = useState("Intermediate");

  const addTag = (field, value, setValue) => {
    const trimmed = value.trim();
    if (trimmed && !form[field].includes(trimmed)) {
      setForm({ ...form, [field]: [...form[field], trimmed] });
      setValue("");
    }
  };

  const removeTag = (field, tag) => {
    setForm({ ...form, [field]: form[field].filter(t => t !== tag) });
  };

  const handleTagKeyDown = (e, field, value, setValue) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(field, value, setValue);
    }
  };

  const addLanguage = () => {
    const trimmed = newLang.trim();
    if (trimmed && !form.languages.some(l => l.language === trimmed)) {
      setForm({ ...form, languages: [...form.languages, { language: trimmed, level: newLangLevel }] });
      setNewLang("");
      setNewLangLevel("Intermediate");
    }
  };

  const removeLanguage = (index) => {
    setForm({ ...form, languages: form.languages.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const payload = {
        ...form,
        skills: [], // Clear legacy skills array
        languages: form.languages.filter(l => l.language && l.language.trim() && l.language !== "Unknown")
      };
      await api.put("/seeker/resume", payload);
      setMessage({ type: "success", text: "Resume data saved successfully" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    if (!showPreview) setShowPreview(true);
    setTimeout(() => window.print(), 200);
  };

  // Certificate handlers
  const handleCertChange = (e) => setCertForm({ ...certForm, [e.target.name]: e.target.value });
  const handleCertFileChange = (e) => setCertFile(e.target.files[0]);

  const handleCertUpload = async (e) => {
    e.preventDefault();
    if (!certFile) return setMessage({ type: "error", text: "Please select a certificate file" });
    setCertUploading(true);
    setMessage({ type: "", text: "" });
    const formData = new FormData();
    formData.append("certificateFile", certFile);
    formData.append("name", certForm.name);
    formData.append("description", certForm.description);
    formData.append("issuedDate", certForm.issuedDate);

    try {
      const res = await api.post("/seeker/certificates", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setCertificates([...certificates, res.data.certificate]);
      setCertForm({ name: "", description: "", issuedDate: "" });
      setCertFile(null);
      setIsAddingCert(false);
      setMessage({ type: "success", text: "Certificate uploaded successfully" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Upload failed" });
    } finally {
      setCertUploading(false);
    }
  };

  const requestDeleteCert = (id) => {
    setCertToDelete(id);
    setShowDeleteCertModal(true);
  };

  const confirmDeleteCert = async () => {
    if (!certToDelete) return;
    try {
      await api.delete("/seeker/certificates/" + certToDelete);
      setCertificates(certificates.filter(c => c._id !== certToDelete));
      setMessage({ type: "success", text: "Certificate deleted successfully" });
    } catch (err) {
      setMessage({ type: "error", text: "Deletion failed" });
    } finally {
      setShowDeleteCertModal(false);
      setCertToDelete(null);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-500 mt-1">Fill in your details to generate a professional resume.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" /> {showPreview ? "Edit" : "Preview"}
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </div>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm print:hidden ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {showPreview ? (
        <div ref={printRef} className="bg-white rounded-xl border border-gray-200 shadow-sm print:shadow-none print:border-none print:rounded-none overflow-hidden">
          <style>{`
            .resume-preview-scroll::-webkit-scrollbar { width: 6px; }
            .resume-preview-scroll::-webkit-scrollbar-track { background: transparent; }
            .resume-preview-scroll::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 9999px; }
            .resume-preview-scroll::-webkit-scrollbar-thumb:hover { background-color: #9ca3af; }
            .resume-preview-scroll { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
            @media print {
              @page { margin: 0; size: auto; }
              body { background: white !important; }
              html, body { margin: 0 !important; padding: 0 !important; }
              .resume-preview-scroll { max-height: none !important; overflow: visible !important; }
              .print-resume-page { border: none !important; box-shadow: none !important; border-radius: 0 !important; }
              .print-sidebar { min-height: 100vh !important; }
              .print-hide-interests { display: none !important; }
              .print-hide-availability { display: none !important; }
            }
          `}</style>
          <div className="max-h-[80vh] overflow-y-auto resume-preview-scroll print:max-h-none print:overflow-visible">
            <div className="flex flex-col md:flex-row print:flex-row">
              {/* Left Sidebar */}
              <div className="md:w-[35%] print:w-[35%] bg-gray-50 p-4 md:p-6 md:border-r border-gray-200 flex flex-col gap-8 print-sidebar">
                {/* Profile Image */}
                <div className="flex justify-center">
                  <img
                    src={getImageUrl(form.profileImage, form.fullName)}
                    alt={form.fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&size=128&name=${encodeURIComponent(form.fullName || "Student")}`; }}
                  />
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Contact</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    {form.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-600 shrink-0" />
                        <span>{form.address}</span>
                      </div>
                    )}
                    {form.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-600 shrink-0" />
                        <span>{form.phone}</span>
                      </div>
                    )}
                    {form.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-600 shrink-0" />
                        <span className="break-all">{form.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Skills</h3>
                  {(form.coreSkills || []).length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Core</p>
                      <ul className="space-y-1.5 text-sm text-gray-700">
                        {form.coreSkills.map((s, i) => (
                          <li key={`core-${i}`} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(form.additionalSkills || []).length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Additional</p>
                      <ul className="space-y-1.5 text-sm text-gray-700">
                        {form.additionalSkills.map((s, i) => (
                          <li key={`additional-${i}`} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary-600 rounded-full shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(form.skills || []).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Skills</p>
                      <ul className="space-y-1.5 text-sm text-gray-700">
                        {form.skills.map((s, i) => (
                          <li key={`skill-${i}`} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(form.coreSkills || []).length === 0 && (form.additionalSkills || []).length === 0 && (form.skills || []).length === 0 && (
                    <p className="text-gray-400 italic text-sm">No skills listed</p>
                  )}
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Languages</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {(form.languages || []).length > 0 ? (
                      form.languages.map((l, i) => {
                        const label = typeof l === "string" ? l : `${l.language} - ${l.level}`;
                        return (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                            {label}
                          </li>
                        );
                      })
                    ) : (
                      <li className="text-gray-400 italic">No languages listed</li>
                    )}
                  </ul>
                </div>

                {/* Interests */}
                <div className="print-hide-interests">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Interests</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {(form.interests || []).length > 0 ? (
                      form.interests.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">No interests listed</li>
                    )}
                  </ul>
                </div>

                {/* Availability */}
                <div className="print-hide-availability">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Availability</h3>
                  <p className="text-sm text-gray-700">{form.availability}</p>
                </div>
              </div>

              {/* Right Content */}
              <div className="md:w-[65%] print:w-[65%] p-4 md:p-6 lg:p-8 flex flex-col gap-8">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">{form.fullName || "Your Name"}</h1>
                  {form.profileTitle && (
                    <p className="text-lg text-gray-600 mt-1 font-medium">{form.profileTitle}</p>
                  )}
                </div>

                {/* Profile */}
                {form.summary && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-3">Profile</h3>
                    <p className="text-sm text-gray-700 leading-relaxed text-justify">{form.summary}</p>
                  </div>
                )}

                {/* Work Experience */}
                {form.experience?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Work Experience</h3>
                    <div className="space-y-5">
                      {form.experience.map((exp, i) => (
                        <div key={i}>
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <h4 className="font-bold text-gray-900 uppercase text-sm">{exp.role}</h4>
                            <span className="text-xs text-gray-500 font-medium">
                              {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 italic mt-0.5">{exp.company}</p>
                          {exp.description && <p className="text-sm text-gray-700 mt-2 leading-relaxed text-justify">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {form.education?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Education</h3>
                    <div className="space-y-5">
                      {form.education.map((edu, i) => (
                        <div key={i}>
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <h4 className="font-bold text-gray-900 text-sm">
                              {edu.qualificationLevel}
                            </h4>
                            <span className="text-xs text-gray-500 font-medium">
                              {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 italic mt-0.5">{edu.institution}</p>
                          {edu.description && <p className="text-sm text-gray-700 mt-2 leading-relaxed text-justify">{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {form.projects?.length > 0 && form.projects.some(p => p.title) && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Projects</h3>
                    <div className="space-y-5">
                      {form.projects.filter(p => p.title).map((proj, i) => (
                        <div key={i}>
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <h4 className="font-bold text-gray-900 text-sm">{proj.title}</h4>
                            <span className="text-xs text-gray-500 font-medium">
                              {proj.startDate}{proj.endDate ? ` – ${proj.endDate}` : proj.startDate ? " – Present" : ""}
                            </span>
                          </div>
                          {proj.technologies && <p className="text-sm text-gray-600 italic mt-0.5">{proj.technologies}</p>}
                          {proj.description && <p className="text-sm text-gray-700 mt-2 leading-relaxed text-justify">{proj.description}</p>}
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline mt-1">
                              <Link className="w-3.5 h-3.5" /> View Project
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {certificates.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Certificates</h3>
                    <div className="space-y-4">
                      {certificates.map((cert, i) => (
                        <div key={i}>
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <h4 className="font-bold text-gray-900 text-sm">{cert.name}</h4>
                            <span className="text-xs text-gray-500 font-medium">
                              {new Date(cert.issuedDate).toLocaleDateString()}
                            </span>
                          </div>
                          {cert.description && <p className="text-sm text-gray-600 italic mt-0.5 text-justify">{cert.description}</p>}
                          <a
                            href={"http://localhost:5000" + cert.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline mt-1"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Certificate
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* References */}
                {form.references?.length > 0 && form.references.some(r => r.name) && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">References</h3>
                    <div className="space-y-5">
                      {form.references.filter(r => r.name).map((ref, i) => (
                        <div key={i}>
                          <h4 className="font-bold text-gray-900 text-sm">{ref.name}</h4>
                          <p className="text-sm text-gray-600 italic mt-0.5">{ref.relationship}{ref.company ? `, ${ref.company}` : ""}</p>
                          <div className="mt-2 space-y-1 text-sm text-gray-700">
                            {ref.email && <p>{ref.email}</p>}
                            {ref.phone && <p>{ref.phone}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 print:hidden">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button type="button" onClick={() => toggleSection("basic")} className="w-full flex items-center justify-between p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expanded.basic ? "rotate-180" : ""}`} />
            </button>
            {expanded.basic && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Title</label>
                <input name="profileTitle" value={form.profileTitle} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. Software Engineering Undergraduate" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select name="availability" value={form.availability} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
                  <option value="Immediate">Immediate</option>
                  <option value="1 Week">1 Week</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. +94 77 123 4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. Colombo, Sri Lanka" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea name="summary" rows="7" value={form.summary} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Brief overview of your career goals and strengths..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills Category (for suggestions)</label>
              <select
                value={skillsCategory}
                onChange={(e) => setSkillsCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white mb-4"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Core Skills</label>
                <SkillsAutocomplete
                  selectedSkills={form.coreSkills}
                  onAddSkill={(skill) => setForm({ ...form, coreSkills: [...form.coreSkills, skill] })}
                  onRemoveSkill={(skill) => setForm({ ...form, coreSkills: form.coreSkills.filter(s => s !== skill) })}
                  skillType="core"
                  category={skillsCategory}
                  placeholder="Add a core skill and press Enter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Skills</label>
                <SkillsAutocomplete
                  selectedSkills={form.additionalSkills}
                  onAddSkill={(skill) => setForm({ ...form, additionalSkills: [...form.additionalSkills, skill] })}
                  onRemoveSkill={(skill) => setForm({ ...form, additionalSkills: form.additionalSkills.filter(s => s !== skill) })}
                  skillType="additional"
                  category={skillsCategory}
                  placeholder="Add an additional skill and press Enter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => handleTagKeyDown(e, "interests", newInterest, setNewInterest)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                    placeholder="Add an interest and press Enter"
                  />
                  <Button type="button" variant="outline" onClick={() => addTag("interests", newInterest, setNewInterest)} className="py-2 px-3">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.interests.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-md font-medium">
                      {item}
                      <button type="button" onClick={() => removeTag("interests", item)} className="hover:text-primary-900">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value)}
                    className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm bg-white"
                  >
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                  <select
                    value={newLangLevel}
                    onChange={(e) => setNewLangLevel(e.target.value)}
                    className="flex-1 min-w-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm bg-white"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Native">Native</option>
                  </select>
                  <Button type="button" variant="outline" onClick={addLanguage} className="py-2 px-3">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.languages.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-md font-medium">
                      {typeof item === "string" ? item : `${item.language} - ${item.level}`}
                      <button type="button" onClick={() => removeLanguage(i)} className="hover:text-primary-900">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
              </div>
            )}
          </div>

          {["education", "experience"].map((section) => (
            <div key={section} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button type="button" onClick={() => toggleSection(section)} className="w-full flex items-center justify-between p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">{section}</h2>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expanded[section] ? "rotate-180" : ""}`} />
              </button>
              {expanded[section] && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" onClick={() => addItem(section)} className="text-sm py-1.5 px-3">
                      <Plus className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </div>
                  {form[section].map((item, index) => (
                <div key={index} className="grid sm:grid-cols-2 gap-4 p-4 pt-10 sm:pt-4 bg-gray-50 rounded-lg relative">
                  <button type="button" onClick={() => removeItem(section, index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {Object.keys(item).filter(k => k !== "current" && k !== "_id").map((field) => (
                    <div key={field} className={field === "description" ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                      {field === "qualificationLevel" ? (
                        <select
                          value={item[field]}
                          onChange={(e) => handleArrayChange(section, index, field, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm bg-white"
                        >
                          <option value="">Select Level</option>
                          <option value="O/L">O/L</option>
                          <option value="A/L">A/L</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Degree">Degree</option>
                          <option value="Masters">Masters</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : field === "description" ? (
                        <textarea
                          rows="6"
                          value={item[field]}
                          onChange={(e) => handleArrayChange(section, index, field, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                        />
                      ) : field.includes("Date") ? (
                        <div className="relative">
                          <DatePicker
                            selected={item[field] ? new Date(item[field]) : null}
                            onChange={(date) => handleArrayChange(section, index, field, date ? date.toISOString().split('T')[0] : "")}
                            dateFormat="yyyy-MM-dd"
                            placeholderText={`Select ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-sm text-gray-900"
                            wrapperClassName="w-full"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            maxDate={new Date()}
                          />
                          <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={item[field]}
                          onChange={(e) => handleArrayChange(section, index, field, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
              )}
            </div>
          ))}

          {/* Projects */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button type="button" onClick={() => toggleSection("projects")} className="w-full flex items-center justify-between p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expanded.projects ? "rotate-180" : ""}`} />
            </button>
            {expanded.projects && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={() => addItem("projects")} className="text-sm py-1.5 px-3">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              {form.projects.map((item, index) => (
              <div key={index} className="grid sm:grid-cols-2 gap-4 p-4 pt-10 sm:pt-4 bg-gray-50 rounded-lg relative">
                <button type="button" onClick={() => removeItem("projects", index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                  <input type="text" value={item.title} onChange={(e) => handleArrayChange("projects", index, "title", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" placeholder="e.g. E-Commerce Website" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Link</label>
                  <input type="text" value={item.link} onChange={(e) => handleArrayChange("projects", index, "link", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" placeholder="e.g. https://github.com/..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Technologies</label>
                  <input type="text" value={item.technologies} onChange={(e) => handleArrayChange("projects", index, "technologies", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" placeholder="e.g. React, Node.js, MongoDB" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea rows="3" value={item.description} onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" placeholder="Brief description of the project..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                  <div className="relative">
                    <DatePicker selected={item.startDate ? new Date(item.startDate) : null} onChange={(date) => handleArrayChange("projects", index, "startDate", date ? date.toISOString().split('T')[0] : "")} dateFormat="yyyy-MM-dd" placeholderText="Select start date" className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-sm text-gray-900" wrapperClassName="w-full" showMonthDropdown showYearDropdown dropdownMode="select" maxDate={new Date()} />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                  <div className="relative">
                    <DatePicker selected={item.endDate ? new Date(item.endDate) : null} onChange={(date) => handleArrayChange("projects", index, "endDate", date ? date.toISOString().split('T')[0] : "")} dateFormat="yyyy-MM-dd" placeholderText="Select end date" className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-sm text-gray-900" wrapperClassName="w-full" showMonthDropdown showYearDropdown dropdownMode="select" maxDate={new Date()} />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            ))}
            </div>
            )}
          </div>

          {/* References */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button type="button" onClick={() => toggleSection("references")} className="w-full flex items-center justify-between p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">References</h2>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expanded.references ? "rotate-180" : ""}`} />
            </button>
            {expanded.references && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={() => addItem("references")} className="text-sm py-1.5 px-3">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              {form.references.map((item, index) => (
              <div key={index} className="grid sm:grid-cols-2 gap-4 p-4 pt-10 sm:pt-4 bg-gray-50 rounded-lg relative">
                <button type="button" onClick={() => removeItem("references", index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                  <input type="text" value={item.name} onChange={(e) => handleArrayChange("references", index, "name", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" placeholder="e.g. Dr. Jane Smith" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Relationship / Title</label>
                  <input type="text" value={item.relationship} onChange={(e) => handleArrayChange("references", index, "relationship", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" placeholder="e.g. Former Manager" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Company / Organization</label>
                  <input type="text" value={item.company} onChange={(e) => handleArrayChange("references", index, "company", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" placeholder="e.g. ABC Pvt Ltd" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input type="email" value={item.email} onChange={(e) => handleArrayChange("references", index, "email", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" placeholder="e.g. jane@example.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                  <input type="tel" value={item.phone} onChange={(e) => handleArrayChange("references", index, "phone", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm sm:max-w-[50%]" placeholder="e.g. +94 77 123 4567" />
                </div>
              </div>
            ))}
            </div>
            )}
          </div>

          {/* Certificates Edit */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button type="button" onClick={() => toggleSection("certificates")} className="w-full flex items-center justify-between p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Certificates</h2>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expanded.certificates ? "rotate-180" : ""}`} />
            </button>
            {expanded.certificates && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
              {!isAddingCert && (
                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsAddingCert(true)} className="text-sm py-1.5 px-3">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
              )}

            {isAddingCert && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Certificate Name</label>
                    <input name="name" required value={certForm.name} onChange={handleCertChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" placeholder="e.g. AWS Cloud Practitioner" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Issued Date</label>
                    <div className="relative">
                      <DatePicker
                        selected={certForm.issuedDate ? new Date(certForm.issuedDate) : null}
                        onChange={(date) => setCertForm({ ...certForm, issuedDate: date ? date.toISOString().split('T')[0] : "" })}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select issue date"
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white text-sm text-gray-900"
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea name="description" rows="2" value={certForm.description} onChange={handleCertChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" placeholder="Brief details about the certification..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Certificate File (PNG, JPG, PDF)</label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">{certFile ? certFile.name : "Choose file..."}</span>
                    <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={handleCertFileChange} className="hidden" />
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" onClick={() => { setIsAddingCert(false); setCertFile(null); setCertForm({ name: "", description: "", issuedDate: "" }); }}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                  <Button type="button" onClick={handleCertUpload} disabled={certUploading} className="min-w-[100px]">
                    {certUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload"}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {certificates.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No certificates added yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {certificates.map((cert) => (
                    <div key={cert._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{cert.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(cert.issuedDate).toLocaleDateString()}</p>
                      </div>
                      <button type="button" onClick={() => requestDeleteCert(cert._id)} className="text-gray-400 hover:text-red-500 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
            )}
          </div>

        <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving} className="min-w-[140px]">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Resume Data"}
            </Button>
          </div>
        </form>
      )}

      <ConfirmModal
        isOpen={showDeleteCertModal}
        onClose={() => setShowDeleteCertModal(false)}
        onConfirm={confirmDeleteCert}
        title="Delete Certificate?"
        message="Are you sure you want to delete this certificate? This action cannot be undone and the file will be permanently removed."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Resume;