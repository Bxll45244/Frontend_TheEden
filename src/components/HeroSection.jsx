import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBookingClick = () => {
    if (user) {
      navigate("/booking");
    } else {
      navigate("/register");
    }
  };

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/Section.jpg')" }}
    >

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 flex flex-col justify-start h-full text-white items-center">
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl text-center">
          {user ? `Welcome, ${user.name}` : "Great swings start with passion and precision"}
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-center">
          Find skilled candidates, in-demand jobs and the solutions you need to help you do your best work yet.
        </p>

        <div className="mt-7">
          <Button onClick={handleBookingClick} variant="secondary">
            Book Now
          </Button>
        </div>
      </div>

{/* Timeline Bar */}
<div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4 h-64">
  <div className="bg-white rounded-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 h-full">

  </div>
</div>

      {/* new container*/}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 flex flex-col justify-start h-full text-white items-start">
        
      </div>
    </section>
  );
}
