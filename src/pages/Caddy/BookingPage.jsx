import React, { useState, useEffect, useRef } from "react"; // ดึงของจำเป็นจาก React: useState เก็บค่าชั่วคราว, useEffect ทำงานตามการเปลี่ยนแปลง, useRef อ้างอิงองค์ประกอบในหน้า
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // เอาคอมโพเนนต์ไอคอนมาใช้
import { faExclamation, faCircleCheck } from "@fortawesome/free-solid-svg-icons"; // เลือกไอคอนเครื่องหมายตกใจและติ๊กถูกจากชุดไอคอน
import { useNavigate, useLocation } from "react-router-dom"; // ใช้สำหรับเปลี่ยนหน้า (navigate) และรับข้อมูลที่ส่งมาจากหน้าก่อน (location)
import DatePicker from "react-datepicker"; // ปฏิทินให้ผู้ใช้เลือกวันที่
import "react-datepicker/dist/react-datepicker.css"; // ไฟล์สไตล์ของปฏิทิน
import { registerLocale } from "react-datepicker"; // ฟังก์ชันลงทะเบียนภาษาให้ปฏิทิน
import th from 'date-fns/locale/th'; // ภาษาไทยสำหรับจัดรูปแบบวันที่ของ date-fns

// ลงทะเบียน locale ภาษาไทยให้กับ DatePicker
registerLocale('th', th); // บอก DatePicker ให้รู้จักรหัส 'th' คือภาษาไทย

// นำเข้า Header Component จากตำแหน่งที่ถูกต้อง (components/caddy/Header.jsx)
import Header from "../../components/Caddy/Header.jsx"; // เผื่อจะใช้หัวเว็บ (แม้ไฟล์นี้ยังไม่ได้ใช้จริง)

