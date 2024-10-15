import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/app.css";
import UserProvider from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);