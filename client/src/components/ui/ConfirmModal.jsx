import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // 'danger' or 'warning'
}) => {
  if (!isOpen) return null;

  const iconColor = type === "danger" ? "text-red-600 bg-red-100" : "text-amber-600 bg-amber-100";
  const btnVariant = type === "danger" ? "primary" : "primary"; // We will style the button specifically below

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-up">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${iconColor}`}>
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">{message}</p>

          <div className="flex w-full gap-3">
            <Button 
              variant="secondary" 
              onClick={onClose} 
              className="flex-1 py-2.5"
            >
              {cancelText}
            </Button>
            <Button 
              variant="primary" 
              onClick={onConfirm} 
              className={`flex-1 py-2.5 ${type === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;