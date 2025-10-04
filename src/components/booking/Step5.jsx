import React from 'react';

const Step5 = ({ bookingResult, navigateToHome, errorMessage }) => {
  // ถ้า bookingResult ไม่มี ให้ถือว่า fail
  const isSuccess = bookingResult && bookingResult._id;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto text-center">
      {isSuccess ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-green-600">จองสำเร็จ!</h2>
          <p className="mb-2">การจองของคุณเสร็จสมบูรณ์แล้ว</p>

          <div className="text-left bg-gray-50 p-4 rounded-lg mt-4">
            <p><strong>Booking ID:</strong> {bookingResult._id}</p>
            <p><strong>Course Type:</strong> {bookingResult.courseType}</p>
            <p><strong>Date:</strong> {bookingResult.date}</p>
            <p><strong>TimeSlot:</strong> {bookingResult.timeSlot}</p>
            <p><strong>Total Price:</strong> {bookingResult.totalPrice?.toLocaleString()} บาท</p>
          </div>

          <img
            src="/booking-success.gif"
            alt="Booking Success"
            className="mx-auto my-4 w-32 h-32"
          />
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4 text-red-600">จองไม่สำเร็จ!</h2>
          <p className="mb-2">
            {errorMessage || 'เกิดข้อผิดพลาดที่ไม่คาดคิด'}
          </p>
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
