import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CircleUser } from "lucide-react";
import { Button } from "../components/Button";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext); 
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/">
          <img
            src="/images/eden-Logo.png"
            alt="The Eden Golf Club Logo"
            className="h-12 sm:h-14"
          />
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-6 relative">

          {/* register button */}
          <Button
            to="/register"
            variant="primary"
            className="text-lg"
          >
            Join Us
          </Button>

          {user && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-800 hover:text-green-600 transition focus:outline-none"
              >
                <CircleUser className="w-6 h-6" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {/* แสดงชื่อใน dropdown */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-md font-semibold">{user.name}</p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        โปรไฟล์ของฉัน
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        ออกจากระบบ
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
