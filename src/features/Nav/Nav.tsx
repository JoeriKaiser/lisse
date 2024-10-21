import { Link } from '@tanstack/react-router';
import ProtectedRoute from '../Protected/ProtectedRoute';
import GuestRoute from '../Protected/GuestRoute';
import { useLogout } from '../../api/mutations/login';
import { useEffect, useState } from 'react';

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="text-gray-300 hover:bg-gray-700 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
    {children}
  </Link>
);

export const Nav = () => {
  const logoutUser = useLogout();

  const handleLogout = () => {
    logoutUser.mutate();
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <ProtectedRoute>
                  <NavLink to="/">Home</NavLink>
                </ProtectedRoute>
                <GuestRoute>
                  <NavLink to="/login">Login</NavLink>
                </GuestRoute>
                <NavLink to="/error">Error</NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <ProtectedRoute>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-foreground font-bold py-2 px-4 rounded text-sm">
                  Logout
                </button>
              </ProtectedRoute>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
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
    <button onClick={() => setDarkMode(!darkMode)}>
      Toggle {darkMode ? 'Light' : 'Dark'} Mode
    </button>
  );
}
