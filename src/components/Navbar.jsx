import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/">
          
        </Link>
        <button
          className="text-gray-800 text-2xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className="hidden md:flex space-x-6 text-gray-800 font-medium text-base">
          <Link to="/">หน้าแรก</Link>
          <Link to="#">โปรไฟล์</Link>
          <Link to="#">สมัครสมาชิก</Link>
          <Link to="#">เข้าสู่ระบบ</Link>
        </nav>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-white border-t px-4 py-4">
          <ul className="space-y-4 text-gray-800 font-medium text-base">
            <li><Link to="/">หน้าแรก</Link></li>
            <li><Link to="#">โปรไฟล์</Link></li>
            <li><Link to="#">สมัครสมาชิก</Link></li>
            <li><Link to="#">เข้าสู่ระบบ</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
}