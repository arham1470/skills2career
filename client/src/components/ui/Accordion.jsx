import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const Accordion = ({ title, children, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-green-500 to-emerald-600",
  ];

  const iconBg = [
    "bg-blue-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-green-100",
  ];

  const iconColor = [
    "text-blue-600",
    "text-purple-600",
    "text-pink-600",
    "text-green-600",
  ];

  const colorIndex = index % colors.length;

  return (
    <div className={`border-b border-gray-200/60 last:border-0 group`}>
      <button
        className={`flex justify-between items-center w-full py-5 text-left focus:outline-none group rounded-xl px-4 transition-all duration-300 ${isOpen ? 'bg-gray-100/50' : 'hover:bg-gray-50'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className={`${iconBg[colorIndex]} p-2.5 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0`}>
            <HelpCircle className={`w-5 h-5 ${iconColor[colorIndex]}`} />
          </div>
          <span className="text-gray-900 font-semibold">
            {title}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 group-hover:text-gray-700 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 pb-5 px-4" : "max-h-0 opacity-0"}`}
      >
        <div className="text-gray-600 text-sm leading-relaxed pl-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;