import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, MapPin, Video, Users, CheckCircle, XCircle, Loader2, Plus, Building2 } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { getImageUrl } from "../../utils/getImageUrl";

const DEFAULT_FORM = { type: "walkin", date: "", time: "", address: "", zoomLink: "", notes: "" };

const TABS = [
  { key: "candidates", label: "Shortlisted Candidates" },
  { key: "upcoming",   label: "Upcoming" },
  { key: "past",       label: "Past" },
];

const STATUS_BADGE = {
  Scheduled: "info",
  Completed: "success",
  Cancelled: "danger",
};

/* ─── Small reusable interview card ─── */
const InterviewCard = ({ iv, onStatus, updatingId, showActions = false }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 border-l-4 ${iv.type === "zoom" ? "border-l-blue-400" : "border-l-amber-400"}`}>
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <img
          src={getImageUrl(iv.seekerImage, iv.seekerName || "C")}
          alt=""
          className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
          onError={e => { e.target.src = `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&name=${encodeURIComponent(iv.seekerName || "C")}`; }}
        />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900">{iv.seekerName || "Candidate"}</p>
            <Badge variant={STATUS_BADGE[iv.status]}>{iv.status}</Badge>
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${iv.type === "zoom" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>
              {iv.type === "zoom" ? <Video className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
              {iv.type === "zoom" ? "Zoom" : "Walk-in"}
            </span>
          </div>
          <p className="text-xs text-primary-600 font-medium mt-0.5">{iv.internship?.title}</p>
          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {iv.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {iv.time}</span>
            {iv.type === "walkin" && iv.address && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {iv.address}</span>
            )}
            {iv.type === "zoom" && iv.zoomLink && (
              <a href={iv.zoomLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                <Video className="w-3 h-3" /> Join Meeting
              </a>
            )}
          </div>
          {iv.notes && <p className="text-xs text-gray-400 mt-1.5 italic">"{iv.notes}"</p>}
        </div>
      </div>
      {showActions && (
        <div className="flex gap-2 shrink-0">
          <Button
            variant="secondary"
            className="text-xs px-3 py-1.5 text-red-600 hover:border-red-300"
            onClick={() => onStatus(iv._id, "Cancelled")}
            disabled={updatingId === iv._id}
          >
            {updatingId === iv._id ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <XCircle className="w-3.5 h-3.5 mr-1" />}
            Cancel
          </Button>
          <Button
            className="text-xs px-3 py-1.5"
            onClick={() => onStatus(iv._id, "Completed")}
            disabled={updatingId === iv._id}
          >
            {updatingId === iv._id ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <CheckCircle className="w-3.5 h-3.5 mr-1" />}
            Complete
          </Button>
        </div>
      )}
    </div>
  </div>
);

/* ─── Main page ─── */
const InterviewScheduler = () => {
  const [tab, setTab] = useState("candidates");
  const [shortlisted, setShortlisted] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, application: null });
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, intRes] = await Promise.all([
        api.get("/applications/employer"),
        api.get("/interviews/employer"),
      ]);
      setShortlisted(appsRes.data.applications.filter(a => a.status === "Shortlisted"));
      setInterviews(intRes.data.interviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const scheduledAppIds = new Set(
    interviews.filter(i => i.status === "Scheduled").map(i =>
      typeof i.application === "object" ? i.application?._id?.toString() : i.application?.toString()
    )
  );

  const openModal = (application) => {
    setModal({ open: true, application });
    setForm(DEFAULT_FORM);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/interviews", { applicationId: modal.application._id, ...form });
      await fetchData();
      setModal({ open: false, application: null });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule interview");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/interviews/${id}`, { status });
      setInterviews(prev => prev.map(i => i._id === id ? { ...i, status } : i));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const upcoming = interviews.filter(i => i.status === "Scheduled");
  const past     = interviews.filter(i => i.status !== "Scheduled");

  if (loading) return (
    <div className="flex justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Interview Scheduler</h1>
        <p className="text-gray-500 mt-1">Schedule and manage interviews for shortlisted candidates.</p>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Shortlisted", value: shortlisted.length, badgeColor: "bg-blue-50 text-blue-700" },
          { label: "Upcoming",    value: upcoming.length,    badgeColor: "bg-emerald-50 text-emerald-700" },
          { label: "Completed",   value: interviews.filter(i => i.status === "Completed").length, badgeColor: "bg-gray-100 text-gray-700" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-2xl font-bold text-gray-900">{s.value}</span>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.badgeColor}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              tab === t.key
                ? "bg-primary-50 text-primary-700"
                : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            {t.label}
            {t.key === "upcoming" && upcoming.length > 0 && (
              <span className="ml-1.5 text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">{upcoming.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Shortlisted Candidates */}
      {tab === "candidates" && (
        <div className="space-y-3">
          {shortlisted.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-700">No shortlisted candidates yet</p>
              <p className="text-xs text-gray-400 mt-1">Go to Applications and shortlist candidates first.</p>
            </div>
          ) : (
            shortlisted.map(app => {
              const hasInterview = scheduledAppIds.has(app._id?.toString());
              return (
                <div key={app._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={getImageUrl(app.studentImage, app.studentName || "Candidate")}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&name=${encodeURIComponent(app.studentName || "C")}`; }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{app.studentName || "Unknown Candidate"}</p>
                      <p className="text-xs text-primary-600 font-medium">{app.internship?.title}</p>
                      <p className="text-xs text-gray-500">{app.internship?.company}</p>
                    </div>
                  </div>
                  {hasInterview ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" /> Interview Scheduled
                    </span>
                  ) : (
                    <Button onClick={() => openModal(app)}>
                      <Plus className="w-4 h-4 mr-1" /> Schedule Interview
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Upcoming */}
      {tab === "upcoming" && (
        <div className="space-y-3">
          {upcoming.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-700">No upcoming interviews</p>
            </div>
          ) : upcoming.map(iv => (
            <InterviewCard key={iv._id} iv={iv} onStatus={handleStatus} updatingId={updatingId} showActions />
          ))}
        </div>
      )}

      {/* Tab: Past */}
      {tab === "past" && (
        <div className="space-y-3">
          {past.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-700">No past interviews</p>
            </div>
          ) : past.map(iv => (
            <InterviewCard key={iv._id} iv={iv} />
          ))}
        </div>
      )}

      {/* ─── Schedule Modal ─── */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Schedule Interview</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {modal.application?.studentName} &mdash; {modal.application?.internship?.title}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
                <div className="flex gap-2">
                  {[
                    { value: "walkin", label: "Walk-in",      Icon: Building2 },
                    { value: "zoom",   label: "Online (Zoom)", Icon: Video },
                  ].map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, type: value }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        form.type === value
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <DatePicker
                    selected={form.date ? new Date(form.date + "T00:00:00") : null}
                    onChange={date => setForm(f => ({ ...f, date: date ? date.toISOString().split("T")[0] : "" }))}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    required
                    wrapperClassName="w-full"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <DatePicker
                    selected={form.time ? (() => { const [h, m] = form.time.split(":").map(Number); const d = new Date(); d.setHours(h, m, 0, 0); return d; })() : null}
                    onChange={date => {
                      if (!date) { setForm(f => ({ ...f, time: "" })); return; }
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(2, "0");
                      setForm(f => ({ ...f, time: `${hours}:${minutes}` }));
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Select time"
                    required
                    wrapperClassName="w-full"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              {/* Address or Zoom link */}
              {form.type === "walkin" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 45 Galle Road, Colombo 03"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zoom Meeting Link</label>
                  <input
                    type="url"
                    required
                    placeholder="https://zoom.us/j/..."
                    value={form.zoomLink}
                    onChange={e => setForm(f => ({ ...f, zoomLink: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Bring your portfolio. Ask for reception at lobby."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-2 pt-1">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setModal({ open: false, application: null })}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;
