import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle, User, ExternalLink, RotateCcw, MapPin, Phone, Mail, FileText, X, Search, Calendar } from "lucide-react";
import api from "../../utils/api";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace("/api", "") : "http://localhost:5000";

const STATUS_COLORS = { Pending: "warning", Shortlisted: "info", Selected: "success", Rejected: "danger" };
const getMatchVariant = (m) => m >= 75 ? "success" : m >= 50 ? "warning" : "danger";

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ isOpen: false, id: null, status: "" });
    const [selectedResume, setSelectedResume] = useState(null);
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const getAvatar = (name, image) => getImageUrl(image, name || "Student");
    const openResume = (app) => app.resume && setSelectedResume(app.resume);
    const closeResume = () => setSelectedResume(null);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await api.get("/applications/employer");
                setApplications(res.data.applications);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchApps();
    }, []);

    const handleStatusUpdate = async () => {
        try {
            await api.patch(`/applications/${modal.id}/status`, { status: modal.status });
            setApplications(prev => prev.map(a => a._id === modal.id ? { ...a, status: modal.status } : a));
        } catch (err) { console.error(err); }
        finally { setModal({ isOpen: false, id: null, status: "" }); }
    };

    const navigate = useNavigate();

    const handleStartChat = async (studentId, internshipId) => {
        try {
            const res = await api.post("/chat/initiate", { seekerId: studentId, internshipId });
            navigate(`/employer/chat?convId=${res.data.conversation._id}`);
        } catch (err) {
            console.error("Failed to start chat", err);
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesTab = activeTab === "All" || app.status === activeTab;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q ||
            app.studentName?.toLowerCase().includes(q) ||
            app.internship?.title?.toLowerCase().includes(q) ||
            app.student?.email?.toLowerCase().includes(q) ||
            app.studentSkills?.some(s => s.toLowerCase().includes(q));
        return matchesTab && matchesSearch;
    });

    const tabs = ["All", "Pending", "Shortlisted", "Selected", "Rejected"];

    if (loading) return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Applications</h1>
                <p className="text-gray-500 mt-1">Review candidates and update their status.</p>
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200" />
                            <div className="h-4 bg-gray-200 rounded w-32" />
                            <div className="h-5 bg-gray-200 rounded-full w-16 ml-auto" />
                        </div>
                        <div className="mt-3 h-3 bg-gray-200 rounded w-48" />
                        <div className="mt-2 h-3 bg-gray-200 rounded w-32" />
                        <div className="mt-3 flex gap-1.5">
                            <div className="h-5 bg-gray-200 rounded w-16" />
                            <div className="h-5 bg-gray-200 rounded w-16" />
                            <div className="h-5 bg-gray-200 rounded w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Applications</h1>
                <p className="text-gray-500 mt-1">Review candidates and update their status.</p>
            </div>

            {/* Filter & Search */}
            <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-gray-200/60">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center pt-2">
                    <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-hide">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                                    activeTab === tab
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                }`}
                            >
                                {tab}
                                {tab !== "All" && (
                                    <span className={`ml-1.5 ${activeTab === tab ? "text-primary-600" : "text-gray-400"}`}>
                                        ({applications.filter(a => a.status === tab).length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search candidates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                        />
                    </div>
                </div>
            </div>

            {filteredApplications.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900">No applications received</h3>
                    <p className="text-gray-500 mt-1">Candidates will appear here once they apply.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredApplications.map(app => (
                        <div key={app._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <img
                                            src={getAvatar(app.studentName, app.student?.profileImage)}
                                            alt={app.studentName}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                            onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.studentName || "Student")}&background=e2e8f0&color=64748b`; }}
                                        />
                                        <h3 className="font-semibold text-gray-900 truncate">{app.studentName}</h3>
                                        <div className="flex items-center gap-2 ml-auto sm:ml-0">
                                            <Badge variant={getMatchVariant(app.matchPercentage)}>{app.matchPercentage}% Match</Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Applied for: <span className="font-medium">{app.internship.title}</span></p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs text-gray-500">{app.student.email}</p>
                                        {app.appliedAt && (
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(app.appliedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {app.studentSkills.slice(0, 4).map(s => <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{s}</span>)}
                                        {app.studentSkills.length > 4 && <span className="text-xs text-gray-400 px-1">+{app.studentSkills.length - 4}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {app.resume && (
                                        <button
                                            onClick={() => openResume(app)}
                                            className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline underline-offset-2"
                                            title="View Resume"
                                        >
                                            View Resume
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleStartChat(app.student._id, app.internship._id)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Message Candidate"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                    </button>

                                    {app.status === "Pending" && (
                                        <>
                                            <Button variant="outline" className="text-xs py-1.5 px-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => setModal({ isOpen: true, id: app._id, status: "Shortlisted" })}>
                                                Shortlist
                                            </Button>
                                            <Button variant="outline" className="text-xs py-1.5 px-3 border-red-200 text-red-700 hover:bg-red-50" onClick={() => setModal({ isOpen: true, id: app._id, status: "Rejected" })}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {app.status === "Shortlisted" && (
                                        <>
                                            <Button variant="outline" className="text-xs py-1.5 px-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={() => setModal({ isOpen: true, id: app._id, status: "Selected" })}>
                                                <CheckCircle className="w-4 h-4 mr-1.5" /> Select
                                            </Button>
                                            <Button variant="outline" className="text-xs py-1.5 px-3 border-gray-300 text-gray-600 hover:bg-gray-50" onClick={() => setModal({ isOpen: true, id: app._id, status: "Pending" })}>
                                                <RotateCcw className="w-4 h-4 mr-1.5" /> Revoke
                                            </Button>
                                        </>
                                    )}
                                    <Badge variant={STATUS_COLORS[app.status]}>{app.status}</Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={modal.isOpen}
                onClose={() => setModal({ isOpen: false, id: null, status: "" })}
                onConfirm={handleStatusUpdate}
                title={modal.status === "Pending" ? "Revoke Shortlist?" : `Mark as ${modal.status}?`}
                message={modal.status === "Pending" ? "This will remove the candidate from the shortlist and revert their status to Pending. The candidate will be notified." : `This will notify the candidate that they have been ${modal.status.toLowerCase()}.`}
                confirmText={modal.status === "Pending" ? "Yes, Revoke" : `Yes, ${modal.status}`}
                type={modal.status === "Rejected" ? "danger" : modal.status === "Pending" ? "warning" : "success"}
            />

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
                                                        <h4 className="font-bold text-gray-900 text-sm">{edu.qualificationLevel}</h4>
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

export default ManageApplications;