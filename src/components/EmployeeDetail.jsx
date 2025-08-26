import React from "react";
import { useState } from "react";

// Component แสดงรายละเอียดพนักงาน
export default function EmployeeDetail({ employee, onBack }) {
  // state สำหรับเปิด/ปิดโหมดแก้ไข
  const [isEditing, setIsEditing] = useState(false);
  // state สำหรับเก็บข้อมูลฟอร์มพนักงาน (เริ่มต้นจาก props.employee)
  const [formData, setFormData] = useState(employee);

  // ฟังก์ชันเปลี่ยนค่า field ใน formData
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // ฟังก์ชันบันทึกการแก้ไข (TODO: เพิ่ม logic backend)
  const handleSave = () => {
    setIsEditing(false); // ปิดโหมดแก้ไขหลังบันทึก
  };

 
  // label = ชื่อ field, key = key ของ formData, isTextarea = true ถ้าเป็น textarea
  const renderField = (label, key, isTextarea = false) => (
    <div>
      <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
      {isEditing ? (
        isTextarea ? (
          // ถ้าอยู่ในโหมดแก้ไขและเป็น textarea
          <textarea
            value={formData[key]}
            onChange={e => handleChange(key, e.target.value)}
            className="border border-gray-300 rounded p-2 w-full resize-none"
          />
        ) : (
          // ถ้าอยู่ในโหมดแก้ไขและเป็น input text
          <input
            type="text"
            value={formData[key]}
            onChange={e => handleChange(key, e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        )
      ) : (
        // ถ้าไม่อยู่ในโหมดแก้ไข แสดงเป็น text ธรรมดา
        <p className="text-gray-800 bg-gray-100 p-2 rounded-lg">{formData[key]}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={onBack}
        className="mb-6 text-blue-600 font-medium hover:underline"
      >
        ← ย้อนกลับ
      </button>

      {/* Container หลักแบ่งสองคอลัมน์: รูปภาพ กับ ข้อมูล */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* รูปภาพ */}
        <div className="flex-shrink-0 text-center">
          <img
            src={formData.image} 
            alt={formData.name}
            className="w-44 h-44 object-cover rounded-full mx-auto shadow-md"
          />
          {/* ปุ่มเปลี่ยน/อัปโหลดรูปภาพ */}
          <button className="mt-4 px-5 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800">
            เปลี่ยน/อัปโหลดรูปภาพ
          </button>
        </div>

        {/* ข้อมูล */}
        <div className="flex-1 space-y-8">
          {/* ข้อมูลส่วนตัว */}
          <section>
            <h2 className="text-xl font-bold text-gray-700 mb-3 border-b pb-1 text-center">
              ข้อมูลส่วนตัว
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("ชื่อ-นามสกุล", "name")} 
              {renderField("เพศ", "gender")}          
            </div>
          </section>

          {/* ข้อมูลการติดต่อ */}
          <section>
            <h2 className="text-xl font-bold text-gray-700 mb-3 border-b pb-1 text-center">
              ข้อมูลการติดต่อ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("เบอร์โทรศัพท์", "phone")} 
              {renderField("อีเมล", "email")}          
            </div>
          </section>

          {/* ข้อมูลตำแหน่งงาน */}
          <section>
            <h2 className="text-xl font-bold text-gray-700 mb-3 border-b pb-1 text-center">
              ข้อมูลตำแหน่งงาน
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("ตำแหน่ง", "position")}       
              {renderField("รหัสพนักงาน", "employeeCode")} 
              {renderField("แผนก", "department")}       
            </div>
          </section>

          {/* ปุ่มแก้ไข / บันทึก */}
          <div className="pt-4 flex gap-4 flex-wrap">
            {isEditing ? (
              <>
                {/* ปุ่มบันทึก */}
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
                {/* ปุ่มยกเลิก */}
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 shadow"
                >
                  ยกเลิก
                </button>
              </>
            ) : (
              // ปุ่มเปิดโหมดแก้ไข
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow"
              >
                แก้ไขข้อมูล
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
