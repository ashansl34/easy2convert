"use client";

import React, { useState } from "react";
import Header from "../../components/Header";

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Live Metrics Calculations
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, "").length;
  const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphCount = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

  // Casing Transformations
  const toUppercase = () => setText(text.toUpperCase());
  const toLowercase = () => setText(text.toLowerCase());

  const toSentenceCase = () => {
    const updated = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
    setText(updated);
  };

  const toTitleCase = () => {
    const updated = text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    setText(updated);
  };

  const toCamelCase = () => {
    const words = text
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim()
      .split(/\s+/);
    if (!words[0]) return;
    const camel = words
      .map((word, idx) =>
        idx === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
    setText(camel);
  };

  const toSnakeCase = () => {
    const snake = text
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_");
    setText(snake);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => setText("");

  const handleLoadSample = () => {
    setText(
      "The quick brown fox jumps over the lazy dog. Front-end developers use case converters to transform variable names and article titles rapidly!"
    );
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
            Text & Utility Tool
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Case Converter & Text Transformer
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto font-medium">
            Transform text between UPPERCASE, lowercase, Title Case, camelCase, and snake_case instantly with live word and character analytics.
          </p>
        </div>

        {/* Converter Workspace Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
          {/* Top Real-Time Analytics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Words</p>
              <p className="text-lg font-extrabold text-slate-900">{wordCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Characters</p>
              <p className="text-lg font-extrabold text-slate-900">{charCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">No Spaces</p>
              <p className="text-lg font-extrabold text-slate-900">{charNoSpaces.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Sentences / Para</p>
              <p className="text-lg font-extrabold text-slate-900">
                {sentenceCount} / {paragraphCount}
              </p>
            </div>
          </div>

          {/* Text Area Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                Input Text Workspace
              </label>
              <div className="flex gap-3 text-xs font-semibold">
                <button
                  onClick={handleLoadSample}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Load Sample
                </button>
                <button
                  onClick={handleClear}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Clear Text
                </button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text content here..."
              className="w-full h-64 p-4 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none text-slate-800 placeholder:text-slate-400 leading-relaxed"
            />
          </div>

          {/* Casing Transformation Action Buttons */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider text-center sm:text-left">
              Select Casing Action
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
              <button
                onClick={toSentenceCase}
                disabled={!text}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sentence case
              </button>
              <button
                onClick={toTitleCase}
                disabled={!text}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Title Case
              </button>
              <button
                onClick={toUppercase}
                disabled={!text}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                UPPERCASE
              </button>
              <button
                onClick={toLowercase}
                disabled={!text}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                lowercase
              </button>
              <button
                onClick={toCamelCase}
                disabled={!text}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                camelCase
              </button>
              <button
                onClick={toSnakeCase}
                disabled={!text}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                snake_case
              </button>
            </div>
          </div>

          {/* Copy Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              {copied ? "✓ Copied to Clipboard!" : "Copy Transformed Text"}
            </button>
          </div>
        </div>

        {/* Informative SEO Explanation Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 text-xs text-slate-600 leading-relaxed font-medium">
          <h2 className="text-base font-bold text-slate-900">
            Understanding Casing Conventions in Publishing & Programming
          </h2>
          <p>
            Text casing conventions play an important role in both editorial publishing and software engineering:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">Title Case</h3>
              <p className="text-[11px] text-slate-500">
                Capitalizes the first letter of every major word. Used for article titles, book covers, and main navigation headers.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">camelCase</h3>
              <p className="text-[11px] text-slate-500">
                Removes spaces and capitalizes subsequent words. Standard naming convention for JavaScript variables and JSON API properties.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-bold text-slate-800 text-xs">snake_case</h3>
              <p className="text-[11px] text-slate-500">
                Replaces spaces with underscores (`_`) in lowercase. Standard naming convention for Python variables and database columns.
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
