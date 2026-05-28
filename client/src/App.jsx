import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Public Pages
import Landing from "./pages/Landing";
import RoleSelect from "./pages/auth/RoleSelect";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import BrowseInternships from "./pages/BrowseInternships";
import Chat from "./pages/Chat";
import ChatInterface from "./components/chat/ChatInterface";
import CareerPathway from "./pages/CareerPathway";
import CareerPathwayResults from "./pages/CareerPathwayResults";

// Lazy Loaded Layouts & Heavy Pages
const SeekerLayout = React.lazy(() => import("./layouts/SeekerLayout"));
const EmployerLayout = React.lazy(() => import("./layouts/EmployerLayout"));
const AdminLayout = React.lazy(() => import("./layouts/AdminLayout"));

// Seeker Pages
import SeekerDashboard from "./pages/seeker/Dashboard";
import SeekerProfile from "./pages/seeker/Profile";
import SeekerSettings from "./pages/seeker/Settings";
import SeekerResume from "./pages/seeker/Resume";
import SeekerCV from "./pages/seeker/CVUpload";
import SeekerPreferences from "./pages/seeker/Preferences";
import SeekerRecommended from "./pages/seeker/Recommended";
import MyApplications from "./pages/seeker/MyApplications";
import CareerQuiz from "./pages/seeker/CareerQuiz";

// Employer Pages
import EmployerDashboard from "./pages/employer/Dashboard";
import CompanyProfile from "./pages/employer/CompanyProfile";
import PostInternship from "./pages/employer/PostInternship";
import EmployerManageInternships from "./pages/employer/ManageInternships";
import ManageApplications from "./pages/employer/ManageApplications";
import SearchCandidates from "./pages/employer/SearchCandidates";
import EmployerSettings from "./pages/employer/Settings";
import InterviewScheduler from "./pages/employer/InterviewScheduler";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminManageInternships from "./pages/admin/ManageInternships";
import VerifyCompanies from "./pages/admin/VerifyCompanies";
import AdminSettings from "./pages/admin/Settings";
import ManageInstitutions from "./pages/admin/ManageInstitutions";
import ManageCourses from "./pages/admin/ManageCourses";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/role-select" element={<RoleSelect />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/internships" element={<BrowseInternships />} />
            <Route path="/career-pathway" element={<CareerPathway />} />
            <Route path="/career-pathway/results" element={<CareerPathwayResults />} />

            {/* Seeker Routes */}
            <Route element={<ProtectedRoute allowedRoles={["seeker"]} />}>
              <Route path="/seeker" element={<SeekerLayout />}>
                <Route path="dashboard" element={<SeekerDashboard />} />
                <Route path="profile" element={<SeekerProfile />} />
                <Route path="settings" element={<SeekerSettings />} />
                <Route path="resume" element={<SeekerResume />} />
                <Route path="cv" element={<SeekerCV />} />
                <Route path="preferences" element={<SeekerPreferences />} />
                <Route path="recommended" element={<SeekerRecommended />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="career-quiz" element={<CareerQuiz />} />
                <Route path="chat" element={<ChatInterface className="flex-1 min-h-0" />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="internships" element={<AdminManageInternships />} />
                <Route path="verify-companies" element={<VerifyCompanies />} />
                <Route path="institutions" element={<ManageInstitutions />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
            </Route>

            {/* Employer Routes */}
            <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
              <Route path="/employer" element={<EmployerLayout />}>
                <Route path="dashboard" element={<EmployerDashboard />} />
                <Route path="profile" element={<CompanyProfile />} />
                <Route path="post" element={<PostInternship />} />
                <Route path="internships" element={<EmployerManageInternships />} />
                <Route path="applications" element={<ManageApplications />} />
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="candidates" element={<SearchCandidates />} />
                <Route path="settings" element={<EmployerSettings />} />
                <Route path="chat" element={<ChatInterface className="flex-1 min-h-0" />} />
                <Route path="interviews" element={<InterviewScheduler />} />
              </Route>
            </Route>

            {/* Shared Auth Routes */}
            <Route element={<ProtectedRoute allowedRoles={["seeker", "employer"]} />}>
              <Route path="/chat" element={<Chat />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;