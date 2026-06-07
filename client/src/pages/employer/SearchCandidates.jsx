import PageLoader from "../../components/ui/PageLoader";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, User, GraduationCap, ChevronLeft, ChevronRight, MessageSquare, FileText, X, Phone, Mail } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import CustomSelect from "../../components/ui/CustomSelect";
import { getImageUrl } from "../../utils/getImageUrl";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace("/api", "") : "http://localhost:5000";
const AVAILABILITY = ["Immediate", "1 Week", "1 Month", "3 Months"];
const LOCATIONS = [
  "Colombo", "Gampaha", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara",
  "Hambantota", "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu",
  "Batticaloa", "Ampara", "Trincomalee", "Polonnaruwa", "Badulla", "Moneragala",
  "Puttalam", "Anuradhapura", "Kurunegala", "Ratnapura", "Kegalle"
];

const CATEGORIES = [
  "Business & Administration", "Design & Creative Industries", "Education & Training",
  "Engineering & Manufacturing", "Finance & Accounting", "Government & Public Sector",
  "Healthcare & Wellness", "Hospitality & Tourism", "Legal & Compliance",
  "Marketing & Communications", "Media & Entertainment", "Research & Development",
  "Sales & Retail", "Social Services & Non-Profit", "Technology & IT",
  "Architecture and Town Planning", "Environmental and Occupational Health",
  "Creative Writing, Content & Translation", "Other"
];

const SALARY_RANGES = [
  { value: "", label: "All Salaries" },
  { value: "0-25000", label: "0 - 25,000 LKR" },
  { value: "25000-50000", label: "25,000 - 50,000 LKR" },
  { value: "50000-75000", label: "50,000 - 75,000 LKR" },
  { value: "75000+", label: "75,000+ LKR" },
  { value: "Unpaid", label: "Unpaid / Volunteer" }
];

const QUALIFICATION_LEVELS = [
  { value: "", label: "All Levels" },
  { value: "O/L", label: "O/L" },
  { value: "A/L", label: "A/L" },
  { value: "Diploma", label: "Diploma" },
  { value: "Undergraduate", label: "Undergraduate" },
  { value: "Degree", label: "Degree" },
  { value: "Masters", label: "Masters" },
  { value: "Other", label: "Other" }
];

const LANGUAGES = [
  { value: "", label: "All Languages" },
  { value: "English", label: "English" },
  { value: "Sinhala", label: "Sinhala" },
  { value: "Tamil", label: "Tamil" }
];

