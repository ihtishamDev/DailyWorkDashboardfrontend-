"use client";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, ClipboardList } from "lucide-react";

interface Props {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: Props) {
    return (
        <>
            {/* Overlay (mobile) */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden ${isOpen ? "block" : "hidden"
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div
                className={`peer group fixed z-50 top-0 left-0 h-screen bg-[#007AB6] text-white p-4
                                transform transition-all duration-300
                                ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
                                md:translate-x-0 md:w-20 md:hover:w-64 overflow-hidden`}
            >
                {/* Logo */}
                <h1 className="text-2xl font-bold mb-8 whitespace-nowrap">
                    {/* <span className="hidden md:group-hover:inline">My Dashboard</span> */}
                    <Image className="rounded-full"
                        src="/images/dailywork.png"
                        alt="Logo"
                        width={40}
                        height={40}

                    />
                </h1>

                {/* Menu */}
                <ul className="space-y-8 ">
                    <li>
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3"
                        >
                            <LayoutDashboard size={22} />
                            <span className="hidden md:group-hover:inline">Dashboard</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/dailytask"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3"
                        >
                            <ClipboardList size={22} />
                            <span className="hidden md:group-hover:inline">Daily Task</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
}