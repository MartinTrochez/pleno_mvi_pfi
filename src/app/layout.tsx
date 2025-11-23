import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Pleno", template: "%s | Pleno" },
  description: "Plataforma de gestión de stock",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <NuqsAdapter>
        <TRPCReactProvider>
          <body
            className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}
          >
            <a className="skip-to-main" href="#main">
              Skip to main content
            </a>
            <Toaster />
            {children}
          </body>
        </TRPCReactProvider>
      </NuqsAdapter>
    </html>
  );
}
