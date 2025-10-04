// service/checkPayment.js
import { createBooking } from '../../service/bookingService';

export const handleBookingPayment = async (bookingData, setIsLoading) => {
  setIsLoading(true);
  try {
    const payload = { ...bookingData };
    const result = await createBooking(payload);

    if (result.success && result.booking.paymentUrl) {
      // redirect ไป Stripe Checkout
      window.location.href = result.booking.paymentUrl;
      return;
    } else {
      alert(result.message || "ไม่สามารถสร้างการจองได้");
      return;
    }
  } catch (err) {
    console.error("Error creating booking and redirecting to Stripe:", err);
    alert("เกิดข้อผิดพลาด");
    return;
  } finally {
    setIsLoading(false);
  }
};

