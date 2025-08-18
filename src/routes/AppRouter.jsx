import React from 'react';
import { Routes, Route } from 'react-router-dom';

import GolferHomePage from '../pages/golfer/GolferHomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';  
import ProfilePage from '../pages/golfer/ProfilePage'; 
import GolferBookingPage from '../pages/golfer/GolferBookingPage';

import UserMobileLayout from '../layouts/Layout';

export default function AppRouter() {
  return (
    <Routes>

      <Route element={<UserMobileLayout />}>
        <Route path="/" element={<GolferHomePage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/booking" element={<GolferBookingPage />} />
      </Route>

    <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}