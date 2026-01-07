import { AuthProvider } from "@/components/AuthProvider";
import { GraphqlProvider } from "@/components/GraphqlProvider";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExpenseBook - Daily Expense Tracker",
  description: "Manage your daily expenses efficiently with ExpenseBook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <GraphqlProvider>
            <AuthProvider>
              <ToastProvider />
              <Navbar />
              <div className="flex-1">
                {children}
              </div>
            </AuthProvider>
          </GraphqlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
