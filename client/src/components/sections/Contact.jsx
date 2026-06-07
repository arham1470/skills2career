import React from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Start Your Journey?</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Join thousands of seekers and companies already using Skills2Career to build the future of work in Sri Lanka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/role-select">
                <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100 border-none">
                  Register Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-white/10 hover:border-gray-500">
                Contact Sales
              </Button>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/10 p-3 rounded-xl">
                <Mail className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Email Us</h3>
                <p className="text-gray-400 text-sm">We reply within 24 hours</p>
              </div>
            </div>
            <a href="mailto:support@skills2career.lk" className="text-2xl font-bold text-white hover:text-primary-300 transition-colors break-all">
              support@careerbridge.lk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;