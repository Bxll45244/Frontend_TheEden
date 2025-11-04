import React from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

// Golfer pages
import GolferHomePage from "../pages/golfer/GolferHomePage";
import GolferBookingPage from "../pages/golfer/GolferBookingPage";
import ProfilePage from "../pages/golfer/ProfilePage";
import CheckoutSuccess from "../pages/golfer/CheckoutSuccess";
import UnauthorizedPage from "../pages/golfer/UnauthorizedPage";

//  Auth pages (both sides use)
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import StaffLoginPage from "../pages/auth/StaffLoginPage";

// Admin pages 
import AdminDashboard from "../pages/admin/AdminDashboard";
import BookingTable from "../pages/admin/BookingTable";
import EmployeeDetail from "../pages/admin/EmployeeDetail";
import EmployeeForm from "../pages/admin/EmployeeForm";
import EmployeePage from "../components/admin/EmployeePage";


// Small guard component for role
function RequireRole({ allowed = [], children }) {
  const { user } = useAuthContext();
  const location = useLocation();

  // not logged in → go login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, reason: "auth" }}
      />
    );
  }

  // logged in but wrong role → unauthorized
  if (!allowed.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ reason: "role" }}
      />
    );
  }

  return children;
}

// Unified Router
const Router = createBrowserRouter([
  // Public / Golfer routes
  { path: "/", element: <GolferHomePage /> },
  { path: "/booking", element: <GolferBookingPage /> },
  { path: "/booking/success", element: <CheckoutSuccess /> },
  { path: "/profile", element: <ProfilePage /> },

  // Auth routes 
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/staff/login", element: <StaffLoginPage /> },

  // Unauthorized page 
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  //  Hard redirects for staff-only root paths accidentally hit by golfers 
  {
    path: "/starter",
    element: (
      <Navigate to="/unauthorized" replace state={{ reason: "role" }} />
    ),
  },
  {
    path: "/caddy",
    element: (
      <Navigate to="/unauthorized" replace state={{ reason: "role" }} />
    ),
  },

  // Admin (protected by role) 
  {
    path: "/admin",
    element: (
      <RequireRole allowed={["admin", "starter", "caddy"]}>
        <AdminDashboard />
      </RequireRole>
    ),
    children: [
      // GET /admin  -> EmployeePage (index)
      { index: true, element: <EmployeePage /> },

      // GET /admin/booking
      { path: "booking", element: <BookingTable /> },

      // GET /admin/add
      { path: "add", element: <EmployeeForm /> },

      // GET /admin/detail/:id
      { path: "detail/:id", element: <EmployeeDetail /> },
    ],
  },

  // Fallback: unknown paths -> home 
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default Router;
