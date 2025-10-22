import React, { useState, useEffect, useMemo } from "react";
import LoadingAnimation from "../animations/LoadingAnimation";
// import { getAvailableCaddies } from "../../service/caddyService.js"; //ต้องสร้าง service จำลองใช้มาก่อน

const Step3 = ({ bookingData, handleChange, onNext, onPrev }) => {
  const {
    golfCartQty = 0,
    golfBagQty = 0,
    caddy = [],
    caddySelectionEnabled = false,
    players = 1,
    date,
    timeSlot = "",
  } = bookingData;

  const [caddySearchTerm, setCaddySearchTerm] = useState("");
  const [availableCaddies, setAvailableCaddies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!caddySelectionEnabled) {
      setAvailableCaddies([]);
      setError("");
      return;
    }

    // ถ้ายังไม่เลือกวันที่ ให้ไม่โหลดข้อมูล และแจ้งผู้ใช้เล็กน้อย
    if (!date) {
      setAvailableCaddies([]);
      setError("โปรดเลือกวันที่ก่อนเพื่อดูรายชื่อแคดดี้ที่ว่าง");
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getAvailableCaddies({ date, timeSlot });
        if (!ac.signal.aborted) setAvailableCaddies(data);
      } catch (e) {
        if (!ac.signal.aborted) setError(e.message || "โหลดรายชื่อแคดดี้ไม่สำเร็จ");
      } finally {
        if (!ac.signal.aborted) setIsLoading(false);
      }
    })();

    return () => ac.abort();
  }, [caddySelectionEnabled, date, timeSlot]);

  const filteredCaddies = useMemo(
    () =>
      availableCaddies.filter((c) =>
        (c.name || "").toLowerCase().includes(caddySearchTerm.toLowerCase())
      ),
    [availableCaddies, caddySearchTerm]
  );

  const handleCaddySelection = (caddyId) => {
    let updated = [...caddy];
    if (updated.includes(caddyId)) {
      updated = updated.filter((id) => id !== caddyId);
    } else {
      if (updated.length >= players) {
        setError(`สามารถเลือกแคดดี้ได้สูงสุด ${players} คน`);
        return;
      }
      updated.push(caddyId);
    }
    setError("");
    handleChange({ target: { name: "caddy", value: updated } });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Step 3: บริการเสริม</h2>

      {/* Golf Bag */}
      <div className="mb-6 text-center">
        <label className="block text-gray-700 font-semibold mb-2">
          จำนวนกระเป๋าไม้กอล์ฟ
        </label>
        <div className="flex items-center justify-center space-x-4">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-lg"
            onClick={() =>
              handleChange({
                target: { name: "golfBagQty", value: Math.max(0, golfBagQty - 1) },
              })
            }
          >
            -
          </button>
          <span className="text-2xl font-bold">{golfBagQty}</span>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-lg"
            onClick={() =>
              handleChange({
                target: { name: "golfBagQty", value: golfBagQty + 1 },
              })
            }
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          *ค่าบริการกระเป๋าไม้กอล์ฟ/ท่าน 300 บาท
        </p>
      </div>

      {/* Golf Cart */}
      <div className="mb-6 text-center">
        <label className="block text-gray-700 font-semibold mb-2">
          จำนวนรถกอล์ฟ
        </label>
        <div className="flex items-center justify-center space-x-4">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-lg"
            onClick={() =>
              handleChange({
                target: { name: "golfCartQty", value: Math.max(0, golfCartQty - 1) },
              })
            }
          >
            -
          </button>
          <span className="text-2xl font-bold">{golfCartQty}</span>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-lg"
            onClick={() =>
              handleChange({
                target: { name: "golfCartQty", value: golfCartQty + 1 },
              })
            }
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">*ค่าบริการรถกอล์ฟ/คัน 500 บาท</p>
      </div>

      {/* Caddy */}
      <div className="mb-6 border-t pt-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="caddy-selection-toggle"
            checked={caddySelectionEnabled}
            onChange={() => {
              if (caddySelectionEnabled)
                handleChange({ target: { name: "caddy", value: [] } });
              handleChange({
                target: {
                  name: "caddySelectionEnabled",
                  value: !caddySelectionEnabled,
                },
              });
              setError(null);
            }}
            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label
            htmlFor="caddy-selection-toggle"
            className="text-gray-800 font-bold text-sm"
          >
            ต้องการเลือกแคดดี้
          </label>
        </div>

        {caddySelectionEnabled && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="ค้นหาชื่อแคดดี้..."
              value={caddySearchTerm}
              onChange={(e) => setCaddySearchTerm(e.target.value)}
              className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {isLoading ? (
              <div className="flex justify-center items-center">
                <LoadingAnimation />
              </div>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredCaddies.length > 0 ? (
                  filteredCaddies.map((c) => {
                    const picked = caddy.includes(c.caddy_id);
                    return (
                      <div
                        key={c.caddy_id}
                        className={`flex flex-col items-center p-4 rounded-xl shadow-md transition-all duration-200 transform ${
                          picked
                            ? "bg-green-50 border-2 border-green-400 shadow-lg scale-105"
                            : "bg-white border border-gray-200 hover:shadow-lg hover:scale-105"
                        }`}
                        onClick={() => handleCaddySelection(c.caddy_id)}
                      >
                        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3">
                          <img
                            src={
                              c.profilePic ||
                              `https://placehold.co/96x96/cccccc/ffffff?text=Caddy`
                            }
                            alt={c.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/96x96/cccccc/ffffff?text=Caddy";
                            }}
                          />
                          {picked && (
                            <span className="absolute bottom-1 right-1 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                              เลือกแล้ว
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-center text-gray-800">
                          {c.name}
                        </p>
                        <p className="text-xs text-green-600 mt-1">ว่าง</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="col-span-2 text-center text-gray-500">
                    ไม่พบแคดดี้ที่ค้นหา
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          *ค่าบริการแคดดี้/ท่าน 400 บาท
        </p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="bg-gray-600 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700 transition-colors"
        >
          ย้อนกลับ
        </button>
        <button
          onClick={onNext}
          className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-colors"
        >
          จองต่อ
        </button>
      </div>
    </div>
  );
};

export default Step3;
