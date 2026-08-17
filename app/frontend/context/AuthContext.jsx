"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    // Check both localStorage and sessionStorage
    const localToken = localStorage.getItem('businessToken');
    const localUser = localStorage.getItem('businessUser');
    const sessionToken = sessionStorage.getItem('businessToken');
    const sessionUser = sessionStorage.getItem('businessUser');

    if (localToken && localUser) {
      setToken(localToken);
      setUser(JSON.parse(localUser));
    } else if (sessionToken && sessionUser) {
      setToken(sessionToken);
      setUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await fetch('https://devagroupon-1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        
        if (rememberMe) {
          localStorage.setItem('businessToken', data.token);
          localStorage.setItem('businessUser', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('businessToken', data.token);
          sessionStorage.setItem('businessUser', JSON.stringify(data.user));
        }
        
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('businessToken');
    localStorage.removeItem('businessUser');
    sessionStorage.removeItem('businessToken');
    sessionStorage.removeItem('businessUser');
  };

  // Check if token is valid
  const isTokenValid = () => {
    return !!(token && user);
  };



    const fetchblogs = async () => {
        try {
            const response = await axios.get("https://devagroupon-1.onrender.com/api/blog/getblog");
            if (response.data && Array.isArray(response.data)) {
                setBlogs(response.data);
            } else {
                setBlogs([]);
                setError("Invalid data format received from server");
            }
        } catch (error) {
            console.error("Error fetching blogs", error);
            setError("Failed to load blogs. Please try again later.");
            setBlogs([]);
        }
    };

    useEffect(() => {
        fetchblogs();
    }, []);

  const value = {
    user,
    token,
    blogs,
    setBlogs,
    login,
    logout,
    loading,
    isAuthenticated: !!(user && token),
    isTokenValid, // Add this function
    checkAuthStatus, // Add this to re-check auth status
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};