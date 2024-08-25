import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Nav } from '../features/Nav/Nav';

export const Route = createRootRoute({
  component: () => (
    <>
      <Nav />
      <hr />
      <div className="container mx-auto p-4">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  )
});
