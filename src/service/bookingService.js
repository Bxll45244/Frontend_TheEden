const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createBooking = async (bookingData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },

            credentials: 'include', // เพื่อให้ Browser ส่ง HttpOnly Cookie ไปด้วย
            body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, message: data.message || 'Booking created successfully!', booking: data.booking };
        } else {
            // Log ข้อมูล error จาก Backend เพิ่มเติมเพื่อช่วย Debug
            console.error('Backend Error for createBooking:', data);
            return { success: false, message: data.error || data.message || 'Failed to create booking' };
        }
    } catch (error) {
        console.error('Network or unexpected error creating booking:', error);
        return { success: false, message: 'Network error or server is down' };
    }
};
