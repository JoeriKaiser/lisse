import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import ProtectedRoute from '../features/Protected/ProtectedRoute';
import '../index.css';
import GuestRoute from '../features/Protected/GuestRoute';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <ProtectedRoute>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
        </ProtectedRoute>
        <GuestRoute>
          <Link to="/login" className="[&.active]:font-bold">
            Login
          </Link>
        </GuestRoute>
        <Link to="/error" className="[&.active]:font-bold">
          error
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
});
