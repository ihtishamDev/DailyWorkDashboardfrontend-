"use client";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Main Content */}
        <div
          className="
            min-h-screen bg-gray-100 transition-all duration-300
            md:ml-20 md:peer-hover:ml-64
          "
        >
          {/* Mobile Navbar */}
          <div className="md:hidden p-4 bg-white shadow">
            <button onClick={() => setIsOpen(true)}>☰</button>
          </div>

          <main className="">{children}</main>
        </div>
      </body>
    </html>
  );
}