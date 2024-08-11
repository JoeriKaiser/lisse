import { createLazyFileRoute } from '@tanstack/react-router';
import LoginContainer from '../features/Login/LoginContainer';

export const Route = createLazyFileRoute('/login' as never)({
  component: Login
});

function Login() {
  return (
    <>
      <LoginContainer />
    </>
  );
}
