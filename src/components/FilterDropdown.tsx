"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  label: string;
  options: string[];
  onChange?: (value: string) => void;
};

export default function FilterDropdown({ label, options, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false);
    onChange?.(value);
  };

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border bg-gray-50 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
      >
        {selected}
        <ChevronDown size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-40 bg-white border rounded-lg shadow-md z-10">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}