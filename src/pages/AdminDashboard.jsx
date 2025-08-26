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
  const [tab, setTab] = useState("All");
  const [activePage, setActivePage] = useState("employeeData");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState(employeesData);

  const filtered = employees
    .filter((e) => tab === "All" || e.position === tab)
    .filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex min-h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 p-6 bg-gray-100 space-y-6">
        <Header activePage={activePage} />
        {activePage === "employeeData" && (
          <>
            {selectedEmployee ? (
              <EmployeeDetail
                employee={selectedEmployee}
                onBack={() => setSelectedEmployee(null)}
              />
            ) : (
              <>
                {/* Search + Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อพนักงาน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded-lg p-2 w-full md:w-80"
                  />
                  <Tabs value={tab} onValueChange={setTab}>
                    <TabsList className="flex gap-2 bg-gray-200 p-2 rounded shadow-inner">
                      {["All", "General", "Admin", "Caddie", "Starter"].map((pos) => {
                        const count =
                          pos === "All"
                            ? employees.length
                            : employees.filter((e) => e.position === pos).length;
                        return (
                          <TabsTrigger
                            key={pos}
                            value={pos}
                            className={`px-4 py-2 rounded ${
                              tab === pos ? "bg-gray-500 text-white" : "text-black"
                            }`}
                          >
                            {pos} ({count})
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </Tabs>
                </div>
                {/* Employee List */}
                <EmployeeList
                  employees={filtered}
                  onClickEmployee={setSelectedEmployee}
                />
              </>
            )}
          </>
        )}
        {activePage === "addEmployee" && (
          <EmployeeForm
            onCancel={() => setActivePage("employeeData")}
            onAddEmployee={(newEmployee) => {
              setEmployees((prev) => [...prev, newEmployee]);
              setActivePage("employeeData");
            }}
          />
        )}
        {activePage === "booking" && <BookingTable />}
      </div>
    </div>
  );
}