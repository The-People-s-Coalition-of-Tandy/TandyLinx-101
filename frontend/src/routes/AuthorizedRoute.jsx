import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AuthorizedRoute = ({ children }) => {
  const { user, loading, initialized, checkAuth } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const pageURL = location.pathname.split('/')[1];

  useEffect(() => {
    if (!initialized && !loading) {
      checkAuth();
    }
  }, [initialized, loading, checkAuth]);

  useEffect(() => {
    const checkPageOwnership = async () => {
      if (!user) return;
      
      try {
        const response = await axios.get(`http://localhost:3000/api/get-page/${pageURL}`, {
          withCredentials: true
        });
        
        setIsAuthorized(response.data.userId === user.id);
      } catch (error) {
        setIsAuthorized(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkPageOwnership();
  }, [user, pageURL]);

  if (!initialized || loading || checkingAuth) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default AuthorizedRoute; 