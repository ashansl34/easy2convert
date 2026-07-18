"use client";

import React, { useState } from "react";
import Header from "../../components/Header";

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState("px-rem");

  // 1. PX to REM Converter State
  const [pxVal, setPxVal] = useState(16);
  const [remVal, setRemVal] = useState(1);
  const [baseVal, setBaseVal] = useState(16);

  // 2. Aspect Ratio Calculator State
  const [origWidth, setOrigWidth] = useState(1920);
  const [origHeight, setOrigHeight] = useState(1080);
  const [newWidth, setNewWidth] = useState(1280);
  const [newHeight, setNewHeight] = useState(720);

  // 3. Data Size Converter State
  const [dataInput, setDataInput] = useState(1024);
  const [dataUnit, setDataUnit] = useState("MB");

  // PX to REM Handlers
  const handlePxChange = (val) => {
    setPxVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && baseVal) {
      setRemVal(parsed / baseVal);
    } else {
      setRemVal("");
    }
  };

  const handleRemChange = (val) => {
    setRemVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && baseVal) {
      setPxVal(parsed * baseVal);
    } else {
      setPxVal("");
    }
  };

  const handleBaseChange = (val) => {
    setBaseVal(val);
    const parsedBase = parseFloat(val);
    const parsedPx = parseFloat(pxVal);
    if (!isNaN(parsedPx) && parsedBase) {
      setRemVal(parsedPx / parsedBase);
    }
  };

  // Aspect Ratio Handlers
  const calculateNewHeight = (w, h, newW) => {
    const parsedW = parseFloat(w);
    const parsedH = parseFloat(h);
    const parsedNewW = parseFloat(newW);
    if (parsedW && parsedH && parsedNewW) {
      setNewHeight(Math.round((parsedH / parsedW) * parsedNewW));
    } else {
      setNewHeight("");
    }
  };

  const handleOrigWidthChange = (val) => {
    setOrigWidth(val);
    calculateNewHeight(val, origHeight, newWidth);
  };

  const handleOrigHeightChange = (val) => {
    setOrigHeight(val);
    calculateNewHeight(origWidth, val, newWidth);
  };

  const handleNewWidthChange = (val) => {
    setNewWidth(val);
    calculateNewHeight(origWidth, origHeight, val);
  };

  const gcd = (a, b) => {
    return b ? gcd(b, a % b) : a;
  };

  const getAspectRatio = (w, h) => {
    const parsedW = parseInt(w);
    const parsedH = parseInt(h);
    if (!parsedW || !parsedH) return "0:0";
    const divisor = gcd(parsedW, parsedH);
    return `${parsedW / divisor}:${parsedH / divisor}`;
  };

  // Data Size Handlers
  const convertData = (value, unit) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return { b: "", kb: "", mb: "", gb: "", tb: "" };

    let inBytes = 0;
    if (unit === "B") inBytes = parsed;
    else if (unit === "KB") inBytes = parsed * 1024;
    else if (unit === "MB") inBytes = parsed * 1024 * 1024;
    else if (unit === "GB") inBytes = parsed * 1024 * 1024 * 1024;
    else if (unit === "TB") inBytes = parsed * 1024 * 1024 * 1024 * 1024;

    return {
      b: inBytes.toLocaleString(),
      kb: (inBytes / 1024).toLocaleString(undefined, { maximumFractionDigits: 4 }),
      mb: (inBytes / (1024 * 1024)).toLocaleString(undefined, { maximumFractionDigits: 4 }),
      gb: (inBytes / (1024 * 1024 * 1024)).toLocaleString(undefined, { maximumFractionDigits: 6 }),
      tb: (inBytes / (1024 * 1024 * 1024 * 1024)).toLocaleString(undefined, { maximumFractionDigits: 8 }),
    };
  };

  const dataConversions = convertData(dataInput, dataUnit);

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-[#030712] text-gray-200 selection:bg-emerald-950 selection:text-white select-none">
      
      {/* Header */}
      <Header currentPage="calculators" />

      {/* Main Workspace */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-6 py-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-900/40">
            Utility Hub
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2.5">
            Developer & Designer Utility Calculators
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
            Quick, reliable local calculators running directly in your browser. Absolutely zero uploads, server-calls, or data tracking.
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="max-w-2xl mx-auto mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-emerald-400 transition-colors bg-[#0b0f19] border border-gray-900 hover:border-emerald-900/50 px-4.5 py-2.5 rounded-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home Converter
          </a>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center border-b border-gray-900 mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("px-rem")}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === "px-rem"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            PX to REM
          </button>
          <button
            onClick={() => setActiveTab("aspect-ratio")}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === "aspect-ratio"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            Aspect Ratio
          </button>
          <button
            onClick={() => setActiveTab("data-size")}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === "data-size"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            Data Size
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="bg-[#0b0f19] border border-gray-900 rounded-2xl shadow-2xl shadow-black/60 p-6 md:p-8 max-w-2xl mx-auto">
          
          {/* 1. PX to REM Converter */}
          {activeTab === "px-rem" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-gray-900 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                </svg>
                PX to REM Converter
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Pixels (px)</label>
                  <input
                    type="number"
                    value={pxVal}
                    onChange={(e) => handlePxChange(e.target.value)}
                    className="w-full bg-[#030712] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                
                <div className="flex items-center justify-center pt-5 text-gray-600 hidden sm:flex">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">REM (rem)</label>
                  <input
                    type="number"
                    step="0.0625"
                    value={remVal}
                    onChange={(e) => handleRemChange(e.target.value)}
                    className="w-full bg-[#030712] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#030712] border border-gray-900 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Calculation Base</p>
                  <p className="text-sm text-gray-300 mt-0.5">1rem = <span className="font-bold text-emerald-400">{baseVal}px</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Change Base:</span>
                  <input
                    type="number"
                    value={baseVal}
                    onChange={(e) => handleBaseChange(e.target.value)}
                    className="w-16 bg-[#0b0f19] border border-gray-800 rounded-lg px-2 py-1 text-xs text-center text-white outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-gray-500">px</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Aspect Ratio Calculator */}
          {activeTab === "aspect-ratio" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-gray-900 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5m0-16.5h16.5m-16.5 0L19.5 20.25M19.5 3.75v16.5m0-16.5H3.75" />
                </svg>
                Aspect Ratio Calculator
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Original Size</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={origWidth}
                        onChange={(e) => handleOrigWidthChange(e.target.value)}
                        className="w-full bg-[#030712] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={origHeight}
                        onChange={(e) => handleOrigHeightChange(e.target.value)}
                        className="w-full bg-[#030712] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#030712] border border-gray-900 rounded-xl p-3 flex justify-between text-xs items-center">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">Calculated Aspect Ratio</span>
                  <span className="text-emerald-400 font-extrabold text-base">{getAspectRatio(origWidth, origHeight)}</span>
                </div>

                <hr className="border-gray-900" />

                <div>
                  <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Target Calculation</h4>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 mb-1">New Width (px)</label>
                      <input
                        type="number"
                        value={newWidth}
                        onChange={(e) => handleNewWidthChange(e.target.value)}
                        className="w-full bg-[#030712] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div className="bg-[#030712] border border-gray-900 rounded-xl p-4 text-center">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Height</p>
                      <p className="text-lg font-extrabold text-emerald-400 mt-0.5">
                        {newHeight ? `${newHeight} px` : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Data Size Converter */}
          {activeTab === "data-size" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-gray-900 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5" />
                </svg>
                Data Size Converter
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 mb-1">Enter Value</label>
                  <input
                    type="number"
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                    className="w-full bg-[#030712] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Unit</label>
                  <select
                    value={dataUnit}
                    onChange={(e) => setDataUnit(e.target.value)}
                    className="w-full bg-[#030712] border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 focus:border-emerald-500 outline-none"
                  >
                    <option value="B">Bytes</option>
                    <option value="KB">Kilobytes (KB)</option>
                    <option value="MB">Megabytes (MB)</option>
                    <option value="GB">Gigabytes (GB)</option>
                    <option value="TB">Terabytes (TB)</option>
                  </select>
                </div>
              </div>

              <div className="border border-gray-900 rounded-xl divide-y divide-gray-900 bg-[#030712] overflow-hidden">
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-gray-500 font-bold">Bytes</span>
                  <span className="text-white text-right font-extrabold">{dataConversions.b} B</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-gray-500 font-bold">Kilobytes (KB)</span>
                  <span className="text-white text-right font-extrabold">{dataConversions.kb} KB</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-gray-500 font-bold">Megabytes (MB)</span>
                  <span className="text-white text-right font-extrabold">{dataConversions.mb} MB</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-gray-500 font-bold">Gigabytes (GB)</span>
                  <span className="text-white text-right font-extrabold">{dataConversions.gb} GB</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-gray-500 font-bold">Terabytes (TB)</span>
                  <span className="text-white text-right font-extrabold">{dataConversions.tb} TB</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#030712] border-t border-gray-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-gray-500 font-semibold">
              © {new Date().getFullYear()} easy2convert.xyz. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed max-w-md">
              Secure client-side utilities. Local calculation models eliminate network latency and ensure complete data privacy.
            </p>
          </div>
          <div className="flex gap-6 text-xs font-bold text-gray-500">
            <a href="/" className="hover:text-emerald-400 transition-colors">
              Converter
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
