import React, { useState, useEffect } from "react";
import { Search, MapPin, Clock, Building2, Filter, ChevronLeft, ChevronRight, X, Loader2, XCircle, Briefcase, MapPin as LocationIcon, Monitor, ChevronDown, ChevronUp, BadgeDollarSign, Zap, Target, Sparkles, Send, Compass, Layers } from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import api from "../utils/api";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";
import ApplyModal from "../components/ui/ApplyModal";

const CATEGORIES = [
  "Technology & IT", 
  "Marketing & Communications", 
  "Finance & Accounting", 
  "Design & Creative Industries", 
  "Engineering & Manufacturing", 
  "Healthcare & Wellness",
  "Business & Management",
  "Education & Teaching",
  "Law & Legal",
  "Sales & Customer Service",
  "Hospitality & Tourism",
  "Agriculture & Environment",
  "Media & Journalism",
  "Human Resources",
  "Logistics & Supply Chain",
  "Research & Development",
  "Data Science & Analytics",
  "Cybersecurity",
  "Cloud Computing",
  "Artificial Intelligence & Machine Learning"
];
const LOCATIONS = [
  "Colombo", "Kandy", "Galle", "Jaffna", "Remote",
  "Negombo", "Matara", "Anuradhapura", "Trincomalee", "Batticaloa",
  "Kurunegala", "Ratnapura", "Badulla", "Puttalam", "Kalutara",
  "Gampaha", "Kegalle", "Matale", "Nuwara Eliya", "Hambantota",
  "Vavuniya", "Mannar", "Kilinochchi", "Mullaitivu", "Ampara"
];
const MODES = ["On-site", "Remote", "Hybrid"];

const getMatchVariant = (match) => {
  if (match >= 75) return "success";
  if (match >= 50) return "warning";
  return "danger";
};

const getMatchColor = (match) => {
  if (match >= 75) return { bg: "bg-emerald-500", text: "text-emerald-700", light: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-500" };
  if (match >= 50) return { bg: "bg-amber-500", text: "text-amber-700", light: "bg-amber-50", border: "border-amber-200", bar: "bg-amber-500" };
  return { bg: "bg-red-500", text: "text-red-700", light: "bg-red-50", border: "border-red-200", bar: "bg-red-500" };
};

const MatchRing = ({ match }) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (match / 100) * circumference;
  const colors = getMatchColor(match);

  return (
    <div className="relative flex items-center justify-center">
      <svg width="64" height="64" className="-rotate-90">
        <circle cx="32" cy="32" r={radius} stroke="#e5e7eb" strokeWidth="5" fill="none" />
        <circle
          cx="32" cy="32" r={radius}
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colors.text} transition-all duration-1000 ease-out`}
        />
      </svg>
      <span className={`absolute text-sm font-bold ${colors.text}`}>{match}%</span>
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, children, className = "" }) => (
  <div className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm ${className}`}>
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-4 h-4 text-gray-400" />}
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h4>
    </div>
    {children}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 animate-pulse shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 w-16 bg-gray-200/80 rounded-full" />
      <div className="h-4 w-20 bg-gray-200/80 rounded-full" />
    </div>
    <div className="h-6 w-3/4 bg-gray-200/80 rounded-lg mb-2" />
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-lg bg-gray-200/80" />
      <div className="h-4 w-1/2 bg-gray-200/80 rounded-lg mt-2" />
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-8 w-24 bg-gray-200/80 rounded-lg" />
      <div className="h-8 w-20 bg-gray-200/80 rounded-lg" />
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 bg-gray-200/80 rounded-lg" />
      <div className="h-6 w-20 bg-gray-200/80 rounded-lg" />
    </div>
    <div className="h-10 w-full bg-gray-200/80 rounded-xl mt-4" />
  </div>
);

