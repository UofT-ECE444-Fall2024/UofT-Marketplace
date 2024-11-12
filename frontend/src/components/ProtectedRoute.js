import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStytchSession } from '@stytch/react';

export const ProtectedRoute = ({ children }) => {
  const { session, fromCache } = useStytchSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !fromCache) {
      navigate('/', { replace: true });
    }
  }, [session, fromCache, navigate]);

  // Show nothing while checking authentication
  if (!session) {
    return null;
  }

  return children;
};