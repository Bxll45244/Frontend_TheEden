import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import th from "date-fns/locale/th";
// ✅ ใช้ Service ที่ล็อกไว้
import CaddyService from "../../service/CaddyService";

registerLocale("th", th);

const formatDateThai = (date) => {
  const thMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const day = date.getDate();
  const month = thMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ${year}`;
};

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // ✅ กันตั้งแต่หน้าแรก: ถ้ายังไม่ล็อกอิน ให้พาไป /login
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const golfTimes = ["06.00", "17.00"];

  // ✅ ข้อมูลต้องว่างจนกว่าจะล็อกอิน + merge branch admin
  const [completed, setCompleted] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [popup, setPopup] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ---------- Auth Gate ----------
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // แค่เรียกเพื่อเช็คว่า session ใช้ได้ไหม
        await CaddyService.getCaddyBookings();
        if (!mounted) return;
        setCheckingAuth(false);
      } catch (e) {
        const status = e?.response?.status;
        // ถ้าไม่ได้ล็อกอิน → ไปหน้า /login
        if (status === 401) {
          const from = location.pathname + location.search;
          navigate(`/login?from=${encodeURIComponent(from)}`, { replace: true });
          return;
        }
        // error อื่น ๆ: แสดงหน้าแบบว่างได้ แต่ไม่โชว์ข้อมูล
        setCheckingAuth(false);
      }
    })();
    return () => { mounted = false; };
  }, [navigate, location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ❗️ตอนนี้ยังไม่โชว์รอบทำงานจนกว่าจะมีข้อมูลจริงหลัง merge
  const hasWorkOnThisDate = () => false;

  // รับสถานะที่ส่งกลับมาหลังทำงานสำเร็จ (ถ้ามีในอนาคต)
  useEffect(() => {
    if (location.state?.completedSchedules) {
      setCompleted(location.state.completedSchedules);
    }
  }, [location.state]);

  // ตาราง 7 วันถัดไป (UI อย่างเดียว ค่าช่องเป็น "-")
  useEffect(() => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      days.push({ date: formatDateThai(currentDate), rawDate: currentDate });
    }
    setWeeklySchedule(days);
  }, [selectedDate]);

  // ตอนนี้ยังไม่อนุญาตให้เริ่มงาน/เลือกเวลา → แจ้ง "ยังไม่พร้อมใช้งาน"
  const handleTimeClick = () => {
    setPopup({ type: "notTime" });
  };

  // ยังไม่ยิง API ใด ๆ ในหน้านี้จนกว่าจะพร้อมจริง
  const handleConfirm = async () => {
    setPopup(null);
  };

  const closePopup = () => setPopup(null);

  useEffect(() => {
    if (popup?.type === "success") {
      const timer = setTimeout(() => {
        navigate("/caddy/booking", { state: { completedSchedules: [...completed] } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [popup, navigate, completed]);

  const isCompleted = (date, time) => completed.some((item) => item.date === date && item.time === time);

  const handleMenuClick = (menu) => {
    if (menu === "โปรไฟล์") navigate("/caddy/profile");
    else if (menu === "ประวัติการทำงาน") navigate("/caddy/history");
    else if (menu === "แจ้งปัญหา") navigate("/caddy/dashboard");
    else if (menu === "ออกจากระบบ") navigate("/landing");
    setIsMenuOpen(false);
  };

  // ระหว่างเช็คสิทธิ์ → spinner เฉย ๆ
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="loading loading-spinner loading-lg text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 text-center space-y-2">
          <img src="/images/caddy/eden-Logo.png" alt="logo" className="mx-auto h-24" />
          <h1 className="text-[#324441] text-xl font-bold uppercase">The Eden Golf Club</h1>
        </div>

        <div className="relative z-10 self-start" ref={profileRef}>
          <div className="avatar avatar-online avatar-placeholder cursor-pointer" onClick={() => setIsMenuOpen((v) => !v)}>
            <div className="bg-[#324441] text-white w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-lg">AI</span>
            </div>
          </div>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
              <button onClick={() => handleMenuClick("โปรไฟล์")} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                โปรไฟล์
              </button>
              <button onClick={() => handleMenuClick("ประวัติการทำงาน")} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                ประวัติการทำงาน
              </button>
              <button onClick={() => handleMenuClick("แจ้งปัญหา")} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                แจ้งปัญหา
              </button>
              <button onClick={() => handleMenuClick("ออกจากระบบ")} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DatePicker (เลือกได้เฉพาะวันนี้และอนาคต) */}
      <div className="flex justify-center mb-6">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="d MMM ปี yyyy"
          locale="th"
          minDate={new Date()}
          className="bg-[#324441] text-white rounded-full px-4 py-2 text-sm cursor-pointer text-center"
        />
      </div>

      {/* เวลา (ตอนนี้เป็น UI อย่างเดียว) */}
      <div className="bg-[#3B6B5D] text-white text-center rounded-2xl shadow-lg py-6 px-6 mx-auto w/full max-w-sm space-y-4 mb-6">
        <h2 className="text-base font-bold">เวลาออกรอบกอล์ฟ</h2>
        <div className="flex justify-center gap-6">
          {golfTimes.map((time) => (
            <button
              key={time}
              onClick={handleTimeClick}
              className="rounded-full px-4 py-1 text-sm font-semibold border border-white text-white hover:bg-white hover:text-[#324441] transition-colors"
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* ตารางรายสัปดาห์ (ข้อมูลว่าง) */}
      <div className="bg-[#E3F1EB] mx-auto w-full max-w-sm rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="bg-[#3B6B5D] text-white text-center py-4">
          <h2 className="text-xl font-bold">การทำงานรายสัปดาห์</h2>
        </div>
        <table className="w-full text-center text-sm">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-2">วันที่</th>
              <th className="p-2">รอบเช้า</th>
              <th className="p-2">รอบบ่าย</th>
            </tr>
          </thead>
          <tbody>
            {weeklySchedule.map((day) => (
              <tr key={day.date} className="border-t border-gray-400">
                <td className="p-2">{day.date}</td>
                <td className="p-2">-</td>
                <td className="p-2">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-black text-center w-[70%] max-w-xs space-y-4">
            {popup.type === "notTime" && (
              <>
                <FontAwesomeIcon icon={faExclamation} className="text-red-500 text-5xl mx-auto" />
                <h3 className="text-lg font-semibold mb-4">ยังไม่พร้อมใช้งาน</h3>
                <button onClick={closePopup} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                  ตกลง
                </button>
              </>
            )}

            {popup.type === "success" && (
              <>
                <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-5xl mx-auto" />
                <h2 className="text-3xl font-extrabold">สำเร็จ!</h2>
                <h3 className="text-base font-normal text-gray-800">{`ดำเนินการสำเร็จ`}</h3>
                <button
                  disabled={clicked}
                  onClick={() => {
                    if (clicked) return;
                    setClicked(true);
                    navigate("/caddy/booking", { state: { completedSchedules: [...completed] } });
                  }}
                  className={`mt-4 px-6 py-2 rounded-full text-white ${
                    clicked ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {clicked ? "กำลังเปลี่ยนหน้า..." : "ตกลง"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
