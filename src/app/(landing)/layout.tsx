import type { Metadata } from "next";
import { Inter, Lalezar } from "next/font/google";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

const primary = Inter({
  subsets: ["latin"],
  variable: "--font-landing",
});

const secondary = Lalezar({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-landing-secondary",
});

export const metadata: Metadata = {
  title: "FormCraft - home",
  description: "A form builder",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          primary.variable,
          secondary.variable,
          "font-landing overflow-x-hidden"
        )}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
