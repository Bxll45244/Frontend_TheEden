import { Routes, Route } from "react-router-dom";

import BookingPage from "../pages/Caddy/BookingPage";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Starter/Dashboard";
import ReportPage from "../pages/Starter/ReportPage";
import ReportConfirmPage from "../pages/Starter/ReportConfirmPage";
import StatusPage from "../pages/Starter/StatusPage";
import ProcessGolfPage from "../pages/Caddy/ProcessGolfPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="status" element={<StatusPage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="report/confirm" element={<ReportConfirmPage />} />
        <Route path="starter" element={<StatusPage />} />
        <Route path="starter/report" element={<ReportPage />} />
      </Route>

      <Route path="/caddy" element={<BookingPage />} />
      <Route path="/caddy/booking" element={<ProcessGolfPage />} />
    </Routes>
  );
}
