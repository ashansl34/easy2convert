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
    <header className="relative w-full bg-[#050b18] border-b-2 border-emerald-500 px-6 py-4 sticky top-0 z-40 shadow-sm overflow-hidden">
      {/* Animated Liquid Background Canvas */}
      <canvas
        ref={headerCanvasRef}
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      />

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

          {/* Dev Calculators */}
          <a
            href="/calculators"
            className={`${
              currentPage === "calculators"
                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-bold"
                : "bg-slate-950/40 text-slate-300 hover:text-white border border-slate-800/80"
            } px-4 py-2 rounded-lg font-semibold text-xs text-center ${popAnim}`}
          >
            Dev Calculators
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
