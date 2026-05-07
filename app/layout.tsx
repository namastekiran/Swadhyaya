import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/AuthProvider";
import { LoginModal } from "@/components/LoginModal";
import { GuestBanner } from "@/components/GuestBanner";
import { BottomNav } from "@/components/BottomNav";
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans" suppressHydrationWarning>
        <AuthProvider>
          <GuestBanner />
          <main className="flex-1 mx-auto w-full max-w-md px-6 py-8 sm:max-w-lg">
            {children}
          </main>
          <LoginModal />
          <BottomNav />
        </AuthProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
