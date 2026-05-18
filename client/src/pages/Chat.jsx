import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChatInterface from "../components/chat/ChatInterface";

const Chat = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-20 pb-6">
      <ChatInterface className="h-[calc(100vh-140px)]" />
    </main>
    <Footer />
  </div>
);

export default Chat;