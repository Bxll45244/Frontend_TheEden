// จุดเริ่มต้นของแอป
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom"; // ใช้ react-router-dom
import "./index.css";
import golferRouter from "./routes/golfer/golferRouter"; 
import Navbar from "./components/golfer/Navbar";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* แชร์สถานะผู้ใช้ทั่วทั้งแอป (cookie-based auth) */}
    <AuthProvider>
      {/* แสดง Navbar ทุกหน้า */}
      <Navbar />
      {/* ใช้เส้นทางทั้งหมดจากไฟล์ router */}
      <RouterProvider router={golferRouter} />
    </AuthProvider>
  </StrictMode>
);