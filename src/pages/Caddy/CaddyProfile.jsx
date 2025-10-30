import React, { useState, useEffect } from "react";
import { FaGolfBall } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const CaddyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => {
    const mockProfileData = {
      caddyId: "CDY-12345",
      firstName: "สมชาย",
      lastName: "ใจดี",
      email: "somchai.j@golfclub.com",
      phone: "081-234-5678",
      address: "123 หมู่ 4 ตรอกกอล์ฟ",
      province: "กรุงเทพมหานคร",
      postalCode: "10110",
      dateHired: "1 มกราคม 2565",
      employmentStatus: "พนักงานประจำ",
      profilePicture: "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp",
      completedRoundsByYear: { 2025: 120, 2024: 210, 2023: 180 },
    };
    const t = setTimeout(() => { setProfile(mockProfileData); setLoading(false); }, 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl text-gray-500" />
      </div>
    );
  }

  const availableYears = Object.keys(profile.completedRoundsByYear).sort((a, b) => b - a);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 hover:text-gray-900 font-semibold transition-colors"
        >
          &lt; ย้อนกลับ
        </button>
      </div>

      <div className="flex justify-center">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="avatar mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-indigo-500 ring-offset-2">
                <img src={profile.profilePicture} alt="Profile" className="object-cover w-full h-full" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h2>
            <span className="text-indigo-500 font-medium mt-1">รหัสแคดดี้: {profile.caddyId}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-gray-700">
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="font-semibold text-gray-600">อีเมล</span>
              <p className="text-gray-900 mt-1">{profile.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="font-semibold text-gray-600">เบอร์โทรศัพท์</span>
              <p className="text-gray-900 mt-1">{profile.phone}</p>
            </div>
            <div className="sm:col-span-2 bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="font-semibold text-gray-600">ที่อยู่</span>
              <p className="text-gray-900 mt-1">
                {profile.address}, {profile.province}, {profile.postalCode}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="font-semibold text-gray-600">วันที่เข้าทำงาน</span>
              <p className="text-gray-900 mt-1">{profile.dateHired}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <span className="font-semibold text-gray-600">สถานะการทำงาน</span>
              <p className="text-gray-900 mt-1">{profile.employmentStatus}</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaGolfBall className="mr-2 text-indigo-500" />
              สถิติการทำงาน
            </h3>

            <div className="mb-4 flex items-center gap-2">
              <span className="font-semibold text-gray-600">เลือกปี:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3 bg-indigo-50 p-4 rounded-xl shadow-sm">
              <BsGraphUp className="text-indigo-600 text-2xl" />
              <span className="font-semibold text-gray-700">
                จำนวนรอบที่ทำสำเร็จในปี {selectedYear}:
              </span>
              <span className="text-xl font-bold text-indigo-700">
                {profile.completedRoundsByYear[selectedYear]} รอบ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaddyProfile;
