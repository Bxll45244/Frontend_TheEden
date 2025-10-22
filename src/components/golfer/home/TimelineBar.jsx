import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaLock } from "react-icons/fa";
import bookingService from "../../../service/bookingService";


// TimelineBar — แสดงช่วงเวลาที่ถูกจองแล้วในวันนั้น
// ดึงข้อมูลจาก backend ผ่าน bookingService.getBookingToday(date)


// เวลาจบโดยประมาณ (ชั่วโมง)
const HOLE_DURATION_HOURS = Object.freeze({ 9: 2.5, 18: 4.5 });
// สถานะที่ถือว่า "ล็อกคิว" แล้ว
const LOCKED_STATUSES = Object.freeze(["booked", "confirmed", "paid"]);

// คำนวณเวลาเสร็จโดยประมาณ
function calculateEstimatedFinishTime(startTimeString, holesCount) {
  const isValid = /^\d{2}:\d{2}$/.test(startTimeString);
  if (!isValid) return "--:--";
  const [hour, minute] = startTimeString.split(":").map(Number);
  const addMinutes = Math.round((HOLE_DURATION_HOURS[holesCount] ?? 4.5) * 60);
  const endDate = new Date(2000, 0, 1, hour, minute + addMinutes);
  return `${String(endDate.getHours()).padStart(2, "0")}:${String(
    endDate.getMinutes()
  ).padStart(2, "0")}`;
}

// แยกข้อมูล booking จาก response ที่อาจมาในหลายรูปแบบ
function extractBookingsFromResponse(responseOrData) {
  const payload = responseOrData?.data ?? responseOrData;
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.bookings)) return payload.bookings;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
}

// เช็คว่า booking นั้น “ล็อกคิว” หรือไม่
function isLockedBooking(booking) {
  const status = String(booking?.status || "").toLowerCase();
  return booking?.isPaid || LOCKED_STATUSES.includes(status);
}

export default function TimelineBar({
  date = new Date().toISOString().split("T")[0],
  courseType = "18",
  className = "",
}) {
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // แปลง courseType ให้แน่ใจว่าเป็น 9 หรือ 18
  const holesCount = useMemo(
    () => (Number(courseType) === 9 ? 9 : 18),
    [courseType]
  );

  // โหลดข้อมูลเวลาที่ถูกจองแล้ว
  const loadLockedTimeSlots = useCallback(
    async (abortSignal) => {
      if (typeof bookingService?.getBookingToday !== "function") {
        setBookedTimeSlots([]);
        setErrorMessage("ไม่พบ service getBookingToday");
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const resp = await bookingService.getBookingToday(date);
        if (abortSignal.aborted) return;
        const allBookings = extractBookingsFromResponse(resp);

        const locked = allBookings
          .filter((b) => String(b.courseType) === String(courseType))
          .filter(isLockedBooking)
          .map((b) => b.timeSlot)
          .filter(Boolean);

        setBookedTimeSlots(locked);
      } catch (err) {
        if (!abortSignal.aborted) {
          setBookedTimeSlots([]);
          setErrorMessage(err?.message || "โหลดข้อมูลไม่สำเร็จ");
        }
      } finally {
        if (!abortSignal.aborted) setIsLoading(false);
      }
    },
    [date, courseType]
  );

  useEffect(() => {
    const ac = new AbortController();
    loadLockedTimeSlots(ac.signal);
    return () => ac.abort();
  }, [loadLockedTimeSlots]);

  // แสดงผล
  return (
    <div
      className={[
        "absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 z-20",
        className,
      ].join(" ")}
    >
      <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 p-6 md:p-8">
        <section className="text-center md:text-left">
          <h3 className="text-xl font-bold text-gray-800">เวลาที่ถูกจองแล้ว</h3>
          <p className="text-sm text-gray-500 mt-1">
            แสดงเฉพาะเวลาที่ไม่ว่าง ({holesCount} หลุม)
          </p>
          {date && <p className="text-xs text-gray-400 mt-1">วันที่: {date}</p>}
        </section>

        <section className="flex flex-wrap justify-center md:justify-end gap-3 mt-4 md:mt-0 min-h-[40px] w-full md:w-auto">
          {isLoading && <span className="text-gray-400">กำลังโหลด...</span>}
          {!isLoading && errorMessage && (
            <span className="text-red-500 text-sm">{errorMessage}</span>
          )}
          {!isLoading && !errorMessage && bookedTimeSlots.length === 0 && (
            <span className="text-gray-400">ยังไม่มีการจอง</span>
          )}
          {!isLoading &&
            !errorMessage &&
            bookedTimeSlots.map((timeSlot, i) => (
              <TimeSlotPill
                key={`${timeSlot}-${i}`}
                timeSlot={timeSlot}
                estimatedFinishTime={calculateEstimatedFinishTime(
                  timeSlot,
                  holesCount
                )}
              />
            ))}
        </section>
      </div>
    </div>
  );
}

// เม็ดยาแสดงเวลาที่จองแล้ว
function TimeSlotPill({ timeSlot, estimatedFinishTime }) {
  return (
    <div
      className="flex flex-col items-center px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-200 cursor-not-allowed min-w-[120px]"
      title={`เวลา ${timeSlot} (จบประมาณ ${estimatedFinishTime} น.)`}
    >
      <div className="flex items-center gap-2">
        <FaLock className="w-4 h-4" />
        <span className="text-sm font-medium">{timeSlot}</span>
      </div>
      <span className="text-xs mt-1">จบ {estimatedFinishTime} น.</span>
    </div>
  );
}
