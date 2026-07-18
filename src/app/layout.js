import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "Easy2Convert - Premium Client-Side Image File Converter",
  description: "Convert HEIC to JPG, WebP to PNG/JPG, and standard images locally in your browser. 100% serverless, private, and secure. Zero upload required.",
  keywords: "HEIC to JPG, WebP to PNG, WebP to JPG, image converter, client side image converter, HEIC converter, local image conversion, fast image converter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <head>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3495501252331334"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-800">
        {children}
      </body>
    </html>
  );
}
