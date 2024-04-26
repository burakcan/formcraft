import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReactDOM from "react-dom";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FormCraft",
  description: "A form builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  ReactDOM.preconnect("https://fonts.gstatic.com");
  ReactDOM.prefetchDNS("https://fonts.googleapis.com");

  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-secondary")}>{children}</body>
    </html>
  );
}
