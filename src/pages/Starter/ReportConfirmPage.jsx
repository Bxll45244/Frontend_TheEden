import { useNavigate, useLocation } from "react-router-dom";

const colorMap = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
};

const ReportConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const popup = location.state || {};

  const circleColor = colorMap[popup.color] || "bg-gray-400";

  const titleText = popup.title ? `${popup.title} สำเร็จ` : "สำเร็จ!";
  const holeText = popup.hole ? `หลุมที่ ${popup.hole}` : "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-[90%] max-w-sm text-center space-y-6">
        <div className={`${circleColor} w-12 h-12 rounded-full mx-auto`} />

        <h3 className="text-lg font-semibold">{titleText}</h3>

        {holeText && <p>แจ้งสำหรับ {holeText}</p>}

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-400 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
        >
          ตกลง
        </button>
      </div>
    </div>
  );
};

export default ReportConfirmPage;
