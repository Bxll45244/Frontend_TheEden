import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Caddy/Header";
import { startRound, endRound, markCaddyAsAvailable } from "../../service/caddy.service.js";

const ProcessGolfPage = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {};

  const handleNextStep = async () => {
    try {
      if (step === 1) {
        await startRound(bookingId);
      } else if (step === 2) {
        await endRound(bookingId);
      } else if (step === 3) {
        await markCaddyAsAvailable(bookingId);
        navigate("/caddy/booking");
        return;
      }
      setStep(step + 1);
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-6 relative">
      <Header />
      <div className="flex justify-center items-center mt-20">
        <div className="bg-gradient-to-br from-green-700 to-green-800 text-white rounded-3xl w-full max-w-sm py-8 px-6 text-center shadow-lg">
          <h2 className="text-xl font-semibold mb-6">
            {step === 1 && "เริ่มออกรอบกอล์ฟ"}
            {step === 2 && "จบการเล่นกอล์ฟ"}
            {step === 3 && "เปลี่ยนแบตรถกอล์ฟสำเร็จ"}
          </h2>
          <button
            onClick={handleNextStep}
            className="mt-6 bg-white text-green-800 font-medium text-sm px-8 py-2 rounded-full shadow-md hover:bg-green-50 transition"
          >
            {step < 3 ? "ยืนยัน" : "เสร็จสิ้น"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessGolfPage;
