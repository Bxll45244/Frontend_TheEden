import React, { useState, useEffect } from "react";
// อิมพอร์ต api instance ที่เราสร้างไว้แทน axios โดยตรง
import api from '../../service/api'; 
import StatusCard from "../../components/Caddy/StatusCard";

const Dashboard = () => {
  const [assetStatus, setAssetStatus] = useState({
    golfCart: {},
    golfBag: {}
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssetStatus = async () => {
      try {
        // ใช้ api instance ที่มีการตั้งค่า Interceptor สำหรับแนบ Token แล้ว
        const response = await api.get('/assets/status/overall');
        const { golfCart, golfBag } = response.data;

        const formattedCartStatus = [
          { count: golfCart.available || 0, label: "รถกอล์ฟว่าง", color: "success" },
          { count: golfCart.inUse || 0, label: "กำลังใช้งาน", color: "info" },
          { count: golfCart.booked || 0, label: "จองแล้ว", color: "primary" },
          { count: golfCart.clean || 0, label: "เปลี่ยนแบต", color: "purple" },
          { count: golfCart.spare || 0, label: "รถสำรอง", color: "warning" },
          { count: golfCart.broken || 0, label: "รถเสีย", color: "error" },
        ];

        const formattedBagStatus = [
          { count: golfBag.available || 0, label: "กระเป๋าว่าง", color: "success" },
          { count: golfBag.inUse || 0, label: "กำลังใช้งาน", color: "info" },
          { count: golfBag.booked || 0, label: "จองแล้ว", color: "primary" },
          { count: golfBag.spare || 0, label: "กระเป๋าสำรอง", color: "warning" },
          { count: golfBag.broken || 0, label: "กระเป๋าเสีย", color: "error" },
        ];
        
        setAssetStatus({
          golfCart: formattedCartStatus,
          golfBag: formattedBagStatus
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching asset status:", err);
        // ปรับปรุงการจัดการ Error ให้ละเอียดขึ้น
        if (err.response) {
            if (err.response.status === 401) {
                setError("คุณไม่ได้รับอนุญาตให้เข้าถึงข้อมูลนี้ กรุณาเข้าสู่ระบบอีกครั้ง");
            } else {
                setError(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${err.message}`);
            }
        } else {
            setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
        }
        setIsLoading(false);
      }
    };

    fetchAssetStatus();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-10">กำลังโหลดข้อมูล...</div>;
  }
  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 py-6">
      <div className="flex justify-center mt-6">
        <div className="inline-block bg-black text-white text-2xl font-bold py-2 px-6 rounded max-w-max">สถานะ</div>
      </div>

      <div className="max-w-7xl mx-auto border rounded-xl shadow-md p-6 sm:p-8 mt-6">
        <div className="divider text-lg font-semibold text-gray-800">รถกอล์ฟ</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {assetStatus.golfCart.map((status, idx) => (
            <StatusCard key={idx} image="/images/starter/cart.jpg" {...status} />
          ))}
        </div>

        <div className="divider text-lg font-semibold text-gray-800 mt-6">กระเป๋าไม้กอล์ฟ</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {assetStatus.golfBag.map((status, idx) => (
            <StatusCard key={idx} image="/images/starter/bag.jpg" {...status} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;