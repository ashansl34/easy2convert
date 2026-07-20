import React from "react";
import Header from "../../components/Header";

export const metadata = {
  title: "Terms and Conditions | easy2convert.xyz",
  description: "Read the Terms and Conditions for easy2convert.xyz. Understand our intellectual property guidelines, usage restrictions, and liability policies.",
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Header */}
      <Header currentPage="terms-and-conditions" />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-6 py-12">
        
        {/* Back to Home Button */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-755 hover:text-emerald-600 transition-colors bg-white border border-slate-200 hover:border-emerald-200 px-4 py-2.5 rounded-xl shadow-sm hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home Converter
          </a>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-10 space-y-8">
          
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Legal
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Terms and Conditions for easy2convert.xyz
            </h1>
            <p className="text-xs text-slate-400 mt-2 font-semibold">
              Effective Date: July 19, 2026
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6 space-y-6 text-sm text-slate-600 leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                1. Intellectual Property
              </h2>
              <p>
                All content, scripts, code segments, design layouts, visual styles, tools, and mathematical calculators on easy2convert.xyz are the sole intellectual property of the website owner. These assets are protected by relevant copyright, trademark, and other proprietary laws. You may not copy, republish, distribute, mirror, or repackage any utility or tool from this site without explicit written authorization.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                2. User Restrictions
              </h2>
              <p>
                By using our platform, you agree to access its tools and layouts responsibly. Specifically, users agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-500 font-medium">
                <li>Attempt to scrape, automate, crawl, parse, or mirror codebase structures or script outputs.</li>
                <li>Conduct denial-of-service (DoS) attempts or perform operations aiming to disrupt browser sandbox scripts.</li>
                <li>Misuse file upload handlers to execute malicious exploits within other visitors' sandboxed contexts.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                3. Limitation of Liability
              </h2>
              <p>
                The file converters, aspect-ratio calculators, pixel converters, and data size metrics are provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis for informational and convenience purposes only. We make no guarantees, warranties, or representations of any kind regarding mathematical accuracy or output precision. We are not liable for any direct or indirect losses, damages, or financial/academic errors resulting from your reliance on these tools.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                4. Third-Party Links
              </h2>
              <p>
                Our platform may contain links to external web applications, advertising networks (such as Google AdSense), or service platforms which are not owned or operated by us. We have no control over, and assume no responsibility for, the content, privacy policies, or terms of service of any third-party websites or services.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                5. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify, amend, or rewrite these terms and conditions at any time. Any changes will become effective immediately upon being published to this page. Your continued use of the website following these updates constitutes an acknowledgement and acceptance of the revised Terms and Conditions.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                6. Contact Us
              </h2>
              <p>
                If you have any questions, suggestions, or concerns regarding our Terms and Conditions, please feel free to reach out to us at:
              </p>
              <p className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-xs inline-block text-emerald-700 select-text">
                propose2025123@gmail.com
              </p>
            </section>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-505 font-bold">
              © {new Date().getFullYear()} easy2convert.xyz. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed max-w-md font-semibold">
              Secure client-side cryptography. Images and files are processed strictly inside sandboxed browser memory. Files are never uploaded to any remote server, guaranteeing absolute confidentiality.
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
