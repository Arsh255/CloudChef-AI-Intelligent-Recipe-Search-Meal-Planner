import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/authContext.jsx";
import { Menu, X, ChefHat, LayoutDashboard, Settings, Search, Calendar, ShoppingCart, Bookmark, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = () => {
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/preferences", label: "Preferences", icon: Settings },
    { to: "/search", label: "Search", icon: Search },
    { to: "/mealplan", label: "Meal Plan", icon: Calendar },
    { to: "/grocery", label: "Grocery", icon: ShoppingCart },
    { to: "/saved", label: "Saved", icon: Bookmark },
  ];

  return (
    <nav className="w-full bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-slate-700/50 sticky top-0 z-50">
      {/* Glow effect at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 group">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-2 sm:p-2.5 rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200 shadow-lg shadow-cyan-500/30">
              <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
              CloudChef
            </span>
          </Link>

          {/* Middle: Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    active
                      ? "text-cyan-400"
                      : "text-slate-400 hover:text-cyan-400"
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-lg border border-cyan-500/20"></div>
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Profile Button */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-200 border border-transparent hover:border-slate-700">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-400" />
            ) : (
              <Menu className="w-6 h-6 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-700/50 bg-slate-900/98 backdrop-blur-xl shadow-2xl">
          {/* Mobile menu glow effect */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          
          <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Profile Section */}
            <div className="flex items-center gap-3 px-4 py-4 mb-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Welcome back!</p>
                <p className="text-sm text-slate-400">CloudChef User</p>
              </div>
            </div>

            {/* Navigation Links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    active
                      ? "text-cyan-400"
                      : "text-slate-400 hover:text-cyan-400"
                  }`}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-xl border border-cyan-500/20"></div>
                  )}
                  
                  {/* Active indicator bar */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-cyan-500 rounded-r-full"></div>
                  )}
                  
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}

            {/* Divider */}
            <div className="my-3 border-t border-slate-700/50"></div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}