import React from "react";
import { FileText } from "lucide-react";

const PageLoader = ({ text = "Loading Data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <style>{`
        @keyframes global-scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        .animate-global-scan {
          animation: global-scan 1.5s ease-in-out infinite;
        }
      `}</style>
      
      <div className="relative w-24 h-28 bg-primary-50 rounded-xl border-2 border-primary-100 flex items-center justify-center mb-6 overflow-hidden shadow-inner">
        <FileText className="w-12 h-12 text-primary-300" />
        <div className="absolute left-0 w-full h-1 bg-primary-500 shadow-[0_0_15px_5px_rgba(59,130,246,0.5)] animate-global-scan z-10"></div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 leading-tight">{text}</h3>
      <div className="mt-4 flex gap-1.5 justify-center">
        <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  );
};

export default PageLoader;
