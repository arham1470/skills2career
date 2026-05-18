import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            {user?.role === "seeker" ? "Seeker" : "Employer"} Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
            <button onClick={logout} className="btn-secondary text-sm py-2 px-4">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-card p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome to your workspace</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Your authentication is working perfectly. Dashboard layouts, sidebars, and role-specific features will be built in the next steps.
          </p>
          <div className="inline-block bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium">
            Role: {user?.role} | ID: {user?.id}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;