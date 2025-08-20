import EmployeeCard from "./EmployeeCard";

export default function EmployeeList({ employees, onClickEmployee }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {employees.map(emp => (
        <EmployeeCard
          key={emp.employeeCode || emp.name}
          employee={emp}
          onClick={() => onClickEmployee(emp)}
        />
      ))}
    </div>
  );
}
