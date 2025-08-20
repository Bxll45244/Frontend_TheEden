import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Import all step components
import Step1 from '../../components/booking/Step1';
import Step2 from '../../components/booking/Step2';
import Step3 from '../../components/booking/Step3'; 
import Step4 from '../../components/booking/Step4';
import Step5 from '../../components/booking/Step5';

const API_BASE_URL = "http://localhost:5000/api"; // หรือ import.meta.env.VITE_API_BASE_URL

// Helper function to format date
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

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
    }, [bookingData.courseType, bookingData.date, bookingData.players, bookingData.golfCartQty, bookingData.golfBagQty, bookingData.caddy, bookingData.totalPrice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prevData => {
            let newValue = value;
            if (name === 'players' || name === 'golfCartQty' || name === 'golfBagQty') {
                newValue = parseInt(value);
            }
            if (name === 'players') {
                newValue = Math.min(Math.max(1, newValue), 4);
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
        total += (caddy.length * 400); // Caddy price is fixed at 400 per caddy
        return total;
    };

    const handleSubmitBooking = async () => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const finalTotalPrice = calculateTotalPrice();
            const bookingPayload = {
                ...bookingData,
                totalPrice: finalTotalPrice,
                date: formatDate(bookingData.date),
            };


            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true 
            };


            const response = await axios.post(`${API_BASE_URL}/bookings/book`, bookingPayload, config); 
            
            setBookingResult({ success: true, message: response.data.message, booking: response.data.booking });
            setCurrentStep(5);
        } catch (error) {
            console.error('Error submitting booking:', error);

            const backendErrorMessage = error.response?.data?.message || error.response?.data?.error;
            setBookingResult({ success: false, message: backendErrorMessage || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' });
            setErrorMessage(backendErrorMessage || 'เกิดข้อผิดพลาดที่ไม่คาดคิด');
            setCurrentStep(5);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1 bookingData={bookingData} handleChange={handleChange} onNext={() => setCurrentStep(2)} />;
            case 2:
                return <Step2 bookingData={bookingData} handleChange={handleChange} onPrev={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />;
            case 3:
                return <Step3 bookingData={bookingData} handleChange={handleChange} onPrev={() => setCurrentStep(2)} onNext={() => setCurrentStep(4)} API_BASE_URL={API_BASE_URL} />;
            case 4:
                return <Step4 bookingData={bookingData} calculateTotalPrice={calculateTotalPrice} onPrev={() => setCurrentStep(3)} onSubmit={handleSubmitBooking} isLoading={isLoading} />;
            case 5:
                return <Step5 bookingResult={bookingResult} navigateToHome={() => navigate('/')} errorMessage={errorMessage} />;
            default:
                return <Step1 bookingData={bookingData} handleChange={handleChange} onNext={() => setCurrentStep(2)} />;
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-center mb-8">จองเวลาออกรอบ</h1>
            
            <ul className="steps steps-vertical lg:steps-horizontal w-full mb-8">
                <li className={`step ${currentStep >= 1 ? 'step-primary' : ''}`}>เลือกเวลาและคอร์ส</li>
                <li className={`step ${currentStep >= 2 ? 'step-primary' : ''}`}>ข้อมูลผู้เล่น</li>
                <li className={`step ${currentStep >= 3 ? 'step-primary' : ''}`}>บริการเสริม</li>
                <li className={`step ${currentStep >= 4 ? 'step-primary' : ''}`}>สรุปและยืนยัน</li>
                <li className={`step ${currentStep === 5 ? 'step-primary' : ''}`}>เสร็จสิ้น</li>
            </ul>

            <div className="min-h-96">
                {renderStep()}
            </div>
        </div>
    );
}
