import { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  UserRound,
  Clock,
  Users,
  ClipboardList,
  UserCheck,
  RefreshCw,
  Trash2,
  Hash,
} from "lucide-react";

const bookings = [
  {
    time: "07:00",
    caddies: ["C019", "C020", "C022"],
    team: "Green Swing",
    group: "วิเชษฐ แสงทอง",
    players: 3,
  },
  {
    time: "07:30",
    caddies: ["C001", "C002", "C003", "C004"],
    team: "The Eagles",
    group: "Jack German",
    players: 4,
  },
  {
    time: "08:15",
    caddies: ["C005", "C011"],
    team: "Blue Birdies",
    group: "อภิชาติ วรากุล",
    players: 2,
  },
  {
    time: "09:00",
    caddies: ["C012", "C015", "C017", "C018"],
    team: "Red Falcons",
    group: "กิตติพงศ์ นามะชัย",
    players: 4,
  },
];

export default function BookingTable() {
  const [selected, setSelected] = useState(null);
  const [holeFilter, setHoleFilter] = useState("all"); // "all", "9", "18"

  const activeColor = "#4F6767";
  const hoverColor = "#3d5151";

  const times = Array.from({ length: 15 }).map((_, index) => {
    const hour = Math.floor(index / 4) + 6;
    const min = (index % 4) * 15;
    return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
  });

  const filteredTimes = times.filter((time) => {
    if (holeFilter === "9") {
      return time <= "11:30";
    }
    if (holeFilter === "18") {
      return true;
    }
    return true;
  });

  // ฟังก์ชันช่วยสร้างปุ่ม พร้อมจัดการ hover, active styles
  function FilterButton({ label, value }) {
    const isActive = holeFilter === value;
    return (
      <button
        className="px-4 py-2 rounded-full border transition-colors duration-200"
        onClick={() => setHoleFilter(value)}
        style={{
          backgroundColor: isActive ? activeColor : "white",
          color: isActive ? "white" : activeColor,
          borderColor: activeColor,
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = hoverColor;
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = "white";
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      {/* ปุ่มเลือก 9 หลุม / 18 หลุม / ทั้งหมด */}
      <div className="mb-4 flex gap-3 ">
        <FilterButton label="9 หลุม" value="9" />
        <FilterButton label="18 หลุม" value="18" />
        <FilterButton label="ทั้งหมด" value="all" />
      </div>

      <table className="min-w-full text-sm text-center">
        <thead>
          <tr className="bg-white border-b font-semibold text-sm text-center">
            <th className="px-2 py-2">
              <div className="flex flex-col items-center justify-center">
                <Hash size={18} className="mb-1" />
                <span>คิว</span>
              </div>
            </th>
            <th className="px-2 py-2">
              <div className="flex flex-col items-center justify-center">
                <UserRound size={18} className="mb-1" />
                <span>แคดดี้</span>
              </div>
            </th>
            <th className="px-2 py-2">
              <div className="flex flex-col items-center justify-center">
                <Clock size={18} className="mb-1" />
                <span>เวลา</span>
              </div>
            </th>
            <th className="px-2 py-2">
              <div className="flex flex-col items-center justify-center">
                <Users size={18} className="mb-1" />
                <span>ชื่อกลุ่ม</span>
              </div>
            </th>
            <th className="px-2 py-2">
              <div className="flex flex-col items-center justify-center">
                <ClipboardList size={18} className="mb-1" />
                <span>จำนวนผู้เล่น</span>
              </div>
            </th>
            <th className="px-2 py-2">
              <div className="flex flex-col items-center justify-center">
                <UserCheck size={18} className="mb-1" />
                <span>ชื่อผู้จอง</span>
              </div>
            </th>
            <th className="px-2 py-2">
              <div className="flex flex-col items-center justify-center">
                <RefreshCw size={18} className="mb-1" />
                <span>เลื่อนเวลา</span>
              </div>
            </th>
            <th className="px-2 py-2">
              <div className="flex flex-col items-center justify-center">
                <Trash2 size={18} className="mb-1" />
                <span>ยกเลิก</span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredTimes.map((time, index) => {
            const booking = bookings.find((b) => b.time === time);
            return (
              <tr
                key={time}
                className={`h-10 ${
                  booking
                    ? "bg-green-100 hover:bg-green-200 cursor-pointer"
                    : ""
                }`}
                onClick={() => booking && setSelected(booking)}
              >
                <td>{index + 1}</td>
                <td className="text-xs font-mono">
                  {booking?.caddies?.join(" ") || ""}
                </td>
                <td className="text-orange-600 font-mono">{time}</td>
                {booking ? (
                  <>
                    <td className="font-semibold">{booking.team}</td>
                    <td>{booking.players}</td>
                    <td>{booking.group}</td>
                    <td>
                      <button className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full hover:bg-gray-500">
                        เลื่อนเวลา
                      </button>
                    </td>
                    <td>
                      <button className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full hover:bg-red-500">
                        ยกเลิก
                      </button>
                    </td>
                  </>
                ) : (
                  <td colSpan={6}></td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Popup รายละเอียดการจอง */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="bg-black bg-opacity-30 fixed inset-0" aria-hidden="true" />
        <div className="relative bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 z-50">
          <Dialog.Title className="text-lg font-bold mb-2">
            รายละเอียดการจอง
          </Dialog.Title>
          {selected && (
            <div className="text-sm space-y-2">
              <p><strong>ชื่อกลุ่ม:</strong> {selected.team}</p>
              <p><strong>ชื่อผู้จอง:</strong> {selected.group}</p>
              <p><strong>เวลา:</strong> {selected.time}</p>
              <p><strong>จำนวนผู้เล่น:</strong> {selected.players}</p>
              <p><strong>แคดดี้:</strong> {selected.caddies.join(", ")}</p>
            </div>
          )}
          <div className="mt-4 text-right">
            <button
              onClick={() => setSelected(null)}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
