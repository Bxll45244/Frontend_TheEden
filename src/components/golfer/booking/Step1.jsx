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

  const dailyPrice = courseType === "18" ? 2200 : 1500;
  const holidayPrice = courseType === "18" ? 4000 : 2500;
  const isNextDisabled = !date || !timeSlot || !courseType;

  useEffect(() => {
    // ไม่มีวันที่หรือยังไม่เลือกจำนวนหลุม -> ล้าง state ทันที
    if (!date || !courseType) {
      setReservedTimeSlots([]);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoadingReserved(true);
      try {
        let reserved = [];

        // 1) ถ้า service มีเมธอดเฉพาะ ให้ใช้ก่อน
        if (typeof BookingService.getAvailableTimeSlots === "function") {
          const res = await BookingService.getAvailableTimeSlots({ date, courseType });
          reserved = res?.data?.reservedTimeSlots ?? res?.reservedTimeSlots ?? [];
        }
        // 2) ชื่ออื่นที่ทีมอาจตั้งไว้
        else if (typeof BookingService.availableTimeSlots === "function") {
          const res = await BookingService.availableTimeSlots({ date, courseType });
          reserved = res?.data?.reservedTimeSlots ?? res?.reservedTimeSlots ?? [];
        }
        // 3) fallback: ดึงทั้งวันแล้วคัดเอง (เผื่อของเดิม)
        else if (typeof BookingService.getTodayBookings === "function") {
          const res = await BookingService.getTodayBookings(date);
          const list = res?.data?.bookings || res?.bookings || [];
          // ล็อกเฉพาะที่ชนประเภทหลุมเดียวกันและมี timeSlot
          reserved = list
            .filter(b => String(b.courseType) === String(courseType))
            .filter(b => !!b.timeSlot)
            .map(b => b.timeSlot);
        }

        if (cancelled) return;
        setReservedTimeSlots(Array.from(new Set(reserved)));

        // ถ้าเวลาที่เลือกไว้ไปทับช่องที่ถูกจอง ให้เคลียร์ทิ้งเพื่อกันหลุด
        if (reserved.includes(timeSlot)) {
          handleChange({ target: { name: "timeSlot", value: "" } });
        }
      } catch (err) {
        if (!cancelled) setReservedTimeSlots([]);
        console.error("fetch available-timeslots error:", err?.response?.data || err?.message);
      } finally {
        if (!cancelled) setIsLoadingReserved(false);
      }
    })();

    return () => { cancelled = true; };
  }, [date, courseType]); // ← เปลี่ยนวันที่/หลุม ค่อยยิงใหม่

  return (
    <div
      className="
        max-w-md mx-auto p-6
        rounded-3xl
        bg-white/60 backdrop-blur-lg
        border border-neutral-200/40 ring-1 ring-white/30 shadow-md
      "
    >
      <h2 className="text-[22px] font-th text-neutral-900 text-center tracking-tight mb-6">
        Step 1: เลือกเวลาและจำนวนหลุม
      </h2>

      <div className="mb-6">
        <label className="block text-neutral-700 text-sm font-th mb-2">วันที่จอง</label>
        <input
          type="date"
          name="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => handleChange({ target: { name: "date", value: e.target.value } })}
          className="
            w-full px-4 py-2 rounded-2xl
            bg-white/80
            border border-neutral-200
            text-neutral-800
            shadow-sm
            outline-none
            focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600
            transition
          "
        />
      </div>

      <div className="mb-6 flex justify-center gap-3">
        {["9", "18"].map((ct) => (
          <button
            key={ct}
            type="button"
            onClick={() => handleChange({ target: { name: "courseType", value: ct } })}
            className={[
              "px-4 py-2 rounded-full font-th text-sm",
              "transition-all",
              courseType === ct
                ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
            ].join(" ")}
          >
            {ct} หลุม
          </button>
        ))}
      </div>

      <h3 className="text-center font-th text-neutral-700 mb-3">เวลาที่สามารถจองได้</h3>
      {isLoadingReserved && (
        <div className="text-center text-neutral-500 mb-4">กำลังโหลดเวลาที่ว่าง…</div>
      )}

      <div className="grid grid-cols-4 gap-2 mb-6">
        {availableTimeSlots.map((t) => {
          const isReserved = reservedTimeSlots.includes(t);
          const isSelected = timeSlot === t;
          return (
            <button
              key={t}
              type="button"
              disabled={isReserved || isLoadingReserved}
              onClick={() =>
                !isReserved && handleChange({ target: { name: "timeSlot", value: t } })
              }
              className={[
                "px-3 py-1 text-[13px] rounded-full font-th",
                "transition-all",
                isReserved
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  : isSelected
                  ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                  : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="text-center text-neutral-700 mb-6">
        <h3 className="font-th mb-1">อัตราการให้บริการ Eden Golf Club</h3>
        <p className="text-sm text-neutral-600">วันธรรมดา: {dailyPrice} บาท ต่อท่าน</p>
        <p className="text-sm text-neutral-600">วันหยุด/นักขัตฤกษ์: {holidayPrice} บาท ต่อท่าน</p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={[
            "px-6 py-2 rounded-full font-th",
            "transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isNextDisabled
              ? "bg-neutral-300 text-neutral-500"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          ].join(" ")}
        >
          จองต่อ
        </button>
      </div>
    </div>
  );
}
