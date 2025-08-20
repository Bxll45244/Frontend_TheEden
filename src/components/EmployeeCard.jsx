import { Card, CardContent } from "@/components/ui/card";

export default function EmployeeCard({ employee, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform bg-white border border-gray-200"
    >
      <CardContent className="p-6 flex flex-col items-center text-center min-h-[260px]">
        <img
          src={employee.image}
          alt={employee.name}
          className="rounded-full w-28 h-28 object-cover mb-4 shadow"
        />
        <p className="mb-2">
          <span className="font-semibold text-gray-700">ชื่อ: </span>
          <span className="text-gray-800">{employee.name}</span>
        </p>
        <p>
          <span className="font-semibold text-gray-700">ตำแหน่ง: </span>
          <span className="text-gray-800">{employee.position}</span>
        </p>
      </CardContent>
    </Card>
  );
}
