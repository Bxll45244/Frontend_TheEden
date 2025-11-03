import { createBrowserRouter } from "react-router-dom";

// ===== ของเพื่อน (เดิม) =====
import GolferHomePage from "../pages/golfer/GolferHomePage";
import StaffLoginPage from "../pages/auth/StaffLoginPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// ===== Caddie (ของเรา) =====
import CaddieLayout from "../layout/caddieLayout";
import LandingPage from "../pages/Caddy/LandingPage";
import BookingPage from "../pages/Caddy/BookingPage";
import CaddyProfile from "../pages/Caddy/CaddyProfile";
import HistoryPage from "../pages/Caddy/HistoryPage";
import ProcessGolfPage from "../pages/Caddy/ProcessGolfPage";
import CaddieDashboard from "../pages/Caddy/Dashboard";
import DashboardStart from "../pages/Caddy/DashboardStart"; // ✅ เพิ่ม import

const authRouter = createBrowserRouter([
  // ===== ของเพื่อน (เดิม) =====
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

  // ===== ของเรา: Caddie routes (เพิ่มใหม่ ไม่ทับของเดิม) =====
  {
    element: <CaddieLayout />,
    children: [
      { path: "/landing", element: <LandingPage /> },
      { path: "/caddy", element: <BookingPage /> },
      { path: "/caddy/booking", element: <BookingPage /> },
      { path: "/caddy/profile", element: <CaddyProfile /> },
      { path: "/caddy/history", element: <HistoryPage /> },
      { path: "/caddy/process", element: <ProcessGolfPage /> },
      { path: "/caddy/dashboard", element: <CaddieDashboard /> },
      { path: "/caddy/dashboard/start", element: <DashboardStart /> }, // ✅ เพิ่มเส้นใหม่
    ],
  },
]);

export default authRouter;
