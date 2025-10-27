import { createBrowserRouter } from "react-router-dom";

import AdminDashboard from "../pages/admin/AdminDashboard";
import BookingTable from "../pages/admin/BookingTable";
import EmployeeDetail from "../pages/admin/EmployeeDetail";
import EmployeeForm from "../pages/admin/EmployeeForm";
import EmployeePage from "../components/admin/EmployeePage"; 


const adminRouter = createBrowserRouter([
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