import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ElectraLearn | Electoral Intelligence & Democratic Education",
  description: "Advanced autonomous intelligence platform for the Indian Democratic Process. Explore real-time constituency insights, AI-driven education, and immersive election simulations.",
  icons: {
    icon: "/favicon.ico",
  },
};

import { Suspense } from "react";
import { FloatingChatButton } from "@/components/ui/FloatingChatButton";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import GAIntegration from "@/components/GoogleAnalytics";
import "@/lib/firebase"; // Firebase Advanced Analytics & Core Services

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="beforeInteractive"
        />
        <Script 
          id="google-translate-config"
          strategy="beforeInteractive"
        >
          {`
            window.googleTranslateElementInit = function() {
              new google.translate.TranslateElement({
                pageLanguage: 'en', 
                includedLanguages: 'en,hi,te,ta,bn,mr,gu,kn,ml,pa,es,fr,de,ja,zh-CN',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            };
          `}
        </Script>
        <Script 
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <GAIntegration gaId={process.env.NEXT_PUBLIC_GA_ID || "G-ELECTION2026"} />
        </Suspense>
        <AuthProvider>
          <Navbar />
          {children}
          <ConditionalFooter />
          <FloatingChatButton />
        </AuthProvider>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'hi,en,te,ta,bn,mr,gu,kn,ml,pa',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              }, 'google_translate_element');
            }
          `}
        </Script>
      </body>
    </html>
  );
}