const formatDateThai = (date) => { // ฟังก์ชันแปลงวันที่ JS ให้เป็นรูปแบบไทยอ่านง่าย
    const thMonths = [ // รายชื่อเดือนย่อภาษาไทย
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const day = date.getDate(); // ดึงเลขวันที่ (1–31)
    const month = thMonths[date.getMonth()]; // แปลงเลขเดือน (0–11) ไปเป็นชื่อเดือนย่อภาษาไทย
    const year = date.getFullYear() + 543; // ปีพุทธศักราช: เอาปีคริสต์ + 543
    return `${day} ${month} ${year}`; // ต่อเป็นข้อความแบบไทย เช่น 1 ก.พ. 2568
};

const BookingPage = () => { // คอมโพเนนต์หลักของหน้านี้
    const navigate = useNavigate(); // ตัวช่วยเปลี่ยนหน้าไปเส้นทางอื่น
    const location = useLocation(); // ตัวช่วยอ่านข้อมูลที่หน้าก่อนส่งมาทาง state
    const profileRef = useRef(null); // เอาไว้ชี้ไปที่กล่องโปรไฟล์ เพื่อเช็กการคลิกนอกพื้นที่

    const [selectedDate, setSelectedDate] = useState(new Date(2025, 1, 1)); // เก็บวันที่ที่เลือก เริ่มต้นเป็น 1 ก.พ. 2025 (เดือนนับจาก 0)
    const golfTimes = ["06.00", "17.00"]; // รอบเวลาที่ให้เลือก: เช้า 06.00 และบ่าย 17.00

    const [completed, setCompleted] = useState([]); // รายการงานที่เริ่มแล้ว/ทำแล้ว เก็บเป็นลิสต์ของ {date,time}
    const [selectedTime, setSelectedTime] = useState(null); // เวลาไหนที่ผู้ใช้กดอยู่ตอนนี้
    const [popup, setPopup] = useState(null); // คุมป๊อปอัปว่าจะโชว์อะไร (ยืนยัน/ยังไม่ถึงเวลา/สำเร็จ) หรือไม่โชว์
    const [clicked, setClicked] = useState(false); // กันผู้ใช้กดปุ่มซ้ำตอนกำลังเปลี่ยนหน้า
    const [weeklySchedule, setWeeklySchedule] = useState([]); // ตารางทำงาน 7 วัน ที่จะโชว์ในตารางด้านล่าง
    const [isMenuOpen, setIsMenuOpen] = useState(false); // เปิด/ปิดเมนูโปรไฟล์มุมขวาบน

    useEffect(() => { // ตั้งตัวฟังการคลิกหน้าจอเพื่อปิดเมนูเมื่อคลิคนอกกล่องโปรไฟล์
        const handleClickOutside = (event) => { // ฟังก์ชันเช็กว่าคลิกนอกกรอบโปรไฟล์ไหม
            if (profileRef.current && !profileRef.current.contains(event.target)) { // ถ้ามีกรอบโปรไฟล์ และที่คลิกไม่ได้อยู่ข้างใน
                setIsMenuOpen(false); // ปิดเมนู
            }
        };

        document.addEventListener("mousedown", handleClickOutside); // เริ่มฟังเหตุการณ์คลิกเมาส์ลง

        return () => {
            document.removeEventListener("mousedown", handleClickOutside); // ตอนออกจากหน้า/เปลี่ยน เผื่อความสะอาด: เลิกฟังเหตุการณ์
        };
    }, [profileRef]); // ทำงานครั้งแรก และจะอัปเดตถ้าอ้างอิง profileRef เปลี่ยน (ปกติไม่เปลี่ยน)

    const hasWorkOnThisDate = (date) => { // เช็กว่าวันที่นี้เป็นวันที่มีงานหรือไม่
        const workDates = [1, 8, 15, 22];  // กำหนดวันที่ที่มีเวรทำงานไว้ล่วงหน้า (วันที่ 1, 8, 15, 22 ของเดือน)
        return workDates.includes(date.getDate()) && date.getMonth() === 1 && date.getFullYear() === 2025; // ต้องตรงกับวันในลิสต์ + เดือนก.พ. (1) + ปี 2025
    };

    useEffect(() => { // ถ้าหน้านี้ถูกเปิดพร้อมข้อมูลเสร็จงานจากหน้าก่อน ให้เอามาเก็บต่อ
        if (location.state?.completedSchedules) { // เช็กว่ามี state ชื่อ completedSchedules มั้ย
            setCompleted(location.state.completedSchedules); // ตั้งค่า completed ให้เท่ากับข้อมูลที่ส่งมา
        }
    }, [location.state]); // ทำงานเมื่อข้อมูลที่มากับเส้นทางเปลี่ยน

    // โค้ดที่ได้รับการแก้ไข
    useEffect(() => { // เมื่อผู้ใช้เปลี่ยนวันที่ ให้สร้างตาราง 7 วันรอบ ๆ ตามวันทำงานอ้างอิง
        const days = []; // เตรียมลิสต์เก็บวันทั้งเจ็ด
        const workDates = [1, 8, 15, 22, 29]; // กำหนดวันอ้างอิงที่ถือเป็นจุดเริ่มสัปดาห์ในเดือนนั้น
        const selectedDay = selectedDate.getDate(); // วันที่ที่ผู้ใช้เลือก (เลขวัน)

        let startDay = workDates[0]; // เริ่มต้นเดาว่าจุดเริ่มคือวันแรกในลิสต์
        for (let i = workDates.length - 1; i >= 0; i--) { // ไล่เช็กจากท้ายมาหาหน้า
            if (selectedDay >= workDates[i]) { // ถ้าวันที่ที่เลือก มากกว่าหรือเท่ากับวันอ้างอิงตัวไหน
                startDay = workDates[i]; // ให้เริ่มสัปดาห์จากวันอ้างอิงตัวนั้น
                break; // เจอแล้วก็พอ
            }
        }

        const startOfWeek = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), startDay); // สร้างวันที่เริ่มสัปดาห์จากปี/เดือนเดียวกับที่เลือก แต่ใช้เลขวันเริ่มต้น

        for (let i = 0; i < 7; i++) { // วนสร้าง 7 วันติดกัน
            const currentDate = new Date(startOfWeek); // ก็อปวันที่เริ่มต้นมา
            currentDate.setDate(startOfWeek.getDate() + i); // ขยับเป็นวันถัดไปตามรอบ
            days.push({ // เก็บทั้งแบบข้อความไทยและแบบ Date จริง
                date: formatDateThai(currentDate), // วันที่ในรูปแบบไทย (ไว้โชว์)
                rawDate: currentDate // วันที่แบบจริง (ไว้คำนวณถ้าต้องใช้ต่อ)
            });
        }
        setWeeklySchedule(days); // อัปเดตตาราง 7 วันให้กับ state เพื่อนำไปแสดงผล
    }, [selectedDate]); // ทำใหม่ทุกครั้งที่ผู้ใช้เปลี่ยนวันในปฏิทิน

    const handleTimeClick = (time) => { // เมื่อคลิกเลือกเวลาออกรอบ
        if (time === "06.00") { // ถ้าเป็นเวลา 06.00
            setPopup({ type: "confirm" }); // ให้ขึ้นป๊อปอัปถามยืนยันก่อน
        } else if (time === "17.00") { // ถ้าเป็นเวลา 17.00
            setPopup({ type: "notTime" }); // ยังไม่ให้เริ่ม แจ้งเตือนว่าถึงเวลาแล้วค่อยมา
        } else {
            setSelectedTime(time); // เผื่ออนาคตมีเวลาอื่น ๆ: เลือกไว้เฉย ๆ
            setPopup(null); // ไม่ต้องมีป๊อปอัป
        }
    };

    const handleConfirm = () => { // เมื่อผู้ใช้กดยืนยันเริ่มงานเวลาที่เลือก (06.00)
        const newItem = { date: formatDateThai(selectedDate), time: "06.00" }; // เตรียมรายการใหม่: วันที่ที่เลือก + เวลา 06.00
        setCompleted((prev) => [...prev, newItem]); // เพิ่มเข้าไปในรายการงานที่สำเร็จแล้ว
        setPopup({ type: "success", title: "เวลา 06.00" }); // โชว์ป๊อปอัปบอกว่าสำเร็จ พร้อมระบุชื่อเวลา
    };

    const closePopup = () => setPopup(null); // ปิดป๊อปอัปเมื่อผู้ใช้กดปุ่ม

    useEffect(() => { // คอยดูว่าเมื่อป๊อปอัปเป็นสถานะสำเร็จ จะให้รอสักแป๊บแล้วพากลับหน้าเดิม
        if (popup?.type === "success") { // ถ้าเป็นป๊อปอัปสำเร็จ
            const timer = setTimeout(() => { // ตั้งเวลาเล็กน้อย
                navigate("/caddy/booking", { // พากลับไปหน้า /caddy/booking
                    state: { completedSchedules: [...completed] }, // ส่งรายการงานที่ทำเสร็จไปด้วย
                });
            }, 2000); // หน่วงประมาณ 2 วินาที
            return () => clearTimeout(timer); // ถ้าหน้าเปลี่ยนก่อนครบเวลา ให้ล้างตัวจับเวลา
        }
    }, [popup, navigate, completed]); // ทำงานใหม่เมื่อสถานะป๊อปอัป, ฟังก์ชันเปลี่ยนหน้า, หรือรายการงาน เปลี่ยนไป

    const isCompleted = (date, time) => { // ฟังก์ชันช่วยเช็กว่าช่องในตารางควรเป็นเครื่องหมายถูกไหม
        return completed.some((item) => item.date === date && item.time === time); // ถ้ามีรายการที่วันที่และเวลาตรงกัน ถือว่าเสร็จแล้ว
    };

    const handleMenuClick = (menu) => { // จัดการคลิกเมนูโปรไฟล์
        if (menu === "โปรไฟล์") { // ถ้าเลือกโปรไฟล์
            navigate("/caddy/profile");
        } else if (menu === "ประวัติการทำงาน") { // ถ้าเลือกดูประวัติการทำงาน
            navigate('/caddy/history'); // พาไปหน้าประวัติการทำงาน
        } else if (menu === "ออกจากระบบ") { // ถ้าเลือกออกจากระบบ
            navigate('/landing'); // พาไปหน้าแลนดิ้ง (เหมือนล็อกเอาต์)
        }
        setIsMenuOpen(false); // ปิดเมนูหลังจากกดอะไรก็ตาม
    };

    return ( // ส่วนที่เอาไว้แสดงผลหน้าเว็บ (JSX)
        <div className="min-h-screen bg-gray-100 p-4 font-sans relative"> {/* กล่องใหญ่ของทั้งหน้า: สูงเต็มจอ พื้นเทาอ่อน ระยะขอบ และฟอนต์อ่านง่าย */}
            {/* Header: โลโก้, ชื่อคลับ, และปุ่มโปรไฟล์ */}
            <div className="flex justify-between items-center mb-6"> {/* แถวบนสุด จัดเรียงซ้าย-ขวา ตรงกลางแนวตั้ง ระยะห่างด้านล่าง */}
                <div className="flex-1 text-center space-y-2"> {/* พื้นที่ตรงกลาง: ยืดเต็ม จัดข้อความกลาง มีระยะห่างแนวตั้ง */}
                    <img src="/images/caddy/eden-Logo.png" alt="logo" className="mx-auto h-24" /> {/* โลโก้คลับกอล์ฟ กำหนดความสูงและจัดกลาง */}
                    <h1 className="text-[#324441] text-xl font-bold uppercase"> {/* ชื่อคลับ สีเขียวเข้ม ตัวหนา ตัวพิมพ์ใหญ่ */}
                        The Eden Golf Club {/* ชื่อคลับ */}
                    </h1> {/* จบหัวข้อ */}
                </div> {/* จบคอลัมน์กลาง */}

                <div className="relative z-10 self-start" ref={profileRef}> {/* กล่องปุ่มโปรไฟล์ อยู่ขวา วางซ้อนเหนือสิ่งอื่นนิดหน่อย และผูกอ้างอิงไว้ */}
                    <div
                        className="avatar avatar-online avatar-placeholder cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    > {/* เมื่อคลิกที่วงกลมนี้จะเปิด/ปิดเมนู */}
                        <div className="bg-[#324441] text-white w-12 h-12 rounded-full flex items-center justify-center"> {/* วงกลมพื้นเขียวเข้ม ขนาด 48x48 ตัวอักษรสีขาว จัดกลาง */}
                            <span className="text-lg">AI</span> {/* อักษรย่อในวงกลม */}
                        </div> {/* จบวงกลมโปรไฟล์ */}
                    </div> {/* จบตัวคลิกโปรไฟล์ */}

                    {isMenuOpen && ( // ถ้าเมนูถูกเปิด จะแสดงกล่องเมนูแบบลอย
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1"> {/* กล่องเมนู: วางชิดขวา กรอบโค้ง เงา */}
                            <a
                                href="#"
                                onClick={() => handleMenuClick("โปรไฟล์")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            > {/* ปุ่มเมนู: โปรไฟล์ */}
                                โปรไฟล์ {/* ข้อความเมนู */}
                            </a> {/* จบปุ่มเมนู */}
                            <a
                                href="#"
                                onClick={() => handleMenuClick("ประวัติการทำงาน")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            > {/* ปุ่มเมนู: ประวัติการทำงาน */}
                                ประวัติการทำงาน {/* ข้อความเมนู */}
                            </a> {/* จบปุ่มเมนู */}
                            <a
                                href="#"
                                onClick={() => handleMenuClick("ออกจากระบบ")}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            > {/* ปุ่มเมนู: ออกจากระบบ */}
                                ออกจากระบบ {/* ข้อความเมนู */}
                            </a> {/* จบปุ่มเมนู */}
                        </div> /* จบกล่องเมนูลอย */
                    )} {/* ปิดเงื่อนไขแสดงเมนู */}
                </div> {/* จบคอลัมน์ขวา (โปรไฟล์) */}
            </div> {/* จบแถวบนสุด */}

            {/* ส่วนเลือกวันที่ */}
            <div className="flex justify-center mb-6"> {/* กล่องปฏิทิน จัดกลาง มีระยะห่างด้านล่าง */}
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="d MMM ปี yyyy"
                    locale="th"
                    className="bg-[#324441] text-white rounded-full px-4 py-2 text-sm cursor-pointer text-center"
                /> {/* ปฏิทินให้ผู้ใช้เลือกวันที่: แสดงเป็นไทยและสไตล์ปุ่มกลม */}
            </div> {/* จบส่วนปฏิทิน */}

            {/* ส่วนเวลาออกรอบกอล์ฟ */}
            <div className="bg-[#3B6B5D] text-white text-center rounded-2xl shadow-lg py-6 px-6 mx-auto w-full max-w-sm space-y-4 mb-6">
 {/* กล่องสีพื้นเขียวเข้ม ข้อความขาว จัดกลาง โค้งและมีเงา */}
                <h2 className="text-base font-bold">เวลาออกรอบกอล์ฟ</h2> {/* หัวข้อของส่วนนี้ */}
                <div className="flex justify-center gap-6"> {/* กล่องปุ่มเวลาจัดเรียงกลาง ระยะห่างระหว่างปุ่ม */}
                    {hasWorkOnThisDate(selectedDate) ? ( // ถ้าวันนี้เป็นวันที่มีงาน
                        golfTimes.map((time) => ( // วนแสดงปุ่มตามเวลาที่มี
                            <button
                                key={time}
                                onClick={() => handleTimeClick(time)}
                                className={`rounded-full px-4 py-1 text-sm font-semibold transition-colors duration-200 ${
                                    selectedTime === time
                                        ? "bg-white text-[#324441] shadow-inner"
                                        : "border border-white text-white hover:bg-white hover:text-[#324441]"
                                }`}
                            > {/* ปุ่มเวลา: ถ้าเลือกอยู่ให้พื้นขาวตัวเขียว ไม่งั้นเป็นปุ่มขอบขาว */}
                                {time} {/* แสดงข้อความเวลา เช่น 06.00 */}
                            </button>
                        ))
                    ) : ( // ถ้าไม่ใช่วันทำงาน
                        <p className="text-gray-400 font-normal">ไม่มีรอบการทำงาน</p> // แจ้งว่าไม่มีรอบในวันนี้
                    )}
                </div> {/* จบส่วนปุ่มเวลา */}
            </div> {/* จบกล่องเวลาออกรอบ */}

            {/* ส่วนการทำงานรายสัปดาห์ */}
            <div className="bg-[#E3F1EB] mx-auto w-full max-w-sm rounded-2xl shadow-lg overflow-hidden mb-6">
 {/* กล่องตารางสีขาว ขอบโค้ง เงา กว้างพอดีตา */}
                <div className="bg-[#3B6B5D] text-white text-center rounded-2xl shadow-lg py-6 px-6 mx-auto w-full max-w-sm space-y-4 mb-6">
 {/* แถบหัวตารางสีเขียวเข้ม ตัวอักษรขาว */}
                    <h2 className="text-xl font-bold">การทำงานรายสัปดาห์</h2> {/* ชื่อหัวตาราง */}
                </div> {/* จบหัวตาราง */}
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
        <td className="p-2">
          {isCompleted(day.date, "06.00") ? (
            <span className="text-green-600 text-2xl font-bold">✓</span>
          ) : "-"}
        </td>
        <td className="p-2">
          {isCompleted(day.date, "17.00") ? (
            <span className="text-green-600 text-2xl font-bold">✓</span>
          ) : "-"}
        </td>
      </tr>
    ))}
  </tbody>
