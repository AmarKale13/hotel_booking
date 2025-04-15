import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./AuthContext"; // ✅ Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById("root"));

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>


root.render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Wrap App inside AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
