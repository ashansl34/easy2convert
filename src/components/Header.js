"use client";

import React from "react";
import Image from "next/image";

export default function Header({ currentPage = "home", onScrollTo }) {
  const handleNavClick = (section, e) => {
    if (currentPage === "home" && onScrollTo) {
      e.preventDefault();
      onScrollTo(section);
    }
  };

  const popAnim = "transition-all duration-300 hover:scale-110 hover:-translate-y-1 ease-in-out";

  return (
    <header className="w-full bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-sm shadow-slate-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo Integration */}
        <a href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png.png"
            alt="easy2convert.xyz Logo"
            width={165}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </a>
        
        <nav className="hidden md:flex items-center gap-4">
          {/* Converter Button - Primary Emerald Action */}
          <a
            href="/#converter"
            onClick={(e) => handleNavClick("converter", e)}
            className={`bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-lg shadow-md shadow-emerald-600/10 font-bold text-sm text-center ${popAnim}`}
          >
            Converter
          </a>

          {/* How To Convert */}
          <a
            href="/#guide"
            onClick={(e) => handleNavClick("guide", e)}
            className={`bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-lg font-semibold text-xs text-center ${popAnim}`}
          >
            How To Convert
          </a>

          {/* What is WebP? */}
          <a
            href="/#webp"
            onClick={(e) => handleNavClick("webp", e)}
            className={`bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-lg font-semibold text-xs text-center ${popAnim}`}
          >
            What is WebP?
          </a>

          {/* Quality Analysis */}
          <a
            href="/#quality"
            onClick={(e) => handleNavClick("quality", e)}
            className={`bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-lg font-semibold text-xs text-center ${popAnim}`}
          >
            Quality Analysis
          </a>

          {/* Dev Calculators */}
          <a
            href="/calculators"
            className={`${
              currentPage === "calculators"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold"
                : "bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 hover:border-slate-300"
            } px-4 py-2 rounded-lg font-semibold text-xs text-center ${popAnim}`}
          >
            Dev Calculators
          </a>
        </nav>

        <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 text-xs font-semibold">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          Secure local sandbox
        </span>
      </div>
    </header>
  );
}
