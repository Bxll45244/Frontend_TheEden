import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import userService from "../../service/golfer/userService";
import { useAuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Login = () => {
  // เก็บค่าฟอร์มแบบโครง restaurant (username/password)
  // backend email > จะ map ใน userService
  const [login, setLogin] = useState({ username: "", password: "" });

  const navigate = useNavigate();
  const { login: loginFn, signIn, user } = useAuthContext();
  const doLoginToContext = signIn ?? loginFn; // รองรับทั้งชื่อ signIn หรือ login

  // ถ้าเข้าสู่ระบบอยู่แล้ว ให้กลับหน้าแรก
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      // เรียก userService แบบเดิม (username,password) แต่ข้างในจะส่งเป็น email,password
      const res = await userService.login(login.username, login.password);

      // axios response: { status, data }
      if (res.status === 200) {
        // อัปเดต Context ด้วยข้อมูลผู้ใช้ที่ backend ส่งกลับมา
        await doLoginToContext(res.data);

        // แจ้งสำเร็จและกลับหน้าแรก
        await Swal.fire({
          title: "User Login",
          text: "Login successfully!",
          icon: "success",
        });
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        title: "User Login",
        text: error?.response?.data?.message || error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 to-green-300 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center text-black mb-2">Welcome</h2>
        <p className="text-center text-gray-500 mb-4">Login to your account</p>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* ช่อง username (จะใช้เป็น email) */}
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow w-full"
              value={login.username}
              name="username"
              placeholder="Username (your email)"
              onChange={handleChange}
              required
            />
          </label>

          {/* ช่อง password */}
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="password"
              className="grow w-full"
              name="password"
              value={login.password}
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </label>

          <div className="flex justify-between items-center text-sm">
            <Link className="text-green-600 hover:underline" to="#">
              Forgot password?
            </Link>
          </div>

          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all mt-2"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
