import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import UserMobileLayout from '../layouts/UserMobileLayout';
import MainLayout from '../layouts/MainLayout';

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

// Auth Pages
import RegisterPage from '../pages/auth/RegisterPage';
import LoginPage from '../pages/auth/LoginPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Landing Page */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Golfer Routes */}
        <Route path="/" element={<UserMobileLayout />}>
          <Route index element={<GolferHomePage />} />
          <Route path="booking" element={<GolferBookingPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Caddy Routes */}
        <Route path="/caddy">
          <Route index element={<BookingPage />} />
          <Route path="booking" element={<ProcessGolfPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="profile" element={<CaddyProfile />} />
        </Route>

        {/* Starter Routes */}
        <Route path="/starter" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="report/confirm" element={<ReportConfirmPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
