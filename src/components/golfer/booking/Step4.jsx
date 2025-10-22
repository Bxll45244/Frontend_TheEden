import React, { useState } from "react";
import LoadingAnimation from "../animations/LoadingAnimation";
import { createBooking } from "../../../service/golfer/bookingService";
import { calculatePriceBreakdown } from "../../../service/golfer/calculatePrice";

// แปลง Date เป็น "YYYY-MM-DD" ให้ backend parse เป็น Date ได้เสถียร
function formatDate(dateInput) {
  const d = new Date(dateInput);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Step4({ bookingData, onPrev, onSubmit, isLoading: isLoadingFromParent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ป้องกัน key ชื่อไม่ตรงด้วยการ normalize ให้ฟังก์ชันคำนวณราคาเข้าใจ
  const priceInput = {
    courseType: bookingData?.courseType,
    players: bookingData?.players,
    caddies: Array.isArray(bookingData?.caddy) ? bookingData.caddy : [],
    cartCount: Number(bookingData?.golfCartQty ?? 0),
    bagCount: Number(bookingData?.golfBagQty ?? 0),
    date: bookingData?.date,
  };

  // ดึง breakdown แบบเซฟค่าเริ่มต้นกัน undefined
  const {
    greenFee = 0,
    caddyFee = 0,
    cartFee = 0,
    bagFee = 0,
    total = 0,
  } = calculatePriceBreakdown(priceInput);

  const {
    courseType = "-",
    date,
    timeSlot = "-",
    players = 0,
    groupName = "",
    caddy = [],
    golfCartQty = 0,
    golfBagQty = 0,
  } = bookingData || {};

  async function handleProceedToPayment() {
    try {
      setIsLoading(true);
      setError("");

      // payload ต้อง “ตรงกับ backend”
      const payload = {
        courseType,
        date: formatDate(date),
        timeSlot,
        players,
        groupName,
        caddy,                   // backend รองรับ array ของ caddy id
        totalPrice: total,       // ส่งยอดรวมที่คำนวณแล้ว
        golfCar: golfCartQty || 0,
        golfBag: golfBagQty || 0,
      };

      if (typeof onSubmit === "function") {
      await onSubmit(payload);       // เรียกของพาเรนต์
      return;
    }

      // service เดิมคืนค่าแบบ Axios response => ต้องอ่านจาก .data
      const result = await createBooking(payload);
      const data = result?.data;

      // backend ฝั่งคุณจะส่ง { success, booking, paymentUrl } (จาก createCheckoutFromDetails)
      const paymentUrl = data?.paymentUrl || data?.url; // กันเคสชื่อ field ต่างกัน
      if (paymentUrl) {
        // เก็บ booking เผื่อใช้แสดงผลบนหน้าถัดไป
        if (data?.booking) {
          sessionStorage.setItem("bookingResult", JSON.stringify(data.booking));
        }
        // ไป Stripe เลย
        window.location.assign(paymentUrl);
        return;
      }

      // ถ้าไม่มี paymentUrl ให้โยน error เพื่อแจ้งผู้ใช้
      throw new Error(data?.message || "ไม่พบลิงก์ชำระเงินจากเซิร์ฟเวอร์");
    } catch (err) {
      setError(err?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  }

  const disabled = isLoading || isLoadingFromParent;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Step 4: สรุปและตรวจสอบ
      </h2>

      <div className="text-gray-700 space-y-2 mb-6">
        <p><strong>ประเภทคอร์ส:</strong> {courseType} หลุม</p>
        <p><strong>วันที่:</strong> {date ? new Date(date).toLocaleDateString("th-TH") : "-"}</p>
        <p><strong>เวลา:</strong> {timeSlot}</p>
        <p><strong>จำนวนผู้เล่น:</strong> {players} คน</p>
        <p><strong>ชื่อกลุ่ม:</strong> {groupName || "-"}</p>
        <p>
          <strong>แคดดี้:</strong>{" "}
          {Array.isArray(caddy) && caddy.length > 0
            ? `${caddy.length} คน (${caddy.join(", ")})`
            : "-"}
        </p>
        <p><strong>รถกอล์ฟ:</strong> {golfCartQty} คัน</p>
        <p><strong>ถุงกอล์ฟ:</strong> {golfBagQty} ถุง</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">รายละเอียดค่าใช้จ่าย</h3>
        <ul className="text-gray-700 space-y-1">
          <li>• Green Fee: {Number(greenFee).toLocaleString()} บาท</li>
          <li>• Caddy: {Number(caddyFee).toLocaleString()} บาท</li>
          <li>• Cart: {Number(cartFee).toLocaleString()} บาท</li>
          <li>• Golf Bag: {Number(bagFee).toLocaleString()} บาท</li>
        </ul>
        <hr className="my-3" />
        <h3 className="text-xl font-bold text-gray-900">
          รวมทั้งหมด: {Number(total).toLocaleString()} บาท
        </h3>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-sm text-red-800">
            <strong>❌ เกิดข้อผิดพลาด:</strong> {error}
          </p>
        </div>
      )}

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ หมายเหตุ:</strong> กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการชำระเงิน
        </p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          disabled={disabled}
          className="bg-gray-600 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          ย้อนกลับ
        </button>
        <button
          onClick={handleProceedToPayment}
          disabled={disabled}
          className={`bg-blue-600 text-white px-6 py-2 rounded-full font-bold ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          } transition-colors flex items-center gap-2`}
        >
          {disabled ? (
            <>
              <LoadingAnimation />
              <span>กำลังประมวลผล...</span>
            </>
          ) : (
            <>ดำเนินการชำระเงิน</>
          )}
        </button>
      </div>
    </div>
  );
}
