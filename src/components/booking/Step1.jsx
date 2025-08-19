import React from 'react';

const Step1 = ({ bookingData, handleChange, onNext }) => {
    const { courseType, date, timeSlot } = bookingData;
    const availableTimeSlots = [
        "06:00", "06:15", "06:30", "06:45", "07:00", "07:15", "07:30", "07:45",
        "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45",
        "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45",
        "12:00",
    ];
    const reservedTimeSlots = ["07:00", "08:15", "09:00", "10:15", "11:00"];
    const dailyPrice = courseType === '18' ? 2200 : 1500;
    const holidayPrice = courseType === '18' ? 4000 : 2500;
    const isNextDisabled = !date || !timeSlot || !courseType;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Step 1: เลือกเวลาและประเภทคอร์ส</h2>
            {/* JSX for course type and date selection */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">วันที่จอง:</label>
                <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={(e) => handleChange({ target: { name: 'date', value: e.target.value } })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            {/* JSX for time slots and prices */}
            <div className="mb-4 flex justify-center gap-4">
                <button
                    type="button"
                    className={`px-4 py-2 rounded-lg font-bold ${courseType === '9' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleChange({ target: { name: 'courseType', value: '9' } })}
                >
                    9 หลุม
                </button>
                <button
                    type="button"
                    className={`px-4 py-2 rounded-lg font-bold ${courseType === '18' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => handleChange({ target: { name: 'courseType', value: '18' } })}
                >
                    18 หลุม
                </button>
            </div>

            <h3 className="text-center font-semibold text-gray-700 mb-2">เวลาที่สามารถจองได้</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
                {availableTimeSlots.map(time => (
                    <button
                        key={time}
                        type="button"
                        className={`px-3 py-1 text-sm rounded-full ${reservedTimeSlots.includes(time) ? 'bg-red-500 text-white cursor-not-allowed' : (timeSlot === time ? 'bg-green-700 text-white' : 'bg-green-600 text-white hover:bg-green-700')}`}
                        onClick={() => !reservedTimeSlots.includes(time) && handleChange({ target: { name: 'timeSlot', value: time } })}
                        disabled={reservedTimeSlots.includes(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>
            <div className="text-center text-gray-700 my-4">
                <h3 className="font-bold">อัตราการให้บริการ Eden Golf Club</h3>
                <p>วันธรรมดา: {dailyPrice} บาท ต่อท่าน</p>
                <p>วันหยุด/วันหยุดนักขัตฤกษ์: {holidayPrice} บาท ต่อท่าน</p>
            </div>
            <div className="flex justify-end mt-6">
                <button
                    onClick={onNext}
                    className={`bg-gray-800 text-white px-6 py-2 rounded-full font-bold ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                    disabled={isNextDisabled}
                >
                    จองต่อ
                </button>
            </div>
        </div>
    );
};

export default Step1;