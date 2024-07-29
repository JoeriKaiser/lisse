import { createLazyFileRoute } from '@tanstack/react-router';
import RegisterContainer from '../features/Register/RegisterContainer';

export const Route = createLazyFileRoute('/register' as never)({
  component: Regsiter
});

function Regsiter() {
  return (
    <>
      <RegisterContainer />
    </>
  );
}
