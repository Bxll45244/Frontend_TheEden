// src/routes/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import GolferHomePage from '../pages/golfer/GolferHomePage';
import UserMobileLayout from '../layouts/Layout';
import LoginPage from '../pages/auth/LoginPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<UserMobileLayout />}>
        <Route path="/" element={<GolferHomePage />} /> 
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
