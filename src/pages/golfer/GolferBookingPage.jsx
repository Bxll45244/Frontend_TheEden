import React, { useState, useEffect } from 'react';
import { createBooking } from '../../service/bookingService'; // ฟังก์ชันสร้างการจอง
import { useNavigate } from 'react-router-dom'; // สำหรับเปลี่ยนหน้า

// Helper function to format date to 'YYYY-MM-DD'
const formatDate = (date) => {
    // Ensure date is a valid Date object before formatting
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Step 1: เลือกประเภทคอร์สและวันที่/เวลา ---
function Step1({ bookingData, handleChange, handleNextStep }) {
    // เปลี่ยนชื่อตัวแปรจาก timeslot เป็น timeSlot
    const { courseType, date, timeSlot } = bookingData; 

    // Mock data for available timeSlots - replace with actual API call if needed
    const availableTimeSlots = [
        "06:00", "06:15", "06:30", "06:45", "07:00", "07:15", "07:30", "07:45",
        "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45",
        "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45",
        "12:00",
        // ... add more as needed
    ];
    const reservedTimeSlots = ["07:00", "08:15", "09:00", "10:15", "11:00"]; // Mock reserved

    // Calculate price based on courseType (example, you'll need actual logic from backend or config)
    const dailyPrice = courseType === '18' ? 2200 : 1500; // Example prices
    const holidayPrice = courseType === '18' ? 4000 : 2500; // Example prices

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        handleChange({ target: { name: 'date', value: selectedDate } });
        // In a real app, you'd fetch available timeSlots for this date
    };

    // ใช้ timeSlot แทน timeslot
    const isNextDisabled = !date || !timeSlot || !courseType; 

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Step 1: เลือกเวลาและประเภทคอร์ส</h2>
            
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">วันที่จอง:</label>
                <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={handleDateChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>

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
                        // ใช้ timeSlot แทน timeslot
                        className={`px-3 py-1 text-sm rounded-full ${reservedTimeSlots.includes(time) ? 'bg-red-500 text-white cursor-not-allowed' : (timeSlot === time ? 'bg-green-700 text-white' : 'bg-green-600 text-white hover:bg-green-700')}`}
                        // ใช้ name: 'timeSlot' แทน name: 'timeslot'
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
                    onClick={handleNextStep}
                    className={`bg-gray-800 text-white px-6 py-2 rounded-full font-bold ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                    disabled={isNextDisabled}
                >
                    จองต่อ
                </button>
            </div>
        </div>
    );
}

// --- Step 2: จำนวนผู้เล่นและชื่อกลุ่ม ---
function Step2({ bookingData, handleChange, handlePrevStep, handleNextStep }) {
    const { players, groupName } = bookingData;
    const isNextDisabled = players < 1 || !groupName.trim(); // Group name required

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Step 2: จำนวนผู้เล่นและชื่อกลุ่ม</h2>
            
            <div className="mb-4 text-center">
                <label className="block text-gray-700 text-sm font-bold mb-2">จำนวนผู้เล่น:</label>
                <div className="flex items-center justify-center space-x-2">
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'players', value: Math.max(1, players - 1) } })}
                    >
                        -
                    </button>
                    <span className="text-2xl font-bold">{players}</span>
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'players', value: players + 1 } })}
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">ชื่อกลุ่ม:</label>
                <input
                    type="text"
                    name="groupName"
                    value={groupName}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="กรุณาระบุชื่อกลุ่ม"
                    required
                />
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={handlePrevStep}
                    className="bg-gray-600 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700"
                >
                    ย้อนกลับ
                </button>
                <button
                    onClick={handleNextStep}
                    className={`bg-gray-800 text-white px-6 py-2 rounded-full font-bold ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                    disabled={isNextDisabled}
                >
                    จองต่อ
                </button>
            </div>
        </div>
    );
}

// --- Step 3: รถกอล์ฟ, ถุงกอล์ฟ, แคดดี้ ---
function Step3({ bookingData, handleChange, handlePrevStep, handleNextStep }) {
    const { golfCartQty, golfBagQty, caddy } = bookingData;
    // For caddy, it's an array of strings, so input needs special handling
    const handleCaddyChange = (e) => {
        const value = e.target.value;
        // Ensure caddy is always an array, even if empty or single item
        handleChange({ target: { name: 'caddy', value: value.split(',').map(item => item.trim()).filter(item => item !== '') } });
    };

    const isNextDisabled = false; // No strict validation for this step based on images

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Step 3: บริการเสริม</h2>
            
            <div className="mb-4 text-center">
                <label className="block text-gray-700 text-sm font-bold mb-2">จำนวนกระเป๋าไม้กอล์ฟ:</label>
                <div className="flex items-center justify-center space-x-2">
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'golfBagQty', value: Math.max(0, golfBagQty - 1) } })}
                    >
                        -
                    </button>
                    <span className="text-2xl font-bold">{golfBagQty}</span>
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'golfBagQty', value: golfBagQty + 1 } })}
                    >
                        +
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">*ค่าบริการกระเป๋าไม้กอล์ฟ/ท่าน 300 บาท</p>
            </div>

            <div className="mb-4 text-center">
                <label className="block text-gray-700 text-sm font-bold mb-2">จำนวนรถกอล์ฟ:</label>
                <div className="flex items-center justify-center space-x-2">
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'golfCartQty', value: Math.max(0, golfCartQty - 1) } })}
                    >
                        -
                    </button>
                    <span className="text-2xl font-bold">{golfCartQty}</span>
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'golfCartQty', value: golfCartQty + 1 } })}
                    >
                        +
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">*ค่าบริการรถกอล์ฟ/คัน 500 บาท</p>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">ID แคดดี้ (คั่นด้วยคอมมา):</label>
                <input
                    type="text"
                    name="caddy"
                    // แสดงค่า caddy เป็น String ที่คั่นด้วยคอมม่าเพื่อการแก้ไข
                    value={Array.isArray(caddy) ? caddy.join(', ') : ''} 
                    onChange={handleCaddyChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="เช่น caddy01, caddy02"
                />
                <p className="text-xs text-gray-500 mt-1">*ค่าบริการแคดดี้/ท่าน 400 บาท</p>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={handlePrevStep}
                    className="bg-gray-600 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700"
                >
                    ย้อนกลับ
                </button>
                <button
                    onClick={handleNextStep}
                    className={`bg-gray-800 text-white px-6 py-2 rounded-full font-bold ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                    disabled={isNextDisabled}
                >
                    จองต่อ
                </button>
            </div>
        </div>
    );
}


function Step4({ bookingData, calculateTotalPrice, handlePrevStep, handleSubmitBooking, isLoading }) {
    // เปลี่ยนชื่อตัวแปรจาก timeslot เป็น timeSlot
    const { courseType, date, timeSlot, players, groupName, caddy, golfCartQty, golfBagQty } = bookingData;
    const totalPrice = calculateTotalPrice();

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Step 4: สรุปและยืนยัน</h2>
            <div className="text-gray-700 space-y-2 mb-6">
                <p><strong>ประเภทคอร์ส:</strong> {courseType} หลุม</p>
                <p><strong>วันที่:</strong> {date}</p>
                <p><strong>เวลา:</strong> {timeSlot}</p> {/* ใช้ timeSlot */}
                <p><strong>จำนวนผู้เล่น:</strong> {players} คน</p>
                <p><strong>ชื่อกลุ่ม:</strong> {groupName || '-'}</p>
                <p><strong>แคดดี้ ID:</strong> {caddy && caddy.length > 0 ? caddy.join(', ') : '-'}</p>
                <p><strong>จำนวนรถกอล์ฟ:</strong> {golfCartQty} คัน</p>
                <p><strong>จำนวนถุงกอล์ฟ:</strong> {golfBagQty} ถุง</p>
            </div>

            <div className="text-center bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-bold text-gray-800">ยอดรวมทั้งหมด: {totalPrice.toLocaleString()} บาท</h3>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    onClick={handlePrevStep}
                    className="bg-gray-600 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700"
                    disabled={isLoading} // ป้องกันการกดซ้ำขณะโหลด
                >
                    ย้อนกลับ
                </button>
                <button
                    onClick={handleSubmitBooking}
                    className={`bg-green-600 text-white px-6 py-2 rounded-full font-bold ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'กำลังยืนยัน...' : 'ยืนยันการจอง'}
                </button>
            </div>
        </div>
    );
}

