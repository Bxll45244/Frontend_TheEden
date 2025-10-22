import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1 from '../../components/golfer/booking/Step1';
import Step2 from '../../components/golfer/booking/Step2';
import Step3 from '../../components/golfer/booking/Step3';
import Step4 from '../../components/golfer/booking/Step4';
import { calculateTotalPrice } from '../../service/golfer/calculatePrice';
import { createBooking } from '../../service/golfer/bookingService';


// อาจจะต้องแก้ฟังชันเปลี่ยนไปสร้างฟังชัน คิดเงินจาก backend  อาจารย์ให้แก้ไข

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
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
    golfCartQty: 0,
    golfBagQty: 0,
    totalPrice: 0,
  });
  const [bookingResult, setBookingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const total = calculateTotalPrice(bookingData);
    if (bookingData.totalPrice !== total) setBookingData(prev => ({ ...prev, totalPrice: total }));
  }, [bookingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: ['players','golfCartQty','golfBagQty'].includes(name) ? parseInt(value) : value
    }));
  };

  const handleSubmitBooking = async () => {
    setIsLoading(true);
    const payload = { ...bookingData, totalPrice: calculateTotalPrice(bookingData), date: formatDate(bookingData.date) };
    const result = await createBooking(payload);
    setBookingResult(result);
    setCurrentStep(5);
    setIsLoading(false);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1: return <Step1 bookingData={bookingData} handleChange={handleChange} onNext={() => setCurrentStep(2)} />;
      case 2: return <Step2 bookingData={bookingData} handleChange={handleChange} onPrev={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />;
      case 3: return <Step3 bookingData={bookingData} handleChange={handleChange} onPrev={() => setCurrentStep(2)} onNext={() => setCurrentStep(4)} />;
      case 4: return <Step4 bookingData={bookingData} onPrev={() => setCurrentStep(3)} onSubmit={handleSubmitBooking} isLoading={isLoading} />;
      case 5: return <Step5 bookingResult={bookingResult} navigateToHome={() => navigate('/')} />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">จองเวลาออกรอบ</h1>
      <ul className="steps steps-vertical lg:steps-horizontal w-full mb-8">
        {['เลือกเวลาและคอร์ส','ข้อมูลผู้เล่น','บริการเสริม','สรุปและยืนยัน','เสร็จสิ้น'].map((label,i) =>
          <li key={i} className={`step ${currentStep > i ? 'step-primary' : ''}`}>{label}</li>
        )}
      </ul>
      <div className="min-h-96">{renderStep()}</div>
    </div>
  );
}

// { calculateTotalPrice } , { createBooking } มาจากชื่อฟังก์ชันใน service ที่ตั้งไว้