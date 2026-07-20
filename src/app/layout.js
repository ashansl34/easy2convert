import { Outfit } from "next/font/google";
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
  description: "Fast, 100% client-side online file converter for PDF, WebP, HEIC, and a powerful online calculator suite for developers, designers, and students.",
  keywords: "HEIC to JPG, WebP to PNG, WebP to JPG, image converter, client side image converter, HEIC converter, local image conversion, fast image converter, online calculator, nil calculator, free web calculator, utility calculator, web calculator tool",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3495501252331334"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-800">
        {children}
      </body>
    </html>
  );
}
