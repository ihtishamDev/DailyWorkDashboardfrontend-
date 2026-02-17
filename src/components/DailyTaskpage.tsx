// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import {
//   Search,
//   Upload,
//   Download,
//   Plus,
//   MoreVertical,
//   ChevronDown,
//   ArrowLeft,
//   ArrowRight,
// } from "lucide-react";
// import FilterDropdown from "@/components/FilterDropdown";
// import AddLeadModal from "@/components/AddLeadModal";

// type Lead = {
//   id?: number;
//   priority: string;
//   work_needed: string;
//   phone_number: string;
//   email: string;
//   notes: string;
//   status: string;
// };

// const API_BASE = "http://localhost:8000";

// /* =========================
//    Helpers
// ========================= */
// const getPriorityColor = (priority: string) => {
//   if (priority === "High") return "bg-red-100 text-red-600 border border-red-200";
//   if (priority === "Low") return "bg-orange-100 text-orange-600 border border-orange-200";
//   return "bg-blue-100 text-blue-600 border border-blue-200";
// };

// const getStatusColor = (status: string) => {
//   if (status === "Qualified") return "bg-blue-100 text-blue-600 border border-blue-200";
//   if (status === "Unqualified") return "bg-red-100 text-red-600 border border-red-200";
//   return "bg-green-100 text-green-600 border border-green-200";
// };

// const validateLead = (lead: Lead) => {
//   const errors: string[] = [];
//   if (!lead.priority) errors.push("Priority is required");
//   if (!lead.work_needed) errors.push("Work Needed is required");
//   if (!lead.phone_number) errors.push("Phone Number is required");
//   if (lead.email) {
//     const e = String(lead.email).trim();
//     if (!e.includes("@") || !e.includes(".")) errors.push("Email is invalid");
//   }
//   return errors;
// };

// function buildPagination(current: number, total: number) {
//   if (total <= 10) return Array.from({ length: total }, (_, i) => i + 1);

//   const pages: (number | "...")[] = [];
//   const left = Math.max(1, current - 1);
//   const right = Math.min(total, current + 1);

//   pages.push(1);
//   if (left > 2) pages.push("...");

//   for (let p = left; p <= right; p++) {
//     if (p !== 1 && p !== total) pages.push(p);
//   }

//   if (right < total - 1) pages.push("...");
//   pages.push(total);

//   const cleaned: (number | "...")[] = [];
//   for (const x of pages) {
//     if (cleaned.length === 0 || cleaned[cleaned.length - 1] !== x) cleaned.push(x);
//   }
//   return cleaned;
// }

// export default function DailyTaskPage() {
//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [selectedPriority, setSelectedPriority] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [search, setSearch] = useState("");

//   const [showModal, setShowModal] = useState(false);
//   const [editLead, setEditLead] = useState<Lead | null>(null);

//   const [loadingTable, setLoadingTable] = useState(false);
//   const [loadingExport, setLoadingExport] = useState(false);
//   const [loadingImport, setLoadingImport] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // selection
//   const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

//   // pagination
//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   // date label UI
//   const [dateLabel] = useState("12 may 2023");

//   // action menu
//   const [openMenuId, setOpenMenuId] = useState<number | null>(null);

//   // notes drafts (so typing feels smooth)
//   const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

//   const fetchLeads = async () => {
//     try {
//       setLoadingTable(true);
//       const res = await fetch(`${API_BASE}/tasks/all`, { method: "GET" });
//       if (!res.ok) throw new Error("Failed to fetch tasks");

//       const data = await res.json();
//       const list = Array.isArray(data) ? data : Array.isArray(data?.tasks) ? data.tasks : [];

//       setLeads(list);
//       setSelectedIds(new Set());
//       setPage(1);
//     } catch (e) {
//       console.error(e);
//       setLeads([]);
//     } finally {
//       setLoadingTable(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   // close menu on outside click
//   useEffect(() => {
//     const handle = () => setOpenMenuId(null);
//     window.addEventListener("click", handle);
//     return () => window.removeEventListener("click", handle);
//   }, []);

//   const filteredLeads = useMemo(() => {
//     return leads.filter((item) => {
//       const priorityMatch =
//         selectedPriority === "" ||
//         selectedPriority === "All" ||
//         item.priority === selectedPriority;

