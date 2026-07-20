"use client";

import React, { useState, useRef } from "react";
import Header from "../../components/Header";

export default function Base64Converter() {
  const [activeTab, setActiveTab] = useState("text"); // 'text' | 'image'
  
  // Text state
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedText, setCopiedText] = useState(false);

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [dataUri, setDataUri] = useState("");
  const [rawBase64, setRawBase64] = useState("");
  const [copiedDataUri, setCopiedDataUri] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const fileInputRef = useRef(null);

  // UTF-8 Safe Base64 Encoding
  const handleEncode = () => {
    try {
      setErrorMsg("");
      if (!inputText) {
        setOutputText("");
        return;
      }
      const encoded = btoa(unescape(encodeURIComponent(inputText)));
      setOutputText(encoded);
    } catch (err) {
      setErrorMsg("Failed to encode text. Please check your input.");
    }
  };

  // UTF-8 Safe Base64 Decoding
  const handleDecode = () => {
    try {
      setErrorMsg("");
      if (!inputText) {
        setOutputText("");
        return;
      }
      const decoded = decodeURIComponent(escape(atob(inputText.trim())));
      setOutputText(decoded);
    } catch (err) {
      setErrorMsg("Invalid Base64 string. Unable to decode.");
    }
  };

  const handleCopyText = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "text") {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } else if (type === "uri") {
      setCopiedDataUri(true);
      setTimeout(() => setCopiedDataUri(false), 2000);
    } else if (type === "raw") {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    }
  };

  const handleClearText = () => {
    setInputText("");
    setOutputText("");
    setErrorMsg("");
  };

  const handleSwapText = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setErrorMsg("");
  };

  // Handle Image Upload
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP, SVG, etc.).");
      return;
    }
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setDataUri(result);
      // Extract raw base64 after the comma
      const commaIdx = result.indexOf(",");
      if (commaIdx !== -1) {
        setRawBase64(result.substring(commaIdx + 1));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
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
            Developer Utility
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Base64 Encoder & Decoder
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto font-medium">
            Encode text to Base64, decode Base64 strings, or convert image assets into CSS/HTML Data URIs 100% locally in your browser.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl space-x-1">
            <button
              onClick={() => setActiveTab("text")}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === "text"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Text Encoder / Decoder
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeTab === "image"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Image to Base64 Data URI
            </button>
          </div>
        </div>

        {/* TAB 1: TEXT BASE64 */}
        {activeTab === "text" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            {/* Error Message */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Split Pane */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                    Input Text / Base64
                  </label>
                  <button
                    onClick={handleClearText}
                    className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste text or Base64 string here..."
                  className="w-full h-48 md:h-64 p-4 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Output Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                    Output Result
                  </label>
                  {outputText && (
                    <button
                      onClick={() => handleCopyText(outputText, "text")}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1"
                    >
                      {copiedText ? "✓ Copied!" : "Copy Output"}
                    </button>
                  )}
                </div>
                <textarea
                  readOnly
                  value={outputText}
                  placeholder="Encoded or decoded output will appear here..."
                  className="w-full h-48 md:h-64 p-4 text-xs font-mono bg-slate-100/70 border border-slate-200 rounded-xl focus:outline-none resize-none text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Action Control Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleEncode}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow hover:shadow-md transition-all duration-200"
              >
                Encode to Base64 →
              </button>
              <button
                onClick={handleDecode}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow hover:shadow-md transition-all duration-200"
              >
                ← Decode from Base64
              </button>
              <button
                onClick={handleSwapText}
                disabled={!outputText}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ⇄ Swap Input & Output
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: IMAGE TO BASE64 DATA URI */}
        {activeTab === "image" && (
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
                accept="image/*"
                onChange={(e) => e.target.files[0] && processImageFile(e.target.files[0])}
                className="hidden"
              />
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-slate-800">
                Click or drag & drop an image file here
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                Supports PNG, JPG, WebP, GIF, SVG (Processed 100% locally in browser)
              </p>
            </div>

            {/* Image Preview & Data URI Output */}
            {dataUri && (
              <div className="space-y-6 pt-4 border-t border-slate-100">
                {/* Image Details */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <img
                    src={dataUri}
                    alt="Preview"
                    className="w-16 h-16 object-contain rounded-lg bg-white border border-slate-200"
                  />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-900">{imageFile?.name}</p>
                    <p className="text-slate-500 font-medium">
                      File Size: {(imageFile?.size / 1024).toFixed(2)} KB | Type: {imageFile?.type}
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      Base64 Character Length: {dataUri.length.toLocaleString()} chars
                    </p>
                  </div>
                </div>

                {/* Data URI Output */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                      Complete Data URI String (`data:image/...`)
                    </label>
                    <button
                      onClick={() => handleCopyText(dataUri, "uri")}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {copiedDataUri ? "✓ Copied!" : "Copy Data URI"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={dataUri}
                    className="w-full h-32 p-3 text-xs font-mono bg-slate-100/70 border border-slate-200 rounded-xl focus:outline-none resize-none text-slate-700"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informative SEO Explanation Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
          <h2 className="text-base font-bold text-slate-900">
            What is Base64 Encoding and How Does It Work?
          </h2>
          <p>
            **Base64** is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It translates 8-bit binary data into a limited radix-64 set of printable characters (letters A-Z, a-z, numbers 0-9, and symbols `+` and `/`).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">Why Use Base64 for Text & APIs?</h3>
              <p className="text-[11px] text-slate-500">
                Base64 ensures data remains intact during transit across networks or HTTP APIs that expect plain text without escaping special control characters.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">Why Use Base64 Data URIs for Images?</h3>
              <p className="text-[11px] text-slate-500">
                Embedding small icon graphics directly into CSS or HTML using `data:image/png;base64,...` eliminates HTTP request overhead, speeding up critical rendering paths.
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
