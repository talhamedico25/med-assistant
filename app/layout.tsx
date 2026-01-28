import React from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Med-Symptom Assistant | Educational Clinical Reasoning",
  description: "Developed by Talha & Vareesha (Batch of 2030, KMC)",
};

export default function RootLayout({
  children,
}: Readonly<{
  // Fixed: Added React import to provide the React namespace for ReactNode
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}