//       const statusMatch =
//         selectedStatus === "" ||
//         selectedStatus === "All" ||
//         item.status === selectedStatus;

//       const searchText = search.toLowerCase();
//       const searchMatch =
//         (item.work_needed || "").toLowerCase().includes(searchText) ||
//         (item.email || "").toLowerCase().includes(searchText) ||
//         (item.phone_number || "").toLowerCase().includes(searchText);

//       return priorityMatch && statusMatch && searchMatch;
//     });
//   }, [leads, selectedPriority, selectedStatus, search]);

//   const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));

//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [totalPages, page]);

//   const pagedLeads = useMemo(() => {
//     const start = (page - 1) * pageSize;
//     return filteredLeads.slice(start, start + pageSize);
//   }, [filteredLeads, page]);

//   const paginationItems = useMemo(() => buildPagination(page, totalPages), [page, totalPages]);

//   const allVisibleIds = useMemo(() => {
//     return pagedLeads
//       .map((x) => x.id)
//       .filter((x): x is number => typeof x === "number");
//   }, [pagedLeads]);

//   const isAllSelected =
//     allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));

//   const toggleSelectAll = () => {
//     const next = new Set(selectedIds);
//     if (isAllSelected) allVisibleIds.forEach((id) => next.delete(id));
//     else allVisibleIds.forEach((id) => next.add(id));
//     setSelectedIds(next);
//   };

//   const toggleRow = (id?: number) => {
//     if (typeof id !== "number") return;
//     const next = new Set(selectedIds);
//     if (next.has(id)) next.delete(id);
//     else next.add(id);
//     setSelectedIds(next);
//   };

//   const handleExport = async () => {
//     try {
//       setLoadingExport(true);
//       const res = await fetch(`${API_BASE}/tasks/export`, { method: "GET" });
//       if (!res.ok) throw new Error("Export failed");

//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "tasks.csv";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (e: any) {
//       alert(`❌ ${e.message}`);
//     } finally {
//       setLoadingExport(false);
//     }
//   };

//   const handlePickImportFile = () => fileInputRef.current?.click();

//   const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setLoadingImport(true);

//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch(`${API_BASE}/tasks/import`, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.detail || "Import failed");

//       const summary = data?.summary;
//       if (summary) {
//         alert(
//           `✅ Import completed\nTotal: ${summary.total}\nImported: ${summary.imported}\nSkipped: ${summary.skipped}`
//         );
//         if (summary.errors_preview?.length) console.log("Import errors:", summary.errors_preview);
//       } else {
//         alert("✅ Import completed");
//       }

//       await fetchLeads();
//     } catch (e: any) {
//       alert(`❌ ${e.message}`);
//     } finally {
//       setLoadingImport(false);
//       e.target.value = "";
//     }
//   };

//   // ✅ Update any task (notes/status/edit)
//   const updateTask = async (id: number, payload: Lead) => {
//     const res = await fetch(`${API_BASE}/tasks/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) throw new Error(data?.detail || "Update failed");
//   };

//   // ✅ Add lead API
//   const createLead = async (leadData: Lead) => {
//     const errors = validateLead(leadData);
//     if (errors.length) {
//       alert("❌ " + errors.join(", "));
//       return;
//     }

//     const res = await fetch(`${API_BASE}/tasks/add`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(leadData),
//     });

//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) throw new Error(data?.detail || "Failed to add lead");
//   };

//   // ✅ Modal submit (Add or Edit)
//   const handleSubmitModal = async (form: Omit<Lead, "id">) => {
//     try {
//       if (editLead?.id) {
//         await updateTask(editLead.id, { ...form, id: editLead.id });
//       } else {
//         await createLead(form as Lead);
//       }
//       setShowModal(false);
//       setEditLead(null);
//       await fetchLeads();
//     } catch (e: any) {
//       alert(`❌ ${e.message}`);
//     }
//   };

//   // ✅ Delete
//   const handleDelete = async (id?: number) => {
//     if (typeof id !== "number") {
//       alert("❌ Task ID missing");
//       return;
//     }
//     const ok = confirm("Are you sure you want to delete this lead?");
//     if (!ok) return;

//     try {
//       const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.detail || "Delete failed");
//       await fetchLeads();
//     } catch (e: any) {
//       alert(`❌ ${e.message}`);
//     }
//   };

