import React, { useState, useEffect } from "react";
import HoleService from "../../service/hole.Route"; // ✅ ใช้ service เดิม (คุกกี้ httpOnly วิ่งในตัว)
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

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
  const [holeStatuses, setHoleStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงสถานะหลุมจาก backend ผ่าน service กลาง (ต้องล็อกอิน cookie อยู่แล้ว)
  const fetchHoleStatuses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await HoleService.getAllHoles(); // GET /hole/gethole
      // สมมุติ data = [{ _id, number, status, issue? }, ...]
      const formatted = (data || []).map((h) => {
        let displayColor = "green";
        let displayStatus = "ใช้งานได้";
        if (h.status === "closed") {
          displayColor = "red";
          displayStatus = h?.issue?.description || "ปิดหลุม";
        } else if (h.status === "under_maintenance") {
          displayColor = "blue";
          displayStatus = "กำลังแก้ไข";
        }
        return {
          number: h.number ?? h.holeNumber ?? h._id?.slice(-2), // fallback หาก field ชื่อไม่ตรง
          color: displayColor,
          status: displayStatus,
          issueId: h?.issue?._id || null,
        };
      });
      setHoleStatuses(formatted);
    } catch (err) {
      if (err?.response?.status === 401) setError("กรุณาเข้าสู่ระบบอีกครั้ง");
      else setError(err?.response?.data?.message || "ไม่สามารถดึงข้อมูลสถานะหลุมได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHoleStatuses();
  }, []);

  const handleSubmit = (title, data) => {
    const required = ["hole"];
    if (title.includes("ชื่อ")) required.push("name");
    if (title === "แจ้งปิดหลุม") required.push("issue");

    const ok = required.every((k) => data[k] && String(data[k]).trim() !== "");
    if (!ok) return setPopup({ title: "กรุณากรอกข้อมูลให้ครบถ้วน", isError: true });
    setConfirmData({ title, ...data });
  };

  const handleConfirm = async () => {
    if (!confirmData) return;
    const { title, hole, issue, issueId } = confirmData;
    try {
      if (title === "แจ้งปิดหลุม") {
        await HoleService.closeHole({ holeNumber: Number(hole), description: issue }); // PUT /hole/close
      } else if (title === "แจ้งสถานะกำลังแก้ไข") {
        // ใส่ endpoint ที่ทีมตกลง ถ้าใช้ /hole/report หรือ /hole/open/close แทน ให้เปลี่ยนได้
        await HoleService.reportHole({ holeNumber: Number(hole), status: "under_maintenance" }); // PUT /hole/report
      } else if (title === "แจ้งเปิดใช้งานหลุม") {
        await HoleService.openHole({ holeNumber: Number(hole) }); // PUT /hole/open
      } else if (title === "ส่งรถกอล์ฟ") {
        await HoleService.reportHelpCar({ holeNumber: Number(hole) }); // PUT /hole/help-car
      } else if (title === "ส่งกระเป๋ากอล์ฟ") {
        await HoleService.resolveGoCar({ holeNumber: Number(hole) }); // PUT /hole/go-car
      }
      await fetchHoleStatuses();
      setPopup({ title: "ดำเนินการสำเร็จ", isError: false });
      setConfirmData(null);
    } catch (err) {
      let msg = err?.response?.data?.message || err.message || `เกิดข้อผิดพลาดในการ ${title}`;
      if (err?.response?.status === 401) msg = "สิทธิ์หมดอายุ กรุณาเข้าสู่ระบบใหม่";
      setPopup({ title: msg, isError: true });
      setConfirmData(null);
    }
  };

  const updateHoleStatusOnFrontend = ({ hole, color, status }) => {
    setHoleStatuses((prev) =>
      prev.map((h) => (h.number === Number(hole) ? { ...h, color, status } : h))
    );
  };

  const renderPopup = () => {
    if (confirmData) {
      return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[60%] max-w-xs">
            <FontAwesomeIcon icon={faExclamation} className="text-yellow-400 mb-4" style={{ fontSize: 48 }} />
            <h3 className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่?</h3>
            <div className="flex justify-center gap-4">
              <button onClick={handleConfirm} className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700">
                ตกลง
              </button>
              <button onClick={() => setConfirmData(null)} className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      );
    }
    if (popup) {
      return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-md text-center w-[70%] max-w-xs space-y-4">
            <FontAwesomeIcon
              icon={popup.isError ? faExclamation : faCircleCheck}
              className={popup.isError ? "text-red-500 mx-auto" : "text-green-500 mx-auto"}
              style={{ fontSize: 48 }}
            />
            <h2 className="text-3xl font-extrabold">{popup.isError ? "เกิดข้อผิดพลาด!" : "สำเร็จ!"}</h2>
            <h3 className="text-base font-normal text-gray-800">{popup.title}</h3>
            <button onClick={() => setPopup(null)} className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-green-600">
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

    const current = holeStatuses.find((h) => h.number === Number(hole));
    const issueId = current ? current.issueId : null;

    const isValid = () => {
      if (!hole.trim()) return false;
      if (showName && !name.trim()) return false;
      if (showIssue && !issue.trim()) return false;
      if ((title === "แจ้งสถานะกำลังแก้ไข" || title === "แจ้งเปิดใช้งานหลุม") && !issueId) return false;
      return true;
    };

    return (
      <div className="w-full max-w-[240px] p-2 border border-gray-800 rounded-xl shadow-sm bg-gray-50">
        <div className="flex items-center mb-3">
          <div className={`w-4 h-4 rounded-full ${colorMap[color]} mr-2`} />
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
            onClick={() => handleSubmit(title, { hole, name: showName ? name : "", issue, issueId })}
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
        <div className="flex justify-center mt-6 mb-8">
          <div className="inline-block bg-black text-white text-xl sm:text-2xl font-bold py-2 px-6 rounded-lg max-w-max shadow-md">
            แจ้งปัญหา
          </div>
        </div>

        <div className="border-2 border-gray-600 rounded-xl p-4 max-w-6xl mx-auto shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center sm:justify-items-stretch">
            <Card title="แจ้งปิดหลุม" color="red" showName={false} showIssue={true} />
            <Card title="แจ้งสถานะกำลังแก้ไข" color="blue" showName={true} showIssue={false} />
            <Card title="แจ้งเปิดใช้งานหลุม" color="green" showName={false} showIssue={false} />
            <Card title="ส่งรถกอล์ฟ" color="orange" showName={true} showIssue={false} />
            <Card title="ส่งกระเป๋ากอล์ฟ" color="yellow" showName={true} showIssue={false} />
          </div>
        </div>

        <div className="max-w-[75rem] mx-auto mt-8 px-6">
          <h2 className="text-2xl font-extrabold mb-4 text-center text-gray-800">สถานะหลุมกอล์ฟ</h2>
          {isLoading ? (
            <div className="text-center text-lg text-gray-600 py-10">กำลังโหลดข้อมูล...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-600 py-10">{error}</div>
          ) : (
            <div className="border-2 border-gray-400 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 shadow-md">
              {holeStatuses.length > 0 ? (
                holeStatuses.map((h) => (
                  <div key={h.number} className="border rounded-lg p-2 bg-white shadow-sm text-center transform hover:scale-105 transition-transform duration-200">
                    <div className={`text-xs font-semibold px-2 py-0.5 mb-2 rounded-full text-white ${colorMap[h.color] || "bg-gray-400"}`}>
                      หลุมที่ {h.number}
                    </div>
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center border border-gray-300 shadow-inner bg-white">
                      <div className={`w-6 h-6 rounded-full ${colorMap[h.color] || "bg-gray-400"}`} />
                    </div>
                    <div className="text-xs text-gray-700 truncate">{h.status}</div>
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
