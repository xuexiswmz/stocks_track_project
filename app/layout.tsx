import React from "react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <main>
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