//   // Notes typing
//   const handleNoteChange = (rowKey: string, value: string) => {
//     setNotesDraft((prev) => ({ ...prev, [rowKey]: value }));
//   };

//   return (
//     <div className="p-5">
//       <div className="mt-5 p-5 bg-white rounded-xl shadow-sm">
//         {/* Header row */}
//         <div className="flex flex-wrap items-center gap-3 mb-3">
//           <h2 className="font-semibold text-gray-800 mr-2">Daily Work Needed</h2>

//           {/* Search */}
//           <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 w-72 bg-white">
//             <Search size={16} className="text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search"
//               value={search}
//               onChange={(ev) => {
//                 setSearch(ev.target.value);
//                 setPage(1);
//               }}
//               className="ml-2 w-full bg-transparent outline-none text-sm text-gray-700"
//             />
//           </div>

//           {/* Filters */}
//           <FilterDropdown
//             label="Priority"
//             options={["All", "High", "Mid", "Low"]}
//             onChange={(value) => {
//               setSelectedPriority(value);
//               setPage(1);
//             }}
//           />
//           <FilterDropdown
//             label="Status"
//             options={["All", "New Lead", "Qualified", "Unqualified"]}
//             onChange={(value) => {
//               setSelectedStatus(value);
//               setPage(1);
//             }}
//           />

//           {/* Export */}
//           <button
//             onClick={handleExport}
//             disabled={loadingExport}
//             className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-60"
//           >
//             <Upload size={16} />
//             {loadingExport ? "Exporting..." : "Export"}
//           </button>

//           {/* Import */}
//           <button
//             onClick={handlePickImportFile}
//             disabled={loadingImport}
//             className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-60"
//           >
//             <Download size={16} />
//             {loadingImport ? "Importing..." : "Import"}
//           </button>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".json,.xlsx,.xls,.csv,.docx"
//             className="hidden"
//             onChange={handleImportFile}
//           />

//           {/* Add */}
//           <button
//             onClick={() => {
//               setEditLead(null);
//               setShowModal(true);
//             }}
//             className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
//           >
//             <Plus size={16} /> Add New Lead
//           </button>
//         </div>

//         {/* Sub header row */}
//         <div className="flex items-center gap-3 mb-4">
//           <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-white hover:bg-gray-50">
//             {dateLabel} <ChevronDown size={14} />
//           </button>

//           <div className="ml-auto flex items-center gap-2">
//             <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-white hover:bg-gray-50">
//               Ménage Priority
//             </button>
//             <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-white hover:bg-gray-50">
//               Manage status
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="border border-gray-200 rounded-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm min-w-[980px]">
//               <thead className="bg-gray-50">
//                 <tr className="text-left text-gray-500 border-b border-gray-200">
//                   <th className="py-3 px-3 w-10">
//                     <input
//                       type="checkbox"
//                       checked={isAllSelected}
//                       onChange={toggleSelectAll}
//                       className="h-4 w-4"
//                     />
//                   </th>
//                   <th className="py-3 px-3">Priority</th>
//                   <th className="py-3 px-3">Work Needed</th>
//                   <th className="py-3 px-3">Phone Number</th>
//                   <th className="py-3 px-3">Email</th>
//                   <th className="py-3 px-3">Notes</th>
//                   <th className="py-3 px-3">Status</th>
//                   <th className="py-3 px-3 text-right">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loadingTable && (
//                   <tr>
//                     <td colSpan={8} className="text-center py-8 text-gray-400">
//                       Loading...
//                     </td>
//                   </tr>
//                 )}

//                 {!loadingTable && pagedLeads.length === 0 && (
//                   <tr>
//                     <td colSpan={8} className="text-center py-8 text-gray-400">
//                       No leads found
//                     </td>
//                   </tr>
//                 )}

//                 {!loadingTable &&
//                   pagedLeads.map((item, index) => {
//                     const rowKey = String(item.id ?? `row-${page}-${index}`);
//                     const noteValue =
//                       notesDraft[rowKey] !== undefined ? notesDraft[rowKey] : item.notes || "";

