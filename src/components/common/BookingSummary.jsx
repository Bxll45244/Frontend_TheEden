import React from 'react';

/**
 * Component สำหรับ Step 5: สรุปการจอง
 * @param {object} props - Properties ของ Component
 * @param {object} props.bookingData - ข้อมูลการจองทั้งหมด
 * @param {object} props.pricing - Object ราคาสำหรับบริการต่างๆ
 * @param {object} props.userInfo - ข้อมูลผู้ใช้ (ชื่อ, ID, ที่อยู่, เบอร์โทร, อีเมล)
 */
const BookingSummary = ({ bookingData, pricing, userInfo }) => {
  // ตรวจสอบว่าเป็นวันหยุด (เสาร์/อาทิตย์) หรือไม่ สำหรับแสดงในสรุป
  const selectedDateSummary = bookingData.date ? new Date(bookingData.date) : null;
  const isHolidaySummary = selectedDateSummary ? (selectedDateSummary.getDay() === 0 || selectedDateSummary.getDay() === 6) : false;

  const basePricePerPlayerSummary = (bookingData.courseType && pricing[bookingData.courseType] && bookingData.players > 0)
    ? (isHolidaySummary ? pricing[bookingData.courseType].holiday : pricing[bookingData.courseType].weekday)
    : 0;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 text-center">สรุปการจอง</h3>

      {/* User Info */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-2 text-gray-700">
        <p className="text-lg font-bold text-center mb-4">{userInfo.name}</p>
        <p>ID : {userInfo.bookingId}</p>
        <p>{userInfo.address}</p>
        <p>เบอร์โทรศัพท์ {userInfo.phone}</p>
        <p>อีเมล {userInfo.email}</p>
      </div>

      {/* Booking Details */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-2 text-gray-700">
        <p className="text-center text-lg font-semibold mb-2">ประเภทการจอง : {bookingData.courseType} หลุม</p>
        <p className="text-center text-lg font-semibold mb-4">กลุ่ม {bookingData.groupName || '-'}</p>
        <div className="flex justify-between text-sm">
          <p>วันออกรอบ {bookingData.date ? new Date(bookingData.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
          <p>วันที่จอง {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <p className="text-center text-lg font-semibold mt-4">เวลาเริ่มต้น {bookingData.timeSlot}</p>
      </div>

      {/* Total Price Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <p className="text-2xl font-bold text-gray-900 mb-4">ยอดรวมทั้งหมด {bookingData.totalPrice.toLocaleString()} บาท</p>

        {/* Service Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">บริการ</th>
                <th className="py-3 px-6 text-center">จำนวน</th>
                <th className="py-3 px-6 text-right">ราคา/คน/หน่วย</th>
                <th className="py-3 px-6 text-right">ราคารวม</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {/* บริการ Green Free */}
              {bookingData.players > 0 && (
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">บริการ Green Free</td>
                  <td className="py-3 px-6 text-center">{bookingData.players} คน</td>
                  <td className="py-3 px-6 text-right">{basePricePerPlayerSummary.toLocaleString()} บาท</td>
                  <td className="py-3 px-6 text-right">{(basePricePerPlayerSummary * bookingData.players).toLocaleString()} บาท</td>
                </tr>
              )}
              {/* บริการแคดดี้ */}
              {bookingData.caddyQty > 0 && (
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">บริการแคดดี้</td>
                  <td className="py-3 px-6 text-center">{bookingData.caddyQty} คน</td>
                  <td className="py-3 px-6 text-right">{pricing.caddy.toLocaleString()} บาท</td>
                  <td className="py-3 px-6 text-right">{(bookingData.caddyQty * pricing.caddy).toLocaleString()} บาท</td>
                </tr>
              )}
              {/* รถกอล์ฟ */}
              {bookingData.golfCartQty > 0 && (
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">รถกอล์ฟ</td>
                  <td className="py-3 px-6 text-center">{bookingData.golfCartQty} คัน</td>
                  <td className="py-3 px-6 text-right">{pricing.golfCart.toLocaleString()} บาท</td>
                  <td className="py-3 px-6 text-right">{(bookingData.golfCartQty * pricing.golfCart).toLocaleString()} บาท</td>
                </tr>
              )}
              {/* ถุงกอล์ฟ */}
              {bookingData.golfBagQty > 0 && (
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">ถุงกอล์ฟ</td>
                  <td className="py-3 px-6 text-center">{bookingData.golfBagQty} ใบ</td>
                  <td className="py-3 px-6 text-right">{pricing.golfBag.toLocaleString()} บาท</td>
                  <td className="py-3 px-6 text-right">{(bookingData.golfBagQty * pricing.golfBag).toLocaleString()} บาท</td>
                </tr>
              )}
              {/* ค่าบริการรวมทั้งหมด */}
              <tr className="bg-gray-50 font-bold">
                <td className="py-3 px-6 text-right" colSpan="3">ค่าบริการรวมทั้งหมด</td>
                <td className="py-3 px-6 text-right">{bookingData.totalPrice.toLocaleString()} บาท</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white p-6 rounded-xl shadow-md text-sm text-gray-600 leading-relaxed">
        <h4 className="font-semibold text-gray-800 mb-2">ข้อกำหนดและเงื่อนไข</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>โปรดแสดงใบยืนยันการจองนี้เมื่อเข้าใช้บริการ</li>
          <li>ในกรณีที่ไม่มาใช้บริการตามเวลาที่กำหนด ระบบจะดำเนินการเลื่อนการจองไปยังช่วงเวลาที่ใกล้เคียงมากที่สุดที่ว่างไม่ว่าระบบจะยกเลิกการจองของคุณ</li>
          {/* เพิ่มข้อกำหนดและเงื่อนไขอื่นๆ ได้ที่นี่ */}
        </ol>
      </div>
    </div>
  );
};

export default BookingSummary;