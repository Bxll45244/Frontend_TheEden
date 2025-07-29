import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; 


import App from "./App"; // Import the top-level App component
import AppRouter from "./routes/AppRouter"; // Import your central router
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* App wraps AppRouter, allowing App to provide global context/layout */}
    <App>
      <AuthProvider>
      <AppRouter />
      </AuthProvider>
    </App>
  </React.StrictMode>
);