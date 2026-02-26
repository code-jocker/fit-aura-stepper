import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Simulate checking auth status
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const userType = localStorage.getItem('userType');

      if (token && user) {
        setIsAuthenticated(true);

        // Check role if required
        if (requiredRole) {
          if (userType === requiredRole || (user && user.role === requiredRole)) {
            setHasRequiredRole(true);
          } else {
            setHasRequiredRole(false);
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('ProtectedRoute auth check error:', err);
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [requiredRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    const loginPath = requiredRole === 'admin' ? '/login?admin=true' : requiredRole === 'delivery' ? '/login?delivery=true' : '/login';
    return <Navigate to={loginPath} replace />;
  }

  // Authenticated but doesn't have required role
  if (requiredRole && !hasRequiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <span className="text-6xl mb-4 block">🔒</span>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Only {requiredRole}s can access this area.
          </p>
          <a
            href="/"
            className="inline-block bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition font-bold"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  // All checks passed
  return children;
}
