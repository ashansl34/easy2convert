import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import { getAllPostSlugs, getPostData } from "../../../lib/posts";

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths.map((path) => ({
    slug: path.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostData(slug);
  if (!post) {
    return {
      title: "Post Not Found | easy2convert.xyz",
    };
  }

  return {
    title: `${post.title} | easy2convert.xyz`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "easy2convert Team"],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  // Google JSON-LD Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": post.author || "easy2convert Team",
    },
    "publisher": {
      "@type": "Organization",
      "name": "easy2convert.xyz",
      "url": "https://easy2convert.xyz",
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://easy2convert.xyz/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-950">
      {/* JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <Header currentPage="blog" />

      {/* Main Content */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 md:px-6 py-12">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors bg-white border border-slate-200 hover:border-emerald-200 px-4 py-2.5 rounded-xl shadow-sm hover:shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to All Articles
          </Link>
        </div>

        {/* Article Container */}
        <article className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-10 space-y-6">
          <header className="space-y-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-widest text-[9px]">
                Guide
              </span>
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
              {post.description}
            </p>
          </header>

          {/* HTML Rendered Content */}
          <div
            className="prose prose-slate max-w-none text-sm text-slate-700 space-y-4 leading-relaxed font-normal"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
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
