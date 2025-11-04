import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

//  public/auth pages 
import GolferHomePage from "../pages/golfer/GolferHomePage";
import StaffLoginPage from "../pages/auth/StaffLoginPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

//  starter
import StarterLayout from "../layout/starterLayout";
import StarterDashboard from "../pages/starter/Dashboard";
import StarterReportPage from "../pages/starter/ReportPage";
import ReportConfirmPage from "../pages/starter/ReportConfirmPage";

function RequireStarter({ children }) {
  const { user, loading } = useAuthContext();
  if (loading) return <div className="p-8 text-center">กำลังตรวจสอบสิทธิ์...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "starter") return <Navigate to="/" replace />;
  return children;
}

const routes = [
  // auth 
  { path: "/", element: <GolferHomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/staff/login", element: <StaffLoginPage /> },

  // starter 
  {
    path: "/starter",
    element: (
      <RequireStarter>
        <StarterLayout />
      </RequireStarter>
    ),
    children: [
      { index: true, element: <StarterDashboard /> },      // /starter
      { path: "dashboard", element: <StarterDashboard /> },// /starter/dashboard
      { path: "report", element: <StarterReportPage /> },  // /starter/report
      { path: "report/confirm", element: <ReportConfirmPage /> },
    ],
  },

  //  fallback 
  { path: "*", element: <Navigate to="/" replace /> },
];

const appRouter = createBrowserRouter(routes);
export default appRouter;