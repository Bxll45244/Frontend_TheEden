import React from "react";
import LoadingAnimation from "../animations/LoadingAnimation";
import { calculateTotalPriceDetailed } from '../../service/bookingService';

const Step4 = ({ bookingData, onPrev, onSubmit, isLoading }) => {
  const { greenFee, caddyFee, cartFee, bagFee, total } = calculateTotalPriceDetailed(bookingData);
  const { courseType, date, timeSlot, players, groupName, caddy, golfCartQty, golfBagQty } = bookingData;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Step 4: สรุปและยืนยัน</h2>

      <div className="text-gray-700 space-y-2 mb-6">
        <p><strong>ประเภทคอร์ส:</strong> {courseType} หลุม</p>
        <p><strong>วันที่:</strong> {date}</p>
        <p><strong>เวลา:</strong> {timeSlot}</p>
        <p><strong>จำนวนผู้เล่น:</strong> {players} คน</p>
        <p><strong>ชื่อกลุ่ม:</strong> {groupName || "-"}</p>
        <p><strong>แคดดี้:</strong> {caddy.length > 0 ? `${caddy.length} คน (${caddy.join(", ")})` : "-"}</p>
        <p><strong>รถกอล์ฟ:</strong> {golfCartQty} คัน</p>
        <p><strong>ถุงกอล์ฟ:</strong> {golfBagQty} ถุง</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">รายละเอียดค่าใช้จ่าย</h3>
        <ul className="text-gray-700 space-y-1">
          <li>• Green Fee: {greenFee.toLocaleString()} บาท</li>
          <li>• Caddy: {caddyFee.toLocaleString()} บาท</li>
          <li>• Cart: {cartFee.toLocaleString()} บาท</li>
          <li>• Golf Bag: {bagFee.toLocaleString()} บาท</li>
        </ul>
        <hr className="my-3" />
        <h3 className="text-xl font-bold text-gray-900">รวมทั้งหมด: {total.toLocaleString()} บาท</h3>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onPrev} disabled={isLoading} className="bg-gray-600 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700 disabled:opacity-50">ย้อนกลับ</button>
        <button onClick={onSubmit} disabled={isLoading} className={`bg-green-600 text-white px-6 py-2 rounded-full font-bold ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}>
          {isLoading ? <LoadingAnimation /> : 'ยืนยันการจอง'}
        </button>
      </div>
    </div>
  );
};

export default Step4;
