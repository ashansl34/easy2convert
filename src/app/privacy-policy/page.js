import React from "react";
import Header from "../../components/Header";

export const metadata = {
  title: "Privacy Policy | easy2convert.xyz",
  description: "Read the Privacy Policy for easy2convert.xyz. We respect your privacy, perform all conversions 100% client-side, and process data transparently.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Header */}
      <Header currentPage="privacy-policy" />

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
              Privacy Policy for easy2convert.xyz
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
                1. Introduction
              </h2>
              <p>
                At easy2convert.xyz, we respect your privacy and are committed to protecting any information we process. Since all file transformations, document conversions, and utility calculations occur directly inside your browser sandbox on the client side, your source documents and images are never uploaded, sent, or saved to any external or remote servers.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                2. Information We Collect
              </h2>
              <p>
                Like many other websites, easy2convert.xyz collects standard technical data to monitor site health and performance:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-500 font-medium">
                <li><strong>Log Files:</strong> We analyze visitor activity through internet protocol (IP) addresses, browser specification types, Internet Service Provider (ISP) tags, referring/exit pages, and date/time stamps.</li>
                <li><strong>Local Cache:</strong> Standard browser cache states and service workers keep scripts running quickly. No personal inputs are compiled or retained.</li>
                <li><strong>Calculators Data:</strong> Mathematical values entered within designer and developer calculators remain inside temporary page memory state variables and are cleared on page reloads.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                3. Google AdSense & DoubleClick Cookie
              </h2>
              <p>
                Google is a third-party vendor on our website. It uses cookies, specifically the DART/DoubleClick cookie, to serve tailored ads to site visitors based on their visit to easy2convert.xyz and other platforms on the internet.
              </p>
              <p>
                Visitors can opt-out of the use of DoubleClick cookies for interest-based advertising by visiting Google's Ad Settings or partner network privacy frameworks.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                4. Third-Party Privacy Policies
              </h2>
              <p>
                easy2convert.xyz's Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of these third-party ad servers (such as Google AdSense) for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
              <p>
                You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                5. Children's Information
              </h2>
              <p>
                We prioritize child protection online. easy2convert.xyz does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately, and we will do our best efforts to promptly remove such records.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                6. Contact Us
              </h2>
              <p>
                If you have any questions or require more information about our Privacy Policy, do not hesitate to contact us at:
              </p>
              <p className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-xs inline-block text-emerald-700 select-text">
                support@easy2convert.xyz
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
            <a href="#" className="bg-slate-50 text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200">
              Contact Us
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
