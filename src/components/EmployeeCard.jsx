import React from "react";

import { Card, CardContent } from "@/components/ui/card";

export default function EmployeeCard({ employee, onClick }) {
return (
        <Card
        onClick={onClick}
        className="cursor-pointer rounded-2xl shadow-md hover:shadow-xl  transition-transform bg-white border border-gray-200 w-64"
        >
            <CardContent className="p-4 flex flex-col items-center text-center">
                <img
                    src={employee.image}
                    alt={employee.name}
                    className="rounded-full w-24 h-24 mb-3 shadow object-cover"
                />
                <p className="mb-1 text-sm">
                <span className="font-semibold text-gray-700">ชื่อ: </span>
                <span className="text-gray-800">{employee.name}</span>
                </p>
                <p className="text-sm">
                <span className="font-semibold text-gray-700">ตำแหน่ง: </span>
                <span className="text-gray-800">{employee.position}</span>
                </p>
            </CardContent>
        </Card>
);
}