import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
// Import service สำหรับเรียก API
import { registerByAdmin } from "../service/userService.js";
import React from "react";


export default function EmployeeForm({ onCancel, onAddEmployee }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // เปลี่ยนชื่อจาก 'position' เป็น 'role' เพื่อให้สอดคล้องกับ backend
    image: "/Images/Profile.jpg",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
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
    const allowedRoles = ['admin', 'caddy', 'starter'];
    if (!allowedRoles.includes(formData.role.toLowerCase())) {
      setError("ตำแหน่งงานไม่ถูกต้อง กรุณาเลือก 'admin', 'caddy' หรือ 'starter'");
      setLoading(false);
      return;
    }

    try {
      // ส่งเฉพาะข้อมูลที่จำเป็นไปให้ API
      const apiData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase(),
      };

      const response = await registerByAdmin(apiData);

      if (response.success) {
        setSuccess("สร้างบัญชีผู้ใช้สำเร็จ!");
        if (onAddEmployee) onAddEmployee(response.user);
        // รีเซ็ตฟอร์มหลังจากสำเร็จ
        setFormData({
          name: "",
          email: "",
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
    <div className="flex flex-col md:flex-row gap-8">
      {/* รูปโปรไฟล์ */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded shadow-md w-52 h-fit text-center">
          <img
            src={formData.image}
            alt="Profile"
            className="rounded-full w-10 h-10 mx-auto object-cover"
          />
          <Button className="w-full mt-4">อัปโหลดรูปภาพ</Button>
        </div>
      </div>

      {/* ฟอร์ม */}
      <form onSubmit={handleSubmit} className="flex-1 bg-white p-6 rounded shadow-md space-y-4 max-w-lg mx-auto">
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
          <Label>ตำแหน่งงาน (admin, caddy, starter)</Label>
          <Input
            placeholder="กรุณากรอกตำแหน่งงาน"
            required
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
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