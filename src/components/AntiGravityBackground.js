"use client";

import React, { useEffect, useRef } from "react";

export default function AntiGravityBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const particleCount = 25; // 25 floating circles as requested
    const mouse = { x: -1000, y: -1000, radius: 80 };

    // Set canvas dimensions relative to parent container
    const resizeCanvas = () => {
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    resizeCanvas();
    
    // Create a ResizeObserver to handle dynamically changing parent sizes
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(parent);

    // Particle template
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * canvas.width;
        // Start from bottom or disperse throughout parent area on load
        this.y = init ? Math.random() * canvas.height : canvas.height + Math.random() * 20;
        this.size = Math.random() * 6 + 2; // Sleek floating circle sizes
        this.speedY = -(Math.random() * 0.35 + 0.1); // Slowly drift upwards
        this.speedX = Math.random() * 0.15 - 0.075; // Subtle swaying motion
        this.alpha = Math.random() * 0.25 + 0.05; // Soft translucent alpha
        this.baseAlpha = this.alpha;
        
        const colors = [
          `rgba(99, 102, 241, `,  // Indigo
          `rgba(16, 185, 129, `,  // Emerald/Mint
          `rgba(6, 182, 212, `,   // Cyan
          `rgba(100, 116, 139, `  // Slate gray (for high-contrast light mode)
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;

        // Mouse repelling mechanism relative to parent canvas space
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.hypot(dx, dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
          this.alpha = Math.min(0.4, this.alpha + 0.015);
        } else {
          if (this.alpha > this.baseAlpha) {
            this.alpha -= 0.005;
          }
        }

        // Reset particle when it floats off the top boundary
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset(false);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorPrefix}${this.alpha})`;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Mouse positions relative to the parent bounding client rect
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Attach listener to parent container
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 rounded-2xl"
      style={{ opacity: 0.9 }}
    />
  );
}
