import React from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

// Auth 
import GolferHomePage from "../pages/golfer/GolferHomePage";
import StaffLoginPage from "../pages/auth/StaffLoginPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";


// Caddie
import CaddieLayout from "../layout/caddieLayout";
import LandingPage from "../pages/Caddy/LandingPage";
import BookingPage from "../pages/Caddy/BookingPage";
import CaddyProfile from "../pages/Caddy/CaddyProfile";
import HistoryPage from "../pages/Caddy/HistoryPage";
import ProcessGolfPage from "../pages/Caddy/ProcessGolfPage";
import CaddieDashboard from "../pages/Caddy/Dashboard";
import DashboardStart from "../pages/Caddy/DashboardStart";


function RequireCaddy({ children }) {
  const { user } = useAuthContext();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, reason: "auth" }}
      />
    );
  }
  if (user.role !== "caddy") {
    return <Navigate to="/unauthorized" replace state={{ reason: "role" }} />;
  }
  return children;
}

const caddieRouter = createBrowserRouter([
  //Auth 
  { path: "/", element: <GolferHomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/staff/login", element: <StaffLoginPage /> },


  // Caddie 
  {
    element: (
      <RequireCaddy>
        <CaddieLayout />
      </RequireCaddy>
    ),
    children: [
      { path: "/landing", element: <LandingPage /> },
      { path: "/caddy", element: <BookingPage /> },
      { path: "/caddy/booking", element: <BookingPage /> },
      { path: "/caddy/profile", element: <CaddyProfile /> },
      { path: "/caddy/history", element: <HistoryPage /> },
      { path: "/caddy/process", element: <ProcessGolfPage /> },
      { path: "/caddy/dashboard", element: <CaddieDashboard /> },
      { path: "/caddy/dashboard/start", element: <DashboardStart /> },
    ],
  },

  
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default caddieRouter;