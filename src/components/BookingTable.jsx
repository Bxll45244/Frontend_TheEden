import React from "react";
import { useState, useEffect } from "react"; // useState: จัดการ state, useEffect: จัดการ side-effects เช่น fetch data
import { Dialog, Transition } from "@headlessui/react"; // สำหรับ modal/dialog
import { Fragment } from "react"; // ใช้แทน wrapper ที่ไม่ render element จริง
import {
  UserRound,
  Clock,
  Users,
  ClipboardList,
  UserCheck,
  RefreshCw,
  Trash2,
  Hash,
} from "lucide-react"; // icon ต่าง ๆ

// Mock data สำหรับทดลอง
const mockBookings = [
  {
    _id: "1",
    timeSlot: "06:00",
    caddy: [{ name: "John" }],
    groupName: "Group A",
    bookedPlayers: 4,
    teamName: "Team Alpha",
  },
  {
    _id: "2",
    timeSlot: "07:30",
    caddy: [{ name: "Jane" }],
    groupName: "Group B",
    bookedPlayers: 2,
    teamName: "Team Beta",
  },
  {
    _id: "3",
    timeSlot: "12:00",
    caddy: [{ name: "Mike" }],
    groupName: "Group C",
    bookedPlayers: 3,
    teamName: "Team Gamma",
  },
];

// Mock API function สำหรับดึงข้อมูล
const getBookings = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, bookings: mockBookings });
    }, 500);
  });
};

// Mock API function สำหรับอัปเดตการจอง
const updateBooking = async (id, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedBooking = {
        ...mockBookings.find((b) => b._id === id),
        ...data,
      };
      resolve({
        success: true,
        booking: updatedBooking,
        message: "Booking updated successfully.",
      });
    }, 500);
  });
};

// Mock API function สำหรับลบการจอง
const deleteBooking = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const remaining = mockBookings.filter((b) => b._id !== id);
      resolve({ success: true, message: "Booking deleted successfully." });
    }, 500);
  });
};

