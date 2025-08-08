import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/Button";

export default function HeroSection() {
  const { user } = useContext(AuthContext);

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/Section.jpg')" }}
    >
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center h-full text-white">
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl">
          {user ? `Welcome, ${user.name}` : "Anything’s possible when you have the talent"}
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          Find skilled candidates, in-demand jobs and the solutions you need to help you do your best work yet.
        </p>

        {/* Single CTA Button */}
        <div className="mt-8">
          <Button
            to="/booking"
            variant="primary"
            className="px-8 py-4 rounded-full text-lg shadow-lg"
          >
            Book a Golf Course
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4">
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4">
          <input
            type="text"
            placeholder="Job Title, Skills, or Keywords"
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none"
          />
          <input
            type="text"
            placeholder="City, State, or Zip Code"
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none"
          />
        </div>
      </div>
    </section>
  );
}
