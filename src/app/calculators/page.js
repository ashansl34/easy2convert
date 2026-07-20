"use client";

import React, { useState } from "react";
import Header from "../../components/Header";

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("px-rem");

  // PX to REM States
  const [pxVal, setPxVal] = useState("");
  const [remVal, setRemVal] = useState("");
  const [baseVal, setBaseVal] = useState("16");

  // Aspect Ratio States
  const [origWidth, setOrigWidth] = useState("1920");
  const [origHeight, setOrigHeight] = useState("1080");
  const [newWidth, setNewWidth] = useState("1280");
  const [newHeight, setNewHeight] = useState("720");

  // Data Size States
  const [dataInput, setDataInput] = useState("1024");
  const [dataUnit, setDataUnit] = useState("MB");

  // Helper to simplify fraction
  const getAspectRatio = (w, h) => {
    const parsedW = parseFloat(w);
    const parsedH = parseFloat(h);
    if (!parsedW || !parsedH) return "—";

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(parsedW, parsedH);
    return `${parsedW / divisor}:${parsedH / divisor}`;
  };

  // PX to REM Handlers
  const handlePxChange = (val) => {
    setPxVal(val);
    const parsedPx = parseFloat(val);
    const parsedBase = parseFloat(baseVal);
    if (!isNaN(parsedPx) && parsedBase) {
      setRemVal(parsedPx / parsedBase);
    } else {
      setRemVal("");
    }
  };

  const handleRemChange = (val) => {
    setRemVal(val);
    const parsedRem = parseFloat(val);
    const parsedBase = parseFloat(baseVal);
    if (!isNaN(parsedRem) && parsedBase) {
      setPxVal(parsedRem * parsedBase);
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

  // Data Size Converter math
  const convertData = (val, fromUnit) => {
    const num = parseFloat(val);
    if (isNaN(num)) return { b: "0", kb: "0", mb: "0", gb: "0", tb: "0" };

    const units = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024, TB: 1024 * 1024 * 1024 * 1024 };
    const inBytes = num * (units[fromUnit] || 1);

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
    <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-950 select-none">
      
      {/* Header */}
      <Header currentPage="calculators" />

      {/* Main Workspace */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-6 py-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Utility Hub
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            Developer & Designer Utility Calculators
          </h2>
          <p className="text-sm text-emerald-600 font-semibold mt-2.5 max-w-md mx-auto leading-relaxed">
            Your all-in-one online calculator suite for lightning-fast local web computations without server lag.
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed font-medium">
            Quick, reliable local calculators running directly in your browser. Absolutely zero uploads, server-calls, or data tracking.
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="max-w-2xl mx-auto mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors bg-white border border-slate-200 hover:border-emerald-200 px-4.5 py-2.5 rounded-xl shadow-sm hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home Converter
          </a>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center border-b border-slate-200 mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("px-rem")}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "px-rem"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            PX to REM
          </button>
          <button
            onClick={() => setActiveTab("aspect-ratio")}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "aspect-ratio"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Aspect Ratio
          </button>
          <button
            onClick={() => setActiveTab("data-size")}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "data-size"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Data Size
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 max-w-2xl mx-auto">
          
          {/* 1. PX to REM Converter */}
          {activeTab === "px-rem" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                </svg>
                PX to REM Converter
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Pixels (px)</label>
                  <input
                    type="number"
                    value={pxVal}
                    onChange={(e) => handlePxChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white outline-none"
                  />
                </div>
                
                <div className="flex items-center justify-center pt-5 text-slate-300 hidden sm:flex">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">REM (rem)</label>
                  <input
                    type="number"
                    step="0.0625"
                    value={remVal}
                    onChange={(e) => handleRemChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Calculation Base</p>
                  <p className="text-sm text-slate-700 mt-0.5 font-medium">1rem = <span className="font-bold text-emerald-600">{baseVal}px</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Change Base:</span>
                  <input
                    type="number"
                    value={baseVal}
                    onChange={(e) => handleBaseChange(e.target.value)}
                    className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-center text-slate-800 outline-none focus:border-emerald-500"
                  />
                  <span className="text-xs text-slate-400 font-semibold">px</span>
                </div>
              </div>

              {/* Informative Text Container */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-left space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Understanding PX to REM
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">
                    What is this calculator and why use it?
                  </h4>
                  <p className="mt-1">
                    The PX to REM Converter is an essential design-to-code utility built for web developers and UI designers. In digital layouts, <strong>Pixels (PX)</strong> represent absolute measurements bound to physical screen display densities. However, modern web standards prioritize accessibility and responsive typography, which is where <strong>Root Em (REM)</strong> units come in. REM units are relative sizes calculated dynamically based on the root font size settings defined by the user's browser.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Step-by-Step Usage Guide:
                  </h4>
                  <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li>Input your desired pixel size in the <strong>Pixels (px)</strong> field to immediately convert it to REM.</li>
                    <li>Alternatively, type a REM value in the <strong>REM (rem)</strong> field to dynamically calculate the equivalent pixel dimensions.</li>
                    <li>If your project scales on a non-default base (such as a 10px Tailwind layout reset), simply change the value in the <strong>Calculation Base</strong> field to adjust the conversion ratio dynamically.</li>
                  </ol>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Mathematical Conversion Formulas:
                  </h4>
                  <p className="mt-1">
                    The conversion logic divides the target size by the baseline typography scale:
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-2 font-mono text-[11px] text-emerald-700">
                    REM Value = Target Pixels (px) / Base Font Size (px)
                  </div>
                  <p>
                    For the reverse calculation, the relative REM unit is multiplied by the base size to recover absolute pixels:
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-2 font-mono text-[11px] text-emerald-700">
                    Pixel Value (px) = REM Value (rem) * Base Font Size (px)
                  </div>
                  <p>
                    By transitioning styling sheets to relative REM values, you ensure that if an individual zooms their browser or overrides font sizes for visual convenience, your entire layout adjusts proportionally, meeting World Wide Web Consortium (W3C) accessibility guidelines.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Aspect Ratio Calculator */}
          {activeTab === "aspect-ratio" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5m0-16.5h16.5m-16.5 0L19.5 20.25M19.5 3.75v16.5m0-16.5H3.75" />
                </svg>
                Aspect Ratio Calculator
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Original Size</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={origWidth}
                        onChange={(e) => handleOrigWidthChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={origHeight}
                        onChange={(e) => handleOrigHeightChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between text-xs items-center">
                  <span className="text-slate-505 font-bold uppercase tracking-wider">Calculated Aspect Ratio</span>
                  <span className="text-emerald-600 font-extrabold text-base">{getAspectRatio(origWidth, origHeight)}</span>
                </div>

                <hr className="border-slate-200" />

                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Target Calculation</h4>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">New Width (px)</label>
                      <input
                        type="number"
                        value={newWidth}
                        onChange={(e) => handleNewWidthChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Height</p>
                      <p className="text-lg font-extrabold text-emerald-600 mt-0.5">
                        {newHeight ? `${newHeight} px` : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informative Text Container */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-left space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Understanding Aspect Ratio
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">
                    What is this calculator and why use it?
                  </h4>
                  <p className="mt-1">
                    The Aspect Ratio Calculator is a design tool that calculates proportional dimensions for images, videos, frames, and responsive UI components. It helps designers and front-end developers scale assets up or down without causing visual distortion, stretching, or unwanted cropping.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Step-by-Step Usage Guide:
                  </h4>
                  <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li>Input the original width and height of your design assets under the <strong>Original Size</strong> settings. The simplified aspect ratio (such as 16:9 or 4:3) is calculated dynamically.</li>
                    <li>Enter your target width under the <strong>Target Calculation</strong> section.</li>
                    <li>The application immediately calculates the required height, keeping the dimensions perfectly in scale.</li>
                  </ol>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Mathematical Calculations:
                  </h4>
                  <p className="mt-1">
                    The calculator maintains a linear equation of proportions, where the ratio of original width to original height equals the ratio of target width to target height:
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-2 font-mono text-[11px] text-emerald-700">
                    Target Height = (Original Height / Original Width) * Target Width
                  </div>
                  <p>
                    For example, to adapt a standard Full HD image (1920x1080) to a smaller 1280px wide container:
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-2 font-mono text-[11px] text-emerald-700">
                    Target Height = (1080 / 1920) * 1280 = 0.5625 * 1280 = 720px
                  </div>
                  <p>
                    Maintaining mathematically precise aspect ratios prevents Cumulative Layout Shift (CLS) on web layout loads, optimizing Core Web Vitals performance scores.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. Data Size Converter */}
          {activeTab === "data-size" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5" />
                </svg>
                Data Size Converter
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Enter Value</label>
                  <input
                    type="number"
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Unit</label>
                  <select
                    value={dataUnit}
                    onChange={(e) => setDataUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="B">Bytes</option>
                    <option value="KB">Kilobytes (KB)</option>
                    <option value="MB">Megabytes (MB)</option>
                    <option value="GB">Gigabytes (GB)</option>
                    <option value="TB">Terabytes (TB)</option>
                  </select>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 bg-slate-50 overflow-hidden shadow-sm">
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-slate-500 font-bold">Bytes</span>
                  <span className="text-slate-800 text-right font-extrabold">{dataConversions.b} B</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-slate-500 font-bold">Kilobytes (KB)</span>
                  <span className="text-slate-800 text-right font-extrabold">{dataConversions.kb} KB</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-slate-500 font-bold">Megabytes (MB)</span>
                  <span className="text-slate-800 text-right font-extrabold">{dataConversions.mb} MB</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-slate-500 font-bold">Gigabytes (GB)</span>
                  <span className="text-slate-800 text-right font-extrabold">{dataConversions.gb} GB</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-slate-500 font-bold">Terabytes (TB)</span>
                  <span className="text-slate-800 text-right font-extrabold">{dataConversions.tb} TB</span>
                </div>
              </div>

              {/* Informative Text Container */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-left space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Understanding Data Sizes
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-2">
                    What is this calculator and why use it?
                  </h4>
                  <p className="mt-1">
                    The Data Size Converter is a digital scale utility that translates storage units between standard measurements including Bytes (B), Kilobytes (KB), Megabytes (MB), Gigabytes (GB), and Terabytes (TB). It helps software developers, server administrators, and database engineers calculate exact storage, configure upload limits, and estimate hosting capacities.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Step-by-Step Usage Guide:
                  </h4>
                  <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li>Type the numerical size you want to convert in the <strong>Enter Value</strong> field.</li>
                    <li>Select the target unit (Bytes, KB, MB, GB, or TB) from the <strong>Unit</strong> dropdown.</li>
                    <li>The system instantly calculates and displays the equivalent allocations across all digital sizes in the grid below.</li>
                  </ol>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Mathematical Binary Logics:
                  </h4>
                  <p className="mt-1">
                    Unlike standard base-10 metrics (where 1 kilo equals 1,000 units), computer memory systems follow a binary scale of base-2 ($2^{10} = 1024$):
                  </p>
                  <ul className="list-disc pl-5 my-2 space-y-1 font-mono text-[11px] text-emerald-700">
                    <li>1 Kilobyte (KB) = 1,024 Bytes</li>
                    <li>1 Megabyte (MB) = 1,024 Kilobytes</li>
                    <li>1 Gigabyte (GB) = 1,024 Megabytes</li>
                    <li>1 Terabyte (TB) = 1,024 Gigabytes</li>
                  </ul>
                  <p>
                    To scale down to smaller units, multiply your value by 1024 for each unit step. To convert up to larger units, divide by 1024. For example, to convert 5 Megabytes to Bytes:
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-2 font-mono text-[11px] text-emerald-700">
                    5 MB * 1024 * 1024 = 5,242,880 Bytes
                  </div>
                  <p>
                    Knowing these conversions is critical because operating systems calculate memory capacity using the binary factor (1024), whereas physical storage drive manufacturers describe capacities using the decimal factor (1000).
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-500 font-bold">
              © {new Date().getFullYear()} easy2convert.xyz. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed max-w-md font-semibold">
              Secure client-side utilities. Local calculation models eliminate network latency and ensure complete data privacy.
            </p>
          </div>
          <div className="flex gap-6 text-xs font-bold text-slate-500">
            <a href="/" className="hover:text-emerald-600 transition-colors">
              Converter
            </a>
            <a href="/privacy-policy" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-and-conditions" className="hover:text-emerald-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
