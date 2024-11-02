import { createLazyFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import RegisterContainer from '../features/Register/RegisterContainer';

export const Route = createLazyFileRoute('/register' as never)({
  component: Register
});

function Register() {
  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}>
      <RegisterContainer />
    </motion.div>
  );
}