const BrowseInternships = () => {
  // 1. All Hooks at the top level (Strict React Rules)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  const [filters, setFilters] = useState({ category: "", location: "", mode: "", skill: "" });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ category: false, location: false, mode: false });
  
  const [applyModal, setApplyModal] = useState({ isOpen: false, job: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, job: null });

  // 2. Data Fetching
  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", pagination.page);
      params.set("limit", 9);
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filters.category) params.set("category", filters.category);
      if (filters.location) params.set("location", filters.location);
      if (filters.mode) params.set("mode", filters.mode);
      if (filters.skill) params.set("skill", filters.skill);
      const res = await api.get(`/internships/browse?${params}`);
      setInternships(res.data.internships);
      setPagination({ ...res.data.pagination, total: res.data.total || res.data.internships.length });
    } catch (err) {
      console.error("Failed to fetch internships", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters, pagination.page]);

  // 3. Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? "" : value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ category: "", location: "", mode: "", skill: "" });
    setSearch("");
  };

  // Initialize skill filter from URL query param on mount
  useEffect(() => {
    const skillFromUrl = searchParams.get("skill");
    if (skillFromUrl) {
      setFilters(prev => ({ ...prev, skill: skillFromUrl }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top when navigating to this page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // 4. Render
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-emerald-400/5 blur-[100px] pointer-events-none" />

      <Navbar />
      
      <main className="flex-1 max-w-[1500px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-8 relative z-10">
        
        {/* Hero Section */}
        <div className="mb-10 text-center max-w-2xl mx-auto animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">breakthrough</span>
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`fixed inset-0 z-40 bg-white p-6 w-72 transform transition-transform duration-300 lg:relative lg:transform-none lg:bg-transparent lg:p-0 lg:w-64 lg:block lg:sticky lg:top-24 lg:self-start overflow-y-auto ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>

            <div className="space-y-4">
              {/* Category Section */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleSection("category")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-primary-50 rounded-lg text-primary-600">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">Category</h3>
                  </div>
                  <div className={`transition-transform duration-300 ${expandedSections.category ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.category ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-3 pt-0 space-y-1 overflow-y-auto max-h-64 custom-scrollbar">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleFilterChange("category", cat)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                          filters.category === cat
                            ? "bg-primary-500 text-white font-medium shadow-md shadow-primary-500/20"
                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleSection("location")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                      <LocationIcon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">Location</h3>
                  </div>
                  <div className={`transition-transform duration-300 ${expandedSections.location ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.location ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-3 pt-0 space-y-1 overflow-y-auto max-h-64 custom-scrollbar">
                    {LOCATIONS.map(loc => (
                      <button
                        key={loc}
                        onClick={() => handleFilterChange("location", loc)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                          filters.location === loc
                            ? "bg-emerald-500 text-white font-medium shadow-md shadow-emerald-500/20"
                            : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Work Mode Section */}
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => toggleSection("mode")}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">Work Mode</h3>
                  </div>
                  <div className={`transition-transform duration-300 ${expandedSections.mode ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.mode ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-4 pt-0 flex flex-wrap gap-2">
                    {MODES.map(mode => (
                      <button
                        key={mode}
                        onClick={() => handleFilterChange("mode", mode)}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                          filters.mode === mode
                            ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300 hover:text-amber-700"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={clearFilters} className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 py-3 rounded-xl transition-colors font-semibold">
                <XCircle className="w-4 h-4" /> Clear All Filters
              </button>
            </div>
          </aside>

          {mobileFiltersOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300" onClick={() => setMobileFiltersOpen(false)}></div>}

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-2">
              <div className="relative w-full sm:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search internships, companies, skills..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none shadow-sm transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <button className="lg:hidden flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-2xl text-gray-700 relative shadow-sm hover:bg-gray-50 transition-colors" onClick={() => setMobileFiltersOpen(true)}>
                <Filter className="w-4 h-4" /> Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active Filters & Results Summary */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-200">
                    {filters.category}
                    <button onClick={() => handleFilterChange("category", filters.category)} className="hover:text-primary-900">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-200">
                    {filters.location}
                    <button onClick={() => handleFilterChange("location", filters.location)} className="hover:text-primary-900">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.mode && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-200">
                    {filters.mode}
                    <button onClick={() => handleFilterChange("mode", filters.mode)} className="hover:text-primary-900">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {filters.skill && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-full border border-orange-200">
                    {filters.skill}
                    <button onClick={() => handleFilterChange("skill", filters.skill)} className="hover:text-orange-900">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {(filters.category || filters.location || filters.mode || filters.skill) && (
                  <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700 font-medium ml-2">Clear all</button>
                )}
              </div>
              {!loading && internships.length > 0 && (
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{internships.length}</span> of <span className="font-semibold text-gray-900">{pagination.total}</span> internships
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : internships.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">No internships found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {internships.map((job, index) => (
                  <div 
                    key={job._id} 
                    className="group bg-white/60 backdrop-blur-md rounded-2xl border border-gray-200/60 p-6 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 hover:border-primary-300 transition-all duration-500 flex flex-col relative overflow-hidden animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-500 pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-5 relative z-10">
                      {job.matchPercentage !== undefined ? (
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getMatchColor(job.matchPercentage).light} ${getMatchColor(job.matchPercentage).text} ${getMatchColor(job.matchPercentage).border} shadow-sm flex items-center gap-1.5`}>
                          <Sparkles className="w-3.5 h-3.5" />
                          {job.matchPercentage}% Match
                        </div>
                      ) : (
                        <div className="h-6"></div> /* Placeholder for alignment */
                      )}
                      <span className="text-xs text-gray-400 font-medium bg-gray-50/80 px-2 py-1 rounded-md">{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-4 mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-500">
                        <Layers className="w-6 h-6 text-primary-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-0.5 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight pr-2">{job.title}</h3>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5 truncate">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                      <div className="flex items-center gap-1.5 bg-gray-50/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-gray-100/80 text-xs font-medium text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location}
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-gray-100/80 text-xs font-medium text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> {job.mode}
                      </div>
                    </div>

                    <div className="mb-5 relative z-10">
                      <div className="flex flex-wrap gap-1.5">
                        {job.coreSkills?.slice(0, 2).map(skill => (
                          <span key={skill} className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-md font-semibold border border-red-100/50">{skill}</span>
                        ))}
                        {job.additionalSkills?.slice(0, 2).map(skill => (
                          <span key={skill} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md font-medium border border-primary-100/50">{skill}</span>
                        ))}
                        {((job.coreSkills?.length || 0) + (job.additionalSkills?.length || 0)) > 4 && (
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">+{((job.coreSkills?.length || 0) + (job.additionalSkills?.length || 0)) - 4}</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100/80 relative z-10">
                      <Button 
                        variant="outline" 
                        className="w-full bg-white group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 group-hover:shadow-md group-hover:shadow-primary-500/20 transition-all duration-300 rounded-xl py-2.5"
                        onClick={() => setDetailModal({ isOpen: true, job })}
                      >
                        {user?.role === "seeker" ? "View & Apply" : "View Details"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-1 pt-4 flex-wrap">
                <button 
                  onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} 
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 7) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 4) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 3) {
                    pageNum = pagination.pages - 6 + i;
                  } else {
                    pageNum = pagination.page - 3 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(p => ({ ...p, page: pageNum }))}
                      className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all ${
                        pagination.page === pageNum
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-primary-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} 
                  disabled={pagination.page === pagination.pages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Detail Modal */}
      {detailModal.isOpen && detailModal.job && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setDetailModal({ isOpen: false, job: null })}></div>

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-hidden flex flex-col animate-fade-up border border-gray-100">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 p-8 text-white shrink-0 overflow-hidden">
              {/* Decorative Mesh background elements */}
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[150%] rounded-full bg-white/10 blur-[40px] pointer-events-none transform rotate-12" />
              <div className="absolute bottom-[-50%] left-[-20%] w-[80%] h-[100%] rounded-full bg-black/10 blur-[50px] pointer-events-none" />

              <button onClick={() => setDetailModal({ isOpen: false, job: null })} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/10 hover:bg-black/20 p-1.5 rounded-full backdrop-blur-sm">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 relative z-10 animate-fade-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 shrink-0 shadow-lg">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <div className="min-w-0 pt-1 pr-20">
                  <h3 className="text-xl font-extrabold leading-tight text-white mb-1 drop-shadow-sm">{detailModal.job.title}</h3>
                  <p className="text-primary-50 text-sm font-medium flex items-center gap-1.5 opacity-90">
                    <Building2 className="w-4 h-4" /> {detailModal.job.company}
                  </p>
                </div>
              </div>

              {/* Match Ring */}
              {detailModal.job.matchPercentage !== undefined && (
                <div className="absolute bottom-0 right-8 translate-y-1/4 z-20 animate-fade-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                  <div className={`${getMatchColor(detailModal.job.matchPercentage).light} border-2 ${getMatchColor(detailModal.job.matchPercentage).border} rounded-full p-1 shadow-xl bg-white`}>
                    <MatchRing match={detailModal.job.matchPercentage} />
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 pt-8 space-y-5">
              {/* Quick Info Chips */}
              <div className="flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-sm border border-gray-100 font-medium shadow-sm">
                  <MapPin className="w-4 h-4 text-gray-400" /> {detailModal.job.location}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-sm border border-gray-100 font-medium shadow-sm">
                  <Clock className="w-4 h-4 text-gray-400" /> {detailModal.job.mode}
                </span>
                {(detailModal.job.salaryMin || detailModal.job.salaryMax) && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl text-sm border border-emerald-100 font-medium shadow-sm">
                    <BadgeDollarSign className="w-4 h-4 text-emerald-500" />
                    LKR {detailModal.job.salaryMin?.toLocaleString() || 0} - {detailModal.job.salaryMax?.toLocaleString() || 0}
                  </span>
                )}
              </div>

              {/* Description */}
              {detailModal.job.description && (
                <div className="animate-fade-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                  <SectionCard icon={Sparkles} title="About the Role" className="shadow-sm border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{detailModal.job.description}</p>
                  </SectionCard>
                </div>
              )}

              {detailModal.job.responsibilities && (
                <div className="animate-fade-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
                  <SectionCard icon={Target} title="Responsibilities" className="shadow-sm border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{detailModal.job.responsibilities}</p>
                  </SectionCard>
                </div>
              )}

              {/* Skills */}
              <div className="animate-fade-up" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
                <SectionCard icon={Zap} title="Required Skills" className="shadow-sm border-gray-100">
                  <div className="space-y-4">
                    {(detailModal.job.coreSkills || []).length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wide">
                          <Target className="w-3.5 h-3.5 text-red-500" /> Core Requirements
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {detailModal.job.coreSkills.map(skill => (
                            <span key={skill} className="text-xs font-bold bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-xl shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(detailModal.job.additionalSkills || []).length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1 uppercase tracking-wide">
                          <Sparkles className="w-3.5 h-3.5 text-primary-500" /> Nice to have
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {detailModal.job.additionalSkills.map(skill => (
                            <span key={skill} className="text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1.5 rounded-xl shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(detailModal.job.coreSkills || []).length === 0 && (detailModal.job.additionalSkills || []).length === 0 && (
                      <p className="text-sm text-gray-400 italic">No specific skills listed for this role.</p>
                    )}
                  </div>
                </SectionCard>
              </div>

              {/* Match Score Bar */}
              {detailModal.job.matchPercentage !== undefined && (
                <div className="animate-fade-up" style={{ animationDelay: '600ms', animationFillMode: 'both' }}>
                  <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-800">Match Score Analysis</span>
                      <span className={`text-sm font-extrabold ${getMatchColor(detailModal.job.matchPercentage).text}`}>{detailModal.job.matchPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200/80 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`h-3 rounded-full ${getMatchColor(detailModal.job.matchPercentage).bar} transition-all duration-1000 ease-out relative overflow-hidden`}
                        style={{ width: `${detailModal.job.matchPercentage}%` }}
                      >
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20" style={{ animation: 'shimmer 2s infinite linear', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)', transform: 'skewX(-20deg)' }}></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 font-medium">
                      {detailModal.job.matchPercentage >= 75
                        ? "🔥 Great fit! Your core skills align extremely well with this role."
                        : detailModal.job.matchPercentage >= 50
                        ? "👍 Decent match. Consider highlighting relevant experience in your profile."
                        : "💡 Low match. You may want to build more relevant skills before applying."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 p-5 border-t border-gray-100 bg-white/90 backdrop-blur-md">
              <div className="flex gap-3 animate-fade-up" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
                <Button variant="secondary" onClick={() => setDetailModal({ isOpen: false, job: null })} className="flex-1 py-3 rounded-xl font-semibold">
                  Cancel
                </Button>
                {user?.role === "seeker" && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setDetailModal({ isOpen: false, job: null });
                      setApplyModal({ isOpen: true, job: detailModal.job });
                    }}
                    className="flex-1 py-3 rounded-xl gap-2 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all font-bold"
                  >
                    <Send className="w-4 h-4" />
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ApplyModal
        isOpen={applyModal.isOpen}
        onClose={() => setApplyModal({ isOpen: false, job: null })}
        internship={applyModal.job}
      />
    </div>
  );
};

export default BrowseInternships;