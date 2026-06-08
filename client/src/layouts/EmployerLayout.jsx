import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Building2, PlusCircle, Users, Settings, Menu, X, LogOut, Search, Briefcase, MessageSquare, Home, Edit2, BadgeCheck, CalendarCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";
import api from "../utils/api";
import { getImageUrl } from "../utils/getImageUrl";
import logo from "../assets/logoD.png";

const EmployerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/company/profile")
      .then(res => setCompany(res.data.profile))
      .catch(() => setCompany(null));
  }, []);

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
  const confirmLogout = () => { setShowLogoutConfirm(true); };
  const cancelLogout = () => { setShowLogoutConfirm(false); };

  const navLinks = [
    { label: "Dashboard", path: "/employer/dashboard", icon: LayoutDashboard },
    { label: "Post Internship", path: "/employer/post", icon: PlusCircle },
    { label: "Manage Internships", path: "/employer/internships", icon: Briefcase },
    { label: "Applications", path: "/employer/applications", icon: Users },
    { label: "Search Candidates", path: "/employer/candidates", icon: Search },
    { label: "Interview Scheduler", path: "/employer/interviews", icon: CalendarCheck },
    { label: "Messages", path: "/employer/chat", icon: MessageSquare },
    { label: "Company Profile", path: "/employer/profile", icon: Building2 },
    { label: "Settings", path: "/employer/settings", icon: Settings },
  ];

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Skills2Career" className="h-20 w-auto" />
          </div>
          <button className="text-gray-500" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <img src={getImageUrl(company?.logo, company?.companyName || "Company")} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&name=${encodeURIComponent(company?.companyName || "Company")}`; }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{company?.companyName || "Employer Account"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.disabled ? "#" : link.path} onClick={(e) => link.disabled && e.preventDefault()}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary-50 text-primary-700" : link.disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
              <link.icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{link.badge}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 flex justify-between items-center">
          <Button variant="ghost" className="w-14 h-14 p-0 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg" onClick={() => navigate("/")}>
            <Home className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className="justify-end text-red-600 hover:bg-red-50 hover:text-red-700 px-2" onClick={confirmLogout}>
            <LogOut className="w-5 h-5 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <img src={logo} alt="Skills2Career" className="h-20 w-auto" />
        </div>
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              <img 
                src={getImageUrl(company?.logo, company?.companyName || "Company")} 
                alt="" 
                className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shadow-sm group-hover:ring-2 group-hover:ring-primary-400 transition-all duration-200" 
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&name=${encodeURIComponent(company?.companyName || "Company")}`; }} 
              />
              <button 
                onClick={() => navigate("/employer/profile")}
                className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
              >
                <Edit2 className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-1.5 mt-3 max-w-full">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-medium">
                <BadgeCheck className="w-3 h-3" />
                Employer
              </span>
              <p className="text-sm font-semibold text-gray-900 text-center break-words">{company?.companyName || "Provider Account"}</p>
            </div>
            <p className="mt-0.5 text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.disabled ? "#" : link.path} onClick={(e) => link.disabled && e.preventDefault()}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary-50 text-primary-700" : link.disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
              <link.icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{link.badge}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 flex justify-between items-center">
          <Button variant="ghost" className="w-14 h-14 p-0 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg" onClick={() => navigate("/")}>
            <Home className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className="justify-end text-red-600 hover:bg-red-50 hover:text-red-700 px-2" onClick={confirmLogout}>
            <LogOut className="w-5 h-5 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-500">{company?.companyName || "Employer Workspace"}</span>
            <button 
              onClick={() => navigate("/employer/profile")}
              className="relative group"
            >
              <img 
                src={getImageUrl(company?.logo, company?.companyName || "Company")} 
                alt="" 
                className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:ring-2 group-hover:ring-primary-400 transition-all duration-200" 
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?background=e2e8f0&color=64748b&name=${encodeURIComponent(company?.companyName || "Company")}`; }} 
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col custom-scrollbar"><Outlet /></main>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={cancelLogout}
        onConfirm={handleLogout}
        title="Sign Out?"
        message="Are you sure you want to sign out of your account?"
        confirmText="Yes, Sign Out"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default EmployerLayout;