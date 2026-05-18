import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  UserX,
  RefreshCw,
  Users,
  Ban,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import api from "../../utils/api";
import Badge from "../../components/ui/Badge";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useDebounce } from "../../hooks/useDebounce";

const stringToColor = (str) => {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500",
    "bg-purple-500", "bg-cyan-500", "bg-orange-500", "bg-indigo-500",
    "bg-pink-500", "bg-teal-500",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (email) => {
  const [name] = email.split("@");
  return name.slice(0, 2).toUpperCase();
};

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100 last:border-0">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200" />
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3"><div className="h-4 w-14 bg-gray-200 rounded" /></td>
    <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
    <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
    <td className="px-4 py-3 text-right"><div className="h-8 w-8 bg-gray-200 rounded-full ml-auto" /></td>
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

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [modal, setModal] = useState({ isOpen: false, userId: null, action: "" });
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const debouncedSearch = useDebounce(search, 300);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 10,
        search: debouncedSearch,
      });
      if (roleFilter !== "All") params.append("role", roleFilter);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
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
    fetchUsers();
  }, [pagination.page, roleFilter, debouncedSearch]);

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

  const sortedUsers = useMemo(() => {
    if (!sortField) return users;
    const sorted = [...users].sort((a, b) => {
      let valA, valB;
      if (sortField === "email") {
        valA = a.email.toLowerCase();
        valB = b.email.toLowerCase();
      } else if (sortField === "role") {
        valA = a.role.toLowerCase();
        valB = b.role.toLowerCase();
      } else if (sortField === "status") {
        valA = a.isSuspended ? 1 : 0;
        valB = b.isSuspended ? 1 : 0;
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
  }, [users, sortField, sortDir]);

  const toggleSuspend = async () => {
    try {
      await api.patch(`/admin/users/${modal.userId}/suspend`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === modal.userId ? { ...u, isSuspended: !u.isSuspended } : u
        )
      );
      fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setModal({ isOpen: false, userId: null, action: "" });
    }
  };

  const statCards = [
    {
      label: "Total Users",
      value: (stats?.totalSeekers || 0) + (stats?.totalEmployers || 0),
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Active",
      value:
        (stats?.totalSeekers || 0) +
        (stats?.totalEmployers || 0) -
        (stats?.suspendedUsers || 0),
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Suspended",
      value: stats?.suspendedUsers || 0,
      icon: Ban,
      color: "text-red-600 bg-red-50",
    },
    {
      label: "Seekers",
      value: stats?.totalSeekers || 0,
      icon: Users,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Employers",
      value: stats?.totalEmployers || 0,
      icon: ShieldCheck,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  const roleOptions = [
    { value: "All", label: "All Roles" },
    { value: "seeker", label: "Seekers" },
    { value: "employer", label: "Employers" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 mt-1">
          View, search, and control seeker & employer accounts.
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
            placeholder="Search by email..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setRoleFilter(opt.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                roleFilter === opt.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.label}
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
                  label="User"
                  field="email"
                  sortField={sortField}
                  sortDir={sortDir}
                  onSort={handleSort}
                />
                <SortHeader
                  label="Role"
                  field="role"
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
                  label="Joined"
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
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No users found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${stringToColor(
                            u.email
                          )}`}
                        >
                          {getInitials(u.email)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {u.email.split("@")[0]}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.isSuspended ? "danger" : "success"}>
                        {u.isSuspended ? "Suspended" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() =>
                          setModal({
                            isOpen: true,
                            userId: u._id,
                            action: u.isSuspended ? "activate" : "suspend",
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          u.isSuspended
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {u.isSuspended ? (
                          <RefreshCw className="w-3.5 h-3.5" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                        {u.isSuspended ? "Activate" : "Suspend"}
                      </button>
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
        onClose={() => setModal({ isOpen: false, userId: null, action: "" })}
        onConfirm={toggleSuspend}
        title={`${modal.action === "suspend" ? "Suspend" : "Activate"} User?`}
        message={`This will ${
          modal.action === "suspend" ? "block" : "restore"
        } their access to the platform.`}
        confirmText={`Yes, ${modal.action}`}
        type={modal.action === "suspend" ? "danger" : "warning"}
      />
    </div>
  );
};

export default ManageUsers;