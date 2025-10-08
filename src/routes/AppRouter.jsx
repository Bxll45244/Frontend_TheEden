import React from "react";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from '../layouts/Layout';

// Golfer Pages
import GolferHomePage from '../pages/golfer/GolferHomePage';
import GolferBookingPage from '../pages/golfer/GolferBookingPage';
import ProfilePage from '../pages/golfer/ProfilePage'; 

// Caddy Pages
import BookingPage from "../pages/Caddy/BookingPage";
import ProcessGolfPage from "../pages/Caddy/ProcessGolfPage";
import LandingPage from "../pages/Caddy/LandingPage";
import HistoryPage from "../pages/Caddy/HistoryPage";
import CaddyProfile from "../pages/Caddy/CaddyProfile";

// Starter Pages
import Dashboard from "../pages/Starter/Dashboard";
import ReportPage from "../pages/Starter/ReportPage";
import ReportConfirmPage from "../pages/Starter/ReportConfirmPage";

// Admin Page
import AdminDashboard from "../pages/AdminDashboard";

// Auth Pages
import RegisterPage from '../pages/auth/RegisterPage';
import LoginPage from '../pages/auth/LoginPage';

export default function AppRouter() {
  return (
    <Routes>

      {/* Auth Routes */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Landing Page */}
      <Route path="/landing" element={<LandingPage />} />

      {/* Golfer/User Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<GolferHomePage />} />
        <Route path="booking" element={<GolferBookingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        {/* Admin nested under User */}
        <Route path="admin" element={<AdminDashboard />} />
      </Route>

      {/* Caddy Routes */}
      <Route path="/caddy">
        <Route index element={<BookingPage />} />
        {/* <Route path="booking" element={<ProcessGolfPage />} /> */}
        <Route path="process" element={<ProcessGolfPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="profile" element={<CaddyProfile />} />
      </Route>

      {/* Starter Routes */}
      <Route path="/starter">
        <Route index element={<Dashboard />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="report/confirm" element={<ReportConfirmPage />} />
      </Route>

    </Routes>
  );
}
