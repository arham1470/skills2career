import React, { useState, useEffect } from "react";
import Accordion from "../ui/Accordion";

const faqs = [
  { q: "How does the skill matching work?", a: "Our algorithm analyzes the skills listed in your profile and compares them with the requirements of posted internships. A match percentage is calculated to show how well you fit the role." },
  { q: "Is Skills2Career free for seekers?", a: "Yes, the platform is completely free for seekers to register, build profiles, and apply for internships." },
  { q: "How do companies post internships?", a: "Companies can register as Employers, verify their business details, and post unlimited internship opportunities through their dashboard." },
  { q: "Can I apply for multiple internships?", a: "Absolutely. You can apply to as many internships as you like, provided you meet the eligibility criteria." },
];

const FAQ = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('faq');
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

  return (
    <section id="faq" className="section-padding bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about getting started.
          </p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-200/60 p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {faqs.map((faq, index) => (
            <Accordion 
              key={index} 
              title={faq.q}
              index={index}
            >
              {faq.a}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;