import React from 'react';

export default function TimeSlotsDisplay({ timeSlots, reservedTimes }) {
  const reservedTimeSet = new Set(reservedTimes.map(item => item.time));

  return (
    <div className="text-center mt-10">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-2 px-4">
        {timeSlots.map(slot => {
          const isReserved = reservedTimeSet.has(slot.time);
          return (
            <div
              key={slot.id}
              className={`px-3 py-1 text-sm rounded-full text-white ${
                isReserved ? "bg-red-500" : "bg-green-600"
              }`}
            >
              {slot.time}
            </div>
          );
        })}
      </div>
    </div>
  );
}
