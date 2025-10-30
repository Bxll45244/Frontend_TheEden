import React, { useState, useEffect } from "react";
import Header from "../../components/Caddy/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const ProcessGolfPage = () => {
  const [step, setStep] = useState(1);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedDate: stateDate, selectedTime: stateTime } = location.state || {};
  const [selectedDate, setSelectedDate] = useState(stateDate || localStorage.getItem("selectedDate") || "8 ก.พ ปี 2568");
  const [selectedTime, setSelectedTime] = useState(stateTime || localStorage.getItem("selectedTime") || "06.00");

  useEffect(() => {
    if (stateDate) localStorage.setItem("selectedDate", stateDate);
    if (stateTime) localStorage.setItem("selectedTime", stateTime);
  }, [stateDate, stateTime]);

  const stepTexts = ["เริ่มออกรอบกอล์ฟ", "จบการเล่นกอล์ฟ", "เปลี่ยนแบตรถกอล์ฟสำเร็จ"];

  const handleNextStep = () => {
    if (step < 3) setStep((s) => s + 1);
    else {
      navigate("/caddy", { state: { completedSchedule: { date: selectedDate, time: selectedTime } } });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-6 relative">
      <Header />

      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  step > i
                    ? "bg-green-500 border-green-500 text-white"
                    : step === i
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {step > i ? <FontAwesomeIcon icon={faCheckCircle} /> : i}
              </div>
              {i < 3 && (
                <div className={`w-10 h-[2px] ${step > i ? "bg-green-500" : "bg-gray-300"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <div className="bg-gradient-to-br from-green-700 to-green-800 text-white rounded-3xl w-full max-w-sm py-8 px-6 text-center shadow-lg">
          <p className="text-lg font-semibold">{stepTexts[step - 1]}</p>
          <button
            className="mt-6 bg-white text-green-800 font-medium text-sm px-8 py-2 rounded-full shadow-md hover:bg-green-50 transition"
            onClick={handleNextStep}
          >
            ยืนยัน
          </button>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="bg-orange-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-orange-600 transition"
        >
          ยกเลิก
        </button>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[80%] max-w-xs">
            <p className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => { setShowCancelConfirm(false); navigate("/caddy"); }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                ตกลง
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
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
