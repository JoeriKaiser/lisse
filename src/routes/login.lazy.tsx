import { createLazyFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import LoginContainer from '../features/Login/LoginContainer';

export const Route = createLazyFileRoute('/login' as never)({
  component: Login
});

function Login() {
  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}>
      <LoginContainer />
    </motion.div>
  );
}
