"use client";

import React from "react";

export default function AdPlaceholder({ type = "banner", className = "" }) {
  if (type === "banner") {
    return (
      <div
        className={`w-full max-w-4xl mx-auto my-6 border border-dashed border-gray-900 rounded-xl bg-gray-950/30 p-4 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:border-indigo-900/60 hover:bg-[#0e1422]/60 hover:shadow-sm ${className}`}
        style={{ minHeight: "100px" }}
      >
        <div className="absolute top-1 left-3 text-[9px] font-semibold text-gray-500 tracking-widest uppercase">
          Advertisement
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-full pt-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-950/40 rounded-lg flex items-center justify-center text-indigo-400 font-bold border border-indigo-900/30 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-200">
                CloudDrive Pro
              </h4>
              <p className="text-xs text-gray-400">
                Get 10TB secure cloud storage. Access files from anywhere, fast.
              </p>
            </div>
          </div>
          <button className="bg-indigo-950/60 hover:bg-indigo-900/50 text-indigo-400 font-medium px-4 py-2 rounded-lg text-xs transition-colors duration-200 border border-indigo-900/40 whitespace-nowrap">
            Learn More
          </button>
        </div>
      </div>
    );
  }

  if (type === "scraper") {
    return (
      <div
        className={`w-[160px] h-[600px] border border-dashed border-gray-900 rounded-xl bg-gray-950/30 p-4 backdrop-blur-sm relative flex flex-col justify-between items-center transition-all duration-300 hover:border-emerald-900/60 hover:bg-[#0e1422]/60 hover:shadow-sm ${className}`}
      >
        <div className="absolute top-2 left-0 right-0 text-center text-[9px] font-semibold text-gray-500 tracking-widest uppercase">
          Advertisement
        </div>
        <div className="flex flex-col items-center justify-center flex-grow text-center px-1 pt-6 gap-6">
          <div className="w-16 h-16 bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-400 font-bold border border-emerald-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-200">WebShield VPN</h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Unblock content and secure your online privacy instantly. 30-day trial.
            </p>
          </div>
          <button className="bg-emerald-950/60 hover:bg-emerald-900/50 text-emerald-400 font-semibold px-4 py-2 rounded-lg text-xs w-full transition-colors duration-200 border border-emerald-900/40">
            Install Shield
          </button>
        </div>
        <div className="text-[10px] text-gray-500 font-medium">
          webshield-vpn.com
        </div>
      </div>
    );
  }

  if (type === "modal") {
    return (
      <div
        className={`w-full max-w-[336px] min-h-[280px] border border-dashed border-gray-900 rounded-xl bg-gray-950/30 p-6 backdrop-blur-sm relative flex flex-col justify-between items-center transition-all duration-300 hover:border-indigo-900/60 hover:bg-[#0e1422]/60 hover:shadow-sm ${className}`}
      >
        <div className="absolute top-2 left-0 right-0 text-center text-[9px] font-semibold text-gray-500 tracking-widest uppercase">
          Sponsored Link
        </div>
        <div className="flex flex-col items-center justify-center flex-grow text-center pt-4 gap-4">
          <div className="w-14 h-14 bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-base font-bold text-gray-200">
              High-Yield Savings
            </h4>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Earn 5.25% APY on your cash. Zero fees, fully insured. Start saving today.
            </p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg text-xs w-full transition-all duration-200 shadow-sm shadow-indigo-500/20">
            Get High Yield APY
          </button>
        </div>
        <div className="text-[10px] text-gray-500 mt-3 font-medium">
          sponsored by securebank.com
        </div>
      </div>
    );
  }

  return null;
}
