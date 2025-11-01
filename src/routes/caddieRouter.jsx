import React from "react";
import CaddieLayout from "../layout/caddieLayout";

// หน้าฝั่ง Caddie ที่คุณมีอยู่แล้ว
import LandingPage from "../pages/Caddy/LandingPage";
import BookingPage from "../pages/Caddy/BookingPage";
import CaddyProfile from "../pages/Caddy/CaddyProfile";
import HistoryPage from "../pages/Caddy/HistoryPage";
import ProcessGolfPage from "../pages/Caddy/ProcessGolfPage";
import CaddieDashboard from "../pages/Caddy/Dashboard"; // ✅ เพิ่มใหม่

// ✅ ส่งเป็น "route objects" ที่พร้อมเอาไป merge กับของเพื่อน
export const caddieRoutes = [
  {
    element: <CaddieLayout />,
    children: [
      // หน้า landing แยกไว้ (ปุ่มออกจากระบบในบางหน้าจะวิ่งมาที่นี่)
      { path: "/landing", element: <LandingPage /> },

      // หน้า Status หลัก — ให้ชี้ไป BookingPage ตอนนี้ เพื่อแก้ 404 ทันที
      { path: "/caddy", element: <BookingPage /> },

      // หน้าแจ้งปัญหา/เลือกเวลา (ยังคงใช้คอมโพเนนต์เดียวกัน)
      { path: "/caddy/booking", element: <BookingPage /> },

      // โปรไฟล์แคดดี้
      { path: "/caddy/profile", element: <CaddyProfile /> },

      // ประวัติการทำงาน
      { path: "/caddy/history", element: <HistoryPage /> },

      // หน้าดำเนินการ 3 ขั้น (เริ่ม-จบ-เปลี่ยนแบต)
      { path: "/caddy/process", element: <ProcessGolfPage /> },

      // ✅ เพิ่ม Dashboard ของ Caddie
      { path: "/caddy/dashboard", element: <CaddieDashboard /> },
    ],
  },
];

// (ไม่ export default เพื่อเลี่ยงชนกับของเพื่อนและให้คุณ import แบบเฉพาะเจาะจง)
