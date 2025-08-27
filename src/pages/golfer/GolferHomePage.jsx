import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css"; // Styles for Swiper
import "swiper/css/autoplay"; // Styles for Autoplay module

// *** นำเข้า useAuth hook จาก AuthContext ***
import { useAuth } from '../../contexts/AuthContext';

// ==========================================================
// *** คอมโพเนนต์ย่อยทั้งหมดถูกประกาศที่นี่ (นอกฟังก์ชัน GolferHomePage) ***
// ==========================================================

/**
 * HeroSection Component:
 * ส่วนหัวของหน้าแรก (Home) ที่แสดงรูปภาพพื้นหลังขนาดใหญ่เต็มขอบ
 * พร้อมปุ่ม "จองออกรอบ" อยู่มุมขวาล่าง
 */
function HeroSection() {
  const { isAuthenticated, user, logout } = useAuth(); // ดึงสถานะและข้อมูลผู้ใช้จาก AuthContext

  return (
    <section
      className="
        relative w-full h-[400px] sm:h-[500px] md:h-[600px]
        bg-cover bg-center bg-no-repeat
      "
      style={{ backgroundImage: "url('/HomeHeroSection1.jpg')" }}
    >
      <div className="absolute inset-0 flex items-end justify-end p-6 sm:p-12">
        {isAuthenticated ? (
          // ถ้า Login แล้ว
          <div className="flex flex-col items-end">
            <p className="text-white text-xl font-bold mb-2">
              สวัสดี, {user?.name || user?.email || 'ผู้ใช้'}!
            </p>
            <Link to="/booking"> {/* *** แก้ไข Link ให้เป็น /booking *** */}
              <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:text-gray-800 transition duration-300 ease-in-out text-lg mb-2">
                จองออกรอบ
              </button>
            </Link>
            <button
              onClick={logout} // ปุ่ม Logout
              className="bg-red-600 border-2 border-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-700 transition duration-300 ease-in-out text-sm"
            >
              ออกจากระบบ
            </button>
          </div>
        ) : (
          // ถ้ายังไม่ได้ Login
          <Link to="/booking"> {/* *** แก้ไข Link ให้เป็น /booking *** */}
            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:text-gray-800 transition duration-300 ease-in-out text-lg">
              จองออกรอบ
            </button>
          </Link>
        )}
      </div>
    </section>
  );
}



/**
 * TimeSlotsDisplay Component:
 * แสดงรายการเวลาที่เปิดให้จองและเวลาที่ถูกจองแล้ว
 * @param {object} props - props
 * @param {Array<object>} props.timeSlots - รายการเวลาทั้งหมด
 * @param {Array<object>} props.reservedTimes - รายการเวลาที่ถูกจองแล้ว
 */
