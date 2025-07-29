import React from 'react';

/**
 * Component สำหรับ Step 2: เลือกเวลาที่สามารถจองได้
 * @param {object} props - Properties ของ Component
 * @param {Array<object>} props.timeSlots - รายการ Time Slot ทั้งหมด
 * @param {Array<object>} props.reservedTimes - รายการ Time Slot ที่ถูกจองแล้ว
 * @param {string} props.selectedTimeSlot - Time Slot ที่เลือกในปัจจุบัน
 * @param {function} props.onTimeSlotSelect - Callback เมื่อเลือก Time Slot
 */
const BookingTimeSlotSelection = ({ timeSlots, reservedTimes, selectedTimeSlot, onTimeSlotSelect }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 text-center">เลือกเวลาที่สามารถจองได้</h3>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {timeSlots.map((slot) => {
            const isReserved = reservedTimes.some(
              (reserved) => reserved.time === slot.time
            );
            const isSelected = selectedTimeSlot === slot.time;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => !isReserved && onTimeSlotSelect(slot.time)}
                disabled={isReserved}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                  ${isReserved
                    ? 'bg-red-200 text-red-700 cursor-not-allowed'
                    : isSelected
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }
                `}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookingTimeSlotSelection;