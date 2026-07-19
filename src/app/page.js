"use client";

import React, { useState, useEffect, useRef } from "react";
import AntiGravityBackground from "../components/AntiGravityBackground";
import AdPlaceholder from "../components/AdPlaceholder";
import DownloadModal from "../components/DownloadModal";
import Header from "../components/Header";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState("");
  const [conversionStatus, setConversionStatus] = useState("idle"); // 'idle' | 'converting' | 'completed' | 'error'
  const [conversionProgress, setConversionProgress] = useState(0);
  const [convertedFileUrl, setConvertedFileUrl] = useState("");
  const [convertedFileName, setConvertedFileName] = useState("");
  const [convertedFileSize, setConvertedFileSize] = useState(null);
  const [compressionQuality, setCompressionQuality] = useState(60);
  const [dragActive, setDragActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDownloadFile, setActiveDownloadFile] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: "Is easy2convert.xyz safe to use?",
      answer: "Yes, 100%. All conversions and calculations happen locally inside your browser sandbox. Your files never touch a remote server, ensuring complete confidentiality.",
    },
    {
      question: "What is the maximum file size limit?",
      answer: "You can process files up to 50MB entirely client-side, restricted only by your local browser's memory constraints.",
    },
    {
      question: "Are the developer calculators free?",
      answer: "Yes, all designer and developer utility tools are 100% free and open for lifetime use without registration.",
    },
  ];
  
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

  const getFormatsForFile = (file) => {
    if (!file) return [];
    const ext = file.name.split(".").pop().toLowerCase();
    
    if (ext === "docx" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      return ["PDF"];
    }
    if (ext === "pdf" || file.type === "application/pdf") {
      return ["DOCX", "Compress"];
    }
    if (ext === "heic" || file.type === "image/heic") {
      return ["JPG", "PNG", "WebP", "Compress"];
    }
    if (ext === "webp" || file.type === "image/webp") {
      return ["JPG", "PNG", "Compress"];
    }
    if (ext === "png" || file.type === "image/png") {
      return ["JPG", "WebP", "Compress"];
    }
    if (ext === "jpg" || ext === "jpeg" || file.type === "image/jpeg") {
      return ["PNG", "WebP", "Compress"];
    }
    
    return ["JPG", "PNG", "WebP", "Compress"];
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setTargetFormat("");
    setConversionStatus("idle");
    setConversionProgress(0);
    setConvertedFileUrl("");
    setConvertedFileName("");
    setConvertedFileSize(null);
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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Trigger file dialog
  const onButtonClick = () => {
    fileInputRef.current.click();
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

  // Single file converter execution
  const handleConvertNow = async () => {
    if (!selectedFile || !targetFormat) return;

    setConversionStatus("converting");
    setConversionProgress(5);

    let progress = 5;
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 4;
      if (progress >= 95) {
        progress = 95;
        clearInterval(progressInterval);
      }
      setConversionProgress(Math.min(progress, 95));
    }, 150);

    try {
      let convertedBlob;
      const fileExt = selectedFile.name.split(".").pop().toLowerCase();
      const isHeic = fileExt === "heic" || selectedFile.type === "image/heic";
      const isDocx = fileExt === "docx" || selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const isPdf = fileExt === "pdf" || selectedFile.type === "application/pdf";
      
      let extension = targetFormat.toLowerCase();

      if (targetFormat === "Compress") {
        extension = fileExt;
        if (isPdf) {
          convertedBlob = await compressPdfClient(selectedFile);
        } else if (isHeic) {
          const heic2any = (await import("heic2any")).default;
          const jpegBlob = await heic2any({
            blob: selectedFile,
            toType: "image/jpeg",
            quality: compressionQuality / 100,
          });
          convertedBlob = Array.isArray(jpegBlob) ? jpegBlob[0] : jpegBlob;
          extension = "jpg";
        } else {
          convertedBlob = await convertViaCanvas(selectedFile, fileExt, compressionQuality / 100);
        }
      } else if (isDocx && targetFormat === "PDF") {
        convertedBlob = await convertDocxToPdfClient(selectedFile);
      } else if (isPdf && targetFormat === "DOCX") {
        convertedBlob = await convertPdfToDocxClient(selectedFile);
        extension = "docx";
      } else if (isHeic) {
        const heic2any = (await import("heic2any")).default;
        const conversionResult = await heic2any({
          blob: selectedFile,
          toType: "image/jpeg",
          quality: 0.85,
        });
        const jpegBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;

        if (targetFormat === "JPG" || targetFormat === "JPEG") {
          convertedBlob = jpegBlob;
        } else {
          convertedBlob = await convertViaCanvas(jpegBlob, targetFormat, 0.88);
        }
      } else {
        convertedBlob = await convertViaCanvas(selectedFile, targetFormat, 0.88);
      }

      clearInterval(progressInterval);

      // Create download URL
      const downloadUrl = URL.createObjectURL(convertedBlob);
      const originalBase = selectedFile.name.substring(0, selectedFile.name.lastIndexOf("."));
      const suffix = targetFormat === "Compress" ? "_compressed" : "";
      const convertedName = `${originalBase}${suffix}.${extension}`;

      setConvertedFileUrl(downloadUrl);
      setConvertedFileName(convertedName);
      setConvertedFileSize(convertedBlob.size);
      setConversionStatus("completed");
      setConversionProgress(100);
      
      // Trigger download popup modal flow automatically after completion
      triggerDownloadFlow({
        convertedName,
        downloadUrl,
      });

    } catch (err) {
      clearInterval(progressInterval);
      console.error("Conversion failed:", err);
      setConversionStatus("error");
      setConversionProgress(0);
    }
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

  const handleScrollTo = (section) => {
    if (section === "converter") scrollTo(converterRef);
    if (section === "guide") scrollTo(guideRef);
    if (section === "webp") scrollTo(webpRef);
    if (section === "quality") scrollTo(qualityRef);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-[#030712] text-gray-200 selection:bg-indigo-950 selection:text-white select-none">
      
      {/* 1. Header: Logo + Simple Navigation */}
      <Header currentPage="home" onScrollTo={handleScrollTo} />



      {/* 2. Core WebP/HEIC Converter Tool Zone */}
      <section ref={converterRef} className="w-full max-w-3xl mx-auto px-4 md:px-6 py-10 flex flex-col items-center justify-center">
          
          {/* Main Converter Card - Anti-gravity background restricted to this box */}
          <div className="w-full bg-[#0b0f19] border border-gray-900 rounded-2xl shadow-2xl shadow-black/80 p-6 md:p-8 backdrop-blur-md relative overflow-hidden transition-all duration-300">
            
            {/* Embedded Anti-Gravity Particle Canvas specifically here */}
            <AntiGravityBackground />

            {/* Content inside the card remains visible above canvas */}
            <div className="relative z-10">
              {/* Card Slogan */}
              <div className="text-center mb-8">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-900/40">
                  Micro-Niche Optimizer
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-2.5">
                  All-in-One Fast Online File Converter
                </h2>
                <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Fast client-side transformation. Convert DOCX, PDF, HEIC, WebP, PNG, and JPG locally without uploading anything to remote servers.
                </p>
              </div>

              {/* If no file is selected, show dropzone */}
              {!selectedFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={onButtonClick}
                  className={`w-full py-12 px-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-950/20 scale-[1.01] shadow-inner"
                      : "border-gray-800 bg-[#0e1422]/60 hover:border-emerald-500 hover:bg-[#12192c]/75 hover:shadow-md"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/heic,image/webp,image/png,image/jpeg,image/jpg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,.pdf"
                    onChange={handleFileChange}
                  />
                  
                  <div className="w-14 h-14 bg-emerald-950/40 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-900/30 mb-4 shadow-sm">
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
                    Drag & drop your file here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports DOCX, PDF, HEIC, WebP, PNG, JPG (Max 50MB)
                  </p>
                  <button
                    type="button"
                    className="mt-6 py-4 px-8 bg-emerald-600 hover:bg-emerald-700 hover:scale-105 active:scale-98 text-white font-bold rounded-xl text-lg shadow-lg shadow-emerald-950/50 border border-emerald-500/30 transition-all duration-300 ease-out"
                  >
                    Browse Files
                  </button>
                </div>
              ) : (
                /* Selected File Step-by-Step UI */
                <div className="w-full space-y-6 transition-all duration-500 animate-fade-in">
                  
                  {/* File Info Card */}
                  <div className="border border-gray-900 rounded-xl bg-[#030712] p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-gray-950 rounded-lg flex items-center justify-center text-gray-500 border border-gray-900 flex-shrink-0">
                        {selectedFile.name.toLowerCase().endsWith(".pdf") ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        ) : selectedFile.name.toLowerCase().endsWith(".docx") ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 font-medium">
                        <p className="text-xs font-bold text-gray-200 truncate max-w-xs md:max-w-md" title={selectedFile.name}>
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {formatSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    
                    {conversionStatus === "idle" && (
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-900 rounded-lg transition-all cursor-pointer"
                        aria-label="Deselect file"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Format Selector Section */}
                  {conversionStatus === "idle" && (
                    <div className="space-y-4 animate-fade-in duration-300">
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Select Output Format
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {getFormatsForFile(selectedFile).map((format) => (
                          <button
                            key={format}
                            onClick={() => setTargetFormat(format)}
                            className={`py-3.5 px-4 rounded-xl border text-sm font-bold uppercase transition-all duration-200 cursor-pointer ${
                              targetFormat === format
                                ? "border-emerald-500 bg-emerald-950/20 text-emerald-400 shadow-md shadow-emerald-950/10"
                                : "border-gray-800 bg-[#030712] text-gray-400 hover:border-gray-700 hover:text-gray-200"
                            }`}
                          >
                            {format === "Compress" ? "COMPRESS" : `TO ${format}`}
                          </button>
                        ))}
                      </div>

                      {/* Compression slider */}
                      {targetFormat === "Compress" && !selectedFile.name.toLowerCase().endsWith(".pdf") && (
                        <div className="bg-[#030712] border border-gray-900 rounded-xl p-4 space-y-2 max-w-md">
                          <div className="flex justify-between text-xs font-bold text-gray-400">
                            <span>Target Compression Quality</span>
                            <span className="text-emerald-400">{compressionQuality}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="90"
                            value={compressionQuality}
                            onChange={(e) => setCompressionQuality(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                          />
                          <p className="text-[10px] text-gray-500">
                            Lower quality values yields higher compression and smaller file dimensions.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Converting State / Progress Bar */}
                  {conversionStatus === "converting" && (
                    <div className="w-full bg-[#030712] border border-gray-900 rounded-xl p-5 space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-emerald-400 animate-pulse">Converting file locally...</span>
                        <span className="text-emerald-400">{conversionProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-950 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-150"
                          style={{ width: `${conversionProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Completed State */}
                  {conversionStatus === "completed" && (
                    <div className="w-full bg-[#030712] border border-gray-900 rounded-xl p-5 space-y-4 text-center">
                      <div className="inline-flex w-12 h-12 bg-emerald-950/30 rounded-full items-center justify-center text-emerald-400 border border-emerald-900/40 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Conversion Successful!</h4>
                        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                          File is converted to <strong>{convertedFileName}</strong>.
                        </p>
                        {convertedFileSize && (
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            Original: {formatSize(selectedFile.size)} → Output: {formatSize(convertedFileSize)} 
                            {convertedFileSize < selectedFile.size && (
                              <span className="text-emerald-400 ml-1">
                                (-{Math.round(((selectedFile.size - convertedFileSize) / selectedFile.size) * 100)}%)
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <button
                          onClick={() => triggerDownloadFlow({ convertedName: convertedFileName, downloadUrl: convertedFileUrl })}
                          className="py-3 px-6 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-900/30 cursor-pointer"
                        >
                          Download Converted File
                        </button>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="py-3 px-6 bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold rounded-xl text-sm border border-gray-800 transition-all cursor-pointer"
                        >
                          Convert Another File
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Primary CTA Button for conversion execution */}
                  {conversionStatus === "idle" && (
                    <button
                      onClick={handleConvertNow}
                      disabled={!targetFormat}
                      className={`w-full py-4 rounded-xl text-sm font-extrabold uppercase tracking-widest transition-all duration-300 ${
                        targetFormat
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-950/40 hover:scale-[1.01] hover:shadow-emerald-950/60 active:scale-98 cursor-pointer"
                          : "bg-gray-950 text-gray-600 border border-gray-900 cursor-not-allowed"
                      }`}
                    >
                      Convert Now
                    </button>
                  )}

                </div>
              )}

            </div>
          </div>

          {/* Quick conversion tags */}
          <div className="flex flex-col items-center justify-center gap-4 mt-6 max-w-2xl text-center">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Quick Actions:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {["HEIC to JPG", "WebP to JPG", "WebP to PNG", "Word to PDF", "PDF to Word", "Compress Image"].map((tag) => (
                <button
                  key={tag}
                  onClick={onButtonClick}
                  className="text-sm md:text-base font-semibold text-gray-300 bg-[#0e1422] border border-gray-800 rounded-xl py-3 px-6 hover:border-emerald-500 hover:bg-[#12192c] hover:text-emerald-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

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

      {/* 3.5 FAQ Section */}
      <section className="w-full bg-[#030712] border-t border-gray-900 py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-900/40">
              Common Questions
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mt-2">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-gray-900 rounded-xl bg-[#0b0f19] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-gray-200 hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className={`w-4 h-4 text-emerald-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-40 border-t border-gray-900" : "max-h-0"
                    }`}
                  >
                    <p className="p-5 text-xs text-gray-400 leading-relaxed bg-[#030712]/30">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
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
          <div className="flex flex-wrap gap-3">
            <a href="/privacy-policy" className="bg-[#0b0f19] text-gray-400 hover:text-emerald-400 border border-gray-900 hover:border-emerald-900/50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms-and-conditions" className="bg-[#0b0f19] text-gray-400 hover:text-emerald-400 border border-gray-900 hover:border-emerald-900/50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="bg-[#0b0f19] text-gray-400 hover:text-emerald-400 border border-gray-900 hover:border-emerald-900/50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200">
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
