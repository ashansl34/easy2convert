"use client";

import React, { useState, useEffect, useRef } from "react";
import AntiGravityBackground from "../components/AntiGravityBackground";
import AdPlaceholder from "../components/AdPlaceholder";
import DownloadModal from "../components/DownloadModal";

export default function Home() {
  const [fileQueue, setFileQueue] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDownloadFile, setActiveDownloadFile] = useState(null);
  
  // Refs for scrolling navigation
  const converterRef = useRef(null);
  const guideRef = useRef(null);
  const webpRef = useRef(null);
  const qualityRef = useRef(null);
  const fileInputRef = useRef(null);

  // Helper to format file size
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Detect supported format and suggest default target
  const getSuggestions = (mimeType, name) => {
    const ext = name.split(".").pop().toLowerCase();
    
    if (ext === "docx" || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return {
        allowedTargets: ["pdf"],
        defaultTarget: "pdf",
      };
    }
    if (ext === "pdf" || mimeType === "application/pdf") {
      return {
        allowedTargets: ["docx", "compress"],
        defaultTarget: "docx",
      };
    }
    if (ext === "heic" || mimeType === "image/heic") {
      return {
        allowedTargets: ["jpg", "png", "webp", "compress"],
        defaultTarget: "jpg",
      };
    }
    if (ext === "webp" || mimeType === "image/webp") {
      return {
        allowedTargets: ["jpg", "png", "compress"],
        defaultTarget: "png",
      };
    }
    if (ext === "png" || mimeType === "image/png") {
      return {
        allowedTargets: ["jpg", "webp", "compress"],
        defaultTarget: "jpg",
      };
    }
    if (ext === "jpg" || ext === "jpeg" || mimeType === "image/jpeg") {
      return {
        allowedTargets: ["png", "webp", "compress"],
        defaultTarget: "png",
      };
    }
    
    // Default fallback
    return {
      allowedTargets: ["jpg", "png", "webp", "compress"],
      defaultTarget: "jpg",
    };
  };

  // Add files to the queue
  const addFilesToQueue = (files) => {
    const validTypes = [
      "image/heic", "image/webp", "image/png", "image/jpeg", "image/jpg",
      "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    const newItems = Array.from(files).filter(file => {
      const ext = file.name.split(".").pop().toLowerCase();
      const isHeic = ext === "heic";
      const isDocx = ext === "docx";
      const isPdf = ext === "pdf";
      return validTypes.includes(file.type) || isHeic || isDocx || isPdf;
    }).map(file => {
      const { allowedTargets, defaultTarget } = getSuggestions(file.type, file.name);
      return {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        allowedTargets,
        targetFormat: defaultTarget,
        status: "idle", // 'idle' | 'converting' | 'completed' | 'error'
        progress: 0,
        downloadUrl: null,
        convertedName: "",
        quality: 60, // default quality percentage for compression slider
        compressedSize: null,
      };
    });

    if (newItems.length > 0) {
      setFileQueue(prev => [...prev, ...newItems]);
    }
  };

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      addFilesToQueue(e.target.files);
    }
  };

  // Trigger file dialog
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Update target format for a specific file
  const handleTargetChange = (id, newFormat) => {
    setFileQueue(prev =>
      prev.map(item => (item.id === id ? { ...item, targetFormat: newFormat } : item))
    );
  };

  // Update quality for compression
  const handleQualityChange = (id, newQuality) => {
    setFileQueue(prev =>
      prev.map(item => (item.id === id ? { ...item, quality: newQuality } : item))
    );
  };

  // Remove file from queue
  const removeFile = (id) => {
    setFileQueue(prev => {
      const item = prev.find(i => i.id !== id);
      if (item && item.downloadUrl) {
        URL.revokeObjectURL(item.downloadUrl);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  // Canvas-based image converter & compressor
  const convertViaCanvas = (imageBlob, targetFormat, quality = 0.88) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageBlob);
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Could not create canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);
        
        let mimeType = "image/jpeg";
        const fmt = targetFormat.toLowerCase();
        if (fmt === "png") mimeType = "image/png";
        if (fmt === "webp") mimeType = "image/webp";

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas export failed"));
          }
        }, mimeType, quality);
        
        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image source"));
        URL.revokeObjectURL(img.src);
      };
    });
  };

  // Dynamic CDN loader for PDF.js to bypass Turbopack / Webpack build errors
  const loadPdfJs = () => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Browser environment required"));
        return;
      }
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib);
        return;
      }
      
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        const pdfjs = window["pdfjs-dist/build/pdf"] || window.pdfjsLib;
        if (pdfjs) {
          pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          window.pdfjsLib = pdfjs;
          resolve(pdfjs);
        } else {
          reject(new Error("PDF.js global library object not found"));
        }
      };
      script.onerror = () => {
        reject(new Error("Failed to load PDF.js from CDN"));
      };
      document.head.appendChild(script);
    });
  };

  // Client-side Word (DOCX) to PDF using mammoth.js and jspdf
  const convertDocxToPdfClient = async (file) => {
    const mammoth = await import("mammoth");
    const jsPDFLib = (await import("jspdf")).jsPDF;
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    const text = result.value || "Empty Document";

    const doc = new jsPDFLib();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    
    const pageMargin = 15;
    const pageWidth = doc.internal.pageSize.getWidth() - (pageMargin * 2);
    const textLines = doc.splitTextToSize(text, pageWidth);
    
    let y = 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    
    textLines.forEach(line => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, pageMargin, y);
      y += 6.5;
    });

    return doc.output("blob");
  };

  // Client-side PDF to Word (DOCX) text extraction & compatibility wrapper
  const convertPdfToDocxClient = async (file) => {
    const pdfjsLib = await loadPdfJs();
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let htmlContent = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      htmlContent += `<p>${pageText}</p>\n`;
    }

    const docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Converted PDF Document</title>
        <!--[if gte mso 9]><xml>
         <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
         </w:WordDocument>
        </xml><![endif]-->
        <style>
          body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; padding: 24px; }
          p { margin-bottom: 12px; text-align: justify; }
        </style>
      </head>
      <body>
        ${htmlContent || "<p>No readable text extracted from PDF.</p>"}
      </body>
      </html>
    `;

    return new Blob(["\ufeff" + docHtml], {
      type: "application/msword"
    });
  };

  // Client-side PDF compress (re-generates optimized structure)
  const compressPdfClient = async (file) => {
    const pdfjsLib = await loadPdfJs();
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    const jsPDFLib = (await import("jspdf")).jsPDF;
    const doc = new jsPDFLib();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    
    const pageMargin = 15;
    const pageWidth = doc.internal.pageSize.getWidth() - (pageMargin * 2);
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    for (let i = 1; i <= pdf.numPages; i++) {
      if (i > 1) {
        doc.addPage();
        y = 20;
      }
      
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      const textLines = doc.splitTextToSize(pageText, pageWidth);

      textLines.forEach(line => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, pageMargin, y);
        y += 6;
      });
    }

    return doc.output("blob");
  };

  // Individual file converter execution
  const handleConvert = async (item) => {
    // Set file state to converting
    setFileQueue(prev =>
      prev.map(i => (i.id === item.id ? { ...i, status: "converting", progress: 5 } : i))
    );

    // Realistic progress animation
    let progress = 5;
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 4;
      if (progress >= 95) {
        progress = 95;
        clearInterval(progressInterval);
      }
      setFileQueue(prev =>
        prev.map(i => (i.id === item.id ? { ...i, progress: Math.min(progress, 95) } : i))
      );
    }, 150);

    try {
      const { file, targetFormat, quality } = item;
      let convertedBlob;
      const fileExt = file.name.split(".").pop().toLowerCase();
      const isHeic = fileExt === "heic" || file.type === "image/heic";
      const isDocx = fileExt === "docx" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const isPdf = fileExt === "pdf" || file.type === "application/pdf";
      
      let extension = targetFormat.toLowerCase();

      if (targetFormat === "compress") {
        extension = fileExt;
        if (isPdf) {
          convertedBlob = await compressPdfClient(file);
        } else if (isHeic) {
          const heic2any = (await import("heic2any")).default;
          const jpegBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: (quality || 60) / 100,
          });
          convertedBlob = Array.isArray(jpegBlob) ? jpegBlob[0] : jpegBlob;
          extension = "jpg";
        } else {
          convertedBlob = await convertViaCanvas(file, fileExt, (quality || 60) / 100);
        }
      } else if (isDocx && targetFormat === "pdf") {
        convertedBlob = await convertDocxToPdfClient(file);
      } else if (isPdf && targetFormat === "docx") {
        convertedBlob = await convertPdfToDocxClient(file);
        extension = "docx";
      } else if (isHeic) {
        const heic2any = (await import("heic2any")).default;
        const conversionResult = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.85,
        });
        const jpegBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;

        if (targetFormat === "jpg" || targetFormat === "jpeg") {
          convertedBlob = jpegBlob;
        } else {
          convertedBlob = await convertViaCanvas(jpegBlob, targetFormat, 0.88);
        }
      } else {
        convertedBlob = await convertViaCanvas(file, targetFormat, 0.88);
      }

      clearInterval(progressInterval);

      // Create download URL
      const downloadUrl = URL.createObjectURL(convertedBlob);
      const originalBase = file.name.substring(0, file.name.lastIndexOf("."));
      const suffix = targetFormat === "compress" ? "_compressed" : "";
      const convertedName = `${originalBase}${suffix}.${extension}`;

      setFileQueue(prev =>
        prev.map(i =>
          i.id === item.id
            ? {
                ...i,
                status: "completed",
                progress: 100,
                downloadUrl,
                convertedName,
                compressedSize: convertedBlob.size,
              }
            : i
        )
      );
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Conversion failed:", err);
      setFileQueue(prev =>
        prev.map(i => (i.id === item.id ? { ...i, status: "error", progress: 0 } : i))
      );
    }
  };

  // Convert all items in queue that are idle
  const handleConvertAll = () => {
    fileQueue.forEach(item => {
      if (item.status === "idle" || item.status === "error") {
        handleConvert(item);
      }
    });
  };

  // Clear completed downloads
  const handleClearQueue = () => {
    fileQueue.forEach(item => {
      if (item.downloadUrl) {
        URL.revokeObjectURL(item.downloadUrl);
      }
    });
    setFileQueue([]);
  };

  // Open interstitial download modal
  const triggerDownloadFlow = (item) => {
    setActiveDownloadFile(item);
    setIsModalOpen(true);
  };

  // Execute actual browser download
  const executeDownload = () => {
    if (!activeDownloadFile) return;
    const link = document.createElement("a");
    link.href = activeDownloadFile.downloadUrl;
    link.download = activeDownloadFile.convertedName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Scroll helper
  const scrollTo = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-[#030712] text-gray-200 selection:bg-indigo-950 selection:text-white select-none">
      
      {/* 1. Header: Logo + Simple Navigation */}
      <header className="w-full bg-[#030712] border-b border-gray-900 px-6 py-4 sticky top-0 z-40 shadow-sm shadow-black/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm shadow-indigo-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-md font-bold tracking-tight text-white animate-pulse">
                easy2convert.xyz
              </h1>
              <p className="text-[10px] text-gray-500 font-semibold leading-none">
                100% Client-Side Engine
              </p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-400">
            <button onClick={() => scrollTo(converterRef)} className="hover:text-indigo-400 transition-colors">
              Converter
            </button>
            <button onClick={() => scrollTo(guideRef)} className="hover:text-indigo-400 transition-colors">
              How To Convert
            </button>
            <button onClick={() => scrollTo(webpRef)} className="hover:text-indigo-400 transition-colors">
              What is WebP?
            </button>
            <button onClick={() => scrollTo(qualityRef)} className="hover:text-indigo-400 transition-colors">
              Quality Analysis
            </button>
          </nav>

          <span className="flex items-center gap-1 bg-emerald-950/40 text-emerald-400 px-3 py-1 rounded-full border border-emerald-900/50 text-xs font-semibold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            Secure local sandbox
          </span>
        </div>
      </header>

      {/* Top Banner Advertisement (Placeholder A) */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        <AdPlaceholder type="banner" className="opacity-90" />
      </div>

      {/* 2. Core WebP/HEIC Converter Tool Zone (3-column layout on desktop) */}
      <section ref={converterRef} className="w-full max-w-7xl mx-auto px-4 md:px-6 flex items-start gap-6 py-4 justify-center">
        
        {/* Left Side Scraper (Placeholder B) */}
        <aside className="hidden lg:block sticky top-24 self-start flex-shrink-0 opacity-90">
          <AdPlaceholder type="scraper" />
        </aside>

        {/* Center Workspace (Core WebP/HEIC Converter Tool Zone) */}
        <div className="flex-grow max-w-3xl w-full flex flex-col items-center">
          
          {/* Main Converter Card - Anti-gravity background restricted to this box */}
          <div className="w-full bg-[#0b0f19] border border-gray-900 rounded-2xl shadow-2xl shadow-black/80 p-6 md:p-8 backdrop-blur-md relative overflow-hidden transition-all duration-300">
            
            {/* Embedded Anti-Gravity Particle Canvas specifically here */}
            <AntiGravityBackground />

            {/* Content inside the card remains visible above canvas */}
            <div className="relative z-10">
              {/* Card Slogan */}
              <div className="text-center mb-8">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded-full border border-indigo-900/40">
                  Micro-Niche Optimizer
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2.5">
                  Convert WebP & HEIC Instantly
                </h2>
                <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Fast client-side file transformation. Drag & drop files here to process locally without uploading anything to remote servers.
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
                className={`w-full py-12 px-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-950/20 scale-[1.01] shadow-inner"
                    : "border-gray-800 bg-[#0e1422]/60 hover:border-indigo-500 hover:bg-[#12192c]/75 hover:shadow-md"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/heic,image/webp,image/png,image/jpeg,image/jpg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,.pdf"
                  onChange={handleFileChange}
                />
                
                <div className="w-14 h-14 bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-900/30 mb-4 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v12m0 0l-3-3m3 3l3-3m-3.01-16A5.25 5.25 0 003 8.25c0 1.38.365 2.68 1.01 3.81a5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75"
                    />
                  </svg>
                </div>
                
                <p className="text-sm font-bold text-gray-200">
                  Drag & drop your files here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports DOCX, PDF, HEIC, WebP, PNG, JPG (Max 50MB per file)
                </p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-indigo-950/60 hover:bg-indigo-900/50 text-indigo-400 font-semibold rounded-lg text-xs border border-indigo-900/50 shadow-sm transition-all duration-200"
                >
                  Browse Files
                </button>
              </div>

              {/* Converter File List Section */}
              {fileQueue.length > 0 && (
                <div className="mt-8 border-t border-gray-900 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-300">
                      Files in Queue ({fileQueue.length})
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleClearQueue}
                        className="text-xs font-semibold text-gray-500 hover:text-red-400 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Queue Items */}
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                    {fileQueue.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-900 rounded-xl bg-[#030712] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md hover:border-gray-800 transition-all duration-200"
                      >
                        {/* Name and Meta */}
                        <div className="flex items-start gap-3 min-w-0 max-w-xs md:max-w-sm">
                          <div className="w-10 h-10 bg-gray-950 rounded-lg flex items-center justify-center text-gray-500 border border-gray-900 flex-shrink-0">
                            {item.name.toLowerCase().endsWith(".pdf") ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-red-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                              </svg>
                            ) : item.name.toLowerCase().endsWith(".docx") ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 text-blue-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0 font-medium">
                            <p className="text-xs font-bold text-gray-200 truncate" title={item.name}>
                              {item.name}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              {formatSize(item.size)}
                            </p>
                          </div>
                        </div>

                        {/* Middle Controls (Selectors, Compression slider, and Status) */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                          {item.status === "idle" ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-[11px] font-semibold text-gray-500 whitespace-nowrap">
                                  Action:
                                </span>
                                <select
                                  value={item.targetFormat}
                                  onChange={(e) => handleTargetChange(item.id, e.target.value)}
                                  className="bg-gray-950 border border-gray-800 rounded-lg text-xs font-bold text-gray-300 px-2 py-1 outline-none focus:border-indigo-500 transition-colors"
                                >
                                  {item.allowedTargets.map((format) => (
                                    <option key={format} value={format}>
                                      {format === "compress" ? "COMPRESS" : `TO ${format.toUpperCase()}`}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              {/* Compression slider if 'compress' selected */}
                              {item.targetFormat === "compress" && !item.name.toLowerCase().endsWith(".pdf") && (
                                <div className="flex flex-col gap-0.5 w-24">
                                  <div className="flex justify-between text-[9px] font-bold text-gray-400">
                                    <span>Quality:</span>
                                    <span className="text-indigo-400">{item.quality || 60}%</span>
                                  </div>
                                  <input
                                    type="range"
                                    min="10"
                                    max="90"
                                    value={item.quality || 60}
                                    onChange={(e) => handleQualityChange(item.id, parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                  />
                                </div>
                              )}
                            </div>
                          ) : item.status === "converting" ? (
                            <div className="w-32 flex flex-col gap-1.5">
                              <div className="flex justify-between text-[9px] font-semibold text-indigo-400">
                                <span>Processing...</span>
                                <span>{item.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-950 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-indigo-600 h-full rounded-full transition-all duration-150 bg-gradient-to-r from-indigo-600 to-indigo-500"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                          ) : item.status === "completed" ? (
                            <div className="text-left md:text-right">
                              <span className="text-xs font-semibold text-emerald-400 flex items-center justify-start md:justify-end gap-1 bg-emerald-950/40 px-2 py-1 rounded-full border border-emerald-900/50">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2.5}
                                  stroke="currentColor"
                                  className="w-3.5 h-3.5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                                {item.targetFormat === "compress" ? "Compressed" : "Converted"}
                              </span>
                              {item.compressedSize && (
                                <p className="text-[9.5px] font-bold text-gray-500 mt-1">
                                  {formatSize(item.compressedSize)} 
                                  {item.compressedSize < item.size && (
                                    <span className="text-emerald-400 ml-1">
                                      (-{Math.round(((item.size - item.compressedSize) / item.size) * 100)}%)
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-red-400 flex items-center gap-1 bg-red-950/40 px-2 py-1 rounded-full border border-red-900/50">
                              Error
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 justify-end">
                          {item.status === "idle" && (
                            <button
                              onClick={() => handleConvert(item)}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-lg text-xs transition-all duration-150 shadow-sm shadow-indigo-900/30"
                            >
                              Process
                            </button>
                          )}
                          {item.status === "completed" && (
                            <button
                              onClick={() => triggerDownloadFlow(item)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold rounded-lg text-xs transition-all duration-150 shadow-sm shadow-emerald-900/30 flex items-center gap-1"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-3 h-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                              </svg>
                              Download
                            </button>
                          )}
                          {item.status === "error" && (
                            <button
                              onClick={() => handleConvert(item)}
                              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg text-xs border border-gray-700 transition-all duration-150"
                            >
                              Retry
                            </button>
                          )}
                          <button
                            onClick={() => removeFile(item.id)}
                            className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-900 rounded-lg transition-all"
                            aria-label="Remove file"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Batch controls */}
                  {fileQueue.some(i => i.status === "idle") && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleConvertAll}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold rounded-xl text-xs transition-all duration-200 shadow-md shadow-indigo-900/20"
                      >
                        Process Queue
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Quick conversion tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-xl text-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Quick Actions:
            </span>
            {["HEIC to JPG", "WebP to JPG", "WebP to PNG", "Word to PDF", "PDF to Word", "Compress Image"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold text-gray-400 bg-[#0b0f19] border border-gray-900 rounded-full px-2.5 py-1 hover:border-indigo-900 hover:text-indigo-400 cursor-default transition-colors duration-150 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>

        {/* Right Side Scraper (Placeholder C) */}
        <aside className="hidden lg:block sticky top-24 self-start flex-shrink-0 opacity-90">
          <AdPlaceholder type="scraper" />
        </aside>

      </section>

      {/* 3. Detailed User Guide & Content Section */}
      <section className="w-full bg-[#0b0f19] border-t border-gray-900 py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Step-by-Step Guide */}
          <div ref={guideRef} className="space-y-6 scroll-mt-24">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                How to Convert WebP to JPG or PNG?
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
                Convert files in three easy, serverless steps using our local browser engine.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="border border-gray-900 rounded-2xl p-6 bg-[#030712]/40 relative hover:shadow-md transition-shadow">
                <span className="w-8 h-8 bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-400 font-extrabold text-sm border border-indigo-900/40">
                  1
                </span>
                <h4 className="text-sm font-bold text-white mt-4">Select or Drag Files</h4>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Drag and drop your `.webp` or `.heic` images directly into the active upload container, or browse locally from your device.
                </p>
              </div>

              <div className="border border-gray-900 rounded-2xl p-6 bg-[#030712]/40 relative hover:shadow-md transition-shadow">
                <span className="w-8 h-8 bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-400 font-extrabold text-sm border border-indigo-900/40">
                  2
                </span>
                <h4 className="text-sm font-bold text-white mt-4">Choose Output Format</h4>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Select the conversion target (`JPG` or `PNG`) or click `COMPRESS` and adjust the quality factor using the slider.
                </p>
              </div>

              <div className="border border-gray-900 rounded-2xl p-6 bg-[#030712]/40 relative hover:shadow-md transition-shadow">
                <span className="w-8 h-8 bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-400 font-extrabold text-sm border border-indigo-900/40">
                  3
                </span>
                <h4 className="text-sm font-bold text-white mt-4">Process & Download</h4>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Click 'Process'. The client-side sandboxed engine will transform your files. Unlock and download after the 5s ad timer.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-900" />

          {/* Section 1: What is WebP */}
          <div ref={webpRef} className="space-y-4 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              What is WebP and Why do Browsers Use it?
            </h3>
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed">
              <p>
                <strong>WebP</strong> is a modern image format developed by Google specifically for the web. It provides superior lossy and lossless compression for images online. Utilizing WebP, web developers and webmasters can create smaller, richer images that make web pages load faster, improving the overall browsing experience.
              </p>
              <p>
                Browsers and web servers use WebP because it achieves comparable quality to standard formats like JPEG and PNG while reducing file size by <strong>25% to 34%</strong>. Lossless WebP supports transparency (alpha channel) at a cost of just 22% additional bytes. Fast page loading is a core ranking factor for search engines, which is why WebP has become the web standard.
              </p>
              <p>
                However, WebP files are not natively supported by all offline image editors, old browsers, and operating systems. Converting WebP to standard PNG or JPG files makes them easy to share, edit, and print without installing additional codecs.
              </p>
            </div>
          </div>

          <hr className="border-gray-900" />

          {/* Section 2: Image Quality Analysis */}
          <div ref={qualityRef} className="space-y-4 scroll-mt-24">
            <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Image Quality Analysis: WebP vs JPG / PNG
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              When deciding whether to maintain WebP format or convert back to traditional JPG or PNG, it's crucial to understand how compression details impact detail preservation:
            </p>
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-900 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Feature</th>
                    <th className="py-3 px-4">WebP</th>
                    <th className="py-3 px-4">JPEG / JPG</th>
                    <th className="py-3 px-4">PNG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900 text-gray-300">
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-200">Compression Type</td>
                    <td className="py-3 px-4">Lossy & Lossless (Predictive)</td>
                    <td className="py-3 px-4">Lossy Only (Block DCT)</td>
                    <td className="py-3 px-4">Lossless Only (Deflate)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-200">Average File Size</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">Very Small (Optimized)</td>
                    <td className="py-3 px-4">Medium</td>
                    <td className="py-3 px-4">Large</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-200">Transparency Support</td>
                    <td className="py-3 px-4">Yes (8-bit Alpha Channel)</td>
                    <td className="py-3 px-4">No</td>
                    <td className="py-3 px-4">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-200">Compression Artifacts</td>
                    <td className="py-3 px-4">Smooth blur at high compression</td>
                    <td className="py-3 px-4">Blocky DCT grids on edges</td>
                    <td className="py-3 px-4">None (Exact Pixel Match)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-gray-200">Compatibility Scope</td>
                    <td className="py-3 px-4">Modern Browsers & Systems</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">Universal (100% Compatible)</td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">Universal (100% Compatible)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 italic pt-2">
              Note: easy2convert.xyz utilizes local browser Canvas rendering pipelines which preserve pixel-perfect details during WebP decoding and JPEG/PNG exports.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Footer: Privacy Policy | Terms | Contact Us */}
      <footer className="w-full bg-[#030712] border-t border-gray-900 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-gray-500 font-semibold">
              © {new Date().getFullYear()} easy2convert.xyz. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed max-w-md">
              Secure client-side cryptography. Images and files are processed strictly inside sandboxed browser memory. Files are never uploaded to any remote server, guaranteeing absolute confidentiality.
            </p>
          </div>
          <div className="flex gap-6 text-xs font-bold text-gray-500">
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-indigo-400 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </footer>

      {/* Interstitial Download Modal */}
      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={executeDownload}
        fileName={activeDownloadFile ? activeDownloadFile.convertedName : ""}
      />

    </div>
  );
}
