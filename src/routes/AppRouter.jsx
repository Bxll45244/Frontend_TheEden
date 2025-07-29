import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import UserMobileLayout from '../layouts/UserMobileLayout';

// Page Components
import GolferHomePage from '../pages/golfer/GolferHomePage';
import RegisterPage from '../pages/auth/RegisterPage';
import LoginPage from '../pages/auth/LoginPage';
import GolferBookingPage from '../pages/golfer/GolferBookingPage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Golfer Routes: เส้นทางสำหรับผู้ใช้งาน Golfer */}
        <Route path="/" element={<UserMobileLayout />}> {/* <--- Parent path ยังคงเป็น "/" */}
          <Route index element={<GolferHomePage />} /> {/* จะแสดงที่ "/" */}
          <Route path="booking" element={<GolferBookingPage />} /> {/* <--- จะแสดงที่ "/booking" */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;