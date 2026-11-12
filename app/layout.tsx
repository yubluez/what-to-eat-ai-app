import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "WhatToEat AI | วันนี้กินอะไรดี?",
  description: "ผู้ช่วยเลือกอาหารอัจฉริยะที่ช่วยแนะนำเมนูอาหารตามความต้องการของคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased bg-[#FBF9F5]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
