import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingCart, LogOut, ShieldAlert, User,
  Clock, Menu, X, ChevronDown, LogIn, UserPlus, TrendingUp
} from 'lucide-react';

export default function Navbar() {
  const { cart, clearCart } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);


  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);


  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {

    await logout();
    clearCart();
    setIsMobileMenuOpen(false);


    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const cartCount = isAdmin ? 0 : cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">


            <Link to="/"
              onClick={() => {
                if (window.location.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-2xl  font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">
                PharmaCare
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex lg:space-x-8">
              {navLinks.map(({ name, path }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={name}
                    to={path}
                    onClick={() => {
                      if (location.pathname === path) {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }
                    }}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-colors duration-200 ${active
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }`}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Cart — desktop only */}
              {!isAdmin && (
                <Link
                  to="/cart"
                  className="relative hidden lg:flex p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Cart"
                >
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[11px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Logged-in: Avatar dropdown */}
              {user ? (
                <div className="relative hidden lg:block" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">
                      {user.username || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      {/* User info */}
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>

                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User size={16} /> My Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Clock size={16} /> Order History
                      </Link>

                      {isAdmin && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <ShieldAlert size={16} /> Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/revenue"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <TrendingUp size={16} /> Revenue Analytics
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-50 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <Link
                    to="/welcome"
                    state={{ mode: 'login' }}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50"
                  >
                    <LogIn size={16} /> Login
                  </Link>
                  <Link
                    to="/welcome"
                    state={{ mode: 'signup' }}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-full shadow-sm hover:shadow-md"
                  >
                    <UserPlus size={16} /> Sign Up
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="px-4 pt-3 pb-5 space-y-1">
              {navLinks.map(({ name, path }) => {
                const active = location.pathname === path;
                return (
                  <Link
                    key={name}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-semibold transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {name}
                  </Link>
                );
              })}

              <div className="border-t border-gray-100 my-2 pt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-2 mb-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.username || user.email?.split('@')[0]}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={18} /> My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Clock size={18} /> Order History
                    </Link>

                    {isAdmin && (
                      <>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <ShieldAlert size={18} /> Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/revenue"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <TrendingUp size={18} /> Revenue Analytics
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-3 px-1 mt-4">
                    <Link
                      to="/welcome"
                      state={{ mode: 'login' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-base font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <LogIn size={18} /> Login
                    </Link>
                    <Link
                      to="/welcome"
                      state={{ mode: 'signup' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                    >
                      <UserPlus size={18} /> Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {!isAdmin && (
        <Link
          to="/cart"
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
          aria-label="Open cart"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center text-xs font-bold text-white bg-rose-500 rounded-full ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </Link>
      )}
    </>
  );
}