//                     return (
//                       <tr key={rowKey} className="border-b border-gray-100 hover:bg-gray-50">
//                         <td className="py-3 px-3">
//                           <input
//                             type="checkbox"
//                             checked={typeof item.id === "number" ? selectedIds.has(item.id) : false}
//                             onChange={() => toggleRow(item.id)}
//                             className="h-4 w-4"
//                           />
//                         </td>

//                         <td className="py-3 px-3">
//                           <span
//                             className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getPriorityColor(
//                               item.priority
//                             )}`}
//                           >
//                             {item.priority}
//                           </span>
//                         </td>

//                         <td className="py-3 px-3 font-medium text-gray-800">{item.work_needed}</td>
//                         <td className="py-3 px-3 text-gray-700">{item.phone_number}</td>
//                         <td className="py-3 px-3 text-gray-700">{item.email}</td>

//                         {/* ✅ Notes (save on blur) */}
//                         <td className="py-3 px-3">
//                           <div className="flex items-center gap-3">
//                             <input
//                               value={noteValue}
//                               onChange={(e) => handleNoteChange(rowKey, e.target.value)}
//                               onBlur={async () => {
//                                 if (typeof item.id !== "number") return;
//                                 try {
//                                   await updateTask(item.id, {
//                                     ...item,
//                                     notes: noteValue,
//                                   });
//                                   await fetchLeads();
//                                 } catch (e: any) {
//                                   alert(`❌ ${e.message}`);
//                                 }
//                               }}
//                               placeholder="Write short note"
//                               className="w-44 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none bg-white"
//                             />
//                             <span className="text-xs text-gray-400">{noteValue.length}/200</span>
//                           </div>
//                         </td>

//                         {/* ✅ Status Change (save on change) */}
//                         <td className="py-3 px-3">
//                           <select
//                             value={item.status}
//                             onChange={async (e) => {
//                               if (typeof item.id !== "number") {
//                                 alert("❌ Task ID missing");
//                                 return;
//                               }
//                               const newStatus = e.target.value;
//                               try {
//                                 await updateTask(item.id, { ...item, status: newStatus });
//                                 await fetchLeads();
//                               } catch (err: any) {
//                                 alert(`❌ ${err.message}`);
//                               }
//                             }}
//                             className={`text-xs rounded-full px-3 py-1 border outline-none ${getStatusColor(
//                               item.status
//                             )}`}
//                           >
//                             <option value="New Lead">New Lead</option>
//                             <option value="Qualified">Qualified</option>
//                             <option value="Unqualified">Unqualified</option>
//                           </select>
//                         </td>

//                         {/* ✅ Action menu */}
//                         <td className="py-3 px-3 text-right relative">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               if (typeof item.id === "number") {
//                                 setOpenMenuId(openMenuId === item.id ? null : item.id);
//                               }
//                             }}
//                             className="p-2 hover:bg-gray-100 rounded-lg"
//                           >
//                             <MoreVertical size={16} className="text-gray-500" />
//                           </button>

//                           {typeof item.id === "number" && openMenuId === item.id && (
//                             <div
//                               onClick={(e) => e.stopPropagation()}
//                               className="absolute right-2 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
//                             >
//                               <button
//                                 className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
//                                 onClick={() => {
//                                   setOpenMenuId(null);
//                                   setEditLead(item);
//                                   setShowModal(true);
//                                 }}
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
//                                 onClick={() => {
//                                   setOpenMenuId(null);
//                                   handleDelete(item.id);
//                                 }}
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between px-4 py-3 bg-white">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//             >
//               <ArrowLeft size={14} />
//               Previous
//             </button>

//             <div className="flex items-center gap-2">
//               {paginationItems.map((p, idx) => {
//                 if (p === "...") {
//                   return (
//                     <span key={`dots-${idx}`} className="px-2 text-xs text-gray-400">
//                       ...
//                     </span>
//                   );
//                 }
//                 return (
//                   <button
//                     key={`page-${p}`}
//                     onClick={() => setPage(p)}
//                     className={`h-8 w-8 rounded-lg text-xs ${
//                       page === p ? "bg-gray-100 text-gray-800" : "text-gray-600 hover:bg-gray-50"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 );
//               })}
//             </div>

