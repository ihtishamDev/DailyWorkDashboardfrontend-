// "use client";
// import { useEffect } from "react";

// export default function Modal({ isOpen, onClose, title, children }) {
//   // close on ESC
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       {/* Modal Box */}
//       <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg animate-fadeIn">
//         {/* Header */}
//         <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-100 rounded-t-xl">
//           <h2 className="text-lg font-semibold">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-black text-xl"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   );
// }