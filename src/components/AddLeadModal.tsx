"use client";

import { useEffect, useState } from "react";

type LeadForm = {
  priority: string;
  work_needed: string;
  phone_number: string;
  email: string;
  notes: string;
  status: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeadForm) => void;
  initialData?: LeadForm | null; // ✅ for edit
  title?: string;               // ✅ optional custom title
};

export default function AddLeadModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  title = "Add New Lead",
}: Props) {
  const [formData, setFormData] = useState<LeadForm>({
    priority: "",
    work_needed: "",
    phone_number: "",
    email: "",
    notes: "",
    status: "New Lead",
  });

  // ✅ When modal opens in edit mode, prefill
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          priority: initialData.priority || "",
          work_needed: initialData.work_needed || "",
          phone_number: initialData.phone_number || "",
          email: initialData.email || "",
          notes: initialData.notes || "",
          status: initialData.status || "New Lead",
        });
      } else {
        setFormData({
          priority: "",
          work_needed: "",
          phone_number: "",
          email: "",
          notes: "",
          status: "New Lead",
        });
      }
    }
  }, [open, initialData]);

  // ✅ Lock background scroll when modal open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // ✅ Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSubmit(formData);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className="relative bg-white w-[520px] rounded-xl shadow-xl p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <div className="space-y-3">
          {/* Priority */}
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Mid">Mid</option>
            <option value="Low">Low</option>
          </select>

          {/* Work Needed */}
          <input
            type="text"
            name="work_needed"
            placeholder="Work Needed"
            value={formData.work_needed}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          {/* Phone */}
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          {/* Notes */}
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            rows={4}
          />

          {/* Status */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="New Lead">New Lead</option>
            <option value="Qualified">Qualified</option>
            <option value="Unqualified">Unqualified</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {initialData ? "Update Lead" : "Save Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}