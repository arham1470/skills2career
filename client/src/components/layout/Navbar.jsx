import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";
import logo from "../../assets/logo.png";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(window.scrollY > 20 || window.location.pathname !== '/');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20 || window.location.pathname !== '/');
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const scrollToSection = (id) => {
        if (location.pathname === '/') {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(`/#${id}`);
        }
    };

    const navBg = isScrolled
        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
        : "bg-transparent";

    const logoText = isScrolled ? "text-gray-900" : "text-white";

    const linkText = isScrolled
        ? "text-gray-600 hover:text-primary-600 hover:scale-105 hover:font-semibold relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-primary-500 after:to-purple-500 after:transition-all after:duration-300 hover:after:w-full"
        : "text-gray-200 hover:text-white hover:scale-105 hover:font-semibold relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-white after:to-white/50 after:transition-all after:duration-300 hover:after:w-full";

    const mobileBtnColor = isScrolled ? "text-gray-600" : "text-white";

    // FIX: Dynamic dashboard routing for all roles
    const handleDashboardClick = () => {
        if (!user) return navigate("/login");
        if (user.role === "seeker") navigate("/seeker/dashboard");
        else if (user.role === "employer") navigate("/employer/dashboard");
        else if (user.role === "admin") navigate("/admin/dashboard");
        else navigate("/");
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    <Link to="/" className="flex items-center group">
                        <img src={logo} alt="Skills2Career" className="h-20 md:h-32 w-auto object-contain" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className={`text-sm font-medium transition-colors ${linkText}`}>Home</a>
                        <Link to="/internships" className={`text-sm font-medium transition-colors ${linkText}`}>Internships</Link>
                        <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }} className={`text-sm font-medium transition-colors ${linkText}`}>About</a>
                        <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className={`text-sm font-medium transition-colors ${linkText}`}>Contact</a>

                        {user ? (
                            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200/30">
                                <NotificationBell />
                                <Button
                                    variant="secondary"
                                    className={`text-sm py-2 px-4 ${isScrolled ? '' : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white hover:border-white/50'}`}
                                    onClick={handleDashboardClick}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    variant="ghost"
                                    className={`text-sm py-2 px-3 ${isScrolled ? 'text-red-600 hover:bg-red-50' : 'text-white hover:bg-white/10'}`}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200/30">
                                <Link to="/login">
                                    <Button variant="ghost" className={`text-sm py-2 px-3 ${isScrolled ? '' : 'text-white hover:bg-white/10'}`}>
                                        Log In
                                    </Button>
                                </Link>
                                <Link to="/role-select">
                                    <Button
                                        variant={isScrolled ? "primary" : "secondary"}
                                        className={`text-sm py-2 px-5 transition-all duration-300 ${isScrolled
                                                ? ''
                                                : 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 hover:border-white/50 hover:text-white shadow-lg shadow-black/10'
                                            }`}
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <button className={`md:hidden p-2 transition-colors ${mobileBtnColor}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full animate-fade-up">
                    <div className="px-4 pt-4 pb-6 space-y-1">
                        <a href="#hero" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); setMobileMenuOpen(false); }}>Home</a>
                        <Link to="/internships" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Internships</Link>
                        <a href="#about" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={(e) => { e.preventDefault(); scrollToSection('about'); setMobileMenuOpen(false); }}>About</a>
                        <a href="#contact" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); setMobileMenuOpen(false); }}>Contact</a>

                        <div className="pt-4 border-t border-gray-100 mt-2 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <Button variant="secondary" className="w-full justify-center py-3" onClick={() => { handleDashboardClick(); setMobileMenuOpen(false); }}>
                                        Dashboard
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 py-3" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="secondary" className="w-full justify-center py-3">Log In</Button>
                                    </Link>
                                    <Link to="/role-select" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="primary" className="w-full justify-center py-3">Get Started</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;