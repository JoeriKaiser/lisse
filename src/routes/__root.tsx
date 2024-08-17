import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import ProtectedRoute from '../features/Protected/ProtectedRoute';
import '../index.css';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <ProtectedRoute>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
        </ProtectedRoute>
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>
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
