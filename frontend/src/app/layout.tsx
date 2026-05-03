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
  manifest: "/manifest.json",
};


import { Suspense } from "react";
import { FloatingChatButton } from "@/components/ui/FloatingChatButton";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import GAIntegration from "@/components/GoogleAnalytics";
import "@/lib/firebase"; // Firebase Advanced Analytics & Core Services

import { AccessibilityProvider } from "@/accessibility/AccessibilityProvider";

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
      <head />

      <body className="min-h-full flex flex-col">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-xl focus:font-bold outline-none"
        >
          Skip to main content
        </a>
        <Suspense fallback={null}>
          <GAIntegration gaId={process.env.NEXT_PUBLIC_GA_ID || "G-ELECTION2026"} />
        </Suspense>
        <AccessibilityProvider>
          <AuthProvider>
            <Navbar />
            <div id="main-content-wrapper">
              {children}
            </div>
            <ConditionalFooter />
            <FloatingChatButton />
          </AuthProvider>
        </AccessibilityProvider>

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



      </body>
    </html>
  );
}