//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//             >
//               Next
//               <ArrowRight size={14} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal (Add/Edit) */}
//       <AddLeadModal
//         open={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setEditLead(null);
//         }}
//         onSubmit={handleSubmitModal}
//         initialData={
//           editLead
//             ? {
//                 priority: editLead.priority,
//                 work_needed: editLead.work_needed,
//                 phone_number: editLead.phone_number,
//                 email: editLead.email,
//                 notes: editLead.notes,
//                 status: editLead.status,
//               }
//             : null
//         }
//         title={editLead ? "Edit Lead" : "Add New Lead"}
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Upload,
  Download,
  Plus,
  MoreVertical,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import FilterDropdown from "@/components/FilterDropdown";
import AddLeadModal from "@/components/AddLeadModal";

type Lead = {
  id?: number;
  priority: string;
  work_needed: string;
  phone_number: string;
  email: string;
  notes: string;
  status: string;
};

const API_BASE = "http://localhost:8000";

/* =========================
   Helpers
========================= */
const getPriorityColor = (priority: string) => {
  if (priority === "High") return "bg-red-100 text-red-600 border border-red-200";
  if (priority === "Low") return "bg-orange-100 text-orange-600 border border-orange-200";
  return "bg-blue-100 text-blue-600 border border-blue-200";
};

const getStatusColor = (status: string) => {
  if (status === "Qualified") return "bg-blue-100 text-blue-600 border border-blue-200";
  if (status === "Unqualified") return "bg-red-100 text-red-600 border border-red-200";
  return "bg-green-100 text-green-600 border border-green-200";
};

const validateLead = (lead: Lead) => {
  const errors: string[] = [];
  if (!lead.priority) errors.push("Priority is required");
  if (!lead.work_needed) errors.push("Work Needed is required");
  if (!lead.phone_number) errors.push("Phone Number is required");
  if (lead.email) {
    const e = String(lead.email).trim();
    if (!e.includes("@") || !e.includes(".")) errors.push("Email is invalid");
  }
  return errors;
};

function buildPagination(current: number, total: number) {
  if (total <= 10) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];
  const left = Math.max(1, current - 1);
  const right = Math.min(total, current + 1);

  pages.push(1);
  if (left > 2) pages.push("...");

  for (let p = left; p <= right; p++) {
    if (p !== 1 && p !== total) pages.push(p);
  }

  if (right < total - 1) pages.push("...");
  pages.push(total);

  const cleaned: (number | "...")[] = [];
  for (const x of pages) {
    if (cleaned.length === 0 || cleaned[cleaned.length - 1] !== x) cleaned.push(x);
  }
  return cleaned;
}

