import { createBrowserRouter } from "react-router-dom";

import GolferHomePage from "../pages/golfer/GolferHomePage";
import StaffLoginPage from "../pages/auth/StaffLoginPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

const authRouter = createBrowserRouter([
    {
        path: "/",              // หน้าแรกของระบบ
        element: <GolferHomePage />,
    },
    {
        path: "/staff/login",   // หน้าเข้าสู่ระบบพนักงาน/ผู้ดูแล
        element: <StaffLoginPage />,
    },
    {
        path: "/login",         // หน้าเข้าสู่ระบบ
        element: <LoginPage />,
    },
    {
        path: "/register",      // หน้าสมัครสมาชิก
        element: <RegisterPage />,
    }
]);

export default authRouter;