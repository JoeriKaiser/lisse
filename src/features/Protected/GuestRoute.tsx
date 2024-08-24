import { useAuth } from '../../context/AuthContext';

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (user) {
    return;
  }
  if (!user) {
    return <>{children}</>;
  }
};

export default GuestRoute;
