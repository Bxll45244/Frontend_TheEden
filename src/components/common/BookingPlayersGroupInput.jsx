import React from 'react';
import QuantityControl from '../../common/QuantityControl'; // นำเข้า QuantityControl

/**
 * Component สำหรับ Step 3: จำนวนผู้เล่นและชื่อกลุ่ม
 * @param {object} props - Properties ของ Component
 * @param {number} props.players - จำนวนผู้เล่น
 * @param {string} props.groupName - ชื่อกลุ่ม
 * @param {function} props.onQuantityChange - Callback เมื่อจำนวนผู้เล่นเปลี่ยน
 * @param {function} props.onGroupNameChange - Callback เมื่อชื่อกลุ่มเปลี่ยน
 */
const BookingPlayersGroupInput = ({ players, groupName, onQuantityChange, onGroupNameChange }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 text-center">จำนวนผู้เล่นและชื่อกลุ่ม</h3>

      {/* Players Quantity */}
      <QuantityControl
        label="จำนวนผู้เล่น ?"
        quantity={players}
        onIncrease={() => onQuantityChange('players', 1)}
        onDecrease={() => onQuantityChange('players', -1)}
        disabledDecrease={players <= 1}
        disabledIncrease={players >= 4}
      />

      {/* Group Name Input */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2 text-center">
          ชื่อกลุ่ม
        </label>
        <input
          type="text"
          id="groupName"
          name="groupName"
          value={groupName}
          onChange={onGroupNameChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          placeholder="ระบุชื่อกลุ่มของคุณ"
          required
        />
      </div>
    </div>
  );
};

export default BookingPlayersGroupInput;