import React, { useState, useEffect } from "react";
import { Target, Zap, Shield } from "lucide-react";

const features = [
  { 
    title: "Skill-Based Matching", 
    desc: "Our algorithm compares your verified skills with company requirements to surface highly relevant opportunities.", 
    icon: Target,
    color: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  { 
    title: "Streamlined Hiring", 
    desc: "Reduce screening time by 60% with structured profiles, skill tags, and automated shortlisting.", 
    icon: Zap,
    color: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600"
  },
  { 
    title: "Secure & Compliant", 
    desc: "Enterprise-grade encryption, GDPR-aligned data handling, and strict access controls for all users.", 
    icon: Shield,
    color: "from-green-500 to-emerald-600",
    iconBg: "bg-green-100",
    iconColor: "text-green-600"
  },
];

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('about');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setInterval(() => {
        setCardIndex(prev => {
          if (prev < features.length - 1) return prev + 1;
          clearInterval(timer);
          return prev;
        });
      }, 150);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  return (
    <section id="about" className="section-padding bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CareerBridge</span>?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We bridge the gap between academic talent and industry needs with a platform built for precision, speed, and trust.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative group order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
                alt="Team collaboration" 
                className="w-full object-cover h-[420px] transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-bounce">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 rounded-full p-2">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Trusted by</p>
                  <p className="text-sm font-bold text-gray-900">100+ Companies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Side */}
          <div className="space-y-4 order-1 lg:order-2">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className={`group flex gap-4 p-5 rounded-2xl bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform ${
                  isVisible && index <= cardIndex ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`${feature.iconBg} p-3 rounded-xl h-fit shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent mb-2`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                  <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent transition-all duration-500 rounded-full" />
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;