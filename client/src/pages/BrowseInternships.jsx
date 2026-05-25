import React, { useState, useEffect } from "react";
import { Search, MapPin, Clock, Building2, Filter, ChevronLeft, ChevronRight, X, Loader2, XCircle, Briefcase, MapPin as LocationIcon, Monitor, ChevronDown, ChevronUp, BadgeDollarSign, Zap, Target, Sparkles, Send } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 w-16 bg-gray-200 rounded" />
      <div className="h-4 w-20 bg-gray-200 rounded" />
    </div>
    <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
    <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
    <div className="flex gap-2 mb-4">
      <div className="h-8 w-24 bg-gray-200 rounded" />
      <div className="h-8 w-20 bg-gray-200 rounded" />
    </div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 bg-gray-200 rounded" />
      <div className="h-6 w-20 bg-gray-200 rounded" />
      <div className="h-6 w-14 bg-gray-200 rounded" />
    </div>
    <div className="h-10 w-full bg-gray-200 rounded mt-4" />
  </div>
);

const BrowseInternships = () => {
  // 1. All Hooks at the top level (Strict React Rules)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // 4. Render
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`fixed inset-0 z-40 bg-white p-6 w-72 transform transition-transform duration-300 lg:relative lg:transform-none lg:bg-transparent lg:p-0 lg:w-64 lg:block lg:sticky lg:top-24 lg:self-start overflow-y-auto ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>

            <div className="space-y-4">
              {/* Category Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection("category")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">Category</h3>
                  </div>
                  {expandedSections.category ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {expandedSections.category && (
                  <div className="p-3 space-y-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleFilterChange("category", cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          filters.category === cat
                            ? "bg-primary-50 text-primary-700 border border-primary-200 font-medium"
                            : "text-gray-600 hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection("location")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <LocationIcon className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">Location</h3>
                  </div>
                  {expandedSections.location ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {expandedSections.location && (
                  <div className="p-3 space-y-2">
                    {LOCATIONS.map(loc => (
                      <button
                        key={loc}
                        onClick={() => handleFilterChange("location", loc)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          filters.location === loc
                            ? "bg-primary-50 text-primary-700 border border-primary-200 font-medium"
                            : "text-gray-600 hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Work Mode Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => toggleSection("mode")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-900 text-sm">Work Mode</h3>
                  </div>
                  {expandedSections.mode ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                {expandedSections.mode && (
                  <div className="p-3 flex flex-wrap gap-2">
                    {MODES.map(mode => (
                      <button
                        key={mode}
                        onClick={() => handleFilterChange("mode", mode)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                          filters.mode === mode
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-gray-600 border-gray-300 hover:border-primary-400"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={clearFilters} className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2">Clear All Filters</button>
            </div>
          </aside>

          {mobileFiltersOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300" onClick={() => setMobileFiltersOpen(false)}></div>}

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search internships, companies, skills..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                />
              </div>
              <button className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 relative" onClick={() => setMobileFiltersOpen(true)}>
                <Filter className="w-4 h-4" /> Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
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
                {internships.map((job) => (
                  <div key={job._id} className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 hover:border-primary-300 transition-all duration-300 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-500/10 transition-all duration-300 pointer-events-none" />
                    <div className="flex justify-between items-start mb-4">
                      {job.matchPercentage !== undefined && (
                        <Badge variant={getMatchVariant(job.matchPercentage)} className="text-sm font-semibold px-3 py-1">
                          {job.matchPercentage}% Match
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400 font-medium ml-auto">{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>{job.company}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                        <Clock className="w-3.5 h-3.5" /> {job.mode}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.coreSkills?.slice(0, 2).map(skill => (
                          <span key={skill} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-md font-medium">{skill}</span>
                        ))}
                        {job.additionalSkills?.slice(0, 2).map(skill => (
                          <span key={skill} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md">{skill}</span>
                        ))}
                        {((job.coreSkills?.length || 0) + (job.additionalSkills?.length || 0)) > 4 && (
                          <span className="text-xs text-gray-400">+{((job.coreSkills?.length || 0) + (job.additionalSkills?.length || 0)) - 4}</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600"
                        onClick={() => setDetailModal({ isOpen: true, job })}
                      >
                        {user?.role === "seeker" ? "Apply Now" : "View Details"}
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

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-hidden flex flex-col animate-fade-up">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white shrink-0">
              <button onClick={() => setDetailModal({ isOpen: false, job: null })} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-tight truncate">{detailModal.job.title}</h3>
                  <p className="text-primary-100 text-sm mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> {detailModal.job.company}
                  </p>
                </div>
              </div>

              {/* Match Ring */}
              {detailModal.job.matchPercentage !== undefined && (
                <div className="absolute bottom-0 right-6 translate-y-1/2">
                  <div className={`${getMatchColor(detailModal.job.matchPercentage).light} border ${getMatchColor(detailModal.job.matchPercentage).border} rounded-full p-1 shadow-lg`}>
                    <MatchRing match={detailModal.job.matchPercentage} />
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-5 pt-10 space-y-4">
              {/* Quick Info Chips */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm border border-gray-100">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {detailModal.job.location}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm border border-gray-100">
                  <Clock className="w-3.5 h-3.5 text-gray-400" /> {detailModal.job.mode}
                </span>
                {(detailModal.job.salaryMin || detailModal.job.salaryMax) && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm border border-gray-100">
                    <BadgeDollarSign className="w-3.5 h-3.5 text-gray-400" />
                    LKR {detailModal.job.salaryMin?.toLocaleString() || 0} - {detailModal.job.salaryMax?.toLocaleString() || 0}
                  </span>
                )}
              </div>

              {/* Description */}
              {detailModal.job.description && (
                <SectionCard icon={Sparkles} title="About the Role">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{detailModal.job.description}</p>
                </SectionCard>
              )}

              {detailModal.job.responsibilities && (
                <SectionCard icon={Target} title="Responsibilities">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{detailModal.job.responsibilities}</p>
                </SectionCard>
              )}

              {/* Skills */}
              <SectionCard icon={Zap} title="Required Skills">
                <div className="space-y-3">
                  {(detailModal.job.coreSkills || []).length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <Target className="w-3 h-3" /> Core — must have
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {detailModal.job.coreSkills.map(skill => (
                          <span key={skill} className="text-xs font-semibold bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(detailModal.job.additionalSkills || []).length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Additional — nice to have
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {detailModal.job.additionalSkills.map(skill => (
                          <span key={skill} className="text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-1 rounded-lg">
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

              {/* Match Score Bar */}
              {detailModal.job.matchPercentage !== undefined && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Match Score</span>
                    <span className={`text-sm font-bold ${getMatchColor(detailModal.job.matchPercentage).text}`}>{detailModal.job.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${getMatchColor(detailModal.job.matchPercentage).bar} transition-all duration-1000 ease-out`}
                      style={{ width: `${detailModal.job.matchPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {detailModal.job.matchPercentage >= 75
                      ? "Great fit! Your core skills align well with this role."
                      : detailModal.job.matchPercentage >= 50
                      ? "Decent match. Consider highlighting relevant experience in your profile."
                      : "Low match. You may want to build more relevant skills before applying."}
                  </p>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="shrink-0 p-5 border-t border-gray-100 bg-white">
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setDetailModal({ isOpen: false, job: null })} className="flex-1 py-2.5">
                  Close
                </Button>
                {user?.role === "seeker" && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setDetailModal({ isOpen: false, job: null });
                      setApplyModal({ isOpen: true, job: detailModal.job });
                    }}
                    className="flex-1 py-2.5 gap-2 shadow-lg shadow-primary-500/25"
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