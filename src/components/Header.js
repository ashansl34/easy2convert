"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export default function Header({ currentPage = "home", onScrollTo }) {
  const headerCanvasRef = useRef(null);

  const handleNavClick = (section, e) => {
    if (currentPage === "home" && onScrollTo) {
      e.preventDefault();
      onScrollTo(section);
    }
  };

  useEffect(() => {
    const canvas = headerCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let blobs = [];
    const blobCount = 4;

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resizeCanvas();

    class LiquidBlob {
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = Math.random() * 60 + 60;
        this.vx = (Math.random() * 0.2 - 0.1);
        this.vy = (Math.random() * 0.2 - 0.1);
        
        const colors = [
          "rgba(59, 130, 246, 0.14)",  // blue-500
          "rgba(16, 185, 129, 0.12)",  // emerald-500
          "rgba(99, 102, 241, 0.14)",  // indigo-500
          "rgba(6, 182, 212, 0.12)"    // cyan-500
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update(w, h) {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < -this.radius) this.x = w + this.radius;
        if (this.x > w + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = h + this.radius;
        if (this.y > h + this.radius) this.y = -this.radius;
      }
      
      draw(ctx) {
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < blobCount; i++) {
      blobs.push(new LiquidBlob(canvas.width, canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw deep navy background
      ctx.fillStyle = "#050b18";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < blobs.length; i++) {
        blobs[i].update(canvas.width, canvas.height);
        blobs[i].draw(ctx);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const popAnim = "transition-all duration-300 hover:scale-110 hover:-translate-y-1 ease-in-out";

  return (
    <header className="relative w-full bg-[#050b18] border-b-2 border-emerald-500 px-6 py-4 sticky top-0 z-50 shadow-sm">
      {/* Animated Liquid Background Canvas Container */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
        <canvas
          ref={headerCanvasRef}
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-between">
        
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
          {/* Converter Dropdown */}
          <div className="relative group">
            <a
              href="/#converter"
              onClick={(e) => handleNavClick("converter", e)}
              className={`bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-lg shadow-md shadow-emerald-600/10 font-bold text-sm flex items-center gap-1.5 ${popAnim}`}
            >
              Converter
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </a>

            {/* Converter Dropdown Menu Wrapper */}
            <div className="absolute left-0 top-full pt-1.5 w-60 hidden group-hover:block group-focus-within:block z-50">
              <div className="bg-[#0a1224] border border-slate-800 rounded-xl shadow-2xl py-2">
                <a href="/#converter" onClick={(e) => handleNavClick("converter", e)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>🖼️</span> HEIC to JPG Converter
                </a>
                <a href="/#converter" onClick={(e) => handleNavClick("converter", e)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>🖼️</span> WebP to JPG / PNG
                </a>
                <a href="/#converter" onClick={(e) => handleNavClick("converter", e)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>📄</span> PDF to Word (DOCX)
                </a>
                <a href="/#converter" onClick={(e) => handleNavClick("converter", e)} className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>📄</span> Word (DOCX) to PDF
                </a>
                <a href="/avif-converter" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>🖼️</span> AVIF to WebP/PNG
                </a>
                <a href="/svg-converter" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>🎨</span> SVG to PNG/JPEG
                </a>
                <div className="border-t border-slate-800/80 my-1" />
                <a href="/#converter" onClick={(e) => handleNavClick("converter", e)} className="flex items-center gap-2 px-4 py-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/60 font-bold transition-colors">
                  <span>⚡</span> Image Compressor →
                </a>
              </div>
            </div>
          </div>

          {/* How To Convert */}
          <a
            href="/#guide"
            onClick={(e) => handleNavClick("guide", e)}
            className={`bg-slate-950/40 text-slate-300 hover:text-white border border-slate-800/80 px-4 py-2 rounded-lg font-semibold text-xs text-center ${popAnim}`}
          >
            How To Convert
          </a>

          {/* What is WebP? */}
          <a
            href="/#webp"
            onClick={(e) => handleNavClick("webp", e)}
            className={`bg-slate-950/40 text-slate-300 hover:text-white border border-slate-800/80 px-4 py-2 rounded-lg font-semibold text-xs text-center ${popAnim}`}
          >
            What is WebP?
          </a>

          {/* Quality Analysis */}
          <a
            href="/#quality"
            onClick={(e) => handleNavClick("quality", e)}
            className={`bg-slate-950/40 text-slate-300 hover:text-white border border-slate-800/80 px-4 py-2 rounded-lg font-semibold text-xs text-center ${popAnim}`}
          >
            Quality Analysis
          </a>

          {/* Dev Tools Dropdown */}
          <div className="relative group">
            <a
              href="/calculators"
              className={`${
                currentPage === "calculators" || currentPage === "tools"
                  ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-bold"
                  : "bg-slate-950/40 text-slate-300 hover:text-white border border-slate-800/80"
              } px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all`}
            >
              Dev Tools
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </a>

            {/* Dev Tools Dropdown Menu Wrapper */}
            <div className="absolute right-0 top-full pt-1.5 w-60 hidden group-hover:block group-focus-within:block z-50">
              <div className="bg-[#0a1224] border border-slate-800 rounded-xl shadow-2xl py-2">
                <a href="/base64-converter" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>⚡</span> Base64 Encoder / Decoder
                </a>
                <a href="/case-converter" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>📝</span> Text Case Converter
                </a>
                <a href="/svg-converter" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>🎨</span> SVG to PNG Converter
                </a>
                <a href="/json-to-ts" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>🔷</span> JSON to TS Interface
                </a>
                <a href="/avif-converter" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold transition-colors">
                  <span>🖼️</span> AVIF to WebP/PNG
                </a>
                <div className="border-t border-slate-800/80 my-1" />
                <a href="/calculators" className="flex items-center gap-2 px-4 py-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/60 font-bold transition-colors">
                  <span>🧮</span> All Dev Calculators →
                </a>
              </div>
            </div>
          </div>

          {/* Blog */}
          <a
            href="/blog"
            className={`${
              currentPage === "blog"
                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-bold"
                : "bg-slate-950/40 text-slate-300 hover:text-white border border-slate-800/80"
            } px-4 py-2 rounded-lg font-semibold text-xs text-center ${popAnim}`}
          >
            Blog
          </a>
        </nav>

        <span className="flex items-center gap-1 bg-emerald-950/40 text-emerald-400 px-3 py-1 rounded-full border border-emerald-900/50 text-xs font-semibold">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          Secure local sandbox
        </span>
      </div>
    </header>
  );
}
