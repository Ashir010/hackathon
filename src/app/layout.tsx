import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { NotesProvider } from "@/context/NotesContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Second Brain OS",
  description: "Personal Knowledge OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <body className="flex h-screen overflow-hidden bg-background text-foreground">
        <NotesProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative z-0">
            {children}
          </main>
          <CommandPalette />
        </NotesProvider>
      </body>
    </html>
  );
}
