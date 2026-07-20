"use client";

import React, { useState, useEffect } from "react";
import AdPlaceholder from "./AdPlaceholder";

export default function DownloadModal({ isOpen, onClose, onDownload, fileName }) {
  const [countdown, setCountdown] = useState(5);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setIsReady(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
        onClick={isReady ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-6 w-full max-w-md relative z-10 transform scale-100 transition-all duration-300 flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center w-full mb-4">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {isReady ? "Download Ready!" : "Processing Secure Download..."}
          </h3>
          <p className="text-xs text-slate-500 mt-1 truncate max-w-xs mx-auto font-medium">
            File: {fileName}
          </p>
        </div>

        {/* Countdown Visualizer */}
        <div className="flex items-center justify-center mb-6">
          {isReady ? (
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center animate-bounce shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
          ) : (
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Outer ticking circle */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
              <div
                className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"
                style={{ animationDuration: "1s" }}
              />
              <span className="text-xl font-extrabold text-emerald-500">
                {countdown}
              </span>
            </div>
          )}
        </div>



        {/* Action Button */}
        <div className="w-full">
          {isReady ? (
            <button
              onClick={() => {
                onDownload();
                onClose();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.01] active:scale-[0.99] text-white font-bold rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/10 text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              Download Converted File
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3.5 bg-slate-100 text-slate-400 font-bold rounded-xl text-sm border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                className="animate-spin -ml-1 mr-2 h-4.5 w-4.5 text-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Unlocking Download link in {countdown}s...
            </button>
          )}
        </div>

        {/* Privacy Note */}
        <p className="text-[10px] text-slate-400 mt-3 text-center font-medium">
          Secure client-side processing. Your file never leaves your device.
        </p>
      </div>
    </div>
  );
}
