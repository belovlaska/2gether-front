import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Starter from "@/app/components/starter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GO Boards",
  description: "Поиск и бронирования мест в антикафе",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable}`}>
        {children}
      <Starter/>
      </body>
    </html>
  );
}
