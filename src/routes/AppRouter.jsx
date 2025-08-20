import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import UserMobileLayout from '../layouts/UserMobileLayout';
import MainLayout from '../layouts/MainLayout';

// Golfer Pages
import GolferHomePage from '../pages/golfer/GolferHomePage';
import GolferBookingPage from '../pages/golfer/GolferBookingPage';

// Caddy Pages
import BookingPage from "../pages/Caddy/BookingPage";
import ProcessGolfPage from "../pages/Caddy/ProcessGolfPage";

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

        {/* Golfer Routes (ภายใน UserMobileLayout) */}
        <Route path="/" element={<UserMobileLayout />}>
          <Route index element={<GolferHomePage />} /> 
          <Route path="booking" element={<GolferBookingPage />} /> 
        </Route>

        {/* Caddy Routes */}
        <Route path="/caddy" element={<BookingPage />} /> 
        <Route path="/caddy/booking" element={<ProcessGolfPage />} /> 

        {/* Starter Routes (ภายใน MainLayout) */}
        <Route path="/starter" element={<MainLayout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="dashboard" element={<Dashboard />} /> 
        </Route>

        {/* ---------------------------------------------------- */}
        {/* Report Routes (ถูกย้ายออกมาเป็น top-level routes) */}
        {/* ---------------------------------------------------- */}
        <Route path="/report" element={<ReportPage />} /> 
        <Route path="/report/confirm" element={<ReportConfirmPage />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;