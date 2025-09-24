import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resistr - Organizing Tool",
  description: "A secure, privacy-focused platform for action coordination, resource tracking, and skill mapping.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ]
  }
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
                  <AuthProvider>
                    {children}
                    <Toaster 
                      position="top-center"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: 'var(--background)',
                          color: 'var(--foreground)',
                          border: '1px solid var(--border)',
                        },
                        success: {
                          iconTheme: {
                            primary: 'var(--primary)',
                            secondary: 'var(--primary-foreground)',
                          },
                        },
                        error: {
                          iconTheme: {
                            primary: 'hsl(var(--destructive))',
                            secondary: 'hsl(var(--destructive-foreground))',
                          },
                        },
                      }}
                    />
                  </AuthProvider>
                </ThemeProvider>
      </body>
    </html>
  );
}
