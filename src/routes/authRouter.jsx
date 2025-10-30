import { createBrowserRouter, Navigate } from "react-router-dom";

import GolferHomePage from "../pages/golfer/GolferHomePage";
import StaffLoginPage from "../pages/auth/StaffLoginPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// ✅ เพิ่ม import ส่วนของ starter
import StarterLayout from "../layout/starterLayout";
import StarterDashboard from "../pages/starter/Dashboard";
import StarterReportPage from "../pages/starter/ReportPage";
import ReportConfirmPage from "../pages/starter/ReportConfirmPage";

const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <GolferHomePage />,
  },
  {
    path: "/staff/login",
    element: <StaffLoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },

  // ✅ เพิ่มส่วนนี้เข้ามา (เฉพาะของคุณ)
  {
    path: "/starter",
    element: <StarterLayout />,
    children: [
      { index: true, element: <StarterDashboard /> },       // /starter
      { path: "dashboard", element: <StarterDashboard /> }, // /starter/dashboard
      { path: "report", element: <StarterReportPage /> },   // /starter/report
      { path: "report/confirm", element: <ReportConfirmPage /> },
    ],
  },

  // fallback route (ถ้าเจอ path แปลก)
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default authRouter;
