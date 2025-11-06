import React from "react";
import "../globals.css";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="min-h-screen text-gray-400">
        <Header />
        <div className="container py-10">{children}</div>
      </main>
      <Toaster />
    </>
  );
};
export default Layout;
