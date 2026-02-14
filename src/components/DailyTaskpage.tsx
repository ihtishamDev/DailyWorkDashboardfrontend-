"use client";

import { useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";
import { Search, Upload, Download, Plus, MoreVertical } from "lucide-react";

const data = [
  { priority: "High", name: "Marvin McKinney", phone: "(629) 555-0129", email: "georgia.young@example.com", status: "New Lead" },
  { priority: "Low", name: "Robert Fox", phone: "(405) 555-0128", email: "michael.mitc@example.com", status: "Unqualified" },
  { priority: "High", name: "Ralph Edwards", phone: "(252) 555-0126", email: "dolores.chambers@example.com", status: "Qualified" },
  { priority: "Mid", name: "Theresa Webb", phone: "(201) 555-0124", email: "jessica.hanson@example.com", status: "New Lead" },
];

const getPriorityColor = (priority: string) => {
  if (priority === "High") return "bg-red-100 text-red-600";
  if (priority === "Low") return "bg-orange-100 text-orange-600";
  return "bg-blue-100 text-blue-600";
};

const getStatusColor = (status: string) => {
  if (status === "Qualified") return "bg-blue-100 text-blue-600";
  if (status === "Unqualified") return "bg-red-100 text-red-600";
  return "bg-green-100 text-green-600";
};

export default function DailyTaskPage() {
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [search, setSearch] = useState("");

  // 🔥 Filtering Logic
  const filteredData = data.filter((item) => {
    const priorityMatch =
      selectedPriority === "" ||
      selectedPriority === "All" ||
      item.priority === selectedPriority;

    const statusMatch =
      selectedStatus === "" ||
      selectedStatus === "All" ||
      item.status === selectedStatus;

    const searchMatch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase());

    return priorityMatch && statusMatch && searchMatch;
  });

  return (
    <div className="p-5">
        <div className="mt-5 p-5 bg-white rounded-xl shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <h2 className="font-semibold text-gray-700 mr-4">Daily Work Needed</h2>

        {/* Search */}
        <div className="flex items-center border rounded-lg px-3 py-2 w-64 bg-gray-50">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ml-2 w-full bg-transparent outline-none text-sm"
          />
        </div>

        {/* ✅ Reused Component */}
        <FilterDropdown
          label="Priority"
          options={["All", "High", "Mid", "Low"]}
          onChange={(value) => setSelectedPriority(value)}
        />

        <FilterDropdown
          label="Status"
          options={["All", "New Lead", "Qualified", "Unqualified"]}
          onChange={(value) => setSelectedStatus(value)}
        />

        <button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm bg-gray-50">
          <Upload size={16} /> Export
        </button>

        <button className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm bg-gray-50">
          <Download size={16} /> Import
        </button>

        <button className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          <Plus size={16} /> Add New Lead
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="py-3 px-2">Priority</th>
            <th className="py-3 px-2">Work Needed</th>
            <th className="py-3 px-2">Phone</th>
            <th className="py-3 px-2">Email</th>
            <th className="py-3 px-2">Status</th>
            <th className="py-3 px-2 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-3 px-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </td>

              <td className="py-3 px-2 font-medium">{item.name}</td>
              <td className="py-3 px-2">{item.phone}</td>
              <td className="py-3 px-2">{item.email}</td>

              <td className="py-3 px-2">
                <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>

              <td className="py-3 px-2 text-right">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}