// --- Main Component ---
export default function App() {
  // State หลัก
  const [selected, setSelected] = useState(null); // booking ที่เลือก
  const [holeFilter, setHoleFilter] = useState("all"); // filter หลุม
  const [bookings, setBookings] = useState([]); // รายการ booking
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state

  // State สำหรับ modal update/delete
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState(""); // เวลาใหม่สำหรับ update

  // State สำหรับแสดงข้อความ success/error
  const [message, setMessage] = useState({ text: "", type: "" });

  const activeColor = "#4F6767"; // สีปุ่ม active
  const hoverColor = "#3d5151"; // สี hover

  // ฟังก์ชันแสดงข้อความ และซ่อนอัตโนมัติ
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  // useEffect เรียก fetchBookings ตอน mount component
  useEffect(() => {
    fetchBookings();
  }, []);

  // ฟังก์ชันดึงข้อมูล booking
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getBookings();
      if (response.success) {
        setBookings(response.bookings);
      } else {
        setError(response.message || "Failed to fetch bookings.");
      }
    } catch (err) {
      setError("Network error or server is down.");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเปิด modal update
  const handleUpdateClick = (booking) => {
    setSelected(booking); // เลือก booking
    setNewTimeSlot(booking.timeSlot); // ตั้งเวลาเริ่มต้น
    setIsUpdateModalOpen(true); // เปิด modal
  };

  // ฟังก์ชันเปิด modal delete
  const handleDeleteClick = (booking) => {
    setSelected(booking);
    setIsDeleteModalOpen(true);
  };

  // ฟังก์ชันยืนยัน update
  const handleUpdateConfirm = async () => {
    if (!selected || !newTimeSlot) return;
    try {
      const response = await updateBooking(selected._id, {
        timeSlot: newTimeSlot,
      });
      if (response.success) {
        const updatedBookings = bookings.map((b) =>
          b._id === selected._id ? response.booking : b
        );
        setBookings(updatedBookings); // อัปเดต state
        setSelected(null);
        setIsUpdateModalOpen(false);
        showMessage("อัปเดตการจองสำเร็จ!", "success"); // แสดงข้อความ success
      } else {
        showMessage("อัปเดตไม่สำเร็จ: " + response.message, "error");
      }
    } catch (err) {
      showMessage("เกิดข้อผิดพลาดในการอัปเดต", "error");
    }
  };

  // ฟังก์ชันยืนยัน delete
  const handleDeleteConfirm = async () => {
    if (!selected) return;
    try {
      const response = await deleteBooking(selected._id);
      if (response.success) {
        const remainingBookings = bookings.filter(
          (b) => b._id !== selected._id
        );
        setBookings(remainingBookings); // อัปเดต state
        setSelected(null);
        setIsDeleteModalOpen(false);
        showMessage("ลบการจองสำเร็จ!", "success"); // แสดงข้อความ success
      } else {
        showMessage("ลบไม่สำเร็จ: " + response.message, "error");
      }
    } catch (err) {
      showMessage("เกิดข้อผิดพลาดในการลบ", "error");
    }
  };

  // สร้างเวลา 6:00 ถึง 9:30 โดยเพิ่มทีละ 15 นาที
  const times = Array.from({ length: 30 }).map((_, index) => {
    const hour = Math.floor(index / 4) + 6;
    const min = (index % 4) * 15;
    return `${hour.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}`;
  });

  // filter เวลา ถ้าเลือก 9 หลุม
  const filteredTimes = times.filter((time) => {
    if (holeFilter === "9") {
      return time > "11:30";
    }
    if (holeFilter === "18") {
      return time <= "11:30";
    }
    return true;
  });
  // ปุ่ม filter
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
        }}
        onMouseEnter={(e) =>
          !isActive && (e.currentTarget.style.backgroundColor = hoverColor)
        }
        onMouseLeave={(e) =>
          !isActive && (e.currentTarget.style.backgroundColor = "white")
        }
      >
        {label}
      </button>
    );
  }

  // ถ้า loading
  if (loading) {
    return <div className="text-center p-8">กำลังโหลดข้อมูลการจอง...</div>;
  }

  // ถ้า error
  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        เกิดข้อผิดพลาด: {error}
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      {/* ข้อความแจ้งเตือน */}
      {message.text && (
        <div
          className={`p-4 mb-4 rounded-lg text-center font-bold ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ปุ่ม Filter */}
      <div className="mb-4 flex gap-3">
        <FilterButton label="9 หลุม" value="9" />
        <FilterButton label="18 หลุม" value="18" />
        <FilterButton label="ทั้งหมด" value="all" />
      </div>

      {/* ตาราง booking */}
      <table className="min-w-full text-sm text-center border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {[
              // แสดง column headers พร้อม icon
              { icon: Hash, label: "คิว" },
              { icon: UserRound, label: "แคดดี้" },
              { icon: Clock, label: "เวลา" },
              { icon: Users, label: "ชื่อกลุ่ม" },
              { icon: ClipboardList, label: "จำนวนผู้เล่น" },
              { icon: UserCheck, label: "ชื่อผู้จอง" },
              { icon: RefreshCw, label: "เลื่อนเวลา" },
              { icon: Trash2, label: "ยกเลิก" },
            ].map((col, idx) => (
              <th key={idx} className="px-2 py-2 border">
                <div className="flex flex-col items-center justify-center">
                  <col.icon size={18} className="mb-1" />
                  <span>{col.label}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredTimes.map((time, index) => {
            const booking = bookings.find((b) => b.timeSlot === time); // หา booking ตามเวลา
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
                <td>{index + 1}</td> {/* ลำดับ */}
                <td className="text-xs font-mono">
                  {booking?.caddy?.map((c) => c.name).join(" ")}
                </td>{" "}
                {/* ชื่อ caddy */}
                <td className="text-orange-600 font-mono">{time}</td>{" "}
                {/* เวลา */}
                {booking ? (
                  <>
                    <td className="font-semibold">{booking.groupName}</td>
                    <td>{booking.bookedPlayers}</td>
                    <td>{booking.teamName}</td>
                    <td>
                      {/* ปุ่มเลื่อนเวลา */}
                      <button
                        className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full hover:bg-gray-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateClick(booking);
                        }}
                      >
                        เลื่อนเวลา
                      </button>
                    </td>
                    <td>
                      {/* ปุ่มยกเลิก */}
                      <button
                        className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full hover:bg-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(booking);
                        }}
                      >
                        ยกเลิก
                      </button>
                    </td>
                  </>
                ) : (
                  <td colSpan={6}></td> // ถ้าไม่มี booking
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* --- Dialog แสดงรายละเอียด booking --- */}
      <Dialog
        open={!!selected} // เปิดเมื่อมี booking ที่เลือก
        onClose={() => setSelected(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="bg-black bg-opacity-30 fixed inset-0"
          aria-hidden="true"
        />
        <div className="relative bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 z-50">
          <Dialog.Title className="text-lg font-bold mb-2">
            รายละเอียดการจอง
          </Dialog.Title>
          {selected && (
            <div className="text-sm space-y-2">
              <p>
                <strong>ชื่อกลุ่ม:</strong> {selected.groupName}
              </p>
              <p>
                <strong>ชื่อผู้จอง:</strong> {selected.teamName}
              </p>
              <p>
                <strong>เวลา:</strong> {selected.timeSlot}
              </p>
              <p>
                <strong>จำนวนผู้เล่น:</strong> {selected.bookedPlayers}
              </p>
              <p>
                <strong>แคดดี้:</strong>{" "}
                {selected.caddy.map((c) => c.name).join(", ")}
              </p>
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

      {/* --- Dialog อัปเดต booking --- */}
      <Transition appear show={isUpdateModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsUpdateModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    เลื่อนเวลาการจอง
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">
                      กำลังเลื่อนเวลาของ **{selected?.groupName}** จาก **
                      {selected?.timeSlot}**
                    </p>
                    <label
                      htmlFor="newTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      เวลาใหม่
                    </label>
                    <input
                      type="time"
                      id="newTime"
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="mt-4">
                    {/* ปุ่มยืนยัน */}
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleUpdateConfirm}
                    >
                      ยืนยันการเลื่อนเวลา
                    </button>
                    {/* ปุ่มยกเลิก */}
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsUpdateModalOpen(false)}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* --- Dialog ลบ booking --- */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    ยืนยันการยกเลิกการจอง
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองของ **
                      {selected?.groupName}** เวลา **{selected?.timeSlot}**?
                    </p>
                  </div>
                  <div className="mt-4">
                    {/* ปุ่มยืนยัน */}
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleDeleteConfirm}
                    >
                      ยืนยันการยกเลิก
                    </button>
                    {/* ปุ่มยกเลิก */}
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
