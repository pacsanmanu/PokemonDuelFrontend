import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const isValid = await validateToken();
      setIsAuthenticated(isValid);
      setLoading(false); // Termina la carga después de la validación
    };

    validate();
  }, []);

  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found");
      return false;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/validate-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.valid; // Usa data.valid en lugar de data.isValid
      }
      console.error('Token validation failed', response.statusText);
      return false;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
