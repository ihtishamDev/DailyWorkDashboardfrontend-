"use client";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false); // mobile open
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // ✅ desktop expanded

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onExpandChange={(expanded) => setSidebarExpanded(expanded)}
        />

        {/* Main Content */}
        <div
          className={`
            min-h-screen bg-gray-100 transition-all duration-300
            ${sidebarExpanded ? "md:ml-64" : "md:ml-20"}
          `}
        >
          {/* Mobile Navbar */}
          <div className="md:hidden p-4 bg-white shadow">
            <button onClick={() => setIsOpen(true)}>☰</button>
          </div>

          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}