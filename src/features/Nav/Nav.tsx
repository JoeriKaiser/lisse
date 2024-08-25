import { Link } from '@tanstack/react-router';
import ProtectedRoute from '../Protected/ProtectedRoute';
import GuestRoute from '../Protected/GuestRoute';
import { useLogout } from '../../api/mutations/login';

export const Nav = () => {
  const logoutUser = useLogout();
  const handleLogout = () => {
    logoutUser.mutate();
  };

  return (
    <nav className="bg-gray-800 p-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-4">
          <ProtectedRoute>
            <Link to="/" className="text-white hover:text-gray-300 [&.active]:font-bold">
              Home
            </Link>
          </ProtectedRoute>
          <GuestRoute>
            <Link to="/login" className="text-white hover:text-gray-300 [&.active]:font-bold">
              Login
            </Link>
          </GuestRoute>
          <Link to="/error" className="text-white hover:text-gray-300 [&.active]:font-bold">
            Error
          </Link>
        </div>
        <ProtectedRoute>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </ProtectedRoute>
      </div>
    </nav>
  );
};
