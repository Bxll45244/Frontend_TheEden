// import api from './api'; // Assuming you have an axios instance or fetch wrapper

// export const getTimeSlots = async () => {
//     try {
//         const response = await api.get('/time-slots'); // Your backend endpoint
//         return { success: true, timeSlots: response.data };
//     } catch (error) {
//         console.error("Error fetching time slots:", error);
//         return { success: false, message: error.response?.data?.message || "Failed to fetch time slots." };
//     }
// };

// export const getReservedTimes = async (date, courseType) => {
//     try {
//         // Encode date for URL parameter if needed
//         const formattedDate = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
//         const response = await api.get(`/reserved-times?date=${formattedDate}&courseType=${courseType}`); // Your backend endpoint
//         return { success: true, reservedTimes: response.data };
//     } catch (error) {
//         console.error("Error fetching reserved times:", error);
//         return { success: false, message: error.response?.data?.message || "Failed to fetch reserved times." };
//     }
// };