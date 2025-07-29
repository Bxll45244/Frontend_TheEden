import React, { useState, useEffect } from "react";
// ตรวจสอบพาธให้แน่ใจว่าถูกต้องอีกครั้ง! (ตามที่ได้แก้ไขปัญหาไปแล้ว)
import CaddySelectionModal from "./CaddySelectionModal"; // พาธนี้ต้องถูกต้อง!
import { getAllUsers } from '../../service/authService'; // นำเข้า authService เพื่อดึง caddies

const BookingAccessoriesCaddySelection = ({
  bookingData,
  onQuantityChange,
  onUseAccessoryToggle,
  pricing,
  // ลบ props ที่เกี่ยวกับ Modal และ caddy selection ออกไป
  // showCaddySelectionModal, setShowCaddySelectionModal, availableCaddies, tempSelectedCaddyIds, onCaddySelect, onConfirmCaddySelection,
  onCaddySelectionChange, // เพิ่ม prop ใหม่ เพื่อส่งข้อมูล caddy ที่เลือกกลับไปให้ parent
}) => {
  const [showCaddySelectionModalInternal, setShowCaddySelectionModalInternal] = useState(false);
  const [availableCaddiesInternal, setAvailableCaddiesInternal] = useState([]);
  const [tempSelectedCaddyIdsInternal, setTempSelectedCaddyIdsInternal] = useState([]);
  const [error, setError] = useState('');

  // Effect สำหรับดึงข้อมูลแคดดี้เมื่อ Modal ถูกเปิด
  useEffect(() => {
    const fetchAvailableCaddies = async () => {
      if (showCaddySelectionModalInternal) {
        // ใน Production: ควรทำการ fetch จาก Backend API ที่กรอง caddy ที่ว่างตามวันและเวลาที่เลือก
        // สำหรับตอนนี้ เราจะดึงผู้ใช้ทั้งหมดที่มี role เป็น 'caddy' และ caddyStatus เป็น 'available'
        try {
          const result = await getAllUsers();
          if (result.success) {
            const caddies = result.users.filter(user => user.role === 'caddy' && user.caddyStatus === 'available');
            setAvailableCaddiesInternal(caddies);
          } else {
            setError(result.message || "Failed to fetch available caddies.");
            setAvailableCaddiesInternal([]);
          }
        } catch (err) {
          console.error("Error fetching available caddies:", err);
          setError("An error occurred while fetching available caddies.");
        }
        // เมื่อเปิด modal ให้ตั้งค่า tempSelectedCaddyIds ให้ตรงกับ selectedCaddyIds ปัจจุบันจาก bookingData
        setTempSelectedCaddyIdsInternal([...bookingData.selectedCaddyIds]);
      }
    };
    fetchAvailableCaddies();
  }, [showCaddySelectionModalInternal, bookingData.selectedCaddyIds]); // เพิ่ม bookingData.selectedCaddyIds ใน dependencies

  const handleCaddySelectInternal = (caddyId) => {
    setTempSelectedCaddyIdsInternal((prevSelected) => {
      if (prevSelected.includes(caddyId)) {
        return prevSelected.filter((id) => id !== caddyId);
      } else {
        // จำกัดจำนวนแคดดี้ที่เลือกได้ ไม่เกินจำนวนผู้เล่น
        if (prevSelected.length < bookingData.players) {
            return [...prevSelected, caddyId];
        }
        // ถ้าเกินจำนวนผู้เล่น ไม่อนุญาตให้เลือกเพิ่ม
        alert(`คุณสามารถเลือกแคดดี้ได้ไม่เกิน ${bookingData.players} คน`);
        return prevSelected;
      }
    });
  };

  const confirmCaddySelectionInternal = () => {
    // ส่งข้อมูล caddy ที่เลือกกลับไปให้ parent
    // parent จะรับ selectedCaddyIds และอัปเดต caddyQty เอง
    if (onCaddySelectionChange) {
        onCaddySelectionChange(tempSelectedCaddyIdsInternal);
    }
    setShowCaddySelectionModalInternal(false);
  };

  // ราคาอุปกรณ์แต่ละชนิด
  const getAccessoryPrice = (key) => pricing ? pricing[key] : 0;

  // คาดว่า bookingData มี totalPrice, basePlayingFee อยู่แล้วจากการคำนวณใน GolferBookingPage
  // ถ้าอยากให้ component นี้คำนวณ accessories เอง ก็ต้องรับ pricing เข้ามา
  // และปรับปรุง useEffect ใน GolferBookingPage ไม่ต้องคำนวณส่วนนี้

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">อุปกรณ์เสริมและแคดดี้</h2>

      {/* Golf Cart Selection */}
      <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
        <label className="flex items-center space-x-3 mb-2 cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-green-600 rounded"
            checked={bookingData.useGolfCart}
            onChange={() => onUseAccessoryToggle('useGolfCart')}
          />
          <span className="text-lg font-medium text-gray-700">รถกอล์ฟ (คันละ {getAccessoryPrice('golfCart')} บาท)</span>
        </label>
        {bookingData.useGolfCart && (
          <div className="flex items-center space-x-2 mt-2 ml-8">
            <button
              type="button"
              onClick={() => onQuantityChange('golfCartQty', -1)}
              className="px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>
            <span className="text-lg font-bold">{bookingData.golfCartQty}</span>
            <button
              type="button"
              onClick={() => onQuantityChange('golfCartQty', 1)}
              className="px-3 py-1 border rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              +
            </button>
            <span className="text-gray-600"> (จำนวนคัน)</span>
          </div>
        )}
      </div>

      {/* Golf Bag Selection */}
      <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
        <label className="flex items-center space-x-3 mb-2 cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-green-600 rounded"
            checked={bookingData.useGolfBag}
            onChange={() => onUseAccessoryToggle('useGolfBag')}
          />
          <span className="text-lg font-medium text-gray-700">ถุงกอล์ฟ (ถุงละ {getAccessoryPrice('golfBag')} บาท)</span>
        </label>
        {bookingData.useGolfBag && (
          <div className="flex items-center space-x-2 mt-2 ml-8">
            <button
              type="button"
              onClick={() => onQuantityChange('golfBagQty', -1)}
              className="px-3 py-1 border rounded-md bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>
            <span className="text-lg font-bold">{bookingData.golfBagQty}</span>
            <button
              type="button"
              onClick={() => onQuantityChange('golfBagQty', 1)}
              className="px-3 py-1 border rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              +
            </button>
            <span className="text-gray-600"> (จำนวนถุง)</span>
          </div>
        )}
      </div>

      {/* Caddy Selection */}
      <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
        <label className="flex items-center space-x-3 mb-2 cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-green-600 rounded"
            checked={bookingData.useCaddy}
            onChange={() => onUseAccessoryToggle('useCaddy')}
          />
          <span className="text-lg font-medium text-gray-700">แคดดี้ (คนละ {getAccessoryPrice('caddy')} บาท)</span>
        </label>
        {bookingData.useCaddy && (
          <div className="mt-2 ml-8">
            <button
              type="button"
              onClick={() => setShowCaddySelectionModalInternal(true)}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              เลือกแคดดี้ ({bookingData.selectedCaddyIds.length} คน)
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {bookingData.selectedCaddyIds.length > 0 && (
                <div className="mt-2 text-gray-600 text-sm">
                    แคดดี้ที่เลือก: {bookingData.selectedCaddyIds.map(id => {
                        const caddy = availableCaddiesInternal.find(c => c._id === id);
                        return caddy ? caddy.username : 'Unknown';
                    }).join(', ')}
                </div>
            )}
          </div>
        )}
      </div>

      {/* Caddy Selection Modal */}
      {showCaddySelectionModalInternal && (
        <CaddySelectionModal
          isOpen={showCaddySelectionModalInternal}
          onClose={() => setShowCaddySelectionModalInternal(false)}
          availableCaddies={availableCaddiesInternal}
          tempSelectedCaddyIds={tempSelectedCaddyIdsInternal}
          onCaddySelect={handleCaddySelectInternal}
          onConfirm={confirmCaddySelectionInternal}
          maxCaddies={bookingData.players} // ส่งจำนวนผู้เล่นไปเป็น max caddy ได้
        />
      )}
    </div>
  );
};

export default BookingAccessoriesCaddySelection;