import React, { useState } from "react";
import messagesData from "../data/messages";
import { MessageSquare, Send, ChevronRight } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function InboxPage() {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      <div className="flex bg-white border rounded-2xl overflow-hidden">
        <div className="w-1/3 border-r">
          <div className="p-4 font-bold">Messages</div>
          {messagesData.map(chat => (
            <div
              key={chat.id}
              className="p-4 border-b cursor-pointer hover:bg-gray-50"
              onClick={() => setActiveChat(chat)}
            >
              <p className="font-bold text-sm">{chat.sender}</p>
              <p className="text-xs text-gray-500">{chat.preview}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {!activeChat ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <MessageSquare size={48} />
            </div>
          ) : (
            <>
              <div className="p-4 border-b flex items-center gap-2">
                <button className="md:hidden" onClick={() => setActiveChat(null)}>
                  <ChevronRight className="rotate-180" />
                </button>
                <p className="font-bold">{activeChat.sender}</p>
              </div>

              <div className="flex-1 p-6 overflow-auto bg-[#F7F7F3] space-y-4">
                {activeChat.history.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === "me" ? "justify-end" : ""}`}>
                    <div className={`px-4 py-2 rounded-xl max-w-xs ${msg.sender === "me" ? "bg-[#2F2F2F] text-white" : "bg-white"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 flex gap-2 border-t bg-white">
                <input className="flex-1 bg-gray-100 rounded-xl px-4" placeholder="Type a message..." />
                <Button className="h-10 w-10 p-0 rounded-full"><Send size={18} /></Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
