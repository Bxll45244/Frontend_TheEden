import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
//import authRouter from "./routes/authRouter";
import adminRouter from "./routes/adminRouter";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={adminRouter} />
    </AuthProvider>
  </React.StrictMode>
);
