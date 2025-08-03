import { useState } from "react";

export default function EmployeeDetail({ employee, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(employee);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    // สามารถเพิ่ม logic สำหรับการบันทึกไปยัง backend ได้ที่นี่
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <button onClick={onBack} className="mb-6 text-blue-600 font-medium hover:underline">
        ← ย้อนกลับ
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-shrink-0 text-center">
          <img
            src={formData.image}
            alt={formData.name}
            className="w-44 h-44 object-cover rounded-full mx-auto shadow-md"
          />
          <button className="mt-4 px-5 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800">
            เปลี่ยน/อัปโหลดรูปภาพ
          </button>
        </div>

        <div className="flex-1 space-y-8">
          {/* ข้อมูลส่วนตัว */}
          <section>
            <h2 className="text-xl font-bold text-gray-700 mb-3 border-b pb-1 text-center">ข้อมูลส่วนตัว</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("ชื่อ-นามสกุล", "name")}
              {renderField("เพศ", "gender")}
              {renderField("วันเกิด", "birthdate")}
              {renderField("สัญชาติ", "nationality")}
              {renderField("เลขบัตรประชาชน", "idCard")}
              {renderField("ที่อยู่", "address", true)}
            </div>
          </section>

          {/* ข้อมูลการติดต่อ */}
          <section>
            <h2 className="text-xl font-bold text-gray-700 mb-3 border-b pb-1 text-center">ข้อมูลการติดต่อ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("เบอร์โทรศัพท์", "phone")}
              {renderField("อีเมล", "email")}
              {renderField("ไลน์ไอดี", "lineId")}
            </div>
          </section>

          {/* ข้อมูลตำแหน่งงาน */}
          <section>
            <h2 className="text-xl font-bold text-gray-700 mb-3 border-b pb-1 text-center">ข้อมูลตำแหน่งงาน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("ตำแหน่ง", "position")}
              {renderField("รหัสพนักงาน", "employeeCode")}
              {/*<p><strong>รหัสพนักงาน:</strong> {formData.employeeCode}</p>*/}
              {renderField("วันที่เริ่มงาน", "startDate")}
              {renderField("วันหมดสัญญา", "contractEnd")}
              {renderField("ประเภทพนักงาน", "workType")}
              {renderField("สถานที่ทำงาน", "workplace")}
              {renderField("เงินเดือน", "salary")}
              {renderField("แผนก", "department")}
            </div>
          </section>

          {/* ปุ่มแก้ไข/บันทึก */}
          <div className="pt-4 flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 shadow"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 shadow"
                >
                  ยกเลิก
                </button>
              </>
            ) : (
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

  function renderField(label, key, isTextarea = false) {
    return (
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
        {isEditing ? (
          isTextarea ? (
            <textarea
              value={formData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border border-gray-300 rounded p-2 w-full resize-none"
            />
          ) : (
            <input
              type="text"
              value={formData[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          )
        ) : (
          <p className="text-gray-800 bg-gray-100 p-2 rounded-lg">{formData[key]}</p>
        )}
      </div>
    );
  }
}