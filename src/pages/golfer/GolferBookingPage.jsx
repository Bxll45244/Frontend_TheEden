import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Step1 from '../../components/booking/Step1';
import Step2 from '../../components/booking/Step2';
import Step3 from '../../components/booking/Step3';
import Step4 from '../../components/booking/Step4';
import Step5 from '../../components/booking/Step5';
import { calculateTotalPrice, createBooking, calculateTotalPriceDetailed } from '../../service/bookingService';

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

export default function GolferBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

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
  const [isFetchingBooking, setIsFetchingBooking] = useState(false);

  // คำนวณราคา
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

  //---------------------------------------
  // โหลด booking หลัง redirect จาก Stripe
  useEffect(() => {
    const savedBooking = sessionStorage.getItem('bookingResult');
    if (savedBooking) {
      setBookingResult(JSON.parse(savedBooking));
      setCurrentStep(5);
      sessionStorage.removeItem('bookingResult');
      return; // ถ้ามี saved booking ไม่ต้อง fetch
    }

    if (sessionId) {
      const fetchBooking = async () => {
        setIsFetchingBooking(true);
        try {
          const res = await fetch(`${API_BASE_URL}/stripe/by-session/${sessionId}`, { credentials: "include" });
          const data = await res.json();
          if (data.success) {
            setBookingResult(data.booking);
            setCurrentStep(5);
          } else {
            console.error("Booking not found:", data.message);
          }
        } catch (err) {
          console.error("Fetch booking by session failed:", err);
        } finally {
          setIsFetchingBooking(false);
        }
      };
      fetchBooking();
    }
  }, [sessionId]);

  //---------------------------------------
  const handleSubmitBooking = async () => {
    console.log("handleSubmitBooking called");
    setIsLoading(true);
    try {
      const payload = { 
        ...bookingData, 
        totalPrice: calculateTotalPriceDetailed(bookingData).total, 
        date: formatDate(bookingData.date) 
      };

      const result = await createBooking(payload);

      console.log("Booking Result:", result);
      console.log("Payment URL:", result.paymentUrl);

      if (result.success && result.paymentUrl) {
        // เก็บ bookingResult ชั่วคราวก่อน redirect ไป Stripe
        sessionStorage.setItem('bookingResult', JSON.stringify(result.booking));
        window.location.href = result.paymentUrl;
        return; 
      } else {
        alert(result.message || "ไม่สามารถสร้างการจองได้");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  //---------------------------------------
  const renderStep = () => {
    if (isFetchingBooking) return <p className="text-center">กำลังโหลดข้อมูล...</p>;

    switch(currentStep) {
      case 1: return <Step1 bookingData={bookingData} handleChange={handleChange} onNext={() => setCurrentStep(2)} />;
      case 2: return <Step2 bookingData={bookingData} handleChange={handleChange} onPrev={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} />;
      case 3: return <Step3 bookingData={bookingData} handleChange={handleChange} onPrev={() => setCurrentStep(2)} onNext={() => setCurrentStep(4)} />;
      case 4: return <Step4 
        bookingData={bookingData}
        onPrev={() => setCurrentStep(3)}
        onSubmit={handleSubmitBooking}
        isLoading={isLoading}
      />;
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
