import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Nav } from '../features/Nav/Nav';

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-grow">
        <div className="container mx-auto p-4">
          <Outlet />
        </div>
      </main>
      <TanStackRouterDevtools />
    </div>
  )
});
