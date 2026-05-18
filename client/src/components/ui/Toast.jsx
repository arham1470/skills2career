import React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const icons = { success: CheckCircle, error: AlertCircle, warning: AlertCircle, info: Info };
const colors = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  error: "bg-red-50 text-red-800 border-red-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  info: "bg-blue-50 text-blue-800 border-blue-200"
};

const Toast = ({ message, type = "info", onClose }) => {
  const Icon = icons[type] || icons.info;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-fade-up min-w-[300px] max-w-md ${colors[type]}`}>
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;