const LANGUAGE_LEVELS = [
  { value: "", label: "All Proficiencies" },
  { value: "Basic", label: "Basic" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Fluent", label: "Fluent" },
  { value: "Native", label: "Native" }
];

const SearchCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    availability: "",
    skills: "",
    category: "",
    expectedSalary: "",
    qualificationLevel: "",
    language: "",
    languageLevel: ""
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [messagingId, setMessagingId] = useState(null);
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });
  const [selectedResume, setSelectedResume] = useState(null);

  const fetchCandidates = async (targetPage = pagination.page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: targetPage, limit: 9, search, ...filters });
      const res = await api.get(`/candidates?${params}`);
      setCandidates(res.data.candidates);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCandidates(1); }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? "" : value }));
  };

  const handleSearch = () => {
    fetchCandidates(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      availability: "",
      skills: "",
      category: "",
      expectedSalary: "",
      qualificationLevel: "",
      language: "",
      languageLevel: ""
    });
    setSearch("");
  };

  const openResume = (candidate) => setSelectedResume(candidate);
  const closeResume = () => setSelectedResume(null);

  const handleMessage = async (candidate) => {
    setMessagingId(candidate._id);
    setActionMessage({ type: "", text: "" });
    try {
      const res = await api.post("/chat/initiate", { studentId: candidate.user._id });
      navigate(`/chat?convId=${res.data.conversation._id}`);
    } catch (err) {
      setActionMessage({ type: "error", text: err.response?.data?.message || "Failed to start chat" });
      setTimeout(() => setActionMessage({ type: "", text: "" }), 3000);
    } finally {
      setMessagingId(null);
    }
  };

  const getAvatar = (name, path) => getImageUrl(path, name);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Candidates</h1>
        <p className="text-gray-500 mt-1">Find students by skills, location, and availability.</p>
      </div>

      {actionMessage.text && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${actionMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : actionMessage.type === "warning" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
          {actionMessage.text}
        </div>
      )}

      <div className="space-y-5">
        {/* Filters */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <CustomSelect
                value={filters.category}
                onChange={(val) => handleFilterChange("category", val)}
                options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                placeholder="All Categories"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary</label>
              <CustomSelect
                value={filters.expectedSalary}
                onChange={(val) => handleFilterChange("expectedSalary", val)}
                options={SALARY_RANGES}
                placeholder="All Salaries"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification Level</label>
              <CustomSelect
                value={filters.qualificationLevel}
                onChange={(val) => handleFilterChange("qualificationLevel", val)}
                options={QUALIFICATION_LEVELS}
                placeholder="All Levels"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <CustomSelect
                value={filters.location}
                onChange={(val) => handleFilterChange("location", val)}
                options={LOCATIONS.map(loc => ({ value: loc, label: loc }))}
                placeholder="All Locations"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <CustomSelect
                value={filters.language}
                onChange={(val) => handleFilterChange("language", val)}
                options={LANGUAGES}
                placeholder="All Languages"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language Proficiency</label>
              <CustomSelect
                value={filters.languageLevel}
                onChange={(val) => handleFilterChange("languageLevel", val)}
                options={LANGUAGE_LEVELS}
                placeholder="All Proficiencies"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY.map(av => (
                  <button key={av} onClick={() => handleFilterChange("availability", av)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${filters.availability === av ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"}`}>
                    {av}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <input 
                value={filters.skills} 
                onChange={(e) => handleFilterChange("skills", e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder="React, Node.js..." 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" 
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button onClick={handleSearch} className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <Search className="w-4 h-4" /> Search
            </button>
            <button onClick={clearFilters} className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Clear Filters</button>
          </div>
        </div>

        {/* Search by name */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search by name or skills..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white" />
        </div>

        {/* Candidate cards */}
        {candidates.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No candidates found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {candidates.map(c => (
              <div key={c._id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col min-w-0 overflow-hidden">
                <div className="flex items-center gap-3 mb-4 min-w-0">
                  <img src={getAvatar(c.fullName, c.profileImage)} alt={c.fullName} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shadow-sm" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&name=${encodeURIComponent(c.fullName || "Student")}`; }} />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{c.fullName || "Unnamed Student"}</h3>
                    <p className="text-xs text-gray-500 truncate">{c.user?.email}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">{c.address || "Not specified"}</span></div>
                  <div className="flex items-center gap-2 min-w-0"><Clock className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">Available: <span className="font-medium text-gray-800">{c.availability || "Not specified"}</span></span></div>
                  {c.education?.length > 0 && (
                    <div className="flex items-center gap-2 min-w-0"><GraduationCap className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate">{c.education[0].qualificationLevel} @ {c.education[0].institution}</span></div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Key Skills:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(c.coreSkills || []).slice(0, 3).map(s => <span key={s} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-md font-medium">{s}</span>)}
                    {(c.additionalSkills || []).slice(0, 2).map(s => <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md">{s}</span>)}
                    {(!c.coreSkills?.length && !c.additionalSkills?.length) && (c.skills || []).slice(0, 4).map(s => <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md font-medium">{s}</span>)}
                    {(!c.coreSkills?.length && !c.additionalSkills?.length) && (c.skills || []).length > 4 && <span className="text-xs text-gray-400 font-medium">+{(c.skills || []).length - 4}</span>}
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
                  <Button variant="secondary" onClick={() => openResume(c)} className="w-full sm:w-auto flex-1 text-sm py-2 gap-1.5">
                    <FileText className="w-4 h-4" /> Resume
                  </Button>
                  <Button variant="primary" onClick={() => handleMessage(c)} disabled={messagingId === c._id} className="w-full sm:w-auto flex-1 text-sm py-2 gap-1.5">
                    {messagingId === c._id ? <FileText className="w-4 h-4 animate-pulse" /> : <MessageSquare className="w-4 h-4" />} Message
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4">
            <button onClick={() => fetchCandidates(pagination.page - 1)} disabled={pagination.page === 1} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-700 px-3">Page {pagination.page} of {pagination.pages}</span>
            <button onClick={() => fetchCandidates(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {selectedResume && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <style>{`
            .resume-modal-scroll::-webkit-scrollbar { width: 6px; }
            .resume-modal-scroll::-webkit-scrollbar-track { background: transparent; }
            .resume-modal-scroll::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 9999px; }
            .resume-modal-scroll::-webkit-scrollbar-thumb:hover { background-color: #9ca3af; }
            .resume-modal-scroll { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
          `}</style>
          <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[92vh] overflow-y-auto resume-modal-scroll">
            <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Candidate Resume</h2>
              <button onClick={closeResume} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col md:flex-row">
              {/* Left Sidebar */}
              <div className="md:w-[35%] bg-gray-50 p-4 sm:p-6 md:border-r border-gray-200 flex flex-col gap-6 sm:gap-8">
                {/* Profile Image */}
                <div className="flex justify-center">
                  <img
                    src={getAvatar(selectedResume.fullName, selectedResume.profileImage)}
                    alt={selectedResume.fullName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&size=128&name=${encodeURIComponent(selectedResume.fullName || "Student")}`; }}
                  />
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Contact</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    {selectedResume.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-600 shrink-0" />
                        <span>{selectedResume.address}</span>
                      </div>
                    )}
                    {selectedResume.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-600 shrink-0" />
                        <span>{selectedResume.phone}</span>
                      </div>
                    )}
                    {selectedResume.user?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-600 shrink-0" />
                        <span className="break-all">{selectedResume.user.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Skills</h3>
                  {(selectedResume.coreSkills || []).length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Core</p>
                      <ul className="space-y-1.5 text-sm text-gray-700">
                        {selectedResume.coreSkills.map((s, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(selectedResume.additionalSkills || []).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Additional</p>
                      <ul className="space-y-1.5 text-sm text-gray-700">
                        {selectedResume.additionalSkills.map((s, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary-600 rounded-full shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(selectedResume.coreSkills || []).length === 0 && (selectedResume.additionalSkills || []).length === 0 && (selectedResume.skills || []).length === 0 && (
                    <p className="text-gray-400 italic text-sm">No skills listed</p>
                  )}
                  {(selectedResume.skills || []).length > 0 && (selectedResume.coreSkills || []).length === 0 && (selectedResume.additionalSkills || []).length === 0 && (
                    <ul className="space-y-2 text-sm text-gray-700">
                      {selectedResume.skills.map((s, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Languages</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {(selectedResume.languages || [])
                      .map(l => typeof l === "string"
                        ? { language: l, level: "Intermediate" }
                        : { language: l?.language || null, level: l?.level || "Intermediate" })
                      .filter(l => l.language && l.language !== "Unknown")
                      .length > 0 ? (
                      selectedResume.languages
                        .map(l => typeof l === "string"
                          ? { language: l, level: "Intermediate" }
                          : { language: l?.language || null, level: l?.level || "Intermediate" })
                        .filter(l => l.language && l.language !== "Unknown")
                        .map((lang, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0" />
                            {`${lang.language} - ${lang.level}`}
                          </li>
                        ))
                    ) : (
                      <li className="text-gray-400 italic">No languages listed</li>
                    )}
                  </ul>
                </div>

                {/* Interests */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Interests</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {(selectedResume.interests || []).length > 0 ? (
                      selectedResume.interests.map((item, i) => (
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
              </div>

              {/* Right Content */}
              <div className="md:w-[65%] p-4 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">{selectedResume.fullName || "Unnamed Student"}</h1>
                  {selectedResume.profileTitle && (
                    <p className="text-lg text-gray-600 mt-1 font-medium">{selectedResume.profileTitle}</p>
                  )}
                </div>

                {/* Profile */}
                {selectedResume.summary && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-3">Profile</h3>
                    <p className="text-sm text-gray-700 leading-relaxed text-justify">{selectedResume.summary}</p>
                  </div>
                )}

                {/* Work Experience */}
                {selectedResume.experience?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Work Experience</h3>
                    <div className="space-y-5">
                      {selectedResume.experience.map((exp, i) => (
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
                {selectedResume.education?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Education</h3>
                    <div className="space-y-5">
                      {selectedResume.education.map((edu, i) => (
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
                {selectedResume.projects?.length > 0 && selectedResume.projects.some(p => p.title) && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Projects</h3>
                    <div className="space-y-5">
                      {selectedResume.projects.filter(p => p.title).map((proj, i) => (
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
                              View Project →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {selectedResume.certificates?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">Certificates</h3>
                    <div className="space-y-4">
                      {selectedResume.certificates.map((cert, i) => (
                        <div key={i}>
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <h4 className="font-bold text-gray-900 text-sm">{cert.name}</h4>
                            <span className="text-xs text-gray-500 font-medium">
                              {new Date(cert.issuedDate).toLocaleDateString()}
                            </span>
                          </div>
                          {cert.description && <p className="text-sm text-gray-600 italic mt-0.5 text-justify">{cert.description}</p>}
                          <a
                            href={`${BASE_URL}${cert.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:underline mt-1"
                          >
                            View Certificate →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* References */}
                {selectedResume.references?.length > 0 && selectedResume.references.some(r => r.name) && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide border-b-2 border-gray-900 pb-1 mb-4">References</h3>
                    <div className="space-y-5">
                      {selectedResume.references.filter(r => r.name).map((ref, i) => (
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

                {/* Availability & CV Link */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">Availability: </span>
                    <span className="text-gray-700">{selectedResume.availability || "Not specified"}</span>
                  </div>
                  {selectedResume.cvFile?.filePath && (
                    <a
                      href={`${BASE_URL}${selectedResume.cvFile.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-2"
                    >
                      View Uploaded CV →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchCandidates;