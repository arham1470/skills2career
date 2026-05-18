import React, { useState, useEffect } from "react";
import { Code, Palette, TrendingUp, Users, Briefcase, Scale, Heart, BookOpen } from "lucide-react";

const categories = [
  { name: "Technology & IT", icon: Code, count: 120, color: "from-blue-500 to-blue-600", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { name: "Design & Creative", icon: Palette, count: 45, color: "from-purple-500 to-purple-600", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  { name: "Marketing", icon: TrendingUp, count: 60, color: "from-pink-500 to-rose-600", iconBg: "bg-pink-100", iconColor: "text-pink-600" },
  { name: "HR & Admin", icon: Users, count: 30, color: "from-amber-500 to-orange-600", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { name: "Finance", icon: Briefcase, count: 55, color: "from-green-500 to-emerald-600", iconBg: "bg-green-100", iconColor: "text-green-600" },
  { name: "Legal", icon: Scale, count: 20, color: "from-indigo-500 to-violet-600", iconBg: "bg-indigo-100", iconColor: "text-indigo-600" },
  { name: "Healthcare", icon: Heart, count: 40, color: "from-red-500 to-rose-600", iconBg: "bg-red-100", iconColor: "text-red-600" },
  { name: "Education", icon: BookOpen, count: 35, color: "from-cyan-500 to-teal-600", iconBg: "bg-cyan-100", iconColor: "text-cyan-600" },
];

const Categories = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCounts, setAnimatedCounts] = useState(categories.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('categories');
    if (section) observer.observe(section);

    // Trigger animation immediately if section is already visible
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setIsVisible(true);
      }
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      categories.forEach((cat, index) => {
        const timer = setTimeout(() => {
          let start = 0;
          const duration = 1500;
          const increment = cat.count / (duration / 16);
          
          const animate = () => {
            start += increment;
            if (start < cat.count) {
              setAnimatedCounts(prev => {
                const newCounts = [...prev];
                newCounts[index] = Math.floor(start);
                return newCounts;
              });
              requestAnimationFrame(animate);
            } else {
              setAnimatedCounts(prev => {
                const newCounts = [...prev];
                newCounts[index] = cat.count;
                return newCounts;
              });
            }
          };
          animate();
        }, index * 100);
        
        return () => clearTimeout(timer);
      });
    }
  }, [isVisible]);

  return (
    <section id="categories" className="section-padding bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explore <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Categories</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Browse opportunities across industries and find the right path for your career.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((cat, index) => (
            <div 
              key={cat.name} 
              className={`group relative bg-white p-6 rounded-2xl border border-gray-200/60 hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer text-center transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className={`${cat.iconBg} inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}>
                <cat.icon className={`w-7 h-7 ${cat.iconColor}`} />
              </div>
              <h3 className={`font-bold text-gray-900 text-base mb-2 group-hover:scale-105 transition-transform duration-300`}>
                {cat.name}
              </h3>
              <p className={`text-sm font-semibold bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`}>
                {animatedCounts[index]}+ Jobs
              </p>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
              <div className="mt-4 h-0.5 w-0 group-hover:w-12 mx-auto bg-gradient-to-r from-transparent via-gray-300 to-transparent transition-all duration-500 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;