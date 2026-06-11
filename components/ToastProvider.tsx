"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      containerStyle={{
        top: 110, // Header ke niche
      }}
      toastOptions={{
        duration: 2500,
        style: {
          borderRadius: "16px",
          background: "#111827",
          color: "#fff",
          fontWeight: "600",
          padding: "14px 18px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.25)",
        },
        success: {
          iconTheme: {
            primary: "#16a34a",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}