import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Heritage Short Studio",
  description: "Turn your family stories into AI-powered heritage short films",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "var(--white)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Providers>
          <Suspense fallback={<div style={{ height: 56, background: "var(--crimson-deep)" }} />}>
            <Navbar />
          </Suspense>
          <main style={{ flex: 1, width: "100%" }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
