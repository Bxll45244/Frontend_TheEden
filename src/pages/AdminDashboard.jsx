import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EmployeeCard from "../components/EmployeeCard";
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
    .filter(e => tab === "All" || e.position === tab)
    .filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex min-h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 p-6 bg-gray-100">
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
                {/* Search input ด้านขวาพร้อมไอคอน */}
                <div className="mb-6 flex justify-end">
                  <div className="relative w-full md:w-80">
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อพนักงาน..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 pr-10 w-full"
                    />
                    <svg
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 2a8 8 0 015.292 13.708l4 4a1 1 0 01-1.415 1.415l-4-4A8 8 0 1110 2zm0 2a6 6 0 100 12A6 6 0 0010 4z" />
                    </svg>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="All" value={tab} onValueChange={setTab}>
                  <TabsList className="flex gap-2 mb-4 bg-gray-200 p-2 rounded shadow-inner">
                    {["All", "General", "Admin", "Caddie", "Starter"].map(position => {
                      const count = position === "All"
                        ? employees.length
                        : employees.filter(e => e.position === position).length;
                      return (
                        <TabsTrigger
                          key={position}
                          value={position}
                          className={`px-4 py-2 rounded ${
                            tab === position ? "bg-gray-500 text-white" : "text-black"
                          }`}
                        >
                          {position} ({count})
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </Tabs>

                {/* Employee cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filtered.map((e, i) => (
                    <EmployeeCard key={i} employee={e} onClick={() => setSelectedEmployee(e)} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* หน้าเพิ่มพนักงาน */}
        {activePage === "addEmployee" && (
          <EmployeeForm
            onCancel={() => setActivePage("employeeData")}
            onAddEmployee={(newEmployee) => {
              setEmployees(prev => [...prev, newEmployee]);
              setActivePage("employeeData");
            }}
          />
        )}

        {activePage === "booking" && <BookingTable />}
      </div>
    </div>
  );
}
