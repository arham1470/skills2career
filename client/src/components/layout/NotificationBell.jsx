import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Check, CheckCircle, AlertCircle, Info, Inbox,
  Briefcase, Calendar, MessageSquare, Zap, Trash2
} from "lucide-react";
import api from "../../utils/api";

const typeConfig = {
  success: { icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  warning: { icon: AlertCircle, color: "text-amber-600 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  info:    { icon: Info,       color: "text-blue-600 bg-blue-50 border-blue-200", dot: "bg-blue-500" }
};

const categoryIcons = {
  application: Briefcase,
  interview: Calendar,
  message: MessageSquare,
  default: Zap
};

const getGroupLabel = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffHrs = diffMs / (1000 * 60 * 60);
  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDay(date, now)) return "Today";
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) return "Yesterday";
  if (diffHrs < 168) return "This week";
  return "Earlier";
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data.notifications);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchNotifs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const handleClick = (n) => {
    if (!n.read) markRead(n._id);
    if (n.link) {
      navigate(n.link);
      setIsOpen(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const grouped = notifications.reduce((acc, n) => {
    const label = getGroupLabel(n.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(n);
    return acc;
  }, {});

  const groupOrder = ["Today", "Yesterday", "This week", "Earlier"];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-fade-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-900">No notifications</p>
                <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              groupOrder.map(label => {
                const items = grouped[label];
                if (!items || items.length === 0) return null;
                return (
                  <div key={label}>
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 sticky top-0 backdrop-blur-sm">
                      {label}
                    </div>
                    {items.map((n, idx) => {
                      const config = typeConfig[n.type] || typeConfig.info;
                      const Icon = config.icon;
                      const CategoryIcon = categoryIcons[n.category] || categoryIcons.default;
                      return (
                        <div
                          key={n._id}
                          onClick={() => handleClick(n)}
                          className={`relative px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 items-start transition-colors ${
                            !n.read ? "bg-primary-50/30" : ""
                          }`}
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          {/* unread dot */}
                          {!n.read && (
                            <span className={`absolute left-1.5 top-4 w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          )}

                          {/* icon circle */}
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${config.color}`}>
                            <CategoryIcon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${!n.read ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                              {n.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Icon className={`w-3 h-3 ${config.color.split(" ")[0]}`} />
                              <p className="text-[11px] text-gray-400">
                                {new Date(n.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                {" · "}
                                {new Date(n.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>

                          {!n.read && (
                            <button
                              onClick={(e) => { e.stopPropagation(); markRead(n._id); }}
                              className="text-gray-300 hover:text-primary-600 transition-colors mt-0.5"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
