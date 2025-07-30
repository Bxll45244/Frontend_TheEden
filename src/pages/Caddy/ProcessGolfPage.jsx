import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Caddy/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCircle } from "@fortawesome/free-solid-svg-icons";

const ProcessGolfPage = () => {
  const [step, setStep] = useState(1);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // เช็คและดึงค่าจาก location.state หรือ localStorage เป็น fallback
  const { selectedDate: stateDate, selectedTime: stateTime } = location.state || {};

  const [selectedDate, setSelectedDate] = useState(stateDate || localStorage.getItem("selectedDate") || "8 ก.พ ปี 2568");
  const [selectedTime, setSelectedTime] = useState(stateTime || localStorage.getItem("selectedTime") || "06.00");

  // บันทึกค่าลง localStorage เผื่อ reload หน้า
  useEffect(() => {
    if (stateDate) localStorage.setItem("selectedDate", stateDate);
    if (stateTime) localStorage.setItem("selectedTime", stateTime);
  }, [stateDate, stateTime]);

  // Debug log เช็คค่า
  useEffect(() => {
    console.log("location.state:", location.state);
    console.log("selectedDate:", selectedDate, "selectedTime:", selectedTime);
  }, [location.state, selectedDate, selectedTime]);

  const stepTexts = [
    "เริ่มออกรอบกอล์ฟ",
    "จบการเล่นกอล์ฟ",
    "เปลี่ยนแบตรถกอล์ฟสำเร็จ",
  ];

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate("/caddy", {
        state: {
          completedSchedule: {
            date: selectedDate,
            time: selectedTime,
          },
        },
      });
    }
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    navigate("/caddy");
  };

  const handleCloseCancel = () => {
    setShowCancelConfirm(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-4 relative">
      <Header />

      {/* Step Progress */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div className="text-green-600">
                {step > i ? (
                  <FontAwesomeIcon icon={faCheckCircle} className="w-6 h-6" />
                ) : (
                  <FontAwesomeIcon
                    icon={faCircle}
                    className={`w-6 h-6 ${
                      step === i ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                )}
              </div>
              {i < 3 && (
                <div
                  className={`w-8 h-1 ${
                    step > i ? "bg-green-600" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* กล่องแสดงสถานะ */}
      <div className="mt-8 flex justify-center">
        <div className="bg-[#324441] text-white rounded-2xl w-full max-w-sm py-6 px-4 text-center">
          <p className="text-base font-semibold">{stepTexts[step - 1]}</p>
          <button
            className="mt-4 bg-white text-[#324441] font-medium text-sm px-6 py-2 rounded-full hover:bg-gray-100"
            onClick={handleNextStep}
          >
            ยืนยัน
          </button>
        </div>
      </div>

      {/* ปุ่มยกเลิกลอยล่างขวา */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={handleCancelClick}
          className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 shadow-md"
        >
          ยกเลิก
        </button>
      </div>

      {/* Popup ยืนยันยกเลิก */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[80%] max-w-xs">
            <p className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmCancel}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                ตกลง
              </button>
              <button
                onClick={handleCloseCancel}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessGolfPage;
