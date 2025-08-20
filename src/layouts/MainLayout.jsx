import React from "react";
import Header from "../components/Starter/Header.jsx";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  // ดึงวันที่ปัจจุบันไปส่งให้ Header (ถ้าจำเป็น)
  const currentDate = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ไม่ต้องส่ง currentDate ให้ Header แล้ว เพราะ Header ไม่ได้ใช้ prop นี้ */}
      <Header /> 
      <main className="flex-grow p-4">
        <Outlet />
      </main>
    </div>
  )
};

export default MainLayout;

