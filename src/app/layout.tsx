import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FormCraft",
  description: "A form builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
