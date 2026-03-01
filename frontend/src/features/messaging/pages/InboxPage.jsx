import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { Search, Send, MoreVertical, Phone, Video, Info, Paperclip, Smile, MessageSquare } from "lucide-react";

// Mock Data within feature for now
const MOCK_CHATS = [
    {
        id: "1",
        sender: "Sarah Chen",
        preview: "The latest AI strategy doc is ready for your review.",
        history: [
            { sender: "Sarah Chen", text: "Hey! I've finished the initial draft for the AI scaling strategy.", time: "10:30 AM" },
            { sender: "You", text: "Awesome, Sarah. I'll take a look at it this afternoon.", time: "10:45 AM" },
            { sender: "Sarah Chen", text: "Perfect. Let me know if you want to hop on a quick call.", time: "11:00 AM" },
        ]
    },
    {
        id: "2",
        sender: "Marco Rossi",
        preview: "Can we hop on a quick design sync at 4pm?",
        history: [
            { sender: "Marco Rossi", text: "Hey, can we hop on a quick design sync at 4pm?", time: "昨天" }
        ]
    },
    {
        id: "3",
        sender: "Elena Volkov",
        preview: "Growth numbers for Q1 are exceeding targets!",
        history: []
    }
];

export default function InboxPage() {
    const [selectedChat, setSelectedChat] = useState(MOCK_CHATS[0]);
    const [messageText, setMessageText] = useState("");

    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedChat) return;

        // In a real app, this would be a mutation
        const newMessage = {
            sender: "You",
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        selectedChat.history.push(newMessage);
        setMessageText("");
    };

    return (
        <div className="h-[calc(100vh-160px)] flex gap-8">
            {/* Sidebar */}
            <Card className="w-96 flex flex-col overflow-hidden border-none shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold mb-6">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-12 pr-4 h-12 rounded-xl bg-gray-50 border-none outline-none text-sm"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {MOCK_CHATS.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`p-6 cursor-pointer transition-colors border-l-4 ${selectedChat?.id === chat.id ? "bg-gray-50 border-[#2F2F2F]" : "border-transparent hover:bg-gray-50/50"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-[#CBD4CE] flex items-center justify-center font-bold text-gray-700 shrink-0">
                                    {chat.sender[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold truncate">{chat.sender}</h4>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">12:30 PM</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{chat.preview}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-sm relative">
                {selectedChat ? (
                    <>
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-[#2F2F2F] text-white flex items-center justify-center font-bold">
                                    {selectedChat.sender[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{selectedChat.sender}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Now</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="h-11 w-11 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400"><Phone size={20} /></button>
                                <button className="h-11 w-11 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400"><Video size={20} /></button>
                                <button className="h-11 w-11 flex items-center justify-center rounded-xl hover:bg-gray-50 text-gray-400"><Info size={20} /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar bg-gray-50/30">
                            {selectedChat.history.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[70%] p-5 rounded-[1.5rem] shadow-sm ${msg.sender === "You"
                                        ? "bg-[#2F2F2F] text-white rounded-tr-none"
                                        : "bg-white text-[#2F2F2F] rounded-tl-none"
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p className={`text-[9px] mt-2 font-black uppercase tracking-widest ${msg.sender === "You" ? "text-white/40" : "text-gray-400"}`}>
                                            {msg.time}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-6 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-6 py-2 border border-gray-100 focus-within:ring-2 ring-[#2F2F2F]/10 transition-all">
                                <button className="text-gray-400 hover:text-black transition-colors"><Paperclip size={20} /></button>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none outline-none py-3 text-sm"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button className="text-gray-400 hover:text-black transition-colors"><Smile size={20} /></button>
                                <Button
                                    onClick={handleSendMessage}
                                    variant="primary"
                                    className="h-10 w-10 p-0 rounded-xl"
                                >
                                    <Send size={18} />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="h-20 w-20 bg-gray-100 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Select a conversation</h3>
                        <p className="text-gray-400 max-w-xs">Choose a chat from the sidebar to start collaborating with visionaries.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
