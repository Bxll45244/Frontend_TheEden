// src/pages/Starter/ReportPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

const colorMap = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  gray: "bg-gray-400",
};

const ReportPage = () => {
  const navigate = useNavigate(); 
  const [confirmData, setConfirmData] = useState(null);
  const [popup, setPopup] = useState(null);
  const [holeStatuses, setHoleStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const handleAdminClick = () => navigate("/starter"); 

  // โหลด token
  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) setAuthToken(storedToken);
  }, []);

  // helper: map สถานะจาก backend → ที่ frontend ใช้
  const normalizeHoles = (raw) => {
    // รองรับได้ทั้ง {holes:[...]} หรือ {holeStatuses:[...]}
    const list = Array.isArray(raw?.holes)
      ? raw.holes
      : Array.isArray(raw?.holeStatuses)
      ? raw.holeStatuses
      : [];

    return list.map((h) => {
      // ชื่อ field เผื่อกรณีไม่ตรงกัน
      const holeNumber = h.holeNumber ?? h.number ?? h.hole ?? 0;
      const currentStatus = h.currentStatus ?? h.status ?? "open";
      const activeIssue = h.activeIssue ?? null;

      let color = "green";
      let statusText = "ใช้งานได้";

      if (currentStatus === "closed") {
        color = "red";
        statusText = activeIssue?.description || "ปิดหลุม";
      } else if (currentStatus === "under_maintenance") {
        color = "blue";
        statusText = "กำลังแก้ไข";
      }

      return {
        number: Number(holeNumber),
        color,
        status: statusText,
        issueId: activeIssue?._id || null,
      };
    });
  };

  // ดึงสถานะหลุมจาก backend (ใช้เส้นทางใหม่ /api/hole/gethole)
  const fetchHoleStatuses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/hole/gethole`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setHoleStatuses(normalizeHoles(res.data));
    } catch (err) {
      console.error("fetchHoleStatuses:", err.response?.data || err.message);
      setError(
        err?.response?.status === 401
          ? "การเข้าถึงไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบใหม่"
          : "ไม่สามารถดึงข้อมูลสถานะหลุมกอล์ฟได้"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) fetchHoleStatuses();
    else if (!isLoading && !authToken) {
      setError("กรุณาเข้าสู่ระบบเพื่อดูสถานะหลุมกอล์ฟ");
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  // ส่งคำสั่งจากการกดปุ่มยืนยันใน Card
  const handleSubmit = (title, data) => {
    const required = ["hole"];
    if (title.includes("ชื่อ")) required.push("name");
    if (title === "แจ้งปิดหลุม") required.push("issue");

    const ok = required.every((k) => data[k] && String(data[k]).trim() !== "");
    if (!ok) return setPopup({ title: "กรุณากรอกข้อมูลให้ครบถ้วน", isError: true });

    setConfirmData({ title, ...data });
  };

  // ยิง API ตามปุ่มที่เลือก (ต่อกับ routes /api/hole/*)
  const handleConfirm = async () => {
    if (!confirmData) return;
    if (!authToken)
      return setPopup({
        title: "คุณไม่ได้เข้าสู่ระบบ กรุณาเข้าสู่ระบบก่อนทำรายการ",
        isError: true,
      });

    const { title, hole, issue, name } = confirmData;
    let endpoint = "";
    let method = "put";
    let data = {};
    let successMsg = "";

    try {
      if (title === "แจ้งปิดหลุม") {
        endpoint = "/hole/close";
        data = {
          holeNumber: Number(hole),
          description: issue,
          reportedBy: "starter_user", // ปรับตามระบบจริงของคุณ
        };
        successMsg = "แจ้งปิดหลุมสำเร็จ";

      } else if (title === "แจ้งสถานะกำลังแก้ไข") {
        endpoint = "/hole/report";
        data = {
          holeNumber: Number(hole),
          personInCharge: name || "greenkeeper", // ใช้ชื่อจากฟอร์ม
        };
        successMsg = "แจ้งสถานะกำลังแก้ไขสำเร็จ";

      } else if (title === "แจ้งเปิดใช้งานหลุม") {
        endpoint = "/hole/open";
        data = {
          holeNumber: Number(hole),
          resolvedBy: "resolver_user",
        };
        successMsg = "แจ้งเปิดใช้งานหลุมสำเร็จ";

      } else if (title === "ส่งรถกอล์ฟ") {
        endpoint = "/hole/help-car";
        data = {
          holeNumber: Number(hole),
          name: name || "starter_user",
          type: "golfCart",
        };
        successMsg = "ส่งรถกอล์ฟสำเร็จ";

      } else if (title === "ส่งกระเป๋ากอล์ฟ") {
        // ยังไม่มี endpoint แยก ใช้ help-car พร้อม type = golfBag
        endpoint = "/hole/help-car";
        data = {
          holeNumber: Number(hole),
          name: name || "starter_user",
          type: "golfBag",
        };
        successMsg = "ส่งกระเป๋ากอล์ฟสำเร็จ";
      }

      await axios[method](`${API_BASE_URL}${endpoint}`, data, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      await fetchHoleStatuses();
      setPopup({ title: successMsg, isError: false });
      setConfirmData(null);
    } catch (err) {
      console.error("handleConfirm:", err.response?.data || err.message);
      let msg =
        err?.response?.data?.message ||
        err.message ||
        `เกิดข้อผิดพลาดในการ ${title}`;
      if (err?.response?.status === 401) {
        localStorage.removeItem("userToken");
        setAuthToken(null);
        msg = "การเข้าถึงไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบใหม่";
      }
      setPopup({ title: msg, isError: true });
      setConfirmData(null);
    }
  };

  const updateHoleStatusOnFrontend = ({ hole, color, status }) => {
    setHoleStatuses((prev) =>
      prev.map((h) => (h.number === Number(hole) ? { ...h, color, status } : h))
    );
  };

  const handleSuccessClose = () => setPopup(null);

  const renderPopup = () => {
    if (confirmData) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[60%] max-w-xs">
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
    if (popup) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[70%] max-w-xs space-y-4">
            <FontAwesomeIcon
              icon={popup.isError ? faExclamation : faCircleCheck}
              className={popup.isError ? "text-red-500 mx-auto" : "text-green-500 mx-auto"}
              style={{ fontSize: "48px" }}
            />
            <h2 className="text-3xl font-extrabold">{popup.isError ? "เกิดข้อผิดพลาด!" : "สำเร็จ!"}</h2>
            <h3 className="text-base font-normal text-gray-800">{popup.title}</h3>
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

  const Card = ({ color, title, showName, showIssue }) => {
    const [hole, setHole] = useState("");
    const [name, setName] = useState("");
    const [issue, setIssue] = useState("");

    const currentHoleStatus = holeStatuses.find((h) => h.number === Number(hole));
    const issueId = currentHoleStatus ? currentHoleStatus.issueId : null;

    const isValid = () => {
      if (!hole.trim()) return false;
      if (showName && !name.trim()) return false;
      if (showIssue && !issue.trim()) return false;
      // ตอนนี้เราไม่ใช้ issueId กับ endpoints ชุดนี้ แต่เผื่อไว้
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
              <option value="" disabled>-- กรุณาเลือกปัญหา --</option>
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
              handleSubmit(title, { hole, name: showName ? name : "", issue, issueId })
            }
            className={`text-white text-sm px-4 py-1 rounded-full transition-colors
              ${isValid() ? "bg-green-600 hover:bg-green-700" : "bg-slate-600 cursor-not-allowed"}`}
            disabled={!isValid()}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <div className="px-4 py-6">
        <div className="flex justify-center mt-6 mb-8 gap-3">
          <div className="inline-block bg-black text-white text-xl sm:text-2xl font-bold py-2 px-6 rounded-lg max-w-max shadow-md">
            แจ้งปัญหา
          </div>
          <button
            className="inline-block bg-black text-white text-2xl font-bold py-2 px-6 rounded max-w-max"
            onClick={handleAdminClick}
          >
            สถานะ
          </button>
        </div>

        {/* Cards */}
        <div className="border-2 border-gray-600 rounded-xl p-4 max-w-6xl mx-auto shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center sm:justify-items-stretch">
            <Card title="แจ้งปิดหลุม" color="red" showName={false} showIssue={true} />
            <Card title="แจ้งสถานะกำลังแก้ไข" color="blue" showName={true} showIssue={false} />
            <Card title="แจ้งเปิดใช้งานหลุม" color="green" showName={false} showIssue={false} />
            <Card title="ส่งรถกอล์ฟ" color="orange" showName={true} showIssue={false} />
            <Card title="ส่งกระเป๋ากอล์ฟ" color="yellow" showName={true} showIssue={false} />
          </div>
        </div>

        {/* Hole statuses */}
        <div className="max-w-[75rem] mx-auto mt-8 px-6">
          <h2 className="text-2xl font-extrabold mb-4 text-center text-gray-800">สถานะหลุมกอล์ฟ</h2>
          {isLoading ? (
            <div className="text-center text-lg text-gray-600 py-10">กำลังโหลดข้อมูล...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-600 py-10">{error}</div>
          ) : (
            <div className="border-2 border-gray-400 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 shadow-md">
              {holeStatuses.length > 0 ? (
                holeStatuses.map((hole) => (
                  <div
                    key={hole.number}
                    className="border rounded-lg p-2 bg-white shadow-sm text-center transform hover:scale-105 transition-transform duration-200"
                  >
                    <div
                      className={`text-xs font-semibold px-2 py-0.5 mb-2 rounded-full text-white ${colorMap[hole.color] || colorMap.gray}`}
                    >
                      หลุมที่ {hole.number}
                    </div>
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center border border-gray-300 shadow-inner bg-white">
                      <div className={`w-6 h-6 rounded-full ${colorMap[hole.color] || colorMap.gray}`}></div>
                    </div>
                    <div className="text-xs text-gray-700 truncate">{hole.status}</div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">ไม่พบข้อมูลสถานะหลุมกอล์ฟ</div>
              )}
            </div>
          )}
        </div>

        {renderPopup()}
      </div>
    </div>
  );
};

export default ReportPage;
