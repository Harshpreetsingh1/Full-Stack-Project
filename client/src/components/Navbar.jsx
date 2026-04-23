import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX, HiLogout, HiHome, HiPlusCircle, HiShieldCheck, HiUserCircle } from 'react-icons/hi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 bg-surface-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hidden sm:block">
              SmartComplaint
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/dashboard" className={navLinkClass('/dashboard')} id="nav-dashboard">
              <HiHome className="text-lg" />
              Dashboard
            </Link>
            <Link to="/complaint/new" className={navLinkClass('/complaint/new')} id="nav-new-complaint">
              <HiPlusCircle className="text-lg" />
              New Complaint
            </Link>
            {isAdmin && (
              <Link to="/admin" className={navLinkClass('/admin')} id="nav-admin">
                <HiShieldCheck className="text-lg" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* User info + logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <HiUserCircle className="text-xl text-brand-400" />
              <span className="text-gray-300">{user?.name || user?.email || 'User'}</span>
              {isAdmin && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-brand-500/20 text-brand-300 rounded-full border border-brand-500/30">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
              id="nav-logout"
            >
              <HiLogout className="text-lg" />
              Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            id="nav-mobile-toggle"
          >
            {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slide-down border-t border-white/5">
            <Link
              to="/dashboard"
              className={navLinkClass('/dashboard')}
              onClick={() => setMobileOpen(false)}
            >
              <HiHome className="text-lg" />
              Dashboard
            </Link>
            <Link
              to="/complaint/new"
              className={navLinkClass('/complaint/new')}
              onClick={() => setMobileOpen(false)}
            >
              <HiPlusCircle className="text-lg" />
              New Complaint
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={navLinkClass('/admin')}
                onClick={() => setMobileOpen(false)}
              >
                <HiShieldCheck className="text-lg" />
                Admin Panel
              </Link>
            )}
            <hr className="border-white/5 my-2" />
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400">
              <HiUserCircle className="text-lg" />
              {user?.name || 'User'}
              {isAdmin && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-brand-500/20 text-brand-300 rounded-full border border-brand-500/30">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <HiLogout className="text-lg" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
