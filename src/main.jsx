import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; 

import App from "./App"; // Top-level App component
import AppRouter from "./routes/AppRouter.jsx"; // Central router
import { AuthProvider } from './contexts/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* App wraps AppRouter, providing global context/layout */}
    <App>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </App>
  </React.StrictMode>
);
