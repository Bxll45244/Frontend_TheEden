import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

// ในหน้านี้ เราไม่ต้องใช้ useState, useEffect, useRef, หรือ useNavigate
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import th from 'date-fns/locale/th';

// ลงทะเบียนการแสดงผลภาษาไทยสำหรับ DatePicker
registerLocale('th', th);

// ประกาศ React Functional Component ชื่อ LandingPage
const LandingPage = () => {
    // กำหนดตัวแปร selectedDate ให้มีค่าเป็นวันที่ปัจจุบัน
    // เนื่องจากหน้านี้ไม่ได้ให้ผู้ใช้เลือกวัน ตัวแปรนี้จึงมีค่าคงที่
    const selectedDate = new Date();

    return (
        // div หลักที่ครอบหน้าจอทั้งหมด กำหนดสไตล์พื้นฐานด้วย Tailwind CSS
        <div className="min-h-screen bg-white p-4 font-sans relative">
            {/* ส่วนหัวของหน้า (Header) ใช้ Flexbox จัดวางองค์ประกอบให้ชิดซ้าย-ขวา */}
            <div className="flex justify-between items-start mb-4">
                {/* โลโก้และชื่อคลับ ถูกจัดให้อยู่ตรงกลางของพื้นที่นี้ */}
                <div className="flex-1 text-center space-y-2">
                    {/* รูปภาพโลโก้ ที่ถูกจัดให้อยู่ตรงกลางด้วย mx-auto */}
                    <img src="/images/caddy/eden-Logo.png" alt="logo" className="mx-auto h-24" />
                    {/* ชื่อคลับ */}
                    <h1 className="text-black text-lg font-bold uppercase">
                        The Eden Golf Club
                    </h1>
                </div>
                
                {/* ปุ่ม "เข้าสู่ระบบ" อยู่ชิดขวาของ header */}
                <button className="bg-[#324441] text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-opacity-90">
                    เข้าสู่ระบบ
                </button>
            </div>

            {/* ส่วนแสดงวันที่ปัจจุบัน ใช้ DatePicker component */}
            <div className="flex justify-center mb-6">
                <DatePicker
                    selected={selectedDate} // กำหนดให้วันที่ที่แสดงคือวันที่ปัจจุบัน
                    onChange={() => {}} // ปิดการใช้งาน onChange เพราะหน้านี้ไม่ให้ผู้ใช้เปลี่ยนวัน
                    dateFormat="d MMM ปี yyyy" // รูปแบบการแสดงผลวันที่เป็นภาษาไทย
                    locale="th" // กำหนดให้ใช้ภาษาไทย
                    className="bg-[#3B6B5D] text-white rounded-full px-4 py-1 text-sm cursor-pointer text-center"
                    disabled // ปิดการใช้งาน DatePicker ไม่ให้กดเลือกวันได้
                />
            </div>
            
            {/* ส่วนแสดงเวลาออกรอบกอล์ฟ ที่ใช้เครื่องหมาย "-" เป็นข้อมูล Placeholder */}
            <div className="bg-[#3B6B5D] text-white text-center rounded-2xl py-4 px-6 mx-auto w-[85%] space-y-2 mb-6">
                <h2 className="text-base font-bold">เวลาออกรอบกอล์ฟ</h2>
                <div className="flex justify-center gap-6">
                    <p className="text-gray-400">-</p>
                </div>
            </div>

            {/* ส่วนตารางการทำงานรายสัปดาห์ */}
            <div className="bg-white mx-auto w-[90%] rounded-2xl shadow-md overflow-hidden mb-6">
                {/* ส่วนหัวของตาราง */}
                <div className="bg-[#3B6B5D] text-white text-center py-3">
                    <h2 className="text-lg font-bold">การทำงานรายสัปดาห์</h2>
                </div>
                {/* ตารางแสดงข้อมูล */}
                <table className="w-full text-center text-sm">
                    {/* หัวข้อของตาราง */}
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">วันที่</th>
                            <th className="p-2">รอบเช้า</th>
                            <th className="p-2">รอบบ่าย</th>
                        </tr>
                    </thead>
                    {/* เนื้อหาในตาราง ซึ่งในที่นี้มีแค่แถวเดียวและแสดงเครื่องหมาย "-" */}
                    <tbody>
                        <tr className="border-t">
                            <td className="p-2">-</td>
                            <td className="p-2">-</td>
                            <td className="p-2">-</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ข้อความแจ้งเตือนให้ผู้ใช้เข้าสู่ระบบ */}
            <div className="flex justify-center mt-6 mb-6">
                <h3 className="text-red-500 font-bold text-lg md:text-xl text-center">
                    *กรุณาเข้าสู่ระบบ
                </h3>
            </div>
        </div>
    );
};

export default LandingPage; // ส่งออก component LandingPage เพื่อให้ไฟล์อื่นสามารถนำไปใช้งานได้