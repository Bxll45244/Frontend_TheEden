import { createBrowserRouter } from "react-router-dom";

import GolferHomePage from "../../pages/golfer/GolferHomePage";
import GolferBookingPage from "../../pages/golfer/GolferBookingPage";
import StaffLoginPage from "../../pages/auth/StaffLoginPage";
import ProfilePage from "../../pages/golfer/ProfilePage";
import CheckoutSuccess from "../../pages/golfer/CheckoutSuccess";
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";
import UnauthorizedPage from "../../pages/golfer/UnauthorizedPage";

// router สำหรับ golfer (ผู้ใช้งานทั่วไป)
const golferRouter = createBrowserRouter([
  {
    path: "/",              // หน้าแรกของระบบ
    element: <GolferHomePage />,
  },
  {
    path: "/booking",       // หน้าเลือกเวลาจอง
    element: <GolferBookingPage />,
  },
  {
    path: "/profile",       // หน้าโปรไฟล์ golfer
    element: <ProfilePage />,
  },
  {
    path: "/checkout-success", // หน้าหลังจากจ่ายเงินเสร็จ
    element: <CheckoutSuccess />,
  },
  {
    path: "/login",         // หน้าเข้าสู่ระบบ
    element: <LoginPage />,
  },
  {
    path: "/staff/login",   // หน้าเข้าสู่ระบบพนักงาน/ผู้ดูแล
    element: <StaffLoginPage />,
  },
  {
    path: "/register",      // หน้าสมัครสมาชิก
    element: <RegisterPage />,
  },
  {
    path: "/notallowed",    // หน้าสำหรับคนที่ไม่มีสิทธิ์เข้าถึง
    element: <UnauthorizedPage />,
  },
]);

export default golferRouter;