</table>

            </div> {/* จบกล่องตารางรายสัปดาห์ */}

            {/* Popup แบบ confirm และแบบอื่น ๆ รวมไว้ด้วยกัน */}
            {/* Popup แสดงผลรวมทุกกรณี */}
            {popup && ( // ถ้า popup ไม่เป็น null แสดงกล่องทับหน้าจอ
              <div className="fixed inset-0 flex items-center justify-center z-50"> {/* ฉากป๊อปอัป: วางบนสุดและกลางจอ */}
                <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-black text-center w-[70%] max-w-xs space-y-4"> {/* กล่องป๊อปอัปสีขาว โค้งใหญ่ ขอบดำบาง ๆ */}
                  
                  {/* Confirm */}
                  {popup.type === "confirm" && ( // กรณีถามยืนยันก่อนเริ่มงาน
                    <>
                      <FontAwesomeIcon
                        icon={faExclamation}
                        className="text-yellow-400 text-5xl mx-auto"
                      /> {/* ไอคอนเครื่องหมายตกใจสีเหลือง */}
                      <h3 className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่?</h3> {/* ข้อความถามยืนยัน */}
                      <div className="flex justify-center gap-4"> {/* ปุ่ม ยืนยัน/ยกเลิก วางข้างกัน */}
                        <button
                          onClick={handleConfirm}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                        > {/* ปุ่มตกลง: สีเขียว */}
                          ตกลง
                        </button>
                        <button
                          onClick={closePopup}
                          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                        > {/* ปุ่มยกเลิก: สีแดง */}
                          ยกเลิก
                        </button>
                      </div>
                    </>
                  )}

                  {/* Not Time */}
                  {popup.type === "notTime" && ( // กรณียังไม่ถึงเวลาเริ่มงาน
                    <>
                      <FontAwesomeIcon
                        icon={faExclamation}
                        className="text-red-500 text-5xl mx-auto"
                      /> {/* ไอคอนเครื่องหมายตกใจสีแดง */}
                      <h3 className="text-lg font-semibold mb-4">ยังไม่ถึงเวลาเริ่มงาน</h3> {/* ข้อความแจ้ง */}
                      <button
                        onClick={closePopup}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                      > {/* ปุ่มปิดป๊อปอัป */}
                        ตกลง
                      </button>
                    </>
                  )}

                  {/* Success */}
                  {popup.type === "success" && ( // กรณีเริ่มงานสำเร็จ
                    <>
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-green-500 text-5xl mx-auto"
                      /> {/* ไอคอนวงกลมติ๊กถูกสีเขียว */}
                      <h2 className="text-3xl font-extrabold">สำเร็จ!</h2> {/* หัวข้อใหญ่บอกว่าสำเร็จ */}
                      <h3 className="text-base font-normal text-gray-800">
                        {`เริ่มงาน${popup.title} สำเร็จ`} {/* แจ้งเวลาอะไรที่เริ่มงานสำเร็จ */}
                      </h3>
                      <button
                        disabled={clicked}
                        onClick={() => {
                          if (clicked) return; // กันกดซ้ำ
                          setClicked(true); // ตั้งสถานะว่ากดแล้ว
                          navigate("/caddy/booking", { // พากลับไปหน้าเดิม
                            state: { completedSchedules: [...completed] }, // ส่งข้อมูลรายการงานที่ทำแล้วไปด้วย
                          });
                        }}
                        className={`mt-4 px-6 py-2 rounded-full text-white ${
                          clicked
                            ? "bg-gray-400 cursor-not-allowed" // ถ้ากำลังกดอยู่ให้ปุ่มเป็นเทา และกดไม่ได้
                            : "bg-green-500 hover:bg-green-600" // ปกติเป็นปุ่มเขียว กดแล้วเขียวเข้มขึ้น
                        }`}
                      > {/* ปุ่มกลับหน้าเดิม */}
                        {clicked ? "กำลังเปลี่ยนหน้า..." : "ตกลง"} {/* เปลี่ยนข้อความตามสถานะกด */}
                      </button>
                    </>
                  )}
                  

                </div> {/* จบกล่องป๊อปอัป */}
              </div>
            )} {/* จบเงื่อนไขการแสดงป๊อปอัป */}

        </div>
    ); // จบส่วนแสดงผลของคอมโพเนนต์
}; // จบคอมโพเนนต์ BookingPage

export default BookingPage; // ส่งออกคอมโพเนนต์ให้ไฟล์อื่นนำไปใช้ได้
