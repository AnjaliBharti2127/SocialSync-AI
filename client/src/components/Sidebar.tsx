// import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wand2,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Single flat accent reused across the whole app (Dashboard, Accounts, AI
// Composer) so the active nav item, badges, and avatar all read as the
// same design language instead of introducing new colors here.
const ACCENT = "#8E7CFF";

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  // const logout = () => {
  //   localStorage.clear();
  //   window.location.href = "/";
  // };

  // const user = {
  //   name: "Alice Johnson",
  //   email: "alice.johnson@example.com",
  // };

    const {logout,user}=useAuth()
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Account", icon: Users, path: "/account" },
    { name: "Scheduler", icon: Calendar, path: "/scheduler" },
    { name: "AI Composer", icon: Wand2, path: "/ai-composer" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-[#0A0C14]/95 backdrop-blur-xl border-r border-white/[0.06] z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 w-64 flex flex-col`}
    >
      {/* ======================================
          Logo Section
          Brand identity and workspace status
          ====================================== */}
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div
              className="absolute inset-0 rounded-full blur-lg opacity-40"
              style={{ backgroundColor: ACCENT }}
            />
            <img
              src="/icons8-ai-32.png"
              alt="Logo"
              className="relative w-10 h-10 transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-100 truncate">
              Social AI
            </h1>
            <p className="text-xs text-slate-500 truncate">Scheduler</p>
          </div>
        </div>

        <span
          className="inline-flex items-center mt-4 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/[0.06]"
          style={{ color: ACCENT }}
        >
          AI Powered
        </span>
      </div>

      {/* Menu Heading */}
      <div className="px-6 py-4">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em]">
          Workspace
        </span>
      </div>

      {/* ======================================
          Navigation Menu
          Main dashboard routes
          ====================================== */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
              style={
                isActive
                  ? { backgroundColor: "rgba(142,124,255,0.12)" }
                  : undefined
              }
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full"
                  style={{ backgroundColor: ACCENT }}
                />
              )}

              <Icon
                className="w-5 h-5 shrink-0"
                style={{ color: isActive ? ACCENT : "#94a3b8" }}
              />

              <span
                className={`text-sm ${isActive ? "font-medium" : "text-slate-400"}`}
                style={isActive ? { color: ACCENT } : undefined}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* ======================================
          User Profile Section
          Displays authenticated user details
          Backend user data attaches here
          ====================================== */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: ACCENT }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0A0C14]" />
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-200 truncate">
              {user?.name || "No Name"}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {user?.email || "No Email"}
            </div>
          </div>

          <span
            className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full shrink-0 bg-white/[0.06]"
            style={{ color: ACCENT }}
          >
            Pro
          </span>
        </div>

        <button
          onClick={logout}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/15 active:scale-[0.98] transition-all duration-150"
        >
          <LogOutIcon className="size-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;