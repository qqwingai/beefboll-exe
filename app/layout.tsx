import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "牛肉丸 — 个人作品集",
  description: "一个藏在 beefboll 2004 Professional 里的中文视觉作品集。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
