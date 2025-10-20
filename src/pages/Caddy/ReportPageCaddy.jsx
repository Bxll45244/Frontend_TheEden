// src/pages/Starter/ReportPage.jsx
import React, { useState, useEffect } from "react";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const colorMap = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  gray: "bg-gray-400",
};

const ReportPageCaddy = () => {
  const navigate = useNavigate();
  const [confirmData, setConfirmData] = useState(null);
  const [popup, setPopup] = useState(null);
  const [holeStatuses, setHoleStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminClick = () => navigate("/caddy/process");

  const normalizeHoles = (raw) => {
    const list = Array.isArray(raw) ? raw : [];
    return list.map((h) => {
      const holeNumber = h.holeNumber ?? 0;
      const currentStatus = h.status ?? "open";
      const description = h.description ?? "";

      let color = "green";
      let statusText = "ใช้งานได้";

      if (currentStatus === "close") {
        color = "red";
        statusText = description || "ปิดหลุม";
      } else if (currentStatus === "editing") {
        color = "blue";
        statusText = "กำลังแก้ไข";
      } else if (currentStatus === "help_car") {
        color = "orange";
        statusText = "รอรถกอล์ฟ";
      } else if (currentStatus === "go_help_car") {
        color = "yellow";
        statusText = "รถกำลังไป";
      }

      return {
        number: Number(holeNumber),
        color,
        status: statusText,
        _id: h._id || null,
      };
    });
  };

  const fetchHoleStatuses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await http.get("/hole/gethole");
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
    fetchHoleStatuses();
  }, []);

  const handleSubmit = (title, data) => {
    const required = ["hole"];
    if (data.requireName) required.push("name");
    if (data.requireIssue) required.push("issue");

    const ok = required.every((k) => data[k] && String(data[k]).trim() !== "");
    if (!ok)
      return setPopup({ title: "กรุณากรอกข้อมูลให้ครบถ้วน", isError: true });

    setConfirmData({ title, ...data });
  };

  const handleConfirm = async () => {
    if (!confirmData || isSubmitting) return;
    setIsSubmitting(true);

    const { title, hole, issue, name } = confirmData;
    let endpoint = "";
    let payload = {};

    if (title === "แจ้งปิดหลุม") {
      endpoint = "/hole/close";
      payload = { holeNumber: Number(hole), description: issue };
    } else if (title === "แจ้งเปิดใช้งานหลุม") {
      endpoint = "/hole/open";
      payload = { holeNumber: Number(hole) };
    } else if (title === "แจ้งรถกอล์ฟเสีย") {
      endpoint = "/hole/help-car";
      payload = {
        holeNumber: Number(hole),
        description: `ขอรถกอล์ฟโดย ${name || "แคดดี้"}`,
        bookingId: null,
      };
    }

    if (!endpoint) {
      setPopup({ title: "ปุ่มนี้ยังไม่ได้แมพ endpoint", isError: true });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await http.put(endpoint, payload);
      await fetchHoleStatuses();
      setPopup({ title: "ดำเนินการสำเร็จ", isError: false });
      setConfirmData(null);
    } catch (err) {
      let msg =
        err?.response?.data?.message ||
        err.message ||
        `เกิดข้อผิดพลาดในการ ${title}`;
      if (err?.response?.status === 401)
        msg = "การเข้าถึงไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบใหม่";
      setPopup({ title: msg, isError: true });
      setConfirmData(null);
    } finally {
      setIsSubmitting(false);
    }
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
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "กำลังส่ง..." : "ตกลง"}
              </button>
              <button
                type="button"
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
              className={
                popup.isError ? "text-red-500 mx-auto" : "text-green-500 mx-auto"
              }
              style={{ fontSize: "48px" }}
            />
            <h2 className="text-3xl font-extrabold">
              {popup.isError ? "เกิดข้อผิดพลาด!" : "สำเร็จ!"}
            </h2>
            <h3 className="text-base font-normal text-gray-800">
              {popup.title}
            </h3>
            <button
              type="button"
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

    const isValid = () => {
      if (!hole.trim()) return false;
      if (showName && !name.trim()) return false;
      if (showIssue && !issue.trim()) return false;
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
              className="w-full mb-3 px-2 py-1 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text_sm"
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
            type="button"
            onClick={() =>
              handleSubmit(title, {
                hole,
                name: showName ? name : "",
                issue,
                requireName: !!showName,
                requireIssue: !!showIssue,
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

        <div className="border-2 border-gray-600 rounded-xl p-4 max-w-6xl mx-auto shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center sm:justify-items-stretch">
            <Card
              title="แจ้งปิดหลุม"
              color="red"
              showName={false}
              showIssue={true}
            />
            <Card
              title="แจ้งเปิดใช้งานหลุม"
              color="green"
              showName={false}
              showIssue={false}
            />
            <Card
              title="แจ้งรถกอล์ฟเสีย"
              color="orange"
              showName={true}
              showIssue={false}
            />
          </div>
        </div>

        {/* ✅ แก้ส่วนนี้ให้ไม่แสดงหลุมสีเขียว */}
        <div className="max-w-[75rem] mx-auto mt-8 px-6">
          <h2 className="text-2xl font-extrabold mb-4 text-center text-gray-800">
            สถานะหลุมกอล์ฟ
          </h2>
          {isLoading ? (
            <div className="text-center text-lg text-gray-600 py-10">
              กำลังโหลดข้อมูล...
            </div>
          ) : error ? (
            <div className="text-center text-lg text-red-600 py-10">{error}</div>
          ) : (
            <div className="border-2 border-gray-400 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 shadow-md">
              {holeStatuses.length > 0 ? (
                holeStatuses
                  .filter((hole) => hole.color !== "green") // ✅ แสดงเฉพาะที่ไม่ใช่สีเขียว
                  .map((hole) => (
                    <div
                      key={hole.number}
                      className="border rounded-lg p-2 bg-white shadow_sm text-center transform hover:scale-105 transition-transform duration-200"
                    >
                      <div
                        className={`text-xs font-semibold px-2 py-0.5 mb-2 rounded-full text-white ${
                          colorMap[hole.color] || colorMap.gray
                        }`}
                      >
                        หลุมที่ {hole.number}
                      </div>
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center border border-gray-300 shadow-inner bg-white">
                        <div
                          className={`w-6 h-6 rounded-full ${
                            colorMap[hole.color] || colorMap.gray
                          }`}
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
    </div>
  );
};

export default ReportPageCaddy;
