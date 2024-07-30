import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/error' as never)({
  component: error
});

function error() {
  return (
    <>
      <h1>Error</h1>
    </>
  );
}
