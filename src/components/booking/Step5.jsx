import React from 'react';

const Step5 = ({ bookingResult, navigateToHome, errorMessage }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto text-center">
            {bookingResult?.success ? (
                <>
                    <h2 className="text-xl font-semibold mb-4 text-green-600">จองสำเร็จ!</h2>
                    <p className="mb-2">{bookingResult.message}</p>
                    {bookingResult.booking && (
                        <div className="text-left bg-gray-50 p-4 rounded-lg mt-4">
                            <p><strong>Booking ID:</strong> {bookingResult.booking._id}</p>
                            <p><strong>Course Type:</strong> {bookingResult.booking.courseType}</p>
                            <p><strong>Date:</strong> {bookingResult.booking.date}</p>
                            <p><strong>TimeSlot:</strong> {bookingResult.booking.timeSlot}</p>
                            <p><strong>Total Price:</strong> {bookingResult.booking.totalPrice?.toLocaleString()} บาท</p>
                        </div>
                    )}
                    <img src="/booking-success.gif" alt="Booking Success" className="mx-auto my-4 w-32 h-32" />
                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-4 text-red-600">จองไม่สำเร็จ!</h2>
                    <p className="mb-2">{errorMessage || bookingResult?.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด'}</p>
                </>
            )}
            <button
                onClick={navigateToHome}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700"
            >
                กลับหน้าหลัก
            </button>
        </div>
    );
};

export default Step5;