function TimeSlotsDisplay({ timeSlots, reservedTimes }) {
  const reservedTimeSet = new Set(reservedTimes.map(item => item.time));

  return (
    <div className="text-center mt-10">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-2 px-4">
        {timeSlots.map(slot => {
          const isReserved = reservedTimeSet.has(slot.time);
          return (
            <div
              key={slot.id}
              className={`px-3 py-1 text-sm rounded-full text-white ${
                isReserved ? "bg-red-500" : "bg-green-600"
              }`}
            >
              {slot.time}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ImageGallery Component:
 * แสดงแกลเลอรีรูปภาพพร้อมเอฟเฟกต์การเคลื่อนไหว
 * @param {object} props - props
 * @param {Array<object>} props.images - รายการรูปภาพ (src, alt, className)
 */
function ImageGallery({ images }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 gap-4 max-w-md mx-auto my-12 px-4"
    >
      {images.map((img, index) => (
        <img
          key={index}
          src={img.src}
          alt={img.alt}
          className={`w-full aspect-[3/2] object-cover transform transition-transform duration-500 hover:-translate-y-2 hover:scale-105 ${img.className}`}
        />
      ))}
    </motion.div>
  );
}

/**
 * QuoteSection Component:
 * ส่วนที่แสดงคำคมหรือข้อความดึงดูดใจ
 */
function QuoteSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.5 }}
      className="text-center mb-12 px-4"
    >
      <h3 className="text-sm uppercase tracking-wider text-gray-600">
        Experience the Perfect Blend
      </h3>
      <p className="italic text-lg mt-1 text-gray-900 font-medium">
        Swing, Savor, and Unwind
      </p>
    </motion.div>
  );
}

/**
 * CourseDetailsSection Component:
 * ส่วนที่แสดงรายละเอียดเกี่ยวกับสนามกอล์ฟพร้อมรูปภาพหลุมต่างๆ
 */
function CourseDetailsSection() {
  return (
    <div className="max-w-4xl mx-auto mb-20 px-4">
      <details className="border rounded-xl p-4 shadow-md cursor-pointer">
        <summary className="font-semibold text-lg text-center">
          สนามกอล์ฟ
        </summary>
        <p className="mt-4 text-gray-700 leading-relaxed text-center">
          The Eden Golf Club เป็นหนึ่งในสนามกอล์ฟที่เก่าแก่และโดดเด่นที่สุดของนครชัยศรี
          <br />
          สนามกอล์ฟ 18 หลุม พาร์ 72 แห่งนี้ มาพร้อมกับเลย์เอาต์ที่ท้าทาย ท่ามกลางความงดงามของธรรมชาติ
        </p>

        <div className="mt-8">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={1.5}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
            }}
          >
            {Array.from({ length: 18 }, (_, i) => (
              <SwiperSlide key={i}>
                <div className="flex flex-col items-center">
                  {/* ตรวจสอบว่ารูปภาพ Hole1.avif ถึง Hole18.avif มีอยู่ในโฟลเดอร์ public */}
                  <img
                    src={`/Hole${i + 1}.avif`}
                    alt={`PAR ${i + 1}`}
                    className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-2xl shadow mb-2"
                  />
                  <span className="text-sm font-medium">PAR {i + 1}</span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="mt-8">
          {/* ตรวจสอบว่ารูปภาพ map-golf.jpg มีอยู่ในโฟลเดอร์ public */}
          <img
            src="/map-golf.jpg"
            alt="full golf course"
            className="w-full h-auto rounded-xl shadow-xl object-cover"
          />
        </div>
      </details>
    </div>
  );
}

/**
 * VisitUsSection Component:
 * ส่วนที่แสดงที่ตั้งของสนามกอล์ฟพร้อมแผนที่ Google Maps
 */
function VisitUsSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 mb-20">
      <h2 className="text-center text-2xl font-semibold mb-4">Visit Us</h2>
      <p className="text-center mb-6 text-gray-700">
        Eden Golf Club ตั้งอยู่ใกล้มหาวิทยาลัยราชภัฏนครปฐม
        <br />
        50 ถนนเพชรเกษม ตำบลนครปฐม อำเภอเมือง จังหวัดนครปฐม 73000
      </p>
      <div className="w-full h-72 rounded-lg overflow-hidden shadow-lg">
        {/*
          Warning: Google Maps Embed API requires a valid API key for production use.
          For development, it might work without, but for deployment, get an API key.
          Replace 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.344727973501!2d100.0653118153113!3d13.819183490356382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2a2f041a7ee39%3A0x456bd50b23e87c0f!2sNakhon%20Pathom%20Rajabhat%20University!5e0!3m2!1sen!2sth!4v1687628393531!5m2=1sen!2sth' with your actual embed URL.
        */}
        <iframe
          title="Nakhon Pathom Rajabhat University Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.1084284693755!2d100.03814497607733!3d13.714574987113197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2946c927f12e7%3A0xc02e7b5f2a1b1a7c!2sNakhon%20Pathom%20Rajabhat%20University!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth" // ตัวอย่าง URL ฝังแผนที่จริง (แทนที่ด้วยพิกัดจริงของคุณ)
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}


// ==========================================================
// *** GolferHomePage Component หลัก ***
// ==========================================================

/**
 * GolferHomePage Component:
 * เป็นหน้าหลักสำหรับผู้ใช้งานประเภท Golfer
 * แสดงส่วนต่างๆ เช่น Hero Section, ตารางเวลา, แกลเลอรีรูปภาพ และรายละเอียดสนามกอล์ฟ
 */
export default function GolferHomePage() {
  // ข้อมูลจำลองสำหรับ Time Slots (แทนที่การดึงจาก Backend API)
  const timeSlots = [
    { id: 1, time: "06:00" }, { id: 2, time: "06:15" }, { id: 3, time: "06:30" }, { id: 4, time: "06:45" },
    { id: 5, time: "07:00" }, { id: 6, time: "07:15" }, { id: 7, time: "07:30" }, { id: 8, time: "07:45" },
    { id: 9, time: "08:00" }, { id: 10, time: "08:15" }, { id: 11, time: "08:30" }, { id: 12, time: "08:45" },
    { id: 13, time: "09:00" }, { id: 14, time: "09:15" }, { id: 15, time: "09:30" }, { id: 16, time: "09:45" },
    { id: 17, time: "10:00" }, { id: 18, time: "10:15" }, { id: 19, time: "10:30" }, { id: 20, time: "10:45" },
    { id: 21, time: "11:00" }, { id: 22, time: "11:15" }, { id: 23, time: "11:30" }, { id: 24, time: "11:45" },
    { id: 25, time: "12:00" }, { id: 26, time: "12:15" }, { id: 27, time: "12:30" }, { id: 28, time: "12:45" },
    { id: 29, time: "13:00" }, { id: 30, time: "13:15" }, { id: 31, time: "13:30" }, { id: 32, time: "13:45" },
    { id: 33, time: "14:00" }, { id: 34, time: "14:15" }, { id: 35, time: "14:30" }, { id: 36, time: "14:45" },
    { id: 37, time: "15:00" }, { id: 38, time: "15:15" }, { id: 39, time: "15:30" }, { id: 40, time: "15:45" },
    { id: 41, time: "16:00" }, { id: 42, time: "16:15" }, { id: 43, time: "16:30" }, { id: 44, time: "16:45" },
    { id: 45, time: "17:00" }, { id: 46, time: "17:15" }, { id: 47, time: "17:30" }, { id: 48, time: "17:45" },
  ];

  // ข้อมูลจำลองสำหรับเวลาที่ถูกจองแล้ว (แทนที่การดึงจาก Backend API)
  const reservedTimes = [
    { id: 1, time: "06:00" }, { id: 2, time: "06:45" }, { id: 3, time: "07:30" }, { id: 4, time: "08:15" },
    { id: 5, time: "09:00" }, { id: 6, time: "09:45" }, { id: 7, time: "10:30" }, { id: 8, time: "11:15" },
    { id: 9, time: "12:00" }, { id: 10, time: "12:45" }, { id: 11, time: "13:30" }, { id: 12, time: "14:15" },
    { id: 13, time: "15:00" }, { id: 14, time: "15:45" }, { id: 15, time: "16:30" }, { id: 16, time: "17:15" },
  ];

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* <DiamondDivider /> <-- ลบบรรทัดนี้ */}

      <section className="py-8 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          ไทม์ไลน์เวลาวันนี้
        </h2>
        <TimeSlotsDisplay timeSlots={timeSlots} reservedTimes={reservedTimes} />
      </section>

      {/* <DiamondDivider /> <-- ลบบรรทัดนี้ */}

      <section className="py-8 bg-gray-50">
        <ImageGallery
          images={[
            { src: "/slide-1.avif", alt: "golf", className: "rotate-[-3deg]" },
            { src: "/slide-2.jpg", alt: "course", className: "rotate-[2deg] mx-auto w-11/12" },
          ]}
        />
      </section>

      <QuoteSection />

      <section className="py-8 bg-gray-50">
        <ImageGallery
          images={[
            { src: "/slide-3.avif", alt: "golfer", className: "rotate-[-2deg] mx-auto w-11/12" },
            { src: "/slide-4.avif", alt: "relax", className: "rotate-[3deg]" },
          ]}
        />
      </section>

      <CourseDetailsSection />

      <VisitUsSection />
    </div>
  );
}