import type { Metadata } from "next";
import { Inter, Lalezar } from "next/font/google";
import { cn } from "@/lib/utils";

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
        {children}
      </body>
    </html>
  );
}
