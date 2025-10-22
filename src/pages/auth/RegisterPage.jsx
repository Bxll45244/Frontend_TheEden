import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import userService from "../../service/golfer/userService"; 

const Register = () => {
  // ปรับฟิลด์ให้ตรง backend ต้องมี name, phone, email, password
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // อัปเดตค่าแต่ละช่อง
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // ส่งข้อมูลสมัครสมาชิก
  const handleSubmit = async () => {
    try {
      // ตรวจสอบอย่างง่าย
      if (!/\S+@\S+\.\S+/.test(user.email)) {
        Swal.fire("User Registration", "กรุณากรอกอีเมลให้ถูกต้อง", "error");
        return;
      }
      if (!/^\d{9,}$/.test(user.phone)) {
        // เบอร์โทรศัพท์ต้องมีอย่างน้อย 9 หลัก 
        Swal.fire("User Registration", "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง", "error");
        return;
      }
      if (user.password.length < 6) {
        Swal.fire("User Registration", "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", "error");
        return;
      }

      const res = await userService.register(
        user.name,
        user.phone,
        user.email,
        user.password
      );

      if (res.status === 200 || res.status === 201) {
        Swal.fire({
          title: "User Registration",
          text: res.data?.message || "ลงทะเบียนสำเร็จ!",
          icon: "success",
        }).then(() => {
          setUser({ name: "", phone: "", email: "", password: "" });
          navigate("/login");
        });
      } else {
        Swal.fire({
          title: "User Registration",
          text: res.data?.message || "ลงทะเบียนไม่สำเร็จ",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "User Registration",
        text: error?.response?.data?.message || error.message,
        icon: "error",
      });
    }
  };

  // ยกเลิกและกลับหน้าแรก
  const handleCancel = () => {
    setUser({ name: "", phone: "", email: "", password: "" });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 to-green-300 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg flex overflow-hidden">
        {/* รูปประกอบ (เอาออกได้ถ้าไม่ใช้) */}
        <div className="w-3/5 hidden md:block">
          <img
            src="/images/Grab_register.jpg"
            alt="Register Illustration"
            className="object-cover w-full h-full"
          />
        </div>

        {/* ฟอร์มสมัคร */}
        <div className="w-full md:w-1/2 p-8 flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-center text-black-700 mb-2">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-4">
            Sign up to get started!
          </p>

          {/* Email */}
          <label className="input input-bordered flex items-center gap-2 w-full">
            <input
              type="email"
              className="grow w-full"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </label>

          {/* Phone */}
          <label className="input input-bordered flex items-center gap-2 w-full">
            <input
              type="tel"
              className="grow w-full"
              placeholder="Phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              required
            />
          </label>

          {/* Name */}
          <label className="input input-bordered flex items-center gap-2 w-full">
            <input
              type="text"
              className="grow w-full"
              placeholder="Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </label>

          {/* Password */}
          <label className="input input-bordered flex items-center gap-2 w-full">
            <input
              type="password"
              value={user.password}
              className="grow w/full"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              required
            />
          </label>

          {/* ปุ่ม */}
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all"
            onClick={handleSubmit}
            type="button"
          >
            Register
          </button>

          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition-all"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <p className="text-center text-sm text-gray-500 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
