import { Card, CardContent } from "@/components/ui/card";

export default function EmployeeCard({ employee, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer rounded-xl shadow hover:shadow-lg transition"
    >
      <CardContent className="p-4 flex flex-col items-center">
        <img
          src={employee.image}
          alt={employee.name}
          className="rounded-full w-24 h-24 object-cover mb-4"
        />
        <p>
          <span className="font-bold">ชื่อ: </span>
          {employee.name}
        </p>
        <p>
          <span className="font-bold">ตำแหน่ง: </span>
          {employee.position}
        </p>
      </CardContent>
    </Card>
  );
}
