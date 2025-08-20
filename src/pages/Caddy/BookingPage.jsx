import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

// นำเข้า Header Component จากตำแหน่งที่ถูกต้อง (components/caddy/Header.jsx)
import Header from "../../components/Caddy/Header.jsx"; // ตรวจสอบ Path ให้ถูกต้องตามโครงสร้างไฟล์ของคุณ

const formatDateThai = (date) => {
  const thMonths = [
    "ม.ค","ก.พ","มี.ค","เม.ย","พ.ค","มิ.ย",
    "ก.ค","ส.ค","ก.ย","ต.ค","พ.ย","ธ.ค"
  ];
  const day = date.getDate();
  const month = thMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ปี ${year}`;
};

const fixedDate = new Date(2025, 1, 8);

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentDate = formatDateThai(fixedDate); // เตรียม currentDate สำหรับส่งให้ Header

  const golfTimes = ["06.00", "17.00"];
  const schedule = [
    { date: "8 ก.พ ปี 2568", times: [] },
    { date: "9 ก.พ ปี 2568", times: [] },
    { date: "10 ก.พ ปี 2568", times: [] },
    { date: "11 ก.พ ปี 2568", times: [] },
    { date: "12 ก.พ ปี 2568", times: [] },
    { date: "13 ก.พ ปี 2568", times: [] },
    { date: "14 ก.พ ปี 2568", times: [] },
  ];

  // ---- เก็บสถานะรอบที่เสร็จแล้ว ----
  const [completed, setCompleted] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [popup, setPopup] = useState(null);
  const [clicked, setClicked] = useState(false);

  // อ่านค่าจาก location.state ถ้ามี
  useEffect(() => {
    if (location.state?.completedSchedules) {
      setCompleted(location.state.completedSchedules);
    }
  }, [location.state]);

  const handleTimeClick = (time) => {
    if (time === "06.00") {
      setPopup({ type: "confirm" });
    } else if (time === "17.00") {
      setPopup({ type: "notTime" });
    } else {
      setSelectedTime(time);
      setPopup(null);
    }
  };

  const handleConfirm = () => {
    const newItem = { date: schedule[0].date, time: "06.00" };
    setCompleted((prev) => [...prev, newItem]);
    setPopup({ type: "success", title: "เวลา 06.00" });
  };

  const closePopup = () => setPopup(null);

  useEffect(() => {
    if (popup?.type === "success") {
      const timer = setTimeout(() => {
        navigate("/caddy/booking", {
          state: { completedSchedules: [...completed] },
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [popup, navigate, completed]);

  const isCompleted = (date, time) => {
    return completed.some((item) => item.date === date && item.time === time);
  };

  return (
    <div className="min-h-screen bg-white p-4 space-y-6 font-sans">
      {/* ส่วน Header */}
      {/* เนื่องจาก BookingPage เป็นหน้าหลักของ Caddy คุณอาจต้องการ Header ที่เหมาะสมกับ Caddy
          ถ้า Header Component ของคุณมี logic ที่จัดการบทบาท Caddy ได้ ก็ใช้ตัวนี้ได้เลย */}
      {/* <Header currentDate={currentDate} /> */} 

      {/* เนื้อหาหลักของ BookingPage เริ่มต้นจากตรงนี้ */}
      {/* Avatar ถูกย้ายไปอยู่ใน Header Component แล้ว */}
      
      <div className="text-center space-y-2">
        {/* โลโก้และชื่อ The Eden Golf Club (ถ้า Header ไม่มีส่วนนี้) */}
        {/* ถ้า Header มีโลโก้แล้ว สามารถลบส่วนนี้ได้เพื่อไม่ให้ซ้ำซ้อน */}
        <img src="/images/caddy/eden-Logo.png" alt="logo" className="mx-auto h-24" />
        <h1 className="text-black text-xl font-bold uppercase">
          The Eden Golf Club
        </h1>
      </div>

      <div className="flex justify-center">
        {/* วันที่ (ถ้า Header มีส่วนนี้แล้ว สามารถลบส่วนนี้ได้) */}
        <div className="bg-[#324441] text-white rounded-full px-4 py-1 text-sm">
          {currentDate}
        </div>
      </div>

      <div className="bg-[#324441] text-white text-center rounded-2xl py-4 px-6 mx-auto w-[85%] space-y-2">
        <h2 className="text-base">เวลาออกรอบกอล์ฟ</h2>
        <div className="flex justify-center gap-6">
          {golfTimes.map((time) => (
            <div
              key={time}
              onClick={() => handleTimeClick(time)}
              className={`border rounded-full px-4 py-1 text-sm cursor-pointer ${
                selectedTime === time
                  ? "border-white bg-white text-[#324441]"
                  : "border-white"
              }`}
            >
              {time}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white mx-auto w-[90%] rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-center text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">วันที่</th>
              <th className="p-2">รอบเช้า</th>
              <th className="p-2">รอบบ่าย</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(({ date }) => (
              <tr key={date} className="border-t">
                <td className="p-2">{date}</td>
                <td className="p-2">
                  {isCompleted(date, "06.00") ? (
                    <span className="text-green-600 text-2xl font-bold">✓</span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2">
                  {isCompleted(date, "17.00") ? (
                    <span className="text-green-600 text-2xl font-bold">✓</span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* popup ต่างๆ */}
      {popup?.type === "confirm" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[60%] max-w-xs">
            <FontAwesomeIcon
              icon={faExclamation}
              className="text-yellow-400 text-4xl mb-4"
            />
            <h3 className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                ตกลง
              </button>
              <button
                onClick={closePopup}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {popup?.type === "notTime" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[60%] max-w-xs">
            <FontAwesomeIcon
              icon={faExclamation}
              className="text-yellow-500 text-4xl mb-4"
            />
            <h3 className="text-lg font-semibold mb-4">ยังไม่ถึงเวลา</h3>
            <div className="flex justify-center">
              <button
                onClick={closePopup}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {popup?.type === "success" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[70%] max-w-xs space-y-4">
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="text-green-500 text-5xl mx-auto"
            />
            <h2 className="text-3xl font-extrabold">สำเร็จ!</h2>
            <h3 className="text-base font-normal text-gray-800">
              {`เริ่มงาน${popup.title} สำเร็จ`}
            </h3>
            <button
              disabled={clicked}
              onClick={() => {
                if (clicked) return;
                setClicked(true);
                navigate("/caddy/booking", {
                  state: { completedSchedules: [...completed] },
                });
              }}
              className={`mt-4 px-6 py-2 rounded-full text-white ${
                clicked
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {clicked ? "กำลังเปลี่ยนหน้า..." : "ตกลง"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
