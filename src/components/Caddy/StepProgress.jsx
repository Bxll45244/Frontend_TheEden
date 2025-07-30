// src/components/StepProgress.jsx
import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const steps = [
  { label: "ออกรอบกอล์ฟ", key: "start" },
  { label: "จบการเล่น", key: "end" },
  { label: "เปลี่ยนแบตสำเร็จ", key: "battery" },
];

const StepProgress = ({ currentStep, onConfirm, onCancel }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-center text-xl font-bold mb-4">สถานะการทำงาน</h2>
      <div className="flex flex-col gap-6">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={step.key}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg border-2 
                ${isDone ? "border-green-500 bg-green-50" :
                  isCurrent ? "border-blue-500 bg-blue-50 animate-pulse" :
                    "border-gray-300 bg-gray-50"}`}
            >
              {isDone ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <div className={`w-6 h-6 rounded-full 
                  ${isCurrent ? "bg-blue-500" : "bg-gray-300"}`} />
              )}
              <span className={`text-base ${isDone ? "line-through text-gray-400" : ""}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onCancel}
          className="btn btn-outline btn-error w-[48%]"
        >
          ยกเลิก
        </button>
        <button
          onClick={onConfirm}
          className="btn btn-primary w-[48%]"
        >
          ยืนยัน
        </button>
      </div>
    </div>
  );
};

export default StepProgress;
