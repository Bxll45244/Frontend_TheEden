import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

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

export const starterRoutes = [
  {
    path: "/starter",
    element: (
      <RequireStarter>
        <StarterLayout />
      </RequireStarter>
    ),
    children: [
      { index: true, element: <StarterDashboard /> },
      { path: "dashboard", element: <StarterDashboard /> },
      { path: "report", element: <StarterReportPage /> },
      { path: "report/confirm", element: <ReportConfirmPage /> },
    ],
  },
];

export default function createStarterRouter() {
  return createBrowserRouter(starterRoutes);
}
