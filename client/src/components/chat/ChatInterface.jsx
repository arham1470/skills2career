import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Loader2, ArrowLeft, User, CheckCheck, Briefcase, Trash2 } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../hooks/useSocket";

const ChatInterface = ({ className = "" }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const { socket, onlineUsers } = useSocket(token);
  const [searchParams] = useSearchParams();
  const initialConvId = searchParams.get("convId");

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, convId: null });
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch Conversations
  useEffect(() => {
    const fetchConvs = async () => {
      try {
        const res = await api.get("/chat/conversations");
        setConversations(res.data.conversations);
        if (initialConvId) {
          const target = res.data.conversations.find(c => c._id === initialConvId);
          if (target) selectConversation(target);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchConvs();
  }, [initialConvId]);

  // Fetch Messages & Join Room
  const selectConversation = async (conv) => {
    setActiveConv(conv);
    try {
      const res = await api.get(`/chat/messages/${conv._id}`);
      setMessages(res.data.messages);
      socket?.emit("joinRoom", conv._id);
      socket?.emit("markRead", { conversationId: conv._id });
    } catch (err) { console.error(err); }
  };

  // Re-join room if socket connects after activeConv is set (fixes stale closure on employer navigation)
  useEffect(() => {
    if (socket && activeConv) {
      socket.emit("joinRoom", activeConv._id);
    }
  }, [socket, activeConv]);

  // Socket Listeners
  useEffect(() => {
    if (!socket) return;
    socket.on("newMessage", (msg) => {
      if (activeConv && String(msg.conversation) === String(activeConv._id)) {
        setMessages(prev => [...prev, msg]);
        socket.emit("markRead", { conversationId: activeConv._id });
      }
      setConversations(prev => prev.map(c => String(c._id) === String(msg.conversation) ? { ...c, lastMessage: msg.text, updatedAt: new Date() } : c));
    });
    socket.on("userTyping", ({ userId }) => {
      if (activeConv && activeConv.participants.some(p => String(p._id) === String(userId))) setIsTyping(true);
    });
    socket.on("userStopTyping", () => setIsTyping(false));
    socket.on("messagesRead", ({ userId }) => {
      if (activeConv && activeConv.participants.some(p => String(p._id) === String(userId))) {
        setMessages(prev => prev.map(m => ({ ...m, read: true })));
      }
    });
    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
      socket.off("userStopTyping");
      socket.off("messagesRead");
    };
  }, [socket, activeConv]);

  // Auto scroll (container-level only)
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Typing handler
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!typing && activeConv) {
      setTyping(true);
      socket?.emit("typing", { conversationId: activeConv._id });
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket?.emit("stopTyping", { conversationId: activeConv._id });
    }, 2000);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !activeConv) return;
    socket?.emit("sendMessage", { conversationId: activeConv._id, text: input.trim() });
    setInput("");
    setTyping(false);
    socket?.emit("stopTyping", { conversationId: activeConv._id });
  };

  const getOtherUser = (conv) => {
    const currentId = String(user?.id || user?._id);
    return conv.participants.find((p) => String(p._id) !== currentId);
  };

  const handleDelete = async (convId, deleteForBoth = false) => {
    try {
      await api.delete(`/chat/conversation/${convId}`, { data: { deleteForBoth } });
      setConversations(prev => prev.filter(c => c._id !== convId));
      if (activeConv?._id === convId) setActiveConv(null);
      setDeleteDialog({ open: false, convId: null });
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleDeleteClick = (convId, e) => {
    e.stopPropagation();
    setDeleteDialog({ open: true, convId });
  };

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm flex overflow-hidden h-full ${className}`}>
      
      {/* Inbox Sidebar */}
      <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${activeConv ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">No conversations yet.</div>
          ) : (
            conversations.map(conv => {
              const other = getOtherUser(conv);
              const isOnline = onlineUsers.includes(String(other._id));
              return (
                <div
                  key={conv._id}
                  onClick={() => selectConversation(conv)}
                  className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 items-center cursor-pointer ${activeConv?._id === conv._id ? "bg-primary-50" : ""}`}
                >
                  <div className="relative">
                    {other.avatar ? (
                      <img src={other.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        {(other.name || other.email).charAt(0).toUpperCase()}
                      </div>
                    )}
                    {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{other.name || other.email}</p>
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage || "Start a conversation"}</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(conv._id, e)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${activeConv ? "flex" : "hidden md:flex"}`}>
        {activeConv ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
              <button className="md:hidden p-2 text-gray-500" onClick={() => setActiveConv(null)}><ArrowLeft className="w-5 h-5" /></button>
              {(() => {
                const otherUser = getOtherUser(activeConv);
                return otherUser?.avatar ? (
                  <img src={otherUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                    {(otherUser?.name || otherUser?.email).charAt(0).toUpperCase()}
                  </div>
                );
              })()}
              <div>
                <p className="text-sm font-semibold text-gray-900">{getOtherUser(activeConv)?.name || getOtherUser(activeConv)?.email}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-xs font-medium border border-primary-100">
                    <Briefcase className="w-3 h-3" />
                    {activeConv.internship?.title || "Internship Chat"}
                  </span>
                  {activeConv.internship?.company && (
                    <span className="text-[10px] text-gray-500">@ {activeConv.internship.company}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-2">
              {messages.map((msg, index) => {
                const currentUserId = String(user?.id || user?._id);
                const senderId = String(msg.sender?._id || msg.sender);
                const isMe = senderId === currentUserId;
                const isLast = index === messages.length - 1 || String(messages[index + 1]?.sender) !== String(msg.sender);
                
                return (
                  <div key={msg._id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"} ${isLast ? "mb-3" : "mb-0.5"}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm relative break-words ${
                      isMe 
                        ? "bg-primary-600 text-white rounded-br-sm" 
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? "text-primary-100" : "text-gray-400"}`}>
                        <span className="text-[10px] opacity-80">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          <CheckCheck className={`w-3.5 h-3.5 ${msg.read ? "text-blue-200" : "text-primary-200/60"}`} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-sm border border-gray-200 shadow-sm">
                    <span className="text-xs text-gray-500 italic">Typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white flex gap-3">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
              />
              <button type="submit" disabled={!input.trim()} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white p-2.5 rounded-full transition-colors shadow-sm">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <User className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Conversation</h3>
            {user?.role === "employer" ? (
              <>
                <p className="text-gray-600 mb-6">Do you want to delete this chat for the seeker also?</p>
                <div className="flex gap-3 mb-3">
                  <button
                    onClick={() => handleDelete(deleteDialog.convId, false)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Delete for me only
                  </button>
                  <button
                    onClick={() => handleDelete(deleteDialog.convId, true)}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Delete for seeker also
                  </button>
                </div>
                <button
                  onClick={() => setDeleteDialog({ open: false, convId: null })}
                  className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this chat?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteDialog({ open: false, convId: null })}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteDialog.convId, false)}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Yes, delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
