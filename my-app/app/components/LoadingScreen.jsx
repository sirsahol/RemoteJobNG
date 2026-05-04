import React from "react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
