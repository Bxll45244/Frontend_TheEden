import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
// Import service สำหรับเรียก API
import { registerByAdmin } from "../service/userService.js";
import React from "react";

export default function EmployeeForm({ onCancel, onAddEmployee }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    image: "/Images/Profile.jpg",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fileInputRef = useRef(null);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  // จัดการการเปลี่ยนรูปภาพ
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // สร้าง URL ชั่วคราวจากไฟล์ที่เลือก
      const newImageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: newImageUrl });
      // ในการใช้งานจริง คุณจะส่งไฟล์นี้ไปที่ API
      // เช่น: uploadImage(file);
    }
  };

  // ฟังก์ชันสำหรับเรียก input file เมื่อกดปุ่ม
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // ตรวจสอบรหัสผ่านว่าตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    // ตรวจสอบ Role ว่าอยู่ในรูปแบบที่กำหนดหรือไม่
    const allowedRoles = ["admin", "caddy", "starter"];
    if (!allowedRoles.includes(formData.role.toLowerCase())) {
      setError(
        "ตำแหน่งงานไม่ถูกต้อง กรุณาเลือก 'admin', 'caddy' หรือ 'starter'"
      );
      setLoading(false);
      return;
    }

  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role.toLowerCase());

    // ถ้ามีไฟล์รูป ให้ส่งด้วย
    const file = fileInputRef.current.files[0];
    if (file) {
      data.append("image", file); // backend จะได้ req.files
    }

    const response = await registerByAdmin(data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.success) {
      setSuccess("สร้างบัญชีผู้ใช้สำเร็จ!");
      if (onAddEmployee) onAddEmployee(response.user);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "",
        image: "/Images/Profile.jpg",
      });
    } else {
      setError(response.message || "เกิดข้อผิดพลาดในการสร้างบัญชี");
    }
  } catch (err) {
    setError("เกิดข้อผิดพลาดในการเชื่อมต่อ: " + err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-start p-4 max-w-4xl mx-auto">
      {/* รูปโปรไฟล์ */}
      <div className="flex justify-center md:justify-start">
        <div className="bg-white p-2 rounded shadow-md w-48 h-fit text-center">
          <img
            src={formData.image}
            alt="Profile"
            className="rounded-full w-40 h-40 mx-auto object-cover"
          />
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden" // ซ่อน input จากการแสดงผล
            accept="image/*" // อนุญาตเฉพาะไฟล์ภาพ
          />
          <Button
            className="w-full mt-4 bg-green-600 text-white hover:bg-green-800"
            onClick={handleButtonClick}
            type="button" // กำหนด type เป็น button เพื่อป้องกันการ submit ฟอร์ม
          >
            อัปโหลดรูปภาพ
          </Button>
        </div>
      </div>

      {/* ฟอร์ม */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 bg-white p-6 rounded shadow-md space-y-4 w-full max-w-md"
      >
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-500 text-center">{success}</div>}
        <div>
          <Label>ชื่อ - นามสกุล</Label>
          <Input
            placeholder="กรุณากรอกชื่อ - นามสกุล"
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div>
          <Label>อีเมล</Label>
          <Input
            type="email"
            placeholder="กรุณากรอกอีเมล"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
  <Label>เบอร์โทรศัพท์</Label>
  <Input
    type="text"
    placeholder="กรุณากรอกเบอร์โทรศัพท์"
    required
    value={formData.phone}
    onChange={(e) => handleChange("phone", e.target.value)}
  />
</div>

        <div>
          <Label>รหัสผ่าน</Label>
          <Input
            type="password"
            placeholder="กรุณากรอกรหัสผ่าน"
            required
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>
        <div>
          <Label>ยืนยันรหัสผ่าน</Label>
          <Input
            type="password"
            placeholder="กรุณายืนยันรหัสผ่าน"
            required
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
        </div>
        <div>
          <Label>กรุณาเลือกตำแหน่งงาน</Label>
          <select
            required
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="border border-black rounded p-2 w-full"
            
          >
            <option value="">กรุณากรอกตำแหน่งงาน</option>
            <option value="Admin">admin</option>
            <option value="Caddy">caddy</option>
            <option value="Starter">starter</option>
          </select>
        </div>

        <div className="flex gap-4 flex-wrap">
          <Button
            type="submit"
            className="flex-1 bg-green-600 text-white hover:bg-green-800"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              className="flex-1 bg-red-500 text-white hover:bg-red-800"
              onClick={onCancel}
            >
              ยกเลิก
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}