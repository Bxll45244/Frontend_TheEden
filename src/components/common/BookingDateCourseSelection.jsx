import React from 'react';

/**
 * Component สำหรับ Step 1: เลือกวันที่และประเภทหลุม
 * @param {object} props - Properties ของ Component
 * @param {string} props.date - วันที่ที่เลือก
 * @param {string} props.courseType - ประเภทหลุมที่เลือก ('9' หรือ '18')
 * @param {function} props.onDateChange - Callback เมื่อวันที่เปลี่ยน
 * @param {function} props.onCourseTypeSelect - Callback เมื่อเลือกประเภทหลุม
 * @param {object} props.pricing - Object ราคาสำหรับ 9/18 หลุม
 */
const BookingDateCourseSelection = ({ date, courseType, onDateChange, onCourseTypeSelect, pricing }) => {
  // กำหนดวันที่ขั้นต่ำให้เป็นวันนี้ เพื่อไม่ให้เลือกวันที่ในอดีตได้
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 text-center">เลือกวันที่และประเภทหลุม</h3>

      {/* Date Picker */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700 mb-2 text-center">
          วันที่จอง
        </label>
        <input
          type="date"
          id="booking-date"
          name="date"
          value={date}
          onChange={onDateChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          min={today}
        />
      </div>

      {/* Course Type Selection */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <p className="block text-sm font-medium text-gray-700 mb-2 text-center">
          ประเภทหลุม
        </p>
        <div className="flex justify-center space-x-4 mt-2">
          <button
            type="button"
            onClick={() => onCourseTypeSelect('9')}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
              courseType === '9' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            9 หลุม
          </button>
          <button
            type="button"
            onClick={() => onCourseTypeSelect('18')}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
              courseType === '18' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            18 หลุม
          </button>
        </div>
      </div>

      {/* Pricing Display */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">อัตราการให้บริการ Eden Golf Club</h4>
        <div className="text-center text-gray-700">
          <p className="mb-2">วันธรรมดา: {pricing['9'].weekday.toLocaleString()} บาท (9 หลุม) / {pricing['18'].weekday.toLocaleString()} บาท (18 หลุม) ต่อท่าน</p>
          <p>วันหยุด/วันหยุดนักขัตฤกษ์: {pricing['9'].holiday.toLocaleString()} บาท (9 หลุม) / {pricing['18'].holiday.toLocaleString()} บาท (18 หลุม) ต่อท่าน</p>
        </div>
      </div>
    </div>
  );
};

export default BookingDateCourseSelection;