import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Step1 from '../../components/booking/Step1';
import Step2 from '../../components/booking/Step2';
import Step3 from '../../components/booking/Step3';
import Step4 from '../../components/booking/Step4';
import Step5 from '../../components/booking/Step5';
//import { calculateTotalPrice, createBooking, calculateTotalPriceDetailed } from '../../service/bookingService';
import { calculateTotalPrice, calculateTotalPriceDetailed } from '../../service/bookingService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

export default function GolferBookingPage() {
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const cancelled = searchParams.get("cancelled");
  
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

  //-----------------------------------------------------------------
  // โหลด booking หลัง redirect จาก Stripe
useEffect(() => {
  if (!sessionId) return;

  let aborted = false;

  const fetchWithRetry = async (retries = 6) => {
    try {
      const res = await fetch(`${API_BASE_URL}/stripe/by-session/${sessionId}`, {
        credentials: "include",
      });

      // กันกรณี backend ส่ง HTML (เช่น 404) จะ parse ไม่ได้
      if (!res.ok) {
        if (retries > 0 && !aborted) {
          setTimeout(() => fetchWithRetry(retries - 1), 1200); // รอ 1.2s แล้วลองใหม่
        }
        return;
      }

      const data = await res.json();

      if (data?.success && data?.booking) {
        setBookingResult(data.booking);
        setCurrentStep(5);                       // ✅ ไป Step5
        navigate('/booking', { replace: true }); // ✅ ล้าง query ออกจาก URL
      } else if (retries > 0 && !aborted) {
        setTimeout(() => fetchWithRetry(retries - 1), 1200);
      } else {
        console.error("Booking not found after retries:", data);
      }
    } catch (err) {
      if (retries > 0 && !aborted) {
        setTimeout(() => fetchWithRetry(retries - 1), 1200);
      } else {
        console.error("Fetch booking failed:", err);
      }
    }
  };

  fetchWithRetry();

  return () => { aborted = true; };
}, [sessionId, navigate]);


  useEffect(() => {
  if (cancelled === '1') {
    setCurrentStep(4); // กลับไป Step4
    navigate('/booking', { replace: true }); // ล้าง query ออกจาก URL
  }
}, [cancelled, navigate]);

  //----------------------------------------------------------------- -----

  const handleSubmitBooking = async () => {
  console.log("handleSubmitBooking called");
  setIsLoading(true);
  try {
    const payload = { 
      ...bookingData, 
      totalPrice: calculateTotalPriceDetailed(bookingData).total, 
      date: formatDate(bookingData.date) 
    };

    // ✅ เรียก backend ให้สร้าง Stripe Checkout Session (ยังไม่บันทึก DB)
    const res = await fetch(`${API_BASE_URL}/stripe/create-checkout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data?.ok && data?.url) {
      // ✅ ไปชำระเงินก่อน – ห้ามสร้าง/เก็บ booking ฝั่ง client
      window.location.href = data.url;
      return;
    } else {
      alert(data?.message || "ไม่สามารถสร้าง Checkout ได้");
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
