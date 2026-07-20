"use client";

import React, { useState, useRef } from "react";
import Header from "../../components/Header";

export default function AvifConverter() {
  const [avifFile, setAvifFile] = useState(null);
  const [avifUrl, setAvifUrl] = useState("");
  const [targetFormat, setTargetFormat] = useState("webp"); // 'webp' | 'png' | 'jpeg'
  const [quality, setQuality] = useState(0.85); // 0.5 to 1.0
  const [isProcessing, setIsProcessing] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef(null);

  const processAvifFile = (file) => {
    if (!file || (!file.type.includes("avif") && !file.name.toLowerCase().endsWith(".avif"))) {
      alert("Please select a valid AVIF image file (.avif).");
      return;
    }
    setAvifFile(file);

    const objectUrl = URL.createObjectURL(file);
    setAvifUrl(objectUrl);

    const img = new Image();
    img.onload = () => {
      setImgDimensions({ width: img.width, height: img.height });
    };
    img.src = objectUrl;
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAvifFile(e.dataTransfer.files[0]);
    }
  };

  const handleConvertAndDownload = () => {
    if (!avifUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (targetFormat === "jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, img.width, img.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType =
        targetFormat === "png"
          ? "image/png"
          : targetFormat === "jpeg"
          ? "image/jpeg"
          : "image/webp";

      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (!blob) {
            alert("Unable to convert image. Your browser may not support native AVIF decoding.");
            return;
          }

          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          const baseName = avifFile ? avifFile.name.replace(/\.avif$/i, "") : "converted";
          a.download = `${baseName}.${targetFormat}`;
          a.href = downloadUrl;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      setIsProcessing(false);
      alert("Failed to decode AVIF file. Please ensure your browser supports AVIF decoding (Chrome 85+, Firefox 93+, Safari 16+).");
    };

    img.src = avifUrl;
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
            Image Converter
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            AVIF to WebP / PNG Converter
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto font-medium">
            Convert modern AVIF images into universally supported WebP, PNG, or JPEG formats locally in your browser with zero server uploads.
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
              accept=".avif,image/avif"
              onChange={(e) => e.target.files[0] && processAvifFile(e.target.files[0])}
              className="hidden"
            />
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-800">
              Click or drag & drop an AVIF image here (.avif)
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              Decodes AVIF graphics locally in browser memory with 100% privacy protection.
            </p>
          </div>

          {/* AVIF Options & Preview */}
          {avifUrl && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="w-32 h-32 flex items-center justify-center p-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <img src={avifUrl} alt="AVIF Preview" className="max-w-full max-h-full object-contain" />
                </div>

                <div className="space-y-4 w-full flex-grow text-center sm:text-left">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{avifFile?.name}</p>
                    <p className="text-xs text-slate-500 font-medium">
                      File Size: {(avifFile?.size / 1024).toFixed(2)} KB | Dimensions: {imgDimensions.width} x {imgDimensions.height} px
                    </p>
                  </div>

                  {/* Format & Quality Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Target Format */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                        Target Format
                      </label>
                      <select
                        value={targetFormat}
                        onChange={(e) => setTargetFormat(e.target.value)}
                        className="w-full text-xs font-bold bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                      >
                        <option value="webp">WebP (Optimized Web Standard)</option>
                        <option value="png">PNG (Lossless & Transparent)</option>
                        <option value="jpeg">JPEG (Universal Compatibility)</option>
                      </select>
                    </div>

                    {/* Quality Slider (for WebP / JPEG) */}
                    {targetFormat !== "png" && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <label className="uppercase tracking-wider">Compression Quality</label>
                          <span>{Math.round(quality * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="1.0"
                          step="0.05"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>

                  {/* Convert Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleConvertAndDownload}
                      disabled={isProcessing}
                      className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow hover:shadow-md transition-all duration-200 inline-flex items-center justify-center gap-2"
                    >
                      {isProcessing ? "Converting AVIF..." : `Convert & Download ${targetFormat.toUpperCase()} →`}
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
            What is the AVIF Image Format and Why Convert It?
          </h2>
          <p>
            **AVIF (AV1 Image File Format)** is a next-generation open-source image format developed by the Alliance for Open Media (AOMedia). Derived from the keyframes of the AV1 video codec, AVIF offers up to **50% better compression than JPEG** and **20% better compression than WebP**.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">Why Convert AVIF to WebP or PNG?</h3>
              <p className="text-[11px] text-slate-500">
                While AVIF offers incredible compression, older legacy graphic software, image editors, and desktop operating system versions fail to display or open native `.avif` files.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">100% Local Browser Security</h3>
              <p className="text-[11px] text-slate-500">
                All image decoding and Canvas re-encoding operations execute in your device's browser memory sandbox, guaranteeing zero server uploads and complete privacy.
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
