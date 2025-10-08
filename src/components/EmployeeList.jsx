import React, { useEffect, useState } from "react";
import EmployeeCard from "./EmployeeCard";
import { getAllNotUser } from "../service/userService2.js"; // ✅ ดึงจาก service

export default function EmployeeList({ onClickEmployee }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await getAllNotUser();
      if (res.success) {
        setEmployees(res.employees);
      } else {
        console.error("ไม่สามารถโหลดข้อมูลพนักงานได้");
      }
      setLoading(false);
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 p-6">กำลังโหลดข้อมูลพนักงาน...</div>;
  }

  if (employees.length === 0) {
    return <div className="text-center text-gray-600 p-6">ไม่พบข้อมูลพนักงาน</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
      {employees.map((emp) => (
        <EmployeeCard
          key={emp._id}
          employee={emp}
          onClick={() => onClickEmployee(emp)} // ✅ ส่งต่อข้อมูลเมื่อคลิก
        />
      ))}
    </div>
  );
}
