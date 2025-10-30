import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function GolferLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Navbar ส่วนบน */}
      <Navbar />

      {/* เนื้อหาหน้าเว็บจากเส้นทางย่อย */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ส่วนล่างของเว็บ */}
      <Footer />
    </div>
  );
}