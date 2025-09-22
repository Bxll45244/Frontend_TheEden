import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Step1 = ({ bookingData, handleChange, onNext }) => {
  const { courseType, date, timeSlot } = bookingData;
  const [reservedTimeSlots, setReservedTimeSlots] = useState([]); 

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
    if (date && courseType) {
        // Fetch reserved time slots from backend
        axios.get(`${API_BASE_URL}/bookings/reserved`, {
  params: { 
    date,        // ส่ง "2025-08-21" ตรง ๆ
    courseType
  }
})

        .then(res => setReservedTimeSlots(res.data))
        .catch(err => console.error(err));
    }
}, [date, courseType]);


  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Step 1: เลือกเวลาและจำนวนหลุม
      </h2>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">วันที่จอง:</label>
        <input
          type="date"
          name="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            handleChange({ target: { name: "date", value: e.target.value } })
          }
          className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
        />
      </div>

      {/* Course Type */}
      <div className="mb-6 flex justify-center gap-4">
        <button
          type="button"
          className={`px-5 py-2 rounded-lg font-semibold transition duration-200 ${
            courseType === "9"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() =>
            handleChange({ target: { name: "courseType", value: "9" } })
          }
        >
          9 หลุม
        </button>
        <button
          type="button"
          className={`px-5 py-2 rounded-lg font-semibold transition duration-200 ${
            courseType === "18"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() =>
            handleChange({ target: { name: "courseType", value: "18" } })
          }
        >
          18 หลุม
        </button>
      </div>

      {/* Time Slots */}
      <h3 className="text-center font-semibold text-gray-700 mb-3">
        เวลาที่สามารถจองได้
      </h3>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {availableTimeSlots.map((time) => (
          <button
            key={time}
            type="button"
            className={`px-3 py-1 text-sm rounded-full font-medium transition duration-200 ${
              reservedTimeSlots.includes(time)
                ? "bg-red-500 text-white cursor-not-allowed" 
                : timeSlot === time
                ? "bg-green-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-green-100"
            }`}
            onClick={() =>
              !reservedTimeSlots.includes(time) &&
              handleChange({ target: { name: "timeSlot", value: time } })
            }
            disabled={reservedTimeSlots.includes(time)}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Pricing */}
      <div className="text-center text-gray-700 mb-6">
        <h3 className="font-bold mb-2">อัตราการให้บริการ Eden Golf Club</h3>
        <p>วันธรรมดา: {dailyPrice} บาท ต่อท่าน</p>
        <p>วันหยุด/วันหยุดนักขัตฤกษ์: {holidayPrice} บาท ต่อท่าน</p>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`px-6 py-2 rounded-full font-bold transition duration-200 ${
            isNextDisabled
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-500 shadow-lg"
          }`}
        >
          จองต่อ
        </button>
      </div>
    </div>
  );
};

export default Step1;
