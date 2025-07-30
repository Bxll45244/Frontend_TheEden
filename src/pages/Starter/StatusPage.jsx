import React from "react";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

const colorMap = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
};

const ReportPage = () => {
  const [confirmData, setConfirmData] = useState(null);
  const [popup, setPopup] = useState(null);

  // สถานะหลุมกอล์ฟ เก็บเป็น state ไว้เพื่ออัปเดต
  const [holeStatuses, setHoleStatuses] = useState([
    { number: 1, color: "green", status: "ใช้งานได้" },
    { number: 2, color: "red", status: "หมอกหนา" },
    { number: 3, color: "blue", status: "กำลังแก้ไข" },
    { number: 4, color: "yellow", status: "กระเป๋าเสีย" },
    { number: 5, color: "orange", status: "รถเสีย" },
    { number: 6, color: "green", status: "ใช้งานได้" },
    { number: 7, color: "green", status: "ใช้งานได้" },
    { number: 8, color: "green", status: "ใช้งานได้" },
    { number: 9, color: "green", status: "ใช้งานได้" },
    { number: 10, color: "green", status: "ใช้งานได้" },
    { number: 11, color: "green", status: "ใช้งานได้" },
    { number: 12, color: "green", status: "ใช้งานได้" },
    { number: 13, color: "green", status: "ใช้งานได้" },
    { number: 14, color: "green", status: "ใช้งานได้" },
    { number: 15, color: "green", status: "ใช้งานได้" },
    { number: 16, color: "green", status: "ใช้งานได้" },
    { number: 17, color: "green", status: "ใช้งานได้" },
    { number: 18, color: "green", status: "ใช้งานได้" },
  ]);

  // ฟังก์ชันอัปเดตสถานะหลุม
  const updateHoleStatus = ({ hole, color, status }) => {
    setHoleStatuses((prev) =>
      prev.map((h) => (h.number === Number(hole) ? { ...h, color, status } : h))
    );
  };

  const handleSubmit = (title, data) => {
    const requiredFields = ["hole"];
    if (title.includes("ชื่อ")) requiredFields.push("name");
    const isValid = requiredFields.every(
      (field) => data[field] && data[field].trim() !== ""
    );

    if (!isValid) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setConfirmData({ title, ...data });
  };

  const handleConfirm = () => {
    if (!confirmData) return;

    const title = confirmData.title;
    const hole = confirmData.hole;

    // ตรวจสอบ title แล้วอัปเดตสถานะตามประเภท
    if (title === "ส่งกระเป๋ากอล์ฟ") {
      updateHoleStatus({ hole, color: "green", status: "ใช้งานได้" });
    } else if (title === "แจ้งปิดหลุม") {
      updateHoleStatus({
        hole,
        color: "red",
        status: confirmData.issue || "ปิดหลุม",
      });
    } else if (title === "แจ้งสถานะกำลังแก้ไข") {
      updateHoleStatus({ hole, color: "blue", status: "กำลังแก้ไข" });
    } else if (title === "แจ้งเปิดใช้งานหลุม") {
      updateHoleStatus({ hole, color: "green", status: "ใช้งานได้" });
    } else if (title === "ส่งรถกอล์ฟ") {
      updateHoleStatus({ hole, color: "orange", status: "ส่งรถกอล์ฟแล้ว" });
    }

    setPopup(confirmData);
    setConfirmData(null);
  };

  const handleSuccessClose = () => {
    setPopup(null);
  };

  const renderPopup = () => {
  if (confirmData) {
    return (
      <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              ตกลง
            </button>
            <button
              onClick={() => setConfirmData(null)}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
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
      <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[70%] max-w-xs space-y-4">
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-green-500 mx-auto"
            style={{ fontSize: "48px" }}
          />
          <h2 className="text-3xl font-extrabold">สำเร็จ!</h2>
          <h3 className="text-base font-normal text-gray-800">
            {`${popup.title} สำเร็จ`}
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
          className="w-20 mb-3 px-2 py-1 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-sm"
          placeholder="เลขหลุม"
        />

        {showName && (
          <>
            <label className="block mb-1 font-medium text-sm">ชื่อ</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 px-2 py-1 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
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
              className="w-full mb-3 px-2 py-1 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
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
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="flex justify-center mt-6 mb-8 margin-bottom-6">
        <div className="inline-block bg-black text-white text-xl sm:text-2xl font-bold py-2 px-6 rounded max-w-max">
          แจ้งปัญหา
        </div>
      </div>

      <div className="border-2 border-gray-600 rounded-xl p-4 max-w-6xl mx-auto">
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
        <h2 className="text-2xl font-extrabold mb-4 text-center">
          สถานะหลุมกอล์ฟ
        </h2>

        <div className="border-2 border-gray-400 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {holeStatuses.map((hole) => (
            <div
              key={hole.number}
              className="border rounded-lg p-2 bg-white shadow text-center"
            >
              <div
                className={`text-xs font-semibold px-2 py-0.5 mb-2 rounded-full text-white
            ${
              hole.color === "green"
                ? "bg-green-600"
                : hole.color === "red"
                ? "bg-red-600"
                : hole.color === "blue"
                ? "bg-blue-600"
                : hole.color === "yellow"
                ? "bg-yellow-400"
                : hole.color === "orange"
                ? "bg-orange-500"
                : "bg-gray-400"
            }`}
              >
                หลุมที่ {hole.number}
              </div>
              <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center border border-gray-300 shadow-inner bg-white">
                <div
                  className={`w-6 h-6 rounded-full
              ${
                hole.color === "green"
                  ? "bg-green-500"
                  : hole.color === "red"
                  ? "bg-red-500"
                  : hole.color === "blue"
                  ? "bg-blue-500"
                  : hole.color === "yellow"
                  ? "bg-yellow-400"
                  : hole.color === "orange"
                  ? "bg-orange-500"
                  : "bg-gray-400"
              }`}
                ></div>
              </div>
              <div className="text-xs text-gray-700 truncate">
                {hole.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {renderPopup()}
    </div>
  );
};

export default ReportPage;
