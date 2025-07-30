import React from "react";
import Header from "../components/Starter/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow p-4">
        <Outlet /> {/* ตรงนี้จะเปลี่ยนไปตามหน้า */}
      </main>
    </div>
  );
};

export default MainLayout;
