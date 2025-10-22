import React from "react";

const Step2 = ({ bookingData, handleChange, onNext, onPrev }) => {
  const { players, groupName } = bookingData;
  const isNextDisabled = players < 1 || players > 4 || !groupName.trim();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Step 2: จำนวนผู้เล่นและชื่อกลุ่ม
      </h2>

      <div className="mb-4 text-center">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          จำนวนผู้เล่น (สูงสุด 4 คน):
        </label>
        <div className="flex items-center justify-center space-x-2">
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
            onClick={() =>
              handleChange({
                target: { name: "players", value: Math.max(1, players - 1) },
              })
            }
            disabled={players <= 1}
          >
            -
          </button>
          <span className="text-2xl font-bold">{players}</span>
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-lg"
            onClick={() =>
              handleChange({
                target: { name: "players", value: players + 1 },
              })
            }
            disabled={players >= 4}
          >
            +
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          ชื่อกลุ่ม:
        </label>
        <input
          type="text"
          name="groupName"
          value={groupName}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="กรุณาระบุชื่อกลุ่ม"
          required
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="bg-gray-600 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700"
        >
          ย้อนกลับ
        </button>
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`bg-gray-800 text-white px-6 py-2 rounded-full font-bold ${
            isNextDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
          }`}
        >
          จองต่อ
        </button>
      </div>
    </div>
  );
};

export default Step2;