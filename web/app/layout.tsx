import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/lib/RoleContext";
import AppShell from "@/components/AppShell";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hệ thống Quản lý ATTP — Chi cục An toàn Thực phẩm TP. Đà Nẵng",
  description:
    "Hệ thống phần mềm quản lý an toàn thực phẩm thành phố Đà Nẵng — Chi cục An toàn Thực phẩm, Sở Y tế",
  keywords: "an toàn thực phẩm, đà nẵng, chi cục, quản lý, cơ sở kinh doanh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={roboto.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ fontFamily: "'Roboto', Arial, Helvetica, sans-serif" }}>
        <RoleProvider>
          <AppShell>{children}</AppShell>
        </RoleProvider>
      </body>
    </html>
  );
}
