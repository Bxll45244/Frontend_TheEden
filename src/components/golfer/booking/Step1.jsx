import React, { useEffect, useState } from "react";
import BookingService from "../../../service/bookingService";

export default function Step1({ bookingData, handleChange, onNext }) {
  const { courseType, date, timeSlot } = bookingData;

  const [reservedTimeSlots, setReservedTimeSlots] = useState([]);
  const [isLoadingReserved, setIsLoadingReserved] = useState(false);

  const availableTimeSlots18 = [
    "06:00","06:15","06:30","06:45","07:00","07:15","07:30","07:45",
    "08:00","08:15","08:30","08:45","09:00","09:15","09:30","09:45",
    "10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45","12:00"
  ];
  const availableTimeSlots9 = [
    "12:15","12:30","12:45","13:00","13:15","13:30","13:45",
    "14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45",
    "16:00","16:15","16:30","16:45","17:00"
  ];
  const availableTimeSlots = courseType === "18" ? availableTimeSlots18 : availableTimeSlots9;

  const dailyPrice   = courseType === "18" ? 2200 : 1500;
  const holidayPrice = courseType === "18" ? 4000 : 2500;
  const isNextDisabled = !date || !timeSlot || !courseType;

  useEffect(() => {
    if (!date) return;
    let alive = true;

    (async () => {
      setIsLoadingReserved(true);
      try {
        const resp = await BookingService.getTodayBookings(date);

        // กันคิวเฉพาะ: ชำระเงินแล้ว หรือสถานะเข้ากลุ่มยืนยันแล้ว
        const CONFIRMED_STATUSES = ["booked", "confirmed", "paid"];
        const slots = (resp?.bookings || [])
          .filter(b => String(b.courseType) === String(courseType))
          .filter(b => Boolean(b.timeSlot))
          .filter(b => b.isPaid === true || CONFIRMED_STATUSES.includes(String(b.status || "").toLowerCase()))
          .map(b => b.timeSlot);

        if (alive) setReservedTimeSlots(slots);
      } catch {
        if (alive) setReservedTimeSlots([]);
      } finally {
        if (alive) setIsLoadingReserved(false);
      }
    })();

    return () => { alive = false; };
  }, [date, courseType]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-mono mb-6 text-center text-gray-800">
        Step 1: เลือกเวลาและจำนวนหลุม
      </h2>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">วันที่จอง:</label>
        <input
          type="date"
          name="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => handleChange({ target: { name: "date", value: e.target.value } })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
        />
      </div>

      <div className="mb-6 flex justify-center gap-4">
        {["9","18"].map(ct => (
          <button
            key={ct}
            type="button"
            className={`px-5 py-2 rounded-lg font-semibold ${courseType === ct ? "bg-green-700 text-white shadow-lg" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
            onClick={() => handleChange({ target: { name: "courseType", value: ct } })}
          >
            {ct} หลุม
          </button>
        ))}
      </div>

      <h3 className="text-center font-semibold text-gray-700 mb-3">เวลาที่สามารถจองได้</h3>
      {isLoadingReserved && <div className="text-center text-gray-500 mb-4">กำลังโหลดเวลาที่ว่าง...</div>}

      <div className="grid grid-cols-4 gap-2 mb-6">
        {availableTimeSlots.map((t) => {
          const isReserved = reservedTimeSlots.includes(t);
          const isSelected = timeSlot === t;
          return (
            <button
              key={t}
              type="button"
              className={`px-3 py-1 text-sm rounded-full font-medium ${
                isReserved
                  ? "bg-red-500 text-white cursor-not-allowed"
                  : isSelected
                  ? "bg-green-700 text-white shadow-lg"
                  : "bg-gray-200 text-gray-800 hover:bg-green-200"
              }`}
              onClick={() => !isReserved && handleChange({ target: { name: "timeSlot", value: t } })}
              disabled={isReserved || isLoadingReserved}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="text-center text-gray-700 mb-6">
        <h3 className="font-bold mb-2">อัตราการให้บริการ Eden Golf Club</h3>
        <p>วันธรรมดา: {dailyPrice} บาท ต่อท่าน</p>
        <p>วันหยุด/นักขัตฤกษ์: {holidayPrice} บาท ต่อท่าน</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`px-6 py-2 rounded-full font-bold ${
            isNextDisabled ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-gray-800 text-white hover:bg-gray-700 shadow-lg"
          }`}
        >
          จองต่อ
        </button>
      </div>
    </div>
  );
}
