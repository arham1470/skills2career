import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useLocation } from "react-router-dom";
import Hero from "../components/sections/Hero";
import Trust from "../components/sections/Trust";
import About from "../components/sections/About";
import Trending from "../components/sections/Trending";
import Categories from "../components/sections/Categories";
import FAQ from "../components/sections/FAQ";
import Contact from "../components/sections/Contact";

const Landing = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Trust />
        <About />
        <Trending />
        <Categories />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;