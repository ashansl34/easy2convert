"use client";

import React, { useState, useRef } from "react";
import Header from "../../components/Header";

export default function SvgConverter() {
  const [svgFile, setSvgFile] = useState(null);
  const [svgDataUrl, setSvgDataUrl] = useState("");
  const [format, setFormat] = useState("png"); // 'png' | 'jpeg'
  const [multiplier, setMultiplier] = useState(2); // 1, 2, 3, 4
  const [isProcessing, setIsProcessing] = useState(false);
  const [intrinsicDim, setIntrinsicDim] = useState({ width: 300, height: 300 });
  const fileInputRef = useRef(null);

  const processSvgFile = (file) => {
    if (!file || !file.name.toLowerCase().endsWith(".svg")) {
      alert("Please select a valid SVG file (.svg).");
      return;
    }
    setSvgFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(content)}`;
      setSvgDataUrl(dataUrl);

      // Parse viewBox or width/height attributes
      const img = new Image();
      img.onload = () => {
        setIntrinsicDim({
          width: img.width || 300,
          height: img.height || 300,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSvgFile(e.dataTransfer.files[0]);
    }
  };

  const handleConvertAndDownload = () => {
    if (!svgDataUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const targetW = (img.width || intrinsicDim.width) * multiplier;
      const targetH = (img.height || intrinsicDim.height) * multiplier;

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      if (format === "jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, targetW, targetH);
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);

      const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
      canvas.toBlob((blob) => {
        setIsProcessing(false);
        if (!blob) return;

        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const baseName = svgFile ? svgFile.name.replace(/\.svg$/i, "") : "converted";
        a.download = `${baseName}_${multiplier}x.${format}`;
        a.href = downloadUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }, mimeType, 0.95);
    };

    img.src = svgDataUrl;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-950">
      {/* Header */}
      <Header currentPage="tools" />

      {/* Main Content Container */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-8">
        {/* Page Title Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Vector Converter
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            SVG to PNG / JPEG Converter
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto font-medium">
            Convert scalable vector graphics (SVG) into crisp PNG or JPEG raster images with custom resolution multipliers (1x to 4x Retina).
          </p>
        </div>

        {/* Converter Workspace Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".svg,image/svg+xml"
              onChange={(e) => e.target.files[0] && processSvgFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-800">
              Click or drag & drop an SVG file here (.svg)
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              Converts vector paths to high-definition PNG / JPEG graphics locally in your browser.
            </p>
          </div>

          {/* SVG Details & Scaling Controls */}
          {svgDataUrl && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              {/* SVG Preview Card */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="w-32 h-32 flex items-center justify-center p-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <img src={svgDataUrl} alt="SVG Preview" className="max-w-full max-h-full object-contain" />
                </div>

                <div className="space-y-4 w-full flex-grow text-center sm:text-left">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{svgFile?.name}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      Original Dimensions: {intrinsicDim.width} x {intrinsicDim.height} px
                    </p>
                  </div>

                  {/* Options Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Format Select */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                        Output Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                      >
                        <option value="png">PNG (Transparent Background)</option>
                        <option value="jpeg">JPEG (Solid White Background)</option>
                      </select>
                    </div>

                    {/* Multiplier Select */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                        Resolution Multiplier
                      </label>
                      <select
                        value={multiplier}
                        onChange={(e) => setMultiplier(Number(e.target.value))}
                        className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                      >
                        <option value={1}>1x Standard ({intrinsicDim.width} x {intrinsicDim.height} px)</option>
                        <option value={2}>2x Retina ({intrinsicDim.width * 2} x {intrinsicDim.height * 2} px)</option>
                        <option value={3}>3x Super HD ({intrinsicDim.width * 3} x {intrinsicDim.height * 3} px)</option>
                        <option value={4}>4x Ultra HD ({intrinsicDim.width * 4} x {intrinsicDim.height * 4} px)</option>
                      </select>
                    </div>
                  </div>

                  {/* Export Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleConvertAndDownload}
                      disabled={isProcessing}
                      className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow hover:shadow-md transition-all duration-200 inline-flex items-center justify-center gap-2"
                    >
                      {isProcessing ? "Rasterizing SVG..." : `Download ${format.toUpperCase()} (${intrinsicDim.width * multiplier} x ${intrinsicDim.height * multiplier} px) →`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Informative SEO Explanation Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
          <h2 className="text-base font-bold text-slate-900">
            Why Convert Scalable Vector Graphics (SVG) to PNG or JPEG?
          </h2>
          <p>
            **SVG (Scalable Vector Graphics)** stores image shapes using XML math equations, allowing graphics to scale endlessly without pixelation. However, certain platforms (social media cards, email clients, print software) require pixel-based **raster images**:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">High-DPI Retina Scaling (2x / 4x)</h3>
              <p className="text-[11px] text-slate-500">
                Rasterizing an SVG at 1x on a 4K display can look blurry. Scaling up by 2x or 4x yields sharp, high-density pixels for desktop Retina screens and printing.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">PNG Transparency vs. JPEG Fill</h3>
              <p className="text-[11px] text-slate-500">
                Converting to PNG preserves full alpha background transparency, whereas JPEG automatically fills transparent SVG areas with a clean white background.
              </p>
            </div>
          </div>
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
            <a href="/calculators" className="hover:text-emerald-600 transition-colors">
              Calculators
            </a>
            <a href="/blog" className="hover:text-emerald-600 transition-colors">
              Blog
            </a>
            <a href="/privacy-policy" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
