import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import authRouter from "./routes/authRouter";

// ⛳ เพิ่มบรรทัดนี้: นำเข้า route ฝั่ง caddie ของเรา
import { caddieRoutes } from "./routes/caddieRouter";

// ⛳ เพิ่มบรรทัดนี้: รวม routes ของเพื่อน + ของเราเข้าด้วยกัน
const mergedRouter = createBrowserRouter([
  ...authRouter.routes,   // ✅ นำ route ของเพื่อนมาใช้ “ตามเดิม”
  ...caddieRoutes,        // ✅ เติม route ของเรา
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {/* ⛳ เปลี่ยนตัวแปรที่ส่งให้ RouterProvider เท่านั้น */}
      <RouterProvider router={mergedRouter} />
    </AuthProvider>
  </React.StrictMode>
);
