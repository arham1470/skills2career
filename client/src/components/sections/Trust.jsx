import React, { useState, useEffect } from "react";
import { Users, Briefcase, CheckCircle } from "lucide-react";

const stats = [
  { label: "Active Seekers", value: "10+", icon: Users, color: "from-blue-500 to-blue-600", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { label: "Jobs Posted", value: "10+", icon: Briefcase, color: "from-purple-500 to-purple-600", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  { label: "Successful Hires", value: "10+", icon: CheckCircle, color: "from-green-500 to-green-600", iconBg: "bg-green-100", iconColor: "text-green-600" },
];

const Trust = () => {
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0]);

  useEffect(() => {
    stats.forEach((stat, index) => {
      const timer = setTimeout(() => {
        let start = 0;
        const duration = 1500;
        const increment = 10 / (duration / 16);
        
        const animate = () => {
          start += increment;
          if (start < 10) {
            setAnimatedValues(prev => {
              const newValues = [...prev];
              newValues[index] = Math.floor(start);
              return newValues;
            });
            requestAnimationFrame(animate);
          } else {
            setAnimatedValues(prev => {
              const newValues = [...prev];
              newValues[index] = 10;
              return newValues;
            });
          }
        };
        animate();
      }, index * 200);
      
      return () => clearTimeout(timer);
    });
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 border-b border-gray-100">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="group relative flex flex-col items-center p-8 md:p-10 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-gray-200"
            >
              <div className={`${stat.iconBg} p-4 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
              </div>
              <h3 className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tracking-tight mb-2`}>
                {animatedValues[index]}+
              </h3>
              <p className="text-gray-600 font-semibold mt-1 text-base">{stat.label}</p>
              <div className="mt-4 h-1 w-0 group-hover:w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent transition-all duration-500 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;