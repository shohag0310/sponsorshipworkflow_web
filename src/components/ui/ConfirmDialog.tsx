import { useEffect, useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (remarks?: string) => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
  remarksLabel?: string;
  remarksPlaceholder?: string;
  remarksRequired?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
  remarksLabel,
  remarksPlaceholder = "Write your remarks...",
  remarksRequired = false,
}: ConfirmDialogProps) {
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (!open) {
      setRemarks("");
    }
  }, [open]);

  if (!open) return null;

  const variantClasses = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  const hasRemarksInput = Boolean(remarksLabel);
  const isDisabled = hasRemarksInput && remarksRequired && !remarks.trim();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>

        {hasRemarksInput && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {remarksLabel}
              {remarksRequired ? " *" : ""}
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={remarksPlaceholder}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm(hasRemarksInput ? remarks.trim() : undefined)}
            disabled={isDisabled}
            className={`px-4 py-2 text-white rounded disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
