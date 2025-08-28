// นำเข้า React และ hooks ที่จำเป็น
import React, { useState, useEffect } from "react";
// นำเข้า useNavigate, useLocation จาก react-router-dom สำหรับเปลี่ยนหน้าและรับค่าที่ส่งมา
import { useNavigate, useLocation } from "react-router-dom";
// นำเข้า Header ที่เป็นคอมโพเนนต์ส่วนหัว
import Header from "../../components/Caddy/Header";
// นำเข้าไอคอนจาก FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

// ประกาศคอมโพเนนต์หลักชื่อ ProcessGolfPage
const ProcessGolfPage = () => {
  // กำหนด state เก็บค่าขั้นตอนปัจจุบัน (เริ่มที่ step 1)
  const [step, setStep] = useState(1);
  // กำหนด state สำหรับเปิด/ปิด popup ยืนยันการยกเลิก
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  // ตัวช่วยเปลี่ยนหน้า
  const navigate = useNavigate();
  // ตัวช่วยอ่านค่า state ที่ส่งมาจากหน้าอื่น
  const location = useLocation();

  // ดึงค่า selectedDate และ selectedTime จาก state ที่ถูกส่งมา
  const { selectedDate: stateDate, selectedTime: stateTime } = location.state || {};
  // สร้าง state สำหรับวัน โดยใช้ค่าที่ส่งมา หรือจาก localStorage หรือค่า default
  const [selectedDate, setSelectedDate] = useState(
    stateDate || localStorage.getItem("selectedDate") || "8 ก.พ ปี 2568"
  );
  // สร้าง state สำหรับเวลา โดยใช้ค่าที่ส่งมา หรือจาก localStorage หรือค่า default
  const [selectedTime, setSelectedTime] = useState(
    stateTime || localStorage.getItem("selectedTime") || "06.00"
  );

  // เมื่อค่า stateDate หรือ stateTime เปลี่ยน → เก็บลง localStorage
  useEffect(() => {
    if (stateDate) localStorage.setItem("selectedDate", stateDate);
    if (stateTime) localStorage.setItem("selectedTime", stateTime);
  }, [stateDate, stateTime]);

  // ข้อความที่จะใช้แสดงตามขั้นตอน (Step)
  const stepTexts = [
    "เริ่มออกรอบกอล์ฟ",         // Step 1
    "จบการเล่นกอล์ฟ",            // Step 2
    "เปลี่ยนแบตรถกอล์ฟสำเร็จ",  // Step 3
  ];

  // ฟังก์ชันเมื่อกดปุ่ม "ยืนยัน"
  const handleNextStep = () => {
    if (step < 3) {
      // ถ้ายังไม่ถึงขั้นตอนสุดท้าย → เพิ่ม step ขึ้นไปอีก 1
      setStep(step + 1);
    } else {
      // ถ้าครบ 3 ขั้นแล้ว → กลับไปหน้า /caddy และส่งค่าที่จบแล้วไปด้วย
      navigate("/caddy", {
        state: {
          completedSchedule: { date: selectedDate, time: selectedTime },
        },
      });
    }
  };

  // ส่วนที่ return คือ UI ที่จะแสดงผล
  return (
    // กล่องใหญ่สุด ครอบทั้งหน้า
    <div className="min-h-screen bg-white flex flex-col px-4 py-6 relative">
      {/* ส่วนหัวของหน้า */}
      <Header />

      {/* ส่วนแสดง Progress ของ Step */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((i) => (
            // ใช้ React.Fragment เพื่อห่อ element หลายตัว
            <React.Fragment key={i}>
              {/* วงกลมแสดงสถานะของ Step */}
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  step > i
                    ? "bg-green-500 border-green-500 text-white"      // ถ้าข้าม step นี้แล้ว → สีเขียว
                    : step === i
                    ? "bg-green-100 border-green-500 text-green-700" // ถ้าเป็น step ปัจจุบัน → เขียวอ่อน
                    : "bg-gray-100 border-gray-300 text-gray-400"    // ถ้ายังไม่ถึง → เทา
                }`}
              >
                {/* ถ้าเลย step นี้แล้ว → แสดง icon ติ๊กถูก, ถ้าไม่ใช่ → แสดงเลขขั้น */}
                {step > i ? <FontAwesomeIcon icon={faCheckCircle} /> : i}
              </div>

              {/* เส้นเชื่อมระหว่าง step */}
              {i < 3 && (
                <div
                  className={`w-10 h-[2px] transition-all duration-300 ${
                    step > i ? "bg-green-500" : "bg-gray-300" // ถ้าผ่านแล้ว → เขียว, ถ้ายังไม่ถึง → เทา
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* การ์ดสถานะแสดงข้อความของ step ปัจจุบัน */}
      <div className="mt-10 flex justify-center">
        <div className="bg-gradient-to-br from-green-700 to-green-800 text-white rounded-3xl w-full max-w-sm py-8 px-6 text-center shadow-lg">
          {/* แสดงข้อความตาม step ปัจจุบัน */}
          <p className="text-lg font-semibold">{stepTexts[step - 1]}</p>
          {/* ปุ่มกดยืนยันไปขั้นต่อไป */}
          <button
            className="mt-6 bg-white text-green-800 font-medium text-sm px-8 py-2 rounded-full shadow-md hover:bg-green-50 transition"
            onClick={handleNextStep}
          >
            ยืนยัน
          </button>
        </div>
      </div>

            {/* ปุ่มยกเลิก (ลอยอยู่มุมขวาล่าง) */}
      <div className="fixed bottom-4 right-4 z-40"> {/* กล่องครอบปุ่มยกเลิก */}
        <button
          onClick={() => setShowCancelConfirm(true)} // เมื่อกดจะเปิด popup ยืนยัน
          className="bg-orange-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-orange-600 transition" // สไตล์ปุ่ม
        >
          ยกเลิก {/* ข้อความบนปุ่ม */}
        </button>
      </div> {/* ปิดกล่องปุ่มยกเลิก */}

      {/* Popup ยืนยันการยกเลิก */}
      {showCancelConfirm && ( // เช็คว่า showCancelConfirm เป็น true หรือไม่ ถ้าใช่จะแสดง popup
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"> {/* พื้นหลังดำโปร่ง */}
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[80%] max-w-xs"> {/* กล่องยืนยันการยกเลิก */}
            <p className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่?</p> {/* ข้อความถามผู้ใช้ */}
            <div className="flex justify-center gap-4"> {/* กล่องปุ่ม 2 อัน */}
              <button
                onClick={() => { // ถ้ากด "ตกลง"
                  setShowCancelConfirm(false); // ปิด popup
                  navigate("/caddy"); // กลับไปหน้า /caddy
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded" // สไตล์ปุ่มตกลง
              >
                ตกลง {/* ข้อความบนปุ่ม */}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)} // ถ้ากด "ยกเลิก" → แค่ปิด popup
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded" // สไตล์ปุ่มยกเลิก
              >
                ยกเลิก {/* ข้อความบนปุ่ม */}
              </button>
            </div> {/* ปิดกล่องปุ่ม 2 อัน */}
          </div> {/* ปิดกล่องยืนยัน */}
        </div> // ปิดพื้นหลังดำโปร่ง
      )}
    </div> // ปิดกล่องใหญ่สุดของหน้านี้
  );
};

// ส่งออกคอมโพเนนต์นี้ไปใช้งานที่อื่น
export default ProcessGolfPage; // export คอมโพเนนต์หลักออกไป

