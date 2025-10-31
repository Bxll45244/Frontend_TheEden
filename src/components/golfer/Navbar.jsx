import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2"; // ⬅️ เพิ่ม
import { CircleUser } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImg, setProfileImg] = useState("");

  useEffect(() => {
    if (user?.img) setProfileImg(user.img);
    else setProfileImg("");
  }, [user]);

  // ⬇️ ฟังก์ชันยืนยันก่อนออกจากระบบ
  async function confirmLogout() {
    const res = await Swal.fire({
      title: "ออกจากระบบ?",
      text: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบตอนนี้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      focusCancel: true,
      // โทนเรียบ ๆ แบบ Apple-ish
      background: "#ffffffee",
      color: "#0f172a",
      showCloseButton: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton:
          "swal2-confirm !rounded-full !px-5 !py-2.5 !bg-red-600 hover:!bg-red-700 !text-white !font-medium",
        cancelButton:
          "swal2-cancel !rounded-full !px-5 !py-2.5 !bg-gray-100 hover:!bg-gray-200 !text-gray-800 !font-medium",
      },
      buttonsStyling: false,
    });

    if (res.isConfirmed) {
      await logout();
      setDropdownOpen(false);
      await Swal.fire({
        icon: "success",
        title: "ออกจากระบบแล้ว",
        timer: 1200,
        showConfirmButton: false,
        background: "#ffffffee",
        color: "#0f172a",
      });
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/images/golfer/eden-Logo.png"
            alt="The Eden Golf Club Logo"
            className="h-12 sm:h-14"
          />
        </Link>

        {/* เมนูด้านขวา */}
        <div className="hidden md:flex items-center space-x-6 relative">
          {!user ? (
            <Link
              to="/register"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-lg"
            >
              Join Us
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center justify-center focus:outline-none rounded-full border border-gray-200 hover:border-green-400 transition p-0.5"
              >
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 grid place-items-center font-en">
                    {(user?.name || "?").slice(0, 1).toUpperCase()}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* ชื่อ */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm text-gray-500">ยินดีต้อนรับ</p>
                    <p className="text-base font-en text-gray-800 truncate">
                      {user?.name || "ผู้ใช้"}
                    </p>
                  </div>

                  {/* ลิงก์ */}
                  <ul className="py-1 text-gray-700">
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-50 transition"
                      >
                        โปรไฟล์ของฉัน
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={confirmLogout} // ⬅️ เปลี่ยนเป็นยืนยันก่อนออก
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition"
                      >
                        ออกจากระบบ
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
