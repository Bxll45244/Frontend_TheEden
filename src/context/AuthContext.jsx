import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile, logout as apiLogout } from '../service/authService';

// Create a centralized repository for logins
export const AuthContext = createContext(null);


// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state for user data


  // Load user data when component mounts for the first time
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const result = await getUserProfile();

      if (result.success) {
        setUser(result.user);
      } else {
        // Do not show if you are not logged in
        if (result.message?.includes("ยังไม่ได้เข้าสู่ระบบ")) {
        // don't have to log anything
        } else {
          console.warn("Error loading user profile:", result.message); // Log only abnormal errors
        }
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Function to handle login (update state)
  const login = async (userData) => {
    const result = await getUserProfile();
    if (result.success) {
      setUser(result.user);
    } else {
      setUser(userData); // fallback กรณี backend ไม่ส่ง user ตอน login
    }
  };

  // Function to handle logout (update state and call API logout)
  const logout = async () => {
    try {
      const result = await apiLogout();
      if (result.success) {
        setUser(null); // Clear user data in state
        console.log("User logged out successfully.");
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value = {
    user,
    loading,
    login, // Function to update user status in Context after successful login
    logout, // Function to handle logout
    isAuthenticated: !!user, // true if user object exists
  };

  

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};