// --- Step 5: แสดงผลลัพธ์การจอง ---
function Step5({ bookingResult, navigateToHome, errorMessage }) {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto text-center">
            {bookingResult?.success ? ( // ใช้ Optional Chaining (?) เพื่อป้องกัน error ถ้า bookingResult เป็น null
                <>
                    <h2 className="text-xl font-semibold mb-4 text-green-600">จองสำเร็จ!</h2>
                    <p className="mb-2">{bookingResult.message}</p>
                    {bookingResult.booking && (
                        <div className="text-left bg-gray-50 p-4 rounded-lg mt-4">
                            <p><strong>Booking ID:</strong> {bookingResult.booking._id}</p>
                            <p><strong>Course Type:</strong> {bookingResult.booking.courseType}</p>
                            <p><strong>Date:</strong> {bookingResult.booking.date}</p>
                            <p><strong>TimeSlot:</strong> {bookingResult.booking.timeSlot}</p> {/* ใช้ timeSlot */}
                            <p><strong>Total Price:</strong> {bookingResult.booking.totalPrice?.toLocaleString()} บาท</p>
                            {/* แสดงข้อมูลอื่นๆ ที่ Backend ส่งกลับมา */}
                        </div>
                    )}
                    <img src="/booking-success.gif" alt="Booking Success" className="mx-auto my-4 w-32 h-32" />
                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-4 text-red-600">จองไม่สำเร็จ!</h2>
                    <p className="mb-2">{errorMessage || bookingResult?.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด'}</p> {/* แสดง errorMessage ด้วย */}
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
}


export default function GolferBookingPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        courseType: '18', // Default to 18 holes
        date: formatDate(new Date()), // Default to today's date, formatted
        timeSlot: '', // *** เปลี่ยนเป็น timeSlot (S ใหญ่) ให้ตรงกับ Backend ***
        players: 1,
        groupName: '',
        caddy: [], // Array of strings
        totalPrice: 0, // Will be calculated
        golfCartQty: 0,
        golfBagQty: 0,
    });
    const [bookingResult, setBookingResult] = useState(null); // สำหรับเก็บผลลัพธ์การจอง
    const [isLoading, setIsLoading] = useState(false); // สถานะ Loading
    const [errorMessage, setErrorMessage] = useState(''); // สำหรับแสดงข้อความ Error

    // *** เพิ่ม useEffect นี้เข้ามาใน GolferBookingPage หลัก ***
    useEffect(() => {
        const calculatedTotal = calculateTotalPrice();
        // อัปเดต totalPrice เฉพาะเมื่อค่าเปลี่ยนไป เพื่อป้องกัน re-render วนลูป
        if (bookingData.totalPrice !== calculatedTotal) {
            setBookingData(prevData => ({
                ...prevData,
                totalPrice: calculatedTotal
            }));
        }
    }, [bookingData.courseType, bookingData.date, bookingData.players,
        bookingData.golfCartQty, bookingData.golfBagQty, bookingData.caddy, bookingData.totalPrice]); // เพิ่ม dependencies ที่ทำให้ total price เปลี่ยนแปลง

    // Function to handle changes in form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prevData => ({
            ...prevData,
            [name]: name === 'players' || name === 'golfCartQty' || name === 'golfBagQty' ? parseInt(value) : value
        }));
    };

    // Calculate total price based on booking data
    const calculateTotalPrice = () => {
        const { courseType, date, players, golfCartQty, golfBagQty, caddy } = bookingData;
        let pricePerPlayer = 0;

        // Example: Determine if it's a weekend/holiday (you'll need more robust logic)
        // ตรวจสอบให้แน่ใจว่า date ไม่ว่าง ก่อนสร้าง Date object
        const selectedDate = date ? new Date(date) : null; 
        const dayOfWeek = selectedDate ? selectedDate.getDay() : -1; // 0 = Sunday, 6 = Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        if (courseType === '18') {
            pricePerPlayer = isWeekend ? 4000 : 2200; 
        } else if (courseType === '9') {
            pricePerPlayer = isWeekend ? 2500 : 1500; 
        }

        let total = (pricePerPlayer * players);
        total += (golfCartQty * 500); // 500 baht per golf cart
        total += (golfBagQty * 300);  // 300 baht per golf bag
        total += (caddy.length * 400); // 400 baht per caddy

        return total;
    };


    // Navigation functions for steps
    const handleNextStep = () => {
        setErrorMessage(''); // Clear previous error messages
        setCurrentStep(prev => prev + 1);
    };
    const handlePrevStep = () => {
        setErrorMessage(''); // Clear previous error messages
        setCurrentStep(prev => prev - 1);
    };
    const navigateToHome = () => navigate('/');

    // Handle final booking submission
    const handleSubmitBooking = async () => {
        setIsLoading(true); // ตั้งค่า loading เป็น true
        setErrorMessage(''); // ล้างข้อความ Error เก่า
        try {
            // Recalculate total price one last time before sending
            const finalTotalPrice = calculateTotalPrice(); 
            const bookingPayload = {
                ...bookingData,
                totalPrice: finalTotalPrice, // Ensure final calculated price is included
                date: formatDate(bookingData.date) // Make sure date is formatted correctly
            };

            console.log("Submitting booking:", bookingPayload); // Debugging: ดูข้อมูลที่จะส่ง

            const result = await createBooking(bookingPayload);
            setBookingResult(result);
            if (!result.success) {
                setErrorMessage(result.message); // ตั้งค่า error message ถ้าไม่สำเร็จ
            }
            setCurrentStep(5); // Move to final result step
        } catch (error) {
            console.error('Error submitting booking:', error);
            setBookingResult({ success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' });
            setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
            setCurrentStep(5);
        } finally {
            setIsLoading(false); // ตั้งค่า loading เป็น false เสมอ
        }
    };

    // Render current step
    switch (currentStep) {
        case 1:
            return <Step1 bookingData={bookingData} handleChange={handleChange} handleNextStep={handleNextStep} />;
        case 2:
            return <Step2 bookingData={bookingData} handleChange={handleChange} handlePrevStep={handlePrevStep} handleNextStep={handleNextStep} />;
        case 3:
            return <Step3 bookingData={bookingData} handleChange={handleChange} handlePrevStep={handlePrevStep} handleNextStep={handleNextStep} />;
        case 4:
            // ส่ง isLoading ไปที่ Step4 เพื่อ disabled ปุ่ม
            return <Step4 bookingData={bookingData} calculateTotalPrice={calculateTotalPrice} handlePrevStep={handlePrevStep} handleSubmitBooking={handleSubmitBooking} isLoading={isLoading} />;
        case 5:
            // ส่ง errorMessage ไปที่ Step5 ด้วย
            return <Step5 bookingResult={bookingResult} navigateToHome={navigateToHome} errorMessage={errorMessage} />;
        default:
            return <Step1 bookingData={bookingData} handleChange={handleChange} handleNextStep={handleNextStep} />;
    }
}