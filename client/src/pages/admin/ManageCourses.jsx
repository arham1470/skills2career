import React, { useState, useEffect } from "react";
import { Plus, BookOpen, Building2, Pencil, Trash2, X, Loader2, Search, GraduationCap } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";

const educationLevels = ["O/L", "A/L", "Diploma", "HND", "Bachelor"];
const alStreams = ["Arts", "Commerce", "Science", "Technology", "Any"];
const olSubjects = [
  "Mathematics", "Science", "English", "Sinhala", "Tamil",
  "History", "Geography", "Commerce", "ICT", "Music", "Art"
];

const fieldsOfStudy = [
  "Any",
  "IT / Computing",
  "Business / Management",
  "Engineering",
  "Science",
  "Arts / Humanities",
  "Law",
  "Medicine / Health Sciences",
  "Hospitality / Tourism",
];

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    institution: "",
    educationLevel: "O/L",
    description: "",
    duration: "",
    requirements: { olPasses: "", olMandatorySubjects: [], alStream: "", alPasses: "", gpa: "", otherRequirements: "" },
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [coursesRes, instRes] = await Promise.all([
        api.get("/courses"),
        api.get("/institutions"),
      ]);
      setCourses(coursesRes.data.courses || []);
      setInstitutions(instRes.data.institutions || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      institution: "",
      educationLevel: "O/L",
      description: "",
      duration: "",
      requirements: { olPasses: "", olMandatorySubjects: [], alStream: "", alPasses: "", gpa: "", requiredField: "Any", otherRequirements: "" },
    });
    setShowModal(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      name: course.name,
      institution: course.institution?._id || course.institution || "",
      educationLevel: course.educationLevel,
      description: course.description || "",
      duration: course.duration || "",
      requirements: {
        olPasses: course.requirements?.olPasses?.toString() || "",
        olMandatorySubjects: course.requirements?.olMandatorySubjects || [],
        alStream: course.requirements?.alStream || "",
        alPasses: course.requirements?.alPasses?.toString() || "",
        gpa: course.requirements?.gpa?.toString() || "",
        requiredField: course.requirements?.requiredField || "Any",
        otherRequirements: course.requirements?.otherRequirements || "",
      },
    });
    setShowModal(true);
  };

  const handleReqChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, [field]: value },
    }));
  };

  const toggleSubject = (subject) => {
    setForm((prev) => {
      const exists = prev.requirements.olMandatorySubjects.includes(subject);
      return {
        ...prev,
        requirements: {
          ...prev.requirements,
          olMandatorySubjects: exists
            ? prev.requirements.olMandatorySubjects.filter((s) => s !== subject)
            : [...prev.requirements.olMandatorySubjects, subject],
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        requirements: {
          ...form.requirements,
          olPasses: form.requirements.olPasses ? parseInt(form.requirements.olPasses) : null,
          alPasses: form.requirements.alPasses ? parseInt(form.requirements.alPasses) : null,
          gpa: form.requirements.gpa ? parseFloat(form.requirements.gpa) : null,
        },
      };

      if (editing) {
        await api.put(`/courses/${editing._id}`, payload);
      } else {
        await api.post("/courses", payload);
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save course:", error);
      alert(error.response?.data?.message || "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const getInstitutionName = (id) => {
    const inst = institutions.find((i) => i._id === (id?._id || id));
    return inst?.name || "Unknown";
  };

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    getInstitutionName(c.institution).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
          <p className="text-gray-500 mt-1">Add and manage courses with requirements.</p>
        </div>
        <Button variant="primary" onClick={openAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Course
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Course</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Institution</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Level</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-900">{course.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
                      {getInstitutionName(course.institution)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                      {course.educationLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {course.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(course)} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(course._id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No courses found.</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-up my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{editing ? "Edit Course" : "Add Course"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="e.g. BSc Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <select
                  required
                  value={form.institution}
                  onChange={(e) => setForm({ ...form, institution: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                >
                  <option value="">Select institution</option>
                  {institutions.map((inst) => (
                    <option key={inst._id} value={inst._id}>{inst.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <select
                    value={form.educationLevel}
                    onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  >
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="e.g. 3 years"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  rows={2}
                  placeholder="Brief description of the course"
                />
              </div>

              {/* Requirements based on education level */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Requirements</h3>

                {form.educationLevel === "O/L" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Min O/L Passes Required</label>
                      <select
                        value={form.requirements.olPasses}
                        onChange={(e) => handleReqChange("olPasses", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
                      >
                        <option value="">Any</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={i}>{i} passes</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Mandatory Subjects</label>
                      <div className="flex flex-wrap gap-1.5">
                        {olSubjects.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => toggleSubject(sub)}
                            className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                              form.requirements.olMandatorySubjects.includes(sub)
                                ? "bg-primary-100 text-primary-700 border border-primary-300"
                                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {form.educationLevel === "A/L" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Required Stream</label>
                      <select
                        value={form.requirements.alStream}
                        onChange={(e) => handleReqChange("alStream", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
                      >
                        <option value="">Any</option>
                        {alStreams.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Min A/L Passes</label>
                      <select
                        value={form.requirements.alPasses}
                        onChange={(e) => handleReqChange("alPasses", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
                      >
                        <option value="">Any</option>
                        {[0, 1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>{n} passes</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {["HND", "Bachelor", "Diploma"].includes(form.educationLevel) && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Min GPA Required</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="4"
                        value={form.requirements.gpa}
                        onChange={(e) => handleReqChange("gpa", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
                        placeholder="e.g. 2.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Required Field of Study</label>
                      <select
                        value={form.requirements.requiredField}
                        onChange={(e) => handleReqChange("requiredField", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
                      >
                        {fieldsOfStudy.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-gray-400 mt-1">Select "Any" if no specific field is required</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Other Requirements</label>
                  <input
                    value={form.requirements.otherRequirements}
                    onChange={(e) => handleReqChange("otherRequirements", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
                    placeholder="Any additional requirements"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting} className="flex-1">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (editing ? "Save Changes" : "Add Course")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
