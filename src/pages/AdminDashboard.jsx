import React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EmployeeList from "../components/EmployeeList";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeDetail from "../components/EmployeeDetail";
import BookingTable from "../components/BookingTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import employeesData from "../data/employees";

export default function AdminDashboard() {
  // state สำหรับ Tab ปัจจุบัน
  const [tab, setTab] = useState("All");

  // state สำหรับหน้า active ปัจจุบัน (employeeData, addEmployee, booking)
  const [activePage, setActivePage] = useState("employeeData");

  // state สำหรับเก็บพนักงานที่ถูกเลือกเพื่อแสดงรายละเอียด
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // state สำหรับข้อความค้นหา
  const [searchTerm, setSearchTerm] = useState("");

  // state สำหรับเก็บข้อมูลพนักงานทั้งหมด
  const [employees, setEmployees] = useState(employeesData);

  // filter พนักงานตาม Tab และข้อความค้นหา
  const filtered = employees
    .filter((e) => tab === "All" || e.position === tab)
    .filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    // container หลักเป็น flex row, min-h-screen ให้เต็มหน้าจอ
    <div className="flex min-h-screen">
      {/* Sidebar แสดงเมนูด้านซ้าย */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* container เนื้อหาหลัก */}
      <div className="flex-1 flex flex-col p-6 bg-gray-100">
        {/* Header แสดงชื่อหน้าปัจจุบัน */}
        <Header activePage={activePage} />

        {/* ส่วนเนื้อหา scrollable */}
        <div className="flex-1 overflow-auto mt-4">
          {/* ถ้า activePage เป็น employeeData */}
          {activePage === "employeeData" && (
            <>
              {selectedEmployee ? (
                // แสดงรายละเอียดพนักงานที่เลือก
                <EmployeeDetail
                  employee={selectedEmployee}
                  onBack={() => setSelectedEmployee(null)}
                />
              ) : (
                <>
                  {/* Search + Tabs */}
                  <div className="flex flex-col gap-4 mb-4">
                    {/* ช่องค้นหา: อยู่ด้านขวา */}
                    <div className="flex justify-end">
                      <input
                        type="text"
                        placeholder="ค้นหาชื่อพนักงาน..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border rounded-lg p-2 w-full md:w-80"
                      />
                    </div>

                    {/* Tabs: อยู่ตรงกลาง */}
                    <div className="flex justify-center">
                      <Tabs value={tab} onValueChange={setTab}>
                        <TabsList className="flex gap-2 bg-gray-200 p-2 rounded shadow-inner">
                          {["All", "General", "Admin", "Caddie", "Starter"].map(
                            (pos) => {
                              const count =
                                pos === "All"
                                  ? employees.length
                                  : employees.filter((e) => e.position === pos)
                                      .length;

                              return (
                                <TabsTrigger
                                  key={pos}
                                  value={pos}
                                  className={`px-4 py-2 rounded ${
                                    tab === pos
                                      ? "bg-gray-500 text-white"
                                      : "text-black"
                                  }`}
                                >
                                  {pos} ({count})
                                </TabsTrigger>
                              );
                            }
                          )}
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>

                  {/* แสดง Employee List */}
                  <EmployeeList
                    employees={filtered}
                    onClickEmployee={setSelectedEmployee}
                  />
                </>
              )}
            </>
          )}

          {/* ถ้า activePage เป็น addEmployee */}
          {activePage === "addEmployee" && (
            <EmployeeForm
              onCancel={() => setActivePage("employeeData")}
              onAddEmployee={(newEmployee) => {
                setEmployees((prev) => [...prev, newEmployee]);
                setActivePage("employeeData");
              }}
            />
          )}

          {/* ถ้า activePage เป็น booking */}
          {activePage === "booking" && <BookingTable />}
        </div>
      </div>
    </div>
  );
}
