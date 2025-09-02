const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ราคามาตรฐาน
const PRICES = {
  hole: 200,
  caddy: 400, 
  cart: 500,
  bag: 300,
};


//  คำนวณราคาการจองแบบละเอียด

export function calculateTotalPriceDetailed(bookingData = {}) {
  const { courseType = '0', players = 0, caddy = [], golfCartQty = 0, golfBagQty = 0, date } = bookingData;

  // Green Fee ตามวันและคอร์ส
  const selectedDate = date ? new Date(date) : null;
  const dayOfWeek = selectedDate ? selectedDate.getDay() : -1;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  let greenFee = 0;
  if (courseType === '18') greenFee = players * (isWeekend ? 4000 : 2200);
  if (courseType === '9') greenFee = players * (isWeekend ? 2500 : 1500);

  const caddyFee = caddy.length * PRICES.caddy;
  const cartFee = golfCartQty * PRICES.cart;
  const bagFee = golfBagQty * PRICES.bag;

  return {
    greenFee,
    caddyFee,
    cartFee,
    bagFee,
    total: greenFee + caddyFee + cartFee + bagFee,
  };
}


// คืนค่า total ราคาการจอง

export function calculateTotalPrice(bookingData = {}) {
  return calculateTotalPriceDetailed(bookingData).total;
}

// สร้าง booking
 
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message || 'Booking created successfully!', booking: data.booking };
    } else {
      console.error('Backend Error for createBooking:', data);
      return { success: false, message: data.error || data.message || 'Failed to create booking' };
    }
  } catch (error) {
    console.error('Network or unexpected error creating booking:', error);
    return { success: false, message: 'Network error or server is down' };
  }
};
