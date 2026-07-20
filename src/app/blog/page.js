import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import { getSortedPostsData } from "../../lib/posts";

export const metadata = {
  title: "Articles & Web Tech Guides | easy2convert.xyz",
  description: "Read in-depth technical guides, WebP optimization tutorials, aspect ratio formulas, and front-end development articles on easy2convert.xyz.",
};

export default function BlogIndex() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-950">
      {/* Header */}
      <Header currentPage="blog" />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 md:px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Publisher Articles
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            Web Technology Guides & Tutorials
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto font-medium leading-relaxed">
            In-depth technical articles on image formats, front-end optimization, web accessibility standards, and web development utility metrics.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider text-[9px]">
                    Technical Guide
                  </span>
                  <span>{post.readingTime} min read</span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">
                  {post.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  {post.date}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
                >
                  Read Article
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
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
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
            <a href="/privacy-policy" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-and-conditions" className="hover:text-emerald-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
