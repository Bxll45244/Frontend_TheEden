import React, { useState, useMemo } from "react";
// ⭐️ ต้อง import useOutletContext
import { useOutletContext, useNavigate } from "react-router-dom"; 
// ⭐️ Import EmployeeList เดิม
import EmployeePage from "./EmployeePage"; 

export default function EmployeeList() {
    // ⭐️ ดึงข้อมูลหลักและ handlers จาก AdminDashboard (Outlet Context)
    const { employees, loading } = useOutletContext();
    const navigate = useNavigate();

    // 💡 State สำหรับการค้นหาและกรอง (ย้ายมาจาก AdminDashboard)
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");

    // 💡 Logic ในการกรองข้อมูล (ใช้ useMemo เพื่อประสิทธิภาพ)
    const filteredEmployees = useMemo(() => {
        if (!employees) return [];
        return employees.filter(emp => {
            const matchesRole = selectedRole === "All" || emp.role === selectedRole;
            const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesRole && matchesSearch;
        });
    }, [employees, searchTerm, selectedRole]);

    // 💡 Handler สำหรับนำทางไปหน้ารายละเอียด
    const handleEmployeeClick = (employee) => {
        navigate(`/admin/detail/${employee._id}`); 
    };

    if (loading) {
        return <div className="text-center p-8 text-xl">กำลังโหลดข้อมูลพนักงาน...</div>;
    }

    // 💡 จัดการ UI สำหรับการค้นหา/กรองข้อมูล
    return (
        <div className="p-4 bg-white rounded-xl shadow-lg">
            {/* ⭐️ ส่วนค้นหา/กรอง (คุณอาจต้องสร้าง Component แยกสำหรับสิ่งนี้) ⭐️ */}
            <div className="mb-6 flex justify-between items-center">
                <input 
                    type="text"
                    placeholder="ค้นหาชื่อพนักงาน..."
                    className="p-2 border rounded-lg w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="p-2 border rounded-lg"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                >
                    <option value="All">ทุกตำแหน่ง</option>
                    {/* ดึง Role ที่มีอยู่จริงมาแสดง */}
                    {Array.from(new Set(employees.map(e => e.role))).map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>
            
            {/* ⭐️ ส่งข้อมูลที่ถูกกรองและ Handler เข้าไปเป็น prop ⭐️ */}
            <EmployeePage 
                employees={filteredEmployees} 
                onClickEmployee={handleEmployeeClick} 
            />
        </div>
    );
}
