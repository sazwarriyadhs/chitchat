
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/components/auth-provider';
import { Suspense, useState, useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { usePathname } from 'next/navigation';

const metadata: Metadata = {
  title: 'ChitChat',
  description: 'A real-time messaging application.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 3000); // Splash screen will be visible for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{String(metadata.title)}</title>
        <meta name="description" content={String(metadata.description)} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isLoading && <SplashScreen />}
          <Suspense fallback={<div>Loading...</div>}>
            <AuthProvider>
                {children}
            </AuthProvider>
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
