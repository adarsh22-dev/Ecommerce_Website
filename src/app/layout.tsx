import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";
import { SkipLink, FocusRing } from "@/components/ui/accessibility";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ECOM Enterprise Commerce Platform",
    template: "%s | ECOM",
  },
  description:
    "A multi-tenant commerce platform for B2C, B2B, marketplace, vendor, and wholesaler experiences.",
  keywords: ["enterprise commerce", "multi-tenant commerce", "b2b commerce", "marketplace platform"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ECOM",
  },
  other: {
    "facebook-domain-verification": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <SkipLink />
          <FocusRing />
          <div id="main-content">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#1A1A1A",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
