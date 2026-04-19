import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Swadhyaya — Daily Yoga Sutra Journey",
  description:
    "Apply insights from the Patanjali Yoga Sutras in everyday life through short teachings, reflection, and small actionable practices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${devanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <main className="flex-1 mx-auto w-full max-w-lg px-5 py-6">
          {children}
        </main>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
