// src/routes/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AdminDashboard from "../pages/AdminDashboard";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
