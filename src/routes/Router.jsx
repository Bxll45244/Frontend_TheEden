import { createBrowserRouter } from "react-router-dom";

import AdminDashboard from "../pages/admin/AdminDashboard";
import BookingTable from "../pages/admin/BookingTable";
import EmployeeDetail from "../pages/admin/EmployeeDetail";
import EmployeeForm from "../pages/admin/EmployeeForm";
import EmployeePage from "../components/admin/EmployeePage";
import GolferHomePage from "../pages/golfer/GolferHomePage";
import StaffLoginPage from "../pages/auth/StaffLoginPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage"; 


const adminRouter = createBrowserRouter([
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
    },
    {
        // Parent Route: นี่คือฐานของทุกเส้นทางย่อย
        path: "admin",
        element: <AdminDashboard />,

        children: [
            {
                // 1. หน้าหลักพนักงาน: Path คือ /admin (index: true แทน index: "")
                index: true, 
                element: <EmployeePage />
            },
            {
                // Path คือ /admin/booking
                path: "booking",
                element: <BookingTable />,
            },
            {
                // Path คือ /admin/add
                path: "add",
                element: <EmployeeForm />,
            },
            {
                // Path คือ /admin/detail/:employeeId
                path: "detail/:id",
                element: <EmployeeDetail />,
            }
        ]
    }
]);

export default adminRouter;