import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Briefcase,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import api from "../../utils/api";
import Badge from "../../components/ui/Badge";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useDebounce } from "../../hooks/useDebounce";

const STATUS_COLORS = {
  Active: "success",
  Draft: "warning",
  Closed: "default",
  Rejected: "danger",
};

const STATUS_META = {
  Active: { label: "Active", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Draft: { label: "Draft", color: "bg-amber-50 text-amber-700 border-amber-200" },
  Closed: { label: "Closed", color: "bg-gray-100 text-gray-700 border-gray-200" },
  Rejected: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
};

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-4 py-3">
      <div className="h-4 w-40 bg-gray-200 rounded mb-1" />
      <div className="h-3 w-24 bg-gray-200 rounded" />
    </td>
    <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
    <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
    <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
    <td className="px-4 py-3 text-right"><div className="h-8 w-24 bg-gray-200 rounded ml-auto" /></td>
  </tr>
);

const SortHeader = ({ label, field, sortField, sortDir, onSort }) => (
  <th
    className="px-4 py-3 cursor-pointer select-none hover:bg-gray-100 transition-colors"
    onClick={() => onSort(field)}
  >
    <span className="inline-flex items-center">
      {label}
      {sortField === field ? (
        sortDir === "asc" ? (
          <ChevronUp className="w-3.5 h-3.5 text-primary-600 ml-1" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-primary-600 ml-1" />
        )
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
      )}
    </span>
  </th>
);

const InlineStatusSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const meta = STATUS_META[value] || STATUS_META.Draft;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${meta.color}`}
      >
        {meta.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((status) => {
            const sMeta = STATUS_META[status];
            return (
              <button
                key={status}
                type="button"
                onClick={() => { onChange(status); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                  status === value
                    ? sMeta.color
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {sMeta.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [modal, setModal] = useState({ isOpen: false, id: null, status: "" });
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const debouncedSearch = useDebounce(search, 300);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
      });
      const res = await api.get(`/admin/internships?${params}`);
      setInternships(res.data.internships);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [pagination.page, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortedInternships = useMemo(() => {
    if (!sortField) return internships;
    const sorted = [...internships].sort((a, b) => {
      let valA, valB;
      if (sortField === "title") {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else if (sortField === "company") {
        valA = (a.company || "").toLowerCase();
        valB = (b.company || "").toLowerCase();
      } else if (sortField === "status") {
        valA = a.status.toLowerCase();
        valB = b.status.toLowerCase();
      } else if (sortField === "createdAt") {
        valA = new Date(a.createdAt);
        valB = new Date(b.createdAt);
      } else {
        valA = a[sortField];
        valB = b[sortField];
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [internships, sortField, sortDir]);

  const updateStatus = async () => {
    try {
      await api.patch(`/admin/internships/${modal.id}/status`, { status: modal.status });
      setInternships((prev) =>
        prev.map((i) =>
          i._id === modal.id ? { ...i, status: modal.status } : i
        )
      );
      fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setModal({ isOpen: false, id: null, status: "" });
    }
  };

  const statCards = [
    {
      label: "Total",
      value: stats?.totalInternships || 0,
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Active",
      value: stats?.activeInternships || 0,
      icon: Briefcase,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Draft",
      value: stats?.draftInternships || 0,
      icon: Briefcase,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Closed",
      value: stats?.closedInternships || 0,
      icon: Briefcase,
      color: "text-gray-600 bg-gray-50",
    },
    {
      label: "Rejected",
      value: stats?.rejectedInternships || 0,
      icon: Briefcase,
      color: "text-red-600 bg-red-50",
    },
  ];

  const statusOptions = ["All", "Active", "Draft", "Closed", "Rejected"];
  const allStatuses = ["Active", "Draft", "Closed", "Rejected"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Moderate Internships</h1>
        <p className="text-gray-500 mt-1">
          Review and control internship postings across the platform.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}
            >
              <card.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 leading-tight">
                {card.value}
              </p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or company..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg flex-wrap">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <SortHeader
                  label="Title"
                  field="title"
                  sortField={sortField}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortHeader
                  label="Company"
                  field="company"
                  sortField={sortField}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortHeader
                  label="Status"
                  field="status"
                  sortField={sortField}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortHeader
                  label="Posted"
                  field="createdAt"
                  sortField={sortField}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : sortedInternships.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No internships found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                sortedInternships.map((i) => (
                  <tr
                    key={i._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 max-w-[220px] truncate">
                        {i.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {i.postedBy?.email || ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{i.company}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_COLORS[i.status]}>
                        {i.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(i.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <InlineStatusSelect
                        value={i.status}
                        options={allStatuses}
                        onChange={(status) =>
                          setModal({ isOpen: true, id: i._id, status })
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            <button
              onClick={() =>
                setPagination((p) => ({ ...p, page: p.page - 1 }))
              }
              disabled={pagination.page === 1}
              className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() =>
                setPagination((p) => ({ ...p, page: p.page + 1 }))
              }
              disabled={pagination.page === pagination.pages}
              className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, id: null, status: "" })}
        onConfirm={updateStatus}
        title={`Mark as ${modal.status}?`}
        message="This will update the visibility of the internship posting."
        confirmText={`Yes, ${modal.status}`}
        type={modal.status === "Rejected" ? "danger" : "warning"}
      />
    </div>
  );
};

export default ManageInternships;