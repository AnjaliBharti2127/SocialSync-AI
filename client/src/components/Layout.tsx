import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const pageTitle: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Accounts",
  "/schedule": "Social Schedule",
  "/ai-composer": "AI Composer",
};

const Layout = () => {

  const {isAuthenticated, isLoading} = useAuth()

  const location = useLocation();
  const title = pageTitle[location.pathname] || "Social AI";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if(isLoading){
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="size-8 border-4 border-red-500 borderr-t-transparent rounded-full animated-spin"/>

        </div>

     
    )
  }
  if(!isAuthenticated){
    return <Navigate to="/login" replace/>
  }

  return (
    <div className="flex h-screen bg-[#05070B] text-slate-200">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-[#05070B]/90 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-slate-100">{title}</p>
            <p className="text-sm text-slate-500">
              Manage and automate your social presence
            </p>
          </div>

          <div className="flex items-center gap-5">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-orange-300 text-lg transition-all hover:scale-105 active:scale-95"
              aria-label="Notifications"
            >
              🔔
            </button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-[0_0_16px_-4px_rgba(139,92,246,0.7)]">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;