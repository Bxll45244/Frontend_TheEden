import React from "react";

import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
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

// Import service functions
import { getBookings, updateBooking, deleteBooking } from "../service/bookingService.js";

export default function BookingTable() {
  const [selected, setSelected] = useState(null);
  const [holeFilter, setHoleFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for update/delete dialogs
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState("");

  const activeColor = "#4F6767";
  const hoverColor = "#3d5151";

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

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

  // Handlers for update and delete
  const handleUpdateClick = (booking) => {
    setSelected(booking);
    setNewTimeSlot(booking.timeSlot);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (booking) => {
    setSelected(booking);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateConfirm = async () => {
    if (!selected || !newTimeSlot) return;
    try {
      const response = await updateBooking(selected._id, { timeSlot: newTimeSlot });
      if (response.success) {
        // อัปเดตข้อมูลใน UI โดยไม่ต้องโหลดใหม่ทั้งหมด
        const updatedBookings = bookings.map(b => b._id === selected._id ? response.booking : b);
        setBookings(updatedBookings);
        setSelected(null);
        setIsUpdateModalOpen(false);
        // สามารถเพิ่มการแจ้งเตือนสำเร็จได้ที่นี่
        alert("อัปเดตการจองสำเร็จ!");
      } else {
        alert("อัปเดตไม่สำเร็จ: " + response.message);
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการอัปเดต");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    try {
      const response = await deleteBooking(selected._id);
      if (response.success) {
        // ลบข้อมูลออกจาก UI
        const remainingBookings = bookings.filter(b => b._id !== selected._id);
        setBookings(remainingBookings);
        setSelected(null);
        setIsDeleteModalOpen(false);
        alert("ลบการจองสำเร็จ!");
      } else {
        alert("ลบไม่สำเร็จ: " + response.message);
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  const times = Array.from({ length: 15 }).map((_, index) => {
    const hour = Math.floor(index / 4) + 6;
    const min = (index % 4) * 15;
    return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
  });

  const filteredTimes = times.filter(time => {
    if (holeFilter === "9") return time <= "11:30";
    return true;
  });

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
        onMouseEnter={(e) => !isActive && (e.currentTarget.style.backgroundColor = hoverColor)}
        onMouseLeave={(e) => !isActive && (e.currentTarget.style.backgroundColor = "white")}
      >
        {label}
      </button>
    );
  }

  if (loading) {
    return <div className="text-center p-8">กำลังโหลดข้อมูลการจอง...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">เกิดข้อผิดพลาด: {error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-xl overflow-x-auto">
      <div className="mb-4 flex gap-3">
        <FilterButton label="9 หลุม" value="9" />
        <FilterButton label="18 หลุม" value="18" />
        <FilterButton label="ทั้งหมด" value="all" />
      </div>

      <table className="min-w-full text-sm text-center border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {[
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
            const booking = bookings.find(b => b.timeSlot === time);
            return (
              <tr
                key={time}
                className={`h-10 ${
                  booking ? "bg-green-100 hover:bg-green-200 cursor-pointer" : ""
                }`}
                onClick={() => booking && setSelected(booking)}
              >
                <td>{index + 1}</td>
                <td className="text-xs font-mono">{booking?.caddy?.map(c => c.name).join(" ")}</td>
                <td className="text-orange-600 font-mono">{time}</td>
                {booking ? (
                  <>
                    <td className="font-semibold">{booking.groupName}</td>
                    <td>{booking.bookedPlayers}</td>
                    <td>{booking.teamName}</td>
                    <td>
                      <button
                        className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full hover:bg-gray-500"
                        onClick={(e) => { e.stopPropagation(); handleUpdateClick(booking); }}
                      >
                        เลื่อนเวลา
                      </button>
                    </td>
                    <td>
                      <button
                        className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full hover:bg-red-500"
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(booking); }}
                      >
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

      {/* --- Dialog สำหรับดูรายละเอียด (Original) --- */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="bg-black bg-opacity-30 fixed inset-0" aria-hidden="true" />
        <div className="relative bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6 z-50">
          <Dialog.Title className="text-lg font-bold mb-2">รายละเอียดการจอง</Dialog.Title>
          {selected && (
            <div className="text-sm space-y-2">
              <p><strong>ชื่อกลุ่ม:</strong> {selected.groupName}</p>
              <p><strong>ชื่อผู้จอง:</strong> {selected.teamName}</p>
              <p><strong>เวลา:</strong> {selected.timeSlot}</p>
              <p><strong>จำนวนผู้เล่น:</strong> {selected.bookedPlayers}</p>
              <p><strong>แคดดี้:</strong> {selected.caddy.map(c => c.name).join(", ")}</p>
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

      {/* --- Dialog สำหรับอัปเดต --- */}
      <Transition appear show={isUpdateModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsUpdateModalOpen(false)}>
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    เลื่อนเวลาการจอง
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">
                      กำลังเลื่อนเวลาของ **{selected?.groupName}** จาก **{selected?.timeSlot}**
                    </p>
                    <label htmlFor="newTime" className="block text-sm font-medium text-gray-700">
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
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleUpdateConfirm}
                    >
                      ยืนยันการเลื่อนเวลา
                    </button>
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

      {/* --- Dialog สำหรับลบ --- */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteModalOpen(false)}>
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    ยืนยันการยกเลิกการจอง
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองของ **{selected?.groupName}** เวลา **{selected?.timeSlot}**?
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleDeleteConfirm}
                    >
                      ยืนยันการยกเลิก
                    </button>
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