export default function DailyTaskPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);

  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Export dropdown
  const [exportOpen, setExportOpen] = useState(false);

  // selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // date label UI
  const [dateLabel] = useState("12 may 2023");

  // action menu
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // notes drafts (so typing feels smooth)
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const fetchLeads = async () => {
    try {
      setLoadingTable(true);
      const res = await fetch(`${API_BASE}/tasks/all`, { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      const list = Array.isArray(data) ? data : Array.isArray(data?.tasks) ? data.tasks : [];

      setLeads(list);
      setSelectedIds(new Set());
      setPage(1);
    } catch (e) {
      console.error(e);
      setLeads([]);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // close menu + export dropdown on outside click
  useEffect(() => {
    const handle = () => {
      setOpenMenuId(null);
      setExportOpen(false);
    };
    window.addEventListener("click", handle);
    return () => window.removeEventListener("click", handle);
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      const priorityMatch =
        selectedPriority === "" ||
        selectedPriority === "All" ||
        item.priority === selectedPriority;

      const statusMatch =
        selectedStatus === "" ||
        selectedStatus === "All" ||
        item.status === selectedStatus;

      const searchText = search.toLowerCase();
      const searchMatch =
        (item.work_needed || "").toLowerCase().includes(searchText) ||
        (item.email || "").toLowerCase().includes(searchText) ||
        (item.phone_number || "").toLowerCase().includes(searchText);

      return priorityMatch && statusMatch && searchMatch;
    });
  }, [leads, selectedPriority, selectedStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pagedLeads = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, page]);

  const paginationItems = useMemo(() => buildPagination(page, totalPages), [page, totalPages]);

  const allVisibleIds = useMemo(() => {
    return pagedLeads
      .map((x) => x.id)
      .filter((x): x is number => typeof x === "number");
  }, [pagedLeads]);

  const isAllSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id));

  const toggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllSelected) allVisibleIds.forEach((id) => next.delete(id));
    else allVisibleIds.forEach((id) => next.add(id));
    setSelectedIds(next);
  };

  const toggleRow = (id?: number) => {
    if (typeof id !== "number") return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // ✅ Export in chosen format (csv/xlsx/docx/pdf)
  const exportByFormat = async (format: "csv" | "xlsx" | "docx" | "pdf") => {
    try {
      setLoadingExport(true);
      setExportOpen(false);

      const res = await fetch(`${API_BASE}/tasks/export?format=${format}`, { method: "GET" });
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `tasks.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(`❌ ${e.message}`);
    } finally {
      setLoadingExport(false);
    }
  };

  const handlePickImportFile = () => fileInputRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoadingImport(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/tasks/import`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Import failed");

      const summary = data?.summary;
      if (summary) {
        alert(
          `✅ Import completed\nTotal: ${summary.total}\nImported: ${summary.imported}\nSkipped: ${summary.skipped}`
        );
        if (summary.errors_preview?.length) console.log("Import errors:", summary.errors_preview);
      } else {
        alert("✅ Import completed");
      }

      await fetchLeads();
    } catch (e: any) {
      alert(`❌ ${e.message}`);
    } finally {
      setLoadingImport(false);
      e.target.value = "";
    }
  };

  // ✅ Update any task (notes/status/edit)
  const updateTask = async (id: number, payload: Lead) => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.detail || "Update failed");
  };

  // ✅ Add lead API
  const createLead = async (leadData: Lead) => {
    const errors = validateLead(leadData);
    if (errors.length) {
      alert("❌ " + errors.join(", "));
      return;
    }

    const res = await fetch(`${API_BASE}/tasks/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.detail || "Failed to add lead");
  };

  // ✅ Modal submit (Add or Edit)
  const handleSubmitModal = async (form: Omit<Lead, "id">) => {
    try {
      if (editLead?.id) {
        await updateTask(editLead.id, { ...form, id: editLead.id });
      } else {
        await createLead(form as Lead);
      }
      setShowModal(false);
      setEditLead(null);
      await fetchLeads();
    } catch (e: any) {
      alert(`❌ ${e.message}`);
    }
  };

  // ✅ Delete
  const handleDelete = async (id?: number) => {
    if (typeof id !== "number") {
      alert("❌ Task ID missing");
      return;
    }
    const ok = confirm("Are you sure you want to delete this lead?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || "Delete failed");
      await fetchLeads();
    } catch (e: any) {
      alert(`❌ ${e.message}`);
    }
  };

  // Notes typing
  const handleNoteChange = (rowKey: string, value: string) => {
    setNotesDraft((prev) => ({ ...prev, [rowKey]: value }));
  };

  return (
    <div className="p-5">
      <div className="mt-5 p-5 bg-white rounded-xl shadow-sm">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h2 className="font-semibold text-gray-800 mr-2">Daily Work Needed</h2>

          {/* Search */}
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 w-72 bg-white">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(ev) => {
                setSearch(ev.target.value);
                setPage(1);
              }}
              className="ml-2 w-full bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          {/* Filters */}
          <FilterDropdown
            label="Priority"
            options={["All", "High", "Mid", "Low"]}
            onChange={(value) => {
              setSelectedPriority(value);
              setPage(1);
            }}
          />
          <FilterDropdown
            label="Status"
            options={["All", "New Lead", "Qualified", "Unqualified"]}
            onChange={(value) => {
              setSelectedStatus(value);
              setPage(1);
            }}
          />

          {/* ✅ Export with format menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setExportOpen((v) => !v)}
              disabled={loadingExport}
              className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-60"
            >
              <Upload size={16} />
              {loadingExport ? "Exporting..." : "Export"}
            </button>

            {exportOpen && (
              <div className="absolute mt-2 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => exportByFormat("csv")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => exportByFormat("xlsx")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Export as Excel (.xlsx)
                </button>
                <button
                  onClick={() => exportByFormat("docx")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Export as Word (.docx)
                </button>
                <button
                  onClick={() => exportByFormat("pdf")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Export as PDF (.pdf)
                </button>
              </div>
            )}
          </div>

          {/* Import */}
          <button
            onClick={handlePickImportFile}
            disabled={loadingImport}
            className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-60"
          >
            <Download size={16} />
            {loadingImport ? "Importing..." : "Import"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.xlsx,.xls,.csv,.docx"
            className="hidden"
            onChange={handleImportFile}
          />

          {/* Add */}
          <button
            onClick={() => {
              setEditLead(null);
              setShowModal(true);
            }}
            className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus size={16} /> Add New Lead
          </button>
        </div>

        {/* Sub header row */}
        <div className="flex items-center gap-3 mb-4">
          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-white hover:bg-gray-50">
            {dateLabel} <ChevronDown size={14} />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-white hover:bg-gray-50">
              Ménage Priority
            </button>
            <button className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 bg-white hover:bg-gray-50">
              Manage status
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[980px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-3 px-3 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4"
                    />
                  </th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Work Needed</th>
                  <th className="py-3 px-3">Phone Number</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Notes</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {loadingTable && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                )}

                {!loadingTable && pagedLeads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      No leads found
                    </td>
                  </tr>
                )}

                {!loadingTable &&
                  pagedLeads.map((item, index) => {
                    const rowKey = String(item.id ?? `row-${page}-${index}`);
                    const noteValue =
                      notesDraft[rowKey] !== undefined ? notesDraft[rowKey] : item.notes || "";

                    return (
                      <tr key={rowKey} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={typeof item.id === "number" ? selectedIds.has(item.id) : false}
                            onChange={() => toggleRow(item.id)}
                            className="h-4 w-4"
                          />
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getPriorityColor(
                              item.priority
                            )}`}
                          >
                            {item.priority}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-medium text-gray-800">{item.work_needed}</td>
                        <td className="py-3 px-3 text-gray-700">{item.phone_number}</td>
                        <td className="py-3 px-3 text-gray-700">{item.email}</td>

                        {/* Notes */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <input
                              value={noteValue}
                              onChange={(e) => handleNoteChange(rowKey, e.target.value)}
                              onBlur={async () => {
                                if (typeof item.id !== "number") return;
                                try {
                                  await updateTask(item.id, {
                                    ...item,
                                    notes: noteValue,
                                  });
                                  await fetchLeads();
                                } catch (e: any) {
                                  alert(`❌ ${e.message}`);
                                }
                              }}
                              placeholder="Write short note"
                              className="w-44 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none bg-white"
                            />
                            <span className="text-xs text-gray-400">{noteValue.length}/200</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3">
                          <select
                            value={item.status}
                            onChange={async (e) => {
                              if (typeof item.id !== "number") {
                                alert("❌ Task ID missing");
                                return;
                              }
                              const newStatus = e.target.value;
                              try {
                                await updateTask(item.id, { ...item, status: newStatus });
                                await fetchLeads();
                              } catch (err: any) {
                                alert(`❌ ${err.message}`);
                              }
                            }}
                            className={`text-xs rounded-full px-3 py-1 border outline-none ${getStatusColor(
                              item.status
                            )}`}
                          >
                            <option value="New Lead">New Lead</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Unqualified">Unqualified</option>
                          </select>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-3 text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (typeof item.id === "number") {
                                setOpenMenuId(openMenuId === item.id ? null : item.id);
                              }
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreVertical size={16} className="text-gray-500" />
                          </button>

                          {typeof item.id === "number" && openMenuId === item.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-2 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                            >
                              <button
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setEditLead(item);
                                  setShowModal(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  handleDelete(item.id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-white">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowLeft size={14} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {paginationItems.map((p, idx) => {
                if (p === "...") {
                  return (
                    <span key={`dots-${idx}`} className="px-2 text-xs text-gray-400">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={`page-${p}`}
                    onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded-lg text-xs ${
                      page === p ? "bg-gray-100 text-gray-800" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal (Add/Edit) */}
      <AddLeadModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditLead(null);
        }}
        onSubmit={handleSubmitModal}
        initialData={
          editLead
            ? {
                priority: editLead.priority,
                work_needed: editLead.work_needed,
                phone_number: editLead.phone_number,
                email: editLead.email,
                notes: editLead.notes,
                status: editLead.status,
              }
            : null
        }
        title={editLead ? "Edit Lead" : "Add New Lead"}
      />
    </div>
  );
}