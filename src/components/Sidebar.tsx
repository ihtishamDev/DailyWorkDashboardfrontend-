"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Settings,
  ChevronRight,
} from "lucide-react";

interface Props {
  isOpen: boolean; // mobile open
  setIsOpen: (val: boolean) => void;
  onExpandChange?: (expanded: boolean) => void; // ✅ NEW
}

export default function Sidebar({ isOpen, setIsOpen, onExpandChange }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const showText = isOpen || isExpanded;

  useEffect(() => {
    onExpandChange?.(showText);
  }, [showText, onExpandChange]);

  return (
    <>
      {/* Overlay (mobile) */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`
          fixed top-0 left-0 z-50 h-screen bg-[#007AB6] text-white overflow-hidden
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          md:translate-x-0
          ${showText ? "md:w-64" : "md:w-20"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo + Brand */}
          <div className="flex flex-col items-center pt-5 pb-4">
            <Image
              src="/images/dailywork.png"
              alt="Logo"
              width={38}
              height={38}
              className="rounded-lg"
            />
            {showText && (
              <div className="mt-2">
                <span className="text-white font-semibold text-base">
                  Schesti
                </span>
              </div>
            )}
          </div>

          <div className="mx-4 border-t border-white/20" />

          {/* Menu */}
          <nav className="flex-1 px-3 pt-5">
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center rounded-xl px-3 py-2 transition
                    ${showText ? "gap-3" : "justify-center"}
                    hover:bg-white/15
                  `}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 shrink-0">
                    <LayoutDashboard size={20} />
                  </div>

                  {showText && (
                    <span className="text-white text-sm font-medium whitespace-nowrap">
                      Dashboard
                    </span>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  href="/dailytask"
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center rounded-xl px-3 py-2 transition
                    ${showText ? "gap-3" : "justify-center"}
                    hover:bg-white/15
                  `}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 shrink-0">
                    <ClipboardList size={20} />
                  </div>

                  {showText && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-white text-sm font-medium whitespace-nowrap">
                        Daily Task
                      </span>
                      <ChevronRight size={16} className="text-white/90" />
                    </div>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Settings */}
          <div className="px-3 pb-5">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center rounded-xl px-3 py-2 transition
                ${showText ? "gap-3" : "justify-center"}
                hover:bg-white/15
              `}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 shrink-0">
                <Settings size={20} />
              </div>

              {showText && (
                <span className="text-white text-sm font-medium whitespace-nowrap">
                  Settings
                </span>
              )}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}