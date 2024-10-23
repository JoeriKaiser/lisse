import { Link, useNavigate } from '@tanstack/react-router';
import ProtectedRoute from '../Protected/ProtectedRoute';
import GuestRoute from '../Protected/GuestRoute';
import { useLogout } from '../../api/mutations/login';
import { useEffect, useState } from 'react';
import { Menu, ScanBarcode, X } from 'lucide-react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="text-gray-300 hover:bg-gray-700 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
    {children}
  </Link>
);

export const Nav = () => {
  const navigate = useNavigate();
  const logoutUser = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser.mutate();
    navigate({ to: '/login' });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-10 bg-gray-800 bg-opacity-90 mx-4 mt-4 rounded-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <ScanBarcode color="white" size={24} />
              <span className="text-background font-semibold ml-2">Lisse</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <ProtectedRoute>
                  <NavLink to="/">Home</NavLink>
                </ProtectedRoute>
                <ProtectedRoute>
                  <NavLink to="/archive">Archive</NavLink>
                </ProtectedRoute>
                <ProtectedRoute>
                  <NavLink to="/settings">Settings</NavLink>
                </ProtectedRoute>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <ProtectedRoute>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-background font-bold py-2 px-4 rounded text-sm">
                  Logout
                </button>
              </ProtectedRoute>
              <ThemeToggle />
            </div>
          </div>
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
            className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <ProtectedRoute>
                <NavLink to="/">Home</NavLink>
              </ProtectedRoute>
              <GuestRoute>
                <NavLink to="/login">Login</NavLink>
              </GuestRoute>
              <ProtectedRoute>
                <NavLink to="/archive">Archive</NavLink>
              </ProtectedRoute>
              <ProtectedRoute>
                <NavLink to="/settings">Settings</NavLink>
              </ProtectedRoute>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center justify-between px-5">
                <ProtectedRoute>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="bg-red-500 hover:bg-red-600 text-foreground font-bold py-2 px-4 rounded text-sm">
                    Logout
                  </button>
                </ProtectedRoute>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 ml-4 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-200">
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}>
        {darkMode ? (
          <Moon className="w-5 h-5 text-yellow-400" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-500" />
        )}
      </motion.div>
    </button>
  );
}
