import { Globe, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      {/* Left Title */}
      <h1 className="text-xl font-semibold text-gray-700">Leads List</h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer">
          <Globe size={16} />
          ENG <ChevronDown size={16} />
        </div>

        <Image
          src="/images/dailywork.png"
          alt="user"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    </div>
  );
}