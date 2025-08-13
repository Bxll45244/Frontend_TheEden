import React, { useState, useEffect } from "react";
import axios from "axios"; // นำเข้า axios เพื่อใช้เรียก API
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

// กำหนด URL ของ API หลัก
const API_BASE_URL = "http://localhost:5000/api/issues"; 

// Mapping สีสำหรับ Tailwind CSS
const colorMap = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
};

const ReportPage = () => {
  const [confirmData, setConfirmData] = useState(null); // เก็บข้อมูลที่จะยืนยัน
  const [popup, setPopup] = useState(null); // สำหรับแสดง Popup (สำเร็จ/ข้อผิดพลาด)
  // สถานะหลุมกอล์ฟ เก็บจาก Backend
  const [holeStatuses, setHoleStatuses] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); // สถานะการโหลดข้อมูล
  const [error, setError] = useState(null); // สถานะข้อผิดพลาดจากการเรียก API

  // useEffect สำหรับดึงข้อมูลสถานะหลุมกอล์ฟจาก Backend เมื่อ Component ถูก mount
  useEffect(() => {
    fetchHoleStatuses();
  }, []); // Array ว่างเปล่าทำให้ Effect ทำงานเพียงครั้งเดียว

  // ฟังก์ชันสำหรับดึงข้อมูลสถานะหลุมกอล์ฟจาก Backend
  const fetchHoleStatuses = async () => {
    setIsLoading(true); // เริ่มโหลดข้อมูล
    setError(null); // ล้างข้อผิดพลาดเก่า
    try {
      const response = await axios.get(`${API_BASE_URL}/hole-status`);
      const backendData = response.data; 

      // <--- บรรทัดนี้คือจุดที่ต้องแก้ไข! เข้าถึง array ผ่าน backendData.holeStatuses
      const formattedStatuses = backendData.holeStatuses.map(hole => {
        let displayColor = "green"; // Default to green (open)
        let displayStatus = "ใช้งานได้";

        // Logic การ Mapping สถานะจาก Backend ไปยัง Frontend
        if (hole.currentStatus === 'closed') {
          displayColor = "red";
          displayStatus = hole.activeIssue?.description || "ปิดหลุม"; 
        } else if (hole.currentStatus === 'under_maintenance') {
          displayColor = "blue";
          displayStatus = "กำลังแก้ไข";
        }
        // หากมีสถานะอื่นๆ เช่น "รถเสีย" หรือ "กระเป๋าเสีย" คุณอาจต้องเพิ่มเงื่อนไขที่นี่

        return {
          number: hole.holeNumber,
          color: displayColor,
          status: displayStatus,
          issueId: hole.activeIssue ? hole.activeIssue._id : null // ดึง _id ของ activeIssue
        };
      });
      setHoleStatuses(formattedStatuses);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching hole statuses:", err.response?.data || err.message);
      setError("ไม่สามารถดึงข้อมูลสถานะหลุมกอล์ฟได้");
      setIsLoading(false);
    }
  };


  // ฟังก์ชันที่ใช้เรียกเมื่อกดปุ่ม "ยืนยัน" ใน Card แต่ละใบ
  const handleSubmit = (title, data) => {
    // ตรวจสอบความถูกต้องของข้อมูล (Validation)
    const requiredFields = ["hole"];
    if (title.includes("ชื่อ")) requiredFields.push("name");
    // สำหรับ 'แจ้งปิดหลุม' ต้องมี 'issue' ด้วย
    if (title === "แจ้งปิดหลุม") requiredFields.push("issue");

    const isValid = requiredFields.every(
      (field) => data[field] && data[field].toString().trim() !== ""
    );

    if (!isValid) {
      // ใช้ popup เพื่อแสดงข้อความแจ้งเตือนแทน alert()
      setPopup({ title: "กรุณากรอกข้อมูลให้ครบถ้วน", isError: true });
      return;
    }

    // เก็บข้อมูลไว้ใน confirmData เพื่อแสดง Popup ยืนยัน
    setConfirmData({ title, ...data });
  };

  // ฟังก์ชันที่ทำงานเมื่อผู้ใช้กด "ตกลง" ใน Popup ยืนยัน
  const handleConfirm = async () => {
    if (!confirmData) return;

    const { title, hole, issue, name, issueId } = confirmData; // รับ issueId จาก confirmData ด้วย
    let endpoint = "";
    let requestData = {};
    let successMsg = "";
    
    try {
      if (title === "แจ้งปิดหลุม") {
        endpoint = "/report-hole-closure";
        // 'reportedBy' ต้องเป็น ID ของผู้ใช้จริงที่ล็อกอินอยู่ (จาก auth context/state)
        requestData = { 
            holeNumber: Number(hole), 
            description: issue, 
            reportedBy: 'user_caddy_starter_id' // <--- **สำคัญ:** คุณต้องแทนที่ด้วย ID ผู้ใช้จริงเมื่อมีการจัดการ Authentication
        };
        successMsg = "แจ้งปิดหลุมสำเร็จ";
        await axios.post(`${API_BASE_URL}${endpoint}`, requestData);

      } else if (title === "แจ้งสถานะกำลังแก้ไข") {
        if (!issueId) { // ตรวจสอบว่ามี issueId สำหรับการอัปเดตสถานะหรือไม่
          throw new Error("ไม่พบ ID ปัญหาสำหรับการดำเนินการนี้ (กำลังแก้ไข)");
        }
        endpoint = `/${issueId}/mark-in-progress`;
        successMsg = "แจ้งสถานะกำลังแก้ไขสำเร็จ";
        // personInCharge ต้องเป็น ID ของผู้ใช้จริง
        requestData = { personInCharge: 'user_starter_id' }; 
        await axios.put(`${API_BASE_URL}${endpoint}`, requestData); 

      } else if (title === "แจ้งเปิดใช้งานหลุม") {
        if (!issueId) { // ตรวจสอบว่ามี issueId สำหรับการอัปเดตสถานะหรือไม่
          throw new Error("ไม่พบ ID ปัญหาสำหรับการดำเนินการนี้ (เปิดใช้งาน)");
        }
        endpoint = `/${issueId}/mark-resolved`;
        successMsg = "แจ้งเปิดใช้งานหลุมสำเร็จ";
        // resolvedBy ต้องเป็น ID ของผู้ใช้จริง
        requestData = { resolvedBy: 'user_resolver_id' }; 
        await axios.put(`${API_BASE_URL}${endpoint}`, requestData); 

      } else if (title === "ส่งรถกอล์ฟ") {
        updateHoleStatusOnFrontend({ hole, color: "orange", status: "ส่งรถกอล์ฟแล้ว" });
        successMsg = "ส่งรถกอล์ฟสำเร็จ";
      } else if (title === "ส่งกระเป๋ากอล์ฟ") {
        updateHoleStatusOnFrontend({ hole, color: "yellow", status: "กระเป๋าเสีย" }); 
        successMsg = "ส่งกระเป๋ากอล์ฟสำเร็จ";
      }

      // หลังจากทำรายการเสร็จสิ้น ไม่ว่าจะเป็นการเรียก API หรืออัปเดต Frontend
      // ให้ดึงสถานะหลุมล่าสุดจาก Backend เสมอ เพื่อให้ UI เป็นปัจจุบัน
      await fetchHoleStatuses(); 
      setPopup({ title: successMsg, isError: false }); // แสดง popup สำเร็จ
      setConfirmData(null); // ปิด popup ยืนยัน

    } catch (err) {
      console.error("Error confirming action:", err.response?.data || err.message);
      setPopup({ 
        title: `เกิดข้อผิดพลาดในการ ${title}: ${err.response?.data?.message || err.message}`, 
        isError: true 
      }); // แสดง popup ข้อผิดพลาด
      setConfirmData(null); // ปิด popup ยืนยัน
    }
  };

  // Helper function เพื่ออัปเดตสถานะใน Frontend เท่านั้น (สำหรับกรณีที่ไม่มี API)
  const updateHoleStatusOnFrontend = ({ hole, color, status }) => {
    setHoleStatuses((prev) =>
      prev.map((h) => (h.number === Number(hole) ? { ...h, color, status } : h))
    );
  };

  // ฟังก์ชันสำหรับปิด Popup
  const handleSuccessClose = () => {
    setPopup(null);
  };

  // ฟังก์ชันสำหรับ Render Popup (ยืนยัน/สำเร็จ/ข้อผิดพลาด)
  const renderPopup = () => {
    // Popup สำหรับยืนยันก่อนทำรายการ
    if (confirmData) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[60%] max-w-xs rounded-3xl">
            <FontAwesomeIcon
              icon={faExclamation}
              style={{ color: "#FFD43B", fontSize: "48px" }}
              className="mb-4"
            />
            <h3 className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
              >
                ตกลง
              </button>
              <button
                onClick={() => setConfirmData(null)}
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      );
    }
    // Popup สำหรับแสดงผลลัพธ์ (สำเร็จ/ข้อผิดพลาด)
    if (popup) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[70%] max-w-xs space-y-4 rounded-3xl">
            <FontAwesomeIcon
              icon={popup.isError ? faExclamation : faCircleCheck} // เปลี่ยน Icon ตามสถานะ
              className={popup.isError ? "text-red-500 mx-auto" : "text-green-500 mx-auto"} // เปลี่ยนสี Icon ตามสถานะ
              style={{ fontSize: "48px" }}
            />
            <h2 className="text-3xl font-extrabold">{popup.isError ? "เกิดข้อผิดพลาด!" : "สำเร็จ!"}</h2>
            <h3 className="text-base font-normal text-gray-800">
              {popup.title}
            </h3>
            <button
              onClick={handleSuccessClose}
              className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
            >
              ตกลง
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  // Card component (แยกภายใน หรือจะย้ายไฟล์ก็ได้)
  const Card = ({ color, title, showName, showIssue }) => {
    const [hole, setHole] = useState("");
    const [name, setName] = useState("");
    const [issue, setIssue] = useState("");

    // ค้นหา active issueId ของหลุมที่เลือก (ถ้ามี active issue)
    // ใช้ holeStatuses ที่ดึงมาจาก Backend
    const currentHoleStatus = holeStatuses.find(h => h.number === Number(hole));
    const issueId = currentHoleStatus ? currentHoleStatus.issueId : null;

    // ตรวจสอบความถูกต้องของฟอร์มใน Card
    const isValid = () => {
      if (!hole.trim()) return false; // ต้องมีหมายเลขหลุม
      if (showName && !name.trim()) return false; // ต้องมีชื่อถ้า showName เป็น true
      if (showIssue && !issue.trim()) return false; // ต้องมีปัญหาถ้า showIssue เป็น true

      // สำหรับ "แจ้งสถานะกำลังแก้ไข" และ "แจ้งเปิดใช้งานหลุม"
      // ต้องมี active issueId ถึงจะกดปุ่มได้
      if ((title === "แจ้งสถานะกำลังแก้ไข" || title === "แจ้งเปิดใช้งานหลุม") && !issueId) {
        return false;
      }
      return true;
    };

    return (
      <div className="w-full max-w-[240px] p-2 border border-gray-800 rounded-xl shadow-sm bg-gray-50">
        <div className="flex items-center mb-3">
          <div className={`w-4 h-4 rounded-full ${colorMap[color]} mr-2`}></div>
          <h2 className="text-md font-semibold">{title}</h2>
        </div>

        <label className="block mb-1 font-medium text-sm">หมายเลขหลุม</label>
        <input
          type="text"
          value={hole}
          onChange={(e) => setHole(e.target.value)}
          className="w-20 mb-3 px-2 py-1 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-sm"
          placeholder="เลขหลุม"
        />

        {showName && (
          <>
            <label className="block mb-1 font-medium text-sm">ชื่อ</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 px-2 py-1 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              placeholder="ระบุชื่อ"
            />
          </>
        )}

        {showIssue && (
          <>
            <label className="block mb-1 font-medium text-sm">เลือกปัญหา</label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full mb-3 px-2 py-1 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              <option value="" disabled>
                -- กรุณาเลือกปัญหา --
              </option>
              <option value="ระบายน้ำ แฟร์เวย์">ระบายน้ำ แฟร์เวย์</option>
              <option value="ระบายน้ำกรีน">ระบายน้ำกรีน</option>
              <option value="ระบายน้ำบังเกอร์">ระบายน้ำบังเกอร์</option>
              <option value="บังเกอร์เสียหาย">บังเกอร์เสียหาย</option>
              <option value="หมอกหนา">หมอกหนา</option>
              <option value="น้ำท่วม">น้ำท่วม</option>
            </select>
          </>
        )}

        <div className="text-center">
          <button
            onClick={() =>
              handleSubmit(title, {
                hole,
                name: showName ? name : "",
                issue,
                issueId: issueId, // ส่ง issueId ไปด้วย (สำคัญสำหรับกำลังแก้ไข/เปิดใช้งาน)
              })
            }
            className={`text-white text-sm px-4 py-1 rounded-full transition-colors
              ${
                isValid()
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-slate-600 cursor-not-allowed"
              }`}
            disabled={!isValid()}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 font-inter"> 
      <div className="flex justify-center mt-6 mb-8">
        <div className="inline-block bg-black text-white text-xl sm:text-2xl font-bold py-2 px-6 rounded-lg max-w-max shadow-md">
          แจ้งปัญหา
        </div>
      </div>

      <div className="border-2 border-gray-600 rounded-xl p-4 max-w-6xl mx-auto shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center sm:justify-items-stretch">
          <Card
            title="แจ้งปิดหลุม"
            color="red"
            showName={false}
            showIssue={true}
          />
          <Card
            title="แจ้งสถานะกำลังแก้ไข"
            color="blue"
            showName={true}
            showIssue={false}
          />
          <Card
            title="แจ้งเปิดใช้งานหลุม"
            color="green"
            showName={false}
            showIssue={false}
          />
          <Card
            title="ส่งรถกอล์ฟ"
            color="orange"
            showName={true}
            showIssue={false}
          />
          <Card
            title="ส่งกระเป๋ากอล์ฟ"
            color="yellow"
            showName={true}
            showIssue={false}
          />
        </div>
      </div>

      {/* สถานะหลุมกอล์ฟ */}
      <div className="max-w-[75rem] mx-auto mt-8 px-6">
        <h2 className="text-2xl font-extrabold mb-4 text-center text-gray-800">
          สถานะหลุมกอล์ฟ
        </h2>

        {isLoading ? (
          <div className="text-center text-lg text-gray-600 py-10">กำลังโหลดข้อมูล...</div>
        ) : (
          <div className="border-2 border-gray-400 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 shadow-md">
            {holeStatuses.length > 0 ? (
              holeStatuses.map((hole) => (
                <div
                  key={hole.number}
                  className="border rounded-lg p-2 bg-white shadow-sm text-center transform hover:scale-105 transition-transform duration-200"
                >
                  <div
                    className={`text-xs font-semibold px-2 py-0.5 mb-2 rounded-full text-white
                    ${colorMap[hole.color] || "bg-gray-400"}`}
                  >
                    หลุมที่ {hole.number}
                  </div>
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center border border-gray-300 shadow-inner bg-white">
                    <div
                      className={`w-6 h-6 rounded-full
                      ${colorMap[hole.color] || "bg-gray-400"}`}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-700 truncate">
                    {hole.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                ไม่พบข้อมูลสถานะหลุมกอล์ฟ
              </div>
            )}
          </div>
        )}
      </div>

      {renderPopup()}
    </div>
  );
};

export default ReportPage;
