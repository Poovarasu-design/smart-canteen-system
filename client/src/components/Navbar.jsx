import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  ShoppingCart,
  Bell,
  User,
  LogOut,
  Shield,
  QrCode,
  Sparkles,
  ChevronDown,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, switchAccount } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Poll notifications every 10 seconds for real-time updates
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleMarkRead = async () => {
    try {
      await api.markNotificationsRead();
      setUnreadCount(0);
    } catch (e) {
      // ignore
    }
  };

  const openDemoModal = async () => {
    try {
      const data = await api.getDemoAccounts();
      if (data.success) {
        setDemoAccounts(data);
        setDemoModalOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickLogin = async (email, password) => {
    try {
      await switchAccount(email, password);
      setDemoModalOpen(false);
      setMobileMenuOpen(false);
      if (email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Login error: ' + err.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 block leading-tight">
                  SMART<span className="text-emerald-600">CANTEEN</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block -mt-0.5">
                  Pre-Ordering System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/menu"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/menu') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Food Menu
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/my-orders"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/my-orders')
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    My Orders
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <div className="h-5 w-px bg-slate-200 mx-1.5" />
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                      isActive('/admin')
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Admin Portal
                  </Link>
                  <Link
                    to="/admin/scanner"
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                      isActive('/admin/scanner')
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    Staff QR Scanner
                  </Link>
                </>
              )}
            </nav>

            {/* Actions & Utilities */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Demo Picker Button */}
              <button
                onClick={openDemoModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
                title="Switch between student and admin demo logins"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Demo Logins
              </button>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Notification Bell */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      if (!notificationsOpen) handleMarkRead();
                    }}
                    className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                    )}
                  </button>

                  {/* Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h4 className="font-semibold text-sm text-slate-800">Notifications</h4>
                        <span className="text-xs text-slate-400">{notifications.length} updates</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 mt-2">
                        {notifications.length === 0 ? (
                          <div className="py-6 text-center text-xs text-slate-400">No notifications yet</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className="py-2.5 text-left hover:bg-slate-50 rounded-lg px-2 transition-colors">
                              <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Profile / Login */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="hidden lg:block text-right">
                    <p className="text-xs font-bold text-slate-800 leading-none">{user.name}</p>
                    <span className="text-[10px] uppercase font-semibold text-emerald-600">
                      {user.role === 'admin' ? 'Staff / Admin' : user.collegeId}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Food Menu
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  My Orders
                </Link>
              </>
            )}
            {isAdmin && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Staff Controls</p>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-700 bg-emerald-50"
                >
                  Admin Order Management
                </Link>
                <Link
                  to="/admin/scanner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-700 bg-emerald-50"
                >
                  Staff QR Scanner
                </Link>
                <Link
                  to="/admin/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-700 bg-emerald-50"
                >
                  Menu Item Manager
                </Link>
                <Link
                  to="/admin/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-700 bg-emerald-50"
                >
                  Sales Analytics
                </Link>
              </div>
            )}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDemoModal();
                }}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                ✨ Demo Logins Switcher
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Demo Account Switcher Modal */}
      {demoModalOpen && demoAccounts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 relative">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Prototype Demo Logins</h3>
                <p className="text-xs text-slate-500">1-click login into demo accounts for grading & evaluation</p>
              </div>
            </div>

            {/* Admin Box */}
            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Canteen Staff & Admin
              </span>
              <button
                onClick={() => handleQuickLogin(demoAccounts.admin.email, demoAccounts.admin.password)}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{demoAccounts.admin.name}</p>
                    <p className="text-xs text-slate-600">{demoAccounts.admin.email} (pwd: {demoAccounts.admin.password})</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-600 text-white rounded-lg shadow-sm group-hover:bg-emerald-700">
                  Login Admin →
                </span>
              </button>
            </div>

            {/* Students List */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Demo Student Accounts (5 Profiles)
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {demoAccounts.students.map((st) => (
                  <button
                    key={st.email}
                    onClick={() => handleQuickLogin(st.email, st.password)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all text-left group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{st.name}</p>
                      <p className="text-xs text-slate-500">
                        {st.email} • ID: <span className="font-mono text-slate-700">{st.collegeId}</span>
                      </p>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 group-hover:underline">
                      Login →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
