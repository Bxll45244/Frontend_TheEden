import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import UserService from "../../service/userService";
import React from "react";

export default function EmployeeForm() {
  const navigate = useNavigate();
  // รับฟังก์ชัน handleAddEmployee จาก Parent Component
  const { handleAddEmployee } = useOutletContext();

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // สร้าง Object URL สำหรับแสดงรูปภาพชั่วคราว
      const newImageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: newImageUrl });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // เช็ครหัสผ่านตรงกัน
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    // เช็ค role ถูกต้อง
    const allowedRoles = ["admin", "caddy", "starter"];
    if (!allowedRoles.includes(formData.role.toLowerCase())) {
      setError("ตำแหน่งงานไม่ถูกต้อง กรุณาเลือก Admin, Caddy หรือ Starter");
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

      const file = fileInputRef.current.files[0];
      if (file) {
        data.append("image", file);
      }

      // เรียก backend
      const response = await UserService.adminRegisterUser(data);

      console.log("Response from server:", response.data);

      // 💡 การแก้ไขสำหรับปัญหาไม่ขึ้นทันที:
      // ดึงข้อมูลผู้ใช้ที่สร้างใหม่ (จากภาพ Console ข้อมูลอยู่ใน response.data โดยตรง)
      const createdUser = response?.data; 

      // ตรวจสอบว่ามี Object ผู้ใช้และมี ID (ยืนยันว่าการบันทึกสำเร็จ)
      if (createdUser && createdUser._id) {
        
        // 🚀 เพิ่ม user ใหม่ลง context (เรียกฟังก์ชันจาก Parent Component)
        // **นี่คือส่วนสำคัญที่ทำให้ข้อมูลอัปเดตทันที**
        if (handleAddEmployee) {
            handleAddEmployee(createdUser);
            console.log("พนักงานใหม่ถูกเพิ่มใน State แล้ว:", createdUser.name);
        }

        setSuccess("เพิ่มข้อมูลสำเร็จ ✅");

        // redirect หลัง 1 วินาที
        setTimeout(() => navigate("/admin"), 1000);
      } else {
        setError(response?.data?.message || "เกิดข้อผิดพลาด: Server ไม่ได้ส่งข้อมูลผู้ใช้กลับมาที่คาดหวัง");
      }
    } catch (err) {
      console.error(err);
      
      // จัดการข้อผิดพลาดจาก Axios
      const serverMessage = err.response?.data?.message || err.response?.data?.error;
      const displayError = serverMessage 
        ? "ข้อผิดพลาดจากเซิร์ฟเวอร์: " + serverMessage 
        : "เกิดข้อผิดพลาดในการเชื่อมต่อ: " + err.message;

      setError(displayError);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // ล้าง Object URL ก่อนออกจากหน้าเพื่อป้องกัน Memory Leak
    if (formData.image && formData.image.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image);
    }
    navigate("/admin");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-start p-4 max-w-4xl mx-auto">
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
            className="hidden"
            accept="image/*"
          />
          <Button
            className="w-full mt-4 bg-green-600 text-white hover:bg-green-800"
            onClick={handleButtonClick}
            type="button"
          >
            อัปโหลดรูปภาพ
          </Button>
        </div>
      </div>

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
            <option value="">เลือกตำแหน่ง</option>
            <option value="Admin">Admin</option>
            <option value="Caddy">Caddy</option>
            <option value="Starter">Starter</option>
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
          <Button
            type="button"
            variant="secondary"
            className="flex-1 bg-red-500 text-white hover:bg-red-800"
            onClick={handleCancel}
          >
            ยกเลิก
          </Button>
        </div>
      </form>
    </div>
  );
}