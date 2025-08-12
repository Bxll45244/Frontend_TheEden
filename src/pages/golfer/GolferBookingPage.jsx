// src/pages/golfer/GolferBookingPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // เพิ่มการ import axios เพื่อใช้เรียก API
import { useNavigate } from 'react-router-dom';
import LoadingAnimation from '../../components/animations/LoadingAnimation';

// Helper function to format date to 'YYYY-MM-DD'
const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};



const API_BASE_URL = "http://localhost:5000/api";


// --- Step 1: เลือกประเภทคอร์สและวันที่/เวลา ---
function Step1({ bookingData, handleChange, handleNextStep }) {
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

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        handleChange({ target: { name: 'date', value: selectedDate } });
    };

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
    const isNextDisabled = players < 1 || players > 4 || !groupName.trim();

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Step 2: จำนวนผู้เล่นและชื่อกลุ่ม</h2>

            <div className="mb-4 text-center">
                <label className="block text-gray-700 text-sm font-bold mb-2">จำนวนผู้เล่น (สูงสุด 4 คน):</label>
                <div className="flex items-center justify-center space-x-2">
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'players', value: Math.max(1, players - 1) } })}
                        disabled={players <= 1}
                    >
                        -
                    </button>
                    <span className="text-2xl font-bold">{players}</span>
                    <button
                        type="button"
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
                        onClick={() => handleChange({ target: { name: 'players', value: players + 1 } })}
                        disabled={players >= 4}
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
    const { golfCartQty, golfBagQty, caddy, caddySelectionEnabled } = bookingData;
    const [caddySearchTerm, setCaddySearchTerm] = useState('');
    const [availableCaddies, setAvailableCaddies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // แก้ไข: ใช้ useEffect เพื่อดึงข้อมูลแคดดี้จาก API จริง
    useEffect(() => {
        const getCaddies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // ต้องมี API endpoint ที่ดึงแคดดี้ที่ว่างจาก MongoDB
                // สมมติว่า endpoint คือ /api/caddies/available
                const response = await axios.get(`${API_BASE_URL}/caddies/available`);
                setAvailableCaddies(response.data);
            } catch (err) {
                console.error("Failed to fetch caddies:", err);
                setError('ไม่สามารถดึงข้อมูลแคดดี้ได้ กรุณาลองใหม่อีกครั้ง');
            } finally {
                setIsLoading(false);
            }
        };

        if (caddySelectionEnabled) {
            getCaddies();
        }
    }, [caddySelectionEnabled]);

    const filteredCaddies = availableCaddies.filter(caddyOption =>
        caddyOption.name.toLowerCase().includes(caddySearchTerm.toLowerCase())
    );

    const handleCaddySelection = (caddyId) => {
        let updatedCaddies = [...caddy];
        if (updatedCaddies.includes(caddyId)) {
            updatedCaddies = updatedCaddies.filter(id => id !== caddyId);
        } else {
            updatedCaddies.push(caddyId);
        }
        handleChange({ target: { name: 'caddy', value: updatedCaddies } });
    };

    const isNextDisabled = false;

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

            <div className="mb-4 border-t pt-4">
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="caddy-selection-toggle"
                        checked={caddySelectionEnabled}
                        onChange={() => handleChange({ target: { name: 'caddySelectionEnabled', value: !caddySelectionEnabled } })}
                        className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="caddy-selection-toggle" className="text-gray-800 font-bold text-sm">
                        ต้องการเลือกแคดดี้
                    </label>
                </div>

                {caddySelectionEnabled && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อแคดดี้..."
                            value={caddySearchTerm}
                            onChange={(e) => setCaddySearchTerm(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {isLoading ? (
                            <LoadingAnimation />
                        ) : error ? (
                            <p className="col-span-2 text-center text-red-500">{error}</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {filteredCaddies.length > 0 ? (
                                    filteredCaddies.map(caddyOption => (
                                        <div
                                            key={caddyOption._id} // ใช้ _id จาก MongoDB
                                            className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors duration-200
                                                ${caddy.includes(caddyOption._id) ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'}`}
                                            onClick={() => handleCaddySelection(caddyOption._id)}
                                        >
                                            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
                                                <img src={caddyOption.profilePic} alt={caddyOption.name} className="w-full h-full object-cover" />
                                                {caddy.includes(caddyOption._id) && (
                                                    <div className="absolute inset-0 bg-green-500 bg-opacity-70 flex items-center justify-center">
                                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-center">{caddyOption.name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-2 text-center text-gray-500">ไม่พบแคดดี้ที่ค้นหา</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
                <p className="text-xs text-gray-500 mt-2">*ค่าบริการแคดดี้/ท่าน 400 บาท</p>
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

// --- Step 4: สรุปและยืนยัน ---
function Step4({ bookingData, calculateTotalPrice, handlePrevStep, handleSubmitBooking, isLoading }) {
    const { courseType, date, timeSlot, players, groupName, caddy, golfCartQty, golfBagQty } = bookingData;
    const totalPrice = calculateTotalPrice();

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">Step 4: สรุปและยืนยัน</h2>
            <div className="text-gray-700 space-y-2 mb-6">
                <p><strong>ประเภทคอร์ส:</strong> {courseType} หลุม</p>
                <p><strong>วันที่:</strong> {date}</p>
                <p><strong>เวลา:</strong> {timeSlot}</p>
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
                    disabled={isLoading}
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
}


export default function GolferBookingPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        courseType: '18',
        date: formatDate(new Date()),
        timeSlot: '',
        players: 1,
        groupName: '',
        caddy: [],
        caddySelectionEnabled: false,
        totalPrice: 0,
        golfCartQty: 0,
        golfBagQty: 0,
    });
    const [bookingResult, setBookingResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const calculatedTotal = calculateTotalPrice();
        if (bookingData.totalPrice !== calculatedTotal) {
            setBookingData(prevData => ({
                ...prevData,
                totalPrice: calculatedTotal
            }));
        }
    }, [bookingData.courseType, bookingData.date, bookingData.players,
        bookingData.golfCartQty, bookingData.golfBagQty, bookingData.caddy, bookingData.totalPrice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prevData => {
            let newValue = value;
            if (name === 'players' || name === 'golfCartQty' || name === 'golfBagQty') {
                newValue = parseInt(value);
                if (name === 'players') {
                    newValue = Math.min(Math.max(1, newValue), 4);
                }
            } else if (name === 'caddySelectionEnabled') {
                newValue = value;
            }
            return {
                ...prevData,
                [name]: newValue
            };
        });
    };

    const calculateTotalPrice = () => {
        const { courseType, date, players, golfCartQty, golfBagQty, caddy } = bookingData;
        let pricePerPlayer = 0;
        const selectedDate = date ? new Date(date) : null;
        const dayOfWeek = selectedDate ? selectedDate.getDay() : -1;
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        if (courseType === '18') {
            pricePerPlayer = isWeekend ? 4000 : 2200;
        } else if (courseType === '9') {
            pricePerPlayer = isWeekend ? 2500 : 1500;
        }

        let total = (pricePerPlayer * players);
        total += (golfCartQty * 500);
        total += (golfBagQty * 300);
        total += (caddy.length * 400);

        return total;
    };

    const handleNextStep = () => {
        setErrorMessage('');
        setCurrentStep(prev => prev + 1);
    };
    const handlePrevStep = () => {
        setErrorMessage('');
        setCurrentStep(prev => prev - 1);
    };
    const navigateToHome = () => navigate('/');


    const handleSubmitBooking = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const finalTotalPrice = calculateTotalPrice();
            const bookingPayload = {
                ...bookingData,
                totalPrice: finalTotalPrice,
                date: formatDate(bookingData.date),
                // สมมติว่ามี golferId หรือข้อมูลผู้จองจาก state/context
            };

            const token = localStorage.getItem('token'); // สมมติว่ามีการเก็บ token ใน localStorage
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            // เรียก API เพื่อสร้างการจอง
            const response = await axios.post(`${API_BASE_URL}/bookings`, bookingPayload, config);
            setBookingResult({ success: true, message: response.data.message, booking: response.data.booking });
            setCurrentStep(5);
        } catch (error) {
            console.error('Error submitting booking:', error);
            setBookingResult({ success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' });
            setErrorMessage(error.response?.data?.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด');
            setCurrentStep(5);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingAnimation />;
    }

    switch (currentStep) {
        case 1:
            return <Step1 bookingData={bookingData} handleChange={handleChange} handleNextStep={handleNextStep} />;
        case 2:
            return <Step2 bookingData={bookingData} handleChange={handleChange} handlePrevStep={handlePrevStep} handleNextStep={handleNextStep} />;
        case 3:
            return <Step3 bookingData={bookingData} handleChange={handleChange} handlePrevStep={handlePrevStep} handleNextStep={handleNextStep} />;
        case 4:
            return <Step4 bookingData={bookingData} calculateTotalPrice={calculateTotalPrice} handlePrevStep={handlePrevStep} handleSubmitBooking={handleSubmitBooking} isLoading={isLoading} />;
        case 5:
            return <Step5 bookingResult={bookingResult} navigateToHome={navigateToHome} errorMessage={errorMessage} />;
        default:
            return <Step1 bookingData={bookingData} handleChange={handleChange} handleNextStep={handleNextStep} />;
    }
}