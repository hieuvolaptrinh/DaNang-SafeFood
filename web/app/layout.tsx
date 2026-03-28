import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/RoleContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "FSMS Đà Nẵng — Hệ thống Quản lý An toàn Thực phẩm",
  description: "Hệ thống quản lý an toàn thực phẩm thành phố Đà Nẵng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${jakarta.variable} ${sora.variable}`}>
      <body className="bg-slate-50 font-sans antialiased">
        <RoleProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </RoleProvider>
      </body>
    </html>
  );
}
