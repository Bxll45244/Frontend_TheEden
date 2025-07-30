import React from "react";
import StatusCard from "../../components/Starter/StatusCard";

const Dashboard = () => {
  const cartStatus = [
    { count: 60, label: "รถกอล์ฟว่าง", color: "success" },
    { count: 32, label: "กำลังใช้งาน", color: "info" },
    { count: 4, label: "เปลี่ยนแบต", color: "purple" },
    { count: 10, label: "รถสำรอง", color: "warning" },
    { count: 0, label: "รถเสีย", color: "error" },
  ];

  const bagStatus = [
    { count: 45, label: "กระเป๋าว่าง", color: "success" },
    { count: 5, label: "กำลังใช้งาน", color: "info" },
    { count: 5, label: "กระเป๋าสำรอง", color: "warning" },
    { count: 0, label: "กระเป๋าเสีย", color: "error" },
  ];

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 py-6">
      <div className="flex justify-center mt-6">
        <div className="inline-block bg-black text-white text-2xl font-bold py-2 px-6 rounded max-w-max">สถานะ</div>
      </div>

      <div className="max-w-7xl mx-auto border rounded-xl shadow-md p-6 sm:p-8 mt-6">
        <div className="divider text-lg font-semibold text-gray-800">รถกอล์ฟ</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cartStatus.map((status, idx) => (
            <StatusCard key={idx} image="/cart.jpg" {...status} />
          ))}
        </div>

        <div className="divider text-lg font-semibold text-gray-800 mt-6">กระเป๋าไม้กอล์ฟ</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {bagStatus.map((status, idx) => (
            <StatusCard key={idx} image="/bag.jpg" {...status} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
