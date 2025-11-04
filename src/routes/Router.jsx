// src/routes/appRouter.jsx
import React from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

// Golfer pages
import GolferHomePage from "../pages/golfer/GolferHomePage";
import GolferBookingPage from "../pages/golfer/GolferBookingPage";
import ProfilePage from "../pages/golfer/ProfilePage";
import CheckoutSuccess from "../pages/golfer/CheckoutSuccess";
import UnauthorizedPage from "../pages/golfer/UnauthorizedPage";

// Auth pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import StaffLoginPage from "../pages/auth/StaffLoginPage";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import BookingTable from "../pages/admin/BookingTable";
import EmployeeDetail from "../pages/admin/EmployeeDetail";
import EmployeeForm from "../pages/admin/EmployeeForm";
import EmployeePage from "../components/admin/EmployeePage";

// Starter pages (protected)
import StarterLayout from "../layout/starterLayout";
import StarterDashboard from "../pages/starter/Dashboard";
import StarterReportPage from "../pages/starter/ReportPage";
import ReportConfirmPage from "../pages/starter/ReportConfirmPage";

// ---- Role guard (reusable) ----
function RequireRole({ allowed = [], children }) {
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

  if (!allowed.includes(user.role)) {
    return <Navigate to="/unauthorized" replace state={{ reason: "role" }} />;
  }

  return children;
}

// ---- Unified Router ----
const Router = createBrowserRouter([
  // Public / Golfer
  { path: "/", element: <GolferHomePage /> },
  { path: "/booking", element: <GolferBookingPage /> },
  { path: "/booking/success", element: <CheckoutSuccess /> },
  { path: "/profile", element: <ProfilePage /> },

  // Auth
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/staff/login", element: <StaffLoginPage /> },

  // Unauthorized
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  // Starter (protected)
  {
    path: "/starter",
    element: (
      <RequireRole allowed={["starter"]}>
        <StarterLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <StarterDashboard /> },       // /starter
      { path: "dashboard", element: <StarterDashboard /> }, // /starter/dashboard
      { path: "report", element: <StarterReportPage /> },   // /starter/report
      { path: "report/confirm", element: <ReportConfirmPage /> },
    ],
  },

  // Caddy root hit by golfers -> unauthorized (ปรับตามที่ต้องการทีหลังได้)
  {
    path: "/caddy",
    element: <Navigate to="/unauthorized" replace state={{ reason: "role" }} />,
  },

  // Admin (protected)
  {
    path: "/admin",
    element: (
      <RequireRole allowed={["admin", "starter", "caddy"]}>
        <AdminDashboard />
      </RequireRole>
    ),
    children: [
      { index: true, element: <EmployeePage /> },
      { path: "booking", element: <BookingTable /> },
      { path: "add", element: <EmployeeForm /> },
      { path: "detail/:id", element: <EmployeeDetail /> },
    ],
  },

  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default Router;
