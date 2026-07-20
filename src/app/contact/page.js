import React from "react";
import Header from "../../components/Header";

export const metadata = {
  title: "Contact Us | easy2convert.xyz",
  description: "Get in touch with the easy2convert.xyz support team for feature requests, bug reports, or privacy inquiries.",
};

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-950">
      {/* Header */}
      <Header currentPage="contact" />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-6 py-12">
        {/* Back to Home Button */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors bg-white border border-slate-200 hover:border-emerald-200 px-4 py-2.5 rounded-xl shadow-sm hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home Converter
          </a>
        </div>

        {/* Contact Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-10 space-y-8">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Support & Inquiries
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Contact Us
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              We welcome your feedback, feature suggestions, technical bug reports, and partnership inquiries.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Card */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg">
                ✉️
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Direct Email Support</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Send us an email anytime and our team will get back to you within 24–48 hours.
                </p>
              </div>
              <a
                href="mailto:propose2025123@gmail.com"
                className="inline-block bg-white border border-slate-300 hover:border-emerald-500 text-emerald-700 text-xs font-mono font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
              >
                propose2025123@gmail.com
              </a>
            </div>

            {/* Privacy & Technical Inquiries Card */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-lg">
                🔒
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">100% Client-Side Privacy</h2>
                <p className="text-xs text-slate-500 mt-1">
                  All image and document conversions operate locally in your browser memory sandbox. We never host or store your source files.
                </p>
              </div>
              <a
                href="/privacy-policy"
                className="inline-block text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
              >
                Read Privacy Policy →
              </a>
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
              Secure client-side cryptography. Images and files are processed strictly inside sandboxed browser memory.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/privacy-policy" className="bg-slate-50 text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="/terms-and-conditions" className="bg-slate-50 text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200">
              Terms of Service
            </a>
            <a href="/contact" className="bg-slate-50 text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
