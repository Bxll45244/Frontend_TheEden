import React, { useState, useEffect, useMemo, useRef } from "react";
import LoadingAnimation from "../../golfer/animations/LoadingAnimation";
import CaddyService from "../../../service/caddyService";

/* ---------- helpers ---------- */
const HOLD_KEY = (d, t, ct) => `caddy-holds:${d || "none"}:${t || "none"}:${ct || "none"}`;

const idOf = (c = {}) => String(c.caddy_id || c._id || c.id || "");
const sameSlot = (a = {}, b = {}) => {
  const ad = a.date || a.d,
    at = a.timeSlot || a.t,
    ac = String(a.courseType ?? a.ct ?? "");
  const bd = b.date || b.d,
    bt = b.timeSlot || b.t,
    bc = String(b.courseType ?? b.ct ?? "");
  return String(ad) === String(bd) && String(at) === String(bt) && String(ac) === String(bc);
};
const readHolds = (d, t, ct) => {
  try {
    const v = JSON.parse(sessionStorage.getItem(HOLD_KEY(d, t, ct)) || "[]");
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
};
const writeHolds = (d, t, ct, ids = []) => {
  const set = Array.from(new Set(ids.map(String)));
  sessionStorage.setItem(HOLD_KEY(d, t, ct), JSON.stringify(set));
};

export default function Step3({ bookingData, handleChange, onNext, onPrev }) {
  const {
    golfCartQty = 0,
    golfBagQty = 0,
    caddy = [],
    caddySelectionEnabled = false,
    players = 1,
    date = "",
    timeSlot = "",
    courseType = "",
  } = bookingData;

  const [caddySearchTerm, setCaddySearchTerm] = useState("");
  const [availableCaddies, setAvailableCaddies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const isNextDisabled = caddySelectionEnabled && caddy.length > players;

  const pollRef = useRef(null);

  /* ---------- load available caddies (call service: date only) ---------- */
  useEffect(() => {
    // ปิดการเลือก หรือยังไม่เลือกวันที่ -> เคลียร์
    if (!caddySelectionEnabled || !date) {
      setAvailableCaddies([]);
      setError("");
      return;
    }

    const ac = new AbortController();

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");

        // 🔸 service ใหม่: รับแค่ date (string)
        const resp = await CaddyService.getAvailableCaddies(date);
        const raw = resp?.data ?? resp ?? [];
        const list = Array.isArray(raw) ? raw : raw.list || raw.items || raw.data || [];

        // 🔸 normalize + กรองให้ว่างจริงใน slot เดียวกันฝั่ง FE
        const normalized = (list || [])
          .filter(Boolean)
          // 1) ต้อง available
          .filter((c) => (c.caddyStatus || c.status || "available").toLowerCase() === "available")
          // 2) ไม่ชน busy ใน slot นี้ (รองรับหลายชื่อฟิลด์)
          .filter((c) => {
            const busy = c.busySlots || c.unavailable || c.bookings || c.slots || [];
            if (!Array.isArray(busy) || busy.length === 0) return true;
            return !busy.some((s) => sameSlot(s, { date, timeSlot, courseType }));
          })
          // 3) map เป็นรูปเดียวกัน
          .map((c) => ({
            id: idOf(c),
            name: c.name || c.fullName || `Caddy ${c.code || ""}`.trim(),
            profilePic: c.profilePic || c.avatar || "",
          }));

        if (!ac.signal.aborted) setAvailableCaddies(normalized);
      } catch (e) {
        if (!ac.signal.aborted) {
          setError(e?.response?.data?.message || e.message || "โหลดรายชื่อแคดดี้ไม่สำเร็จ");
          setAvailableCaddies([]);
        }
      } finally {
        if (!ac.signal.aborted) setIsLoading(false);
      }
    };

    // โหลดทันที
    load();

    // โพลล์ทุก 15 วิ
    clearInterval(pollRef.current);
    pollRef.current = setInterval(load, 15000);

    // รีโหลดเมื่อกลับมาโฟกัส
    const onFocus = () => document.visibilityState === "visible" && load();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    // cleanup
    return () => {
      ac.abort();
      clearInterval(pollRef.current);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [caddySelectionEnabled, date, timeSlot, courseType, players]);

  /* ---------- soft lock (per-slot) ---------- */
  const softHolds = useMemo(() => readHolds(date, timeSlot, courseType), [date, timeSlot, courseType]);

  // โชว์หลังตัด holds + ค้นหาชื่อ
  const filteredCaddies = useMemo(() => {
    const kw = caddySearchTerm.trim().toLowerCase();
    return availableCaddies
      .filter((c) => !softHolds.includes(String(c.id)))
      .filter((c) => (c.name || "").toLowerCase().includes(kw));
  }, [availableCaddies, softHolds, caddySearchTerm]);

  const handleCaddySelection = (caddyIdRaw) => {
    const caddyId = String(caddyIdRaw);
    let updated = caddy.map(String);

    if (updated.includes(caddyId)) {
      // ยกเลิกเลือก -> ถอน hold
      updated = updated.filter((id) => id !== caddyId);
      writeHolds(
        date,
        timeSlot,
        courseType,
        readHolds(date, timeSlot, courseType).filter((id) => id !== caddyId)
      );
    } else {
      if (updated.length >= Number(players || 0)) {
        setError(`สามารถเลือกแคดดี้ได้สูงสุด ${players} คน`);
        return;
      }
      updated = [...updated, caddyId];
      // ตั้ง hold
      writeHolds(date, timeSlot, courseType, [...readHolds(date, timeSlot, courseType), caddyId]);
    }
    setError("");
    handleChange({ target: { name: "caddy", value: updated } });
  };

  // เคลียร์ hold เมื่อปิดการเลือก หรือเปลี่ยน slot
  useEffect(() => {
    return () => writeHolds(date, timeSlot, courseType, []);
  }, [date, timeSlot, courseType]);

  /* ---------- UI ---------- */
  return (
    <div className="max-w-lg mx-auto p-6 bg-white/60 backdrop-blur-lg rounded-3xl border border-neutral-200/40 ring-1 ring-white/30 shadow-md">
      <h2 className="text-[22px] font-th text-neutral-900 text-center mb-6">Step 3: บริการเสริม</h2>

      {/* Golf Bag */}
      <div className="mb-6 text-center">
        <label className="block text-neutral-700 text-sm font-th mb-2">จำนวนกระเป๋าไม้กอล์ฟ</label>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              handleChange({
                target: { name: "golfBagQty", value: Math.max(0, Number(golfBagQty) - 1) },
              })
            }
            className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition"
          >
            –
          </button>
          <span className="text-2xl font-th text-neutral-900 tabular-nums">{golfBagQty}</span>
          <button
            type="button"
            onClick={() =>
              handleChange({
                target: { name: "golfBagQty", value: Number(golfBagQty) + 1 },
              })
            }
            className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition"
          >
            +
          </button>
        </div>
        <p className="text-xs text-neutral-500 mt-1">*ค่าบริการกระเป๋าไม้กอล์ฟ/ท่าน 300 บาท</p>
      </div>

      {/* Golf Cart */}
      <div className="mb-6 text-center">
        <label className="block text-neutral-700 text-sm font-th mb-2">จำนวนรถกอล์ฟ</label>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              handleChange({
                target: { name: "golfCartQty", value: Math.max(0, Number(golfCartQty) - 1) },
              })
            }
            className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition"
          >
            –
          </button>
          <span className="text-2xl font-th text-neutral-900 tabular-nums">{golfCartQty}</span>
          <button
            type="button"
            onClick={() =>
              handleChange({
                target: { name: "golfCartQty", value: Number(golfCartQty) + 1 },
              })
            }
            className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition"
          >
            +
          </button>
        </div>
        <p className="text-xs text-neutral-500 mt-1">*ค่าบริการรถกอล์ฟ/คัน 500 บาท</p>
      </div>

      {/* Caddy */}
      <div className="mb-6 border-t border-neutral-200 pt-6">
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="caddy-selection-toggle"
            checked={!!caddySelectionEnabled}
            onChange={() => {
              if (caddySelectionEnabled) {
                handleChange({ target: { name: "caddy", value: [] } });
                writeHolds(date, timeSlot, courseType, []); // clear holds
              }
              handleChange({
                target: { name: "caddySelectionEnabled", value: !caddySelectionEnabled },
              });
              setError("");
            }}
            className="mr-2 h-4 w-4 text-emerald-600 border-neutral-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="caddy-selection-toggle" className="text-neutral-800 font-th text-sm">
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
              className="w-full px-3 py-2 rounded-2xl bg-white/80 border border-neutral-200 text-neutral-800 shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />

            <p className="text-xs text-neutral-600">
              แคดดี้ว่าง: <span className="font-medium">{filteredCaddies.length}</span> คน
            </p>

            {isLoading ? (
              <div className="flex justify-center py-3">
                <LoadingAnimation />
              </div>
            ) : error ? (
              <p className="text-center text-red-500 text-sm">{error}</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredCaddies.length > 0 ? (
                  filteredCaddies.map((c) => {
                    const cid = String(c.id);
                    const picked = caddy.map(String).includes(cid);
                    return (
                      <div
                        key={cid}
                        onClick={() => handleCaddySelection(cid)}
                        className={[
                          "flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all",
                          picked
                            ? "bg-emerald-50 border border-emerald-300 scale-[1.02]"
                            : "bg-white/70 border border-neutral-200 hover:bg-neutral-50 hover:scale-[1.01]",
                        ].join(" ")}
                      >
                        <div className="relative w-20 h-20 rounded-full overflow-hidden mb-2">
                          <img
                            src={c.profilePic || "https://placehold.co/96x96/cccccc/ffffff?text=Caddy"}
                            alt={c.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/96x96/cccccc/ffffff?text=Caddy";
                            }}
                          />
                          {picked && (
                            <span className="absolute bottom-1 right-1 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              ✓ เลือกแล้ว
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-neutral-800">{c.name}</p>
                        <p className="text-xs text-emerald-600 mt-0.5">ว่าง</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="col-span-2 text-center text-neutral-500 text-sm">
                    ไม่พบแคดดี้ที่ค้นหา
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-neutral-500 mt-3">*ค่าบริการแคดดี้/ท่าน 400 บาท</p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          type="button"
          className="px-6 py-2 rounded-full font-th bg-neutral-900 text-white hover:bg-black transition-colors"
        >
          ย้อนกลับ
        </button>

        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={[
            "px-6 py-2 rounded-full font-th transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isNextDisabled ? "bg-neutral-300 text-neutral-500" : "bg-emerald-600 text-white hover:bg-emerald-700",
          ].join(" ")}
        >
          ยืนยันการจอง
        </button>
      </div>
    </div>
  );
}