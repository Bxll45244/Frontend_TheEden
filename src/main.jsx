import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App>
          <AppRouter />
        </App>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);