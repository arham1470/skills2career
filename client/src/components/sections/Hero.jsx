import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Building2, ArrowRight, BookOpen } from "lucide-react";
import Button from "../ui/Button";

const Hero = () => {
  return (
    <section id="hero" className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80"
          alt="Seekers collaborating on projects"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60"></div>
        {/* Subtle brand tint overlay */}
        <div className="absolute inset-0 bg-primary-900/20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400"></span>
              </span>
              Now live for Sri Lankan seekers & companies
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Launch Your Career with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                Skills2Career
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
              The intelligent internship platform that matches your skills with real industry opportunities. Faster hiring. Better fits. Zero noise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/role-select">
                <Button variant="primary" className="w-full sm:w-auto text-base px-8 py-3 bg-primary-600 hover:bg-primary-500 border-none shadow-lg shadow-primary-900/30">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#internships">
                <Button variant="secondary" className="w-full sm:w-auto text-base px-8 py-3 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white hover:border-white/50">
                  Browse Internships
                </Button>
              </a>
            </div>
            <p className="text-sm text-gray-400 pt-2">Free for seekers. Trusted by 200+ companies.</p>
          </div>

          {/* Dual Role Cards */}
          <div className="grid gap-5 animate-fade-up animate-delay-200">
            <Link to="/register?role=seeker" className="group bg-white/95 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 opacity-80">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-600 transition-colors duration-300 shrink-0">
                  <GraduationCap className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">I am a Seeker</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Build your profile, showcase skills, and get matched with relevant internships.</p>
                </div>
              </div>
            </Link>

            <Link to="/register?role=employer" className="group bg-white/95 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 opacity-80">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-600 transition-colors duration-300 shrink-0">
                  <Building2 className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">I am an Employer</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Post opportunities, filter by skills, and hire pre-qualified talent efficiently.</p>
                </div>
              </div>
            </Link>

            <Link to="/career-pathway" className="group bg-white/95 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 opacity-80">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-600 transition-colors duration-300 shrink-0">
                  <BookOpen className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">Career Pathway</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Discover courses and programs you qualify for based on your education.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;