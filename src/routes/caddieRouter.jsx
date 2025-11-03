import React from "react";
import CaddieLayout from "../layout/caddieLayout";

// หน้าฝั่ง Caddie
import LandingPage from "../pages/Caddy/LandingPage";
import BookingPage from "../pages/Caddy/BookingPage";
import CaddyProfile from "../pages/Caddy/CaddyProfile";
import HistoryPage from "../pages/Caddy/HistoryPage";
import ProcessGolfPage from "../pages/Caddy/ProcessGolfPage";
import CaddieDashboard from "../pages/Caddy/Dashboard";
import DashboardStart from "../pages/Caddy/DashboardStart"; // ✅

export const caddieRoutes = [
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
      { path: "/caddy/dashboard/start", element: <DashboardStart /> }, // ✅ route ใหม่
    ],
  },
];
