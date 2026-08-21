import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useConversationsQuery, useMessageRequestsQuery, useUpdateRequestStatusMutation, useMessagesQuery, useSendMessageMutation } from "@/api/hooks";
import { Send, MessageSquare, Inbox, UserPlus, Check, X, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function Messages() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState("inbox"); // "inbox" | "requests"
    const [selectedConv, setSelectedConv] = useState(null);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    const { data: conversations = [], isLoading: loadingConvs, refetch: refetchConvs } = useConversationsQuery();
    const { data: requests = [], isLoading: loadingRequests, refetch: refetchRequests } = useMessageRequestsQuery();
    const { data: messages = [], isLoading: loadingMsgs, refetch: refetchMsgs } = useMessagesQuery(selectedConv?.id);

    const sendMutation = useSendMessageMutation();
    const updateRequestMutation = useUpdateRequestStatusMutation();

    useEffect(() => {
        if (conversations.length > 0 && !selectedConv) {
            setSelectedConv(conversations[0]);
        }
    }, [conversations, selectedConv]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedConv) return;

        const text = inputText;
        setInputText("");

        try {
            await sendMutation.mutateAsync({
                conversation_id: selectedConv.id,
                receiver_id: selectedConv.recipient?.id,
                content: text
            });
            refetchMsgs();
            refetchConvs();
        } catch (err) {
            toast.error(err.message || "Failed to send message");
        }
    };

    const handleRequestAction = async (requestId, action) => {
        try {
            const res = await updateRequestMutation.mutateAsync({ id: requestId, action });
            toast.success(`Request ${action === 'accept' ? 'accepted' : 'declined'}`);
            refetchRequests();
            const { data: updatedConvs } = await refetchConvs();

            if (action === 'accept') {
                setActiveTab("inbox");
                if (res.conversation) {
                    setSelectedConv(res.conversation);
                } else if (updatedConvs && updatedConvs.length > 0) {
                    setSelectedConv(updatedConvs[0]);
                }
            }
        } catch (err) {
            toast.error(err.message || "Failed to update request");
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Sidebar Conversation / Request List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50/50">
                <div className="p-3 border-b border-gray-200 bg-white">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab("inbox")}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                                activeTab === "inbox" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <Inbox className="w-3.5 h-3.5" />
                            Inbox ({conversations.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all relative ${
                                activeTab === "requests" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            Requests
                            {requests.length > 0 && (
                                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {activeTab === "inbox" ? (
                        loadingConvs ? (
                            <div className="p-4 text-center text-sm text-gray-500">Loading chats...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm font-medium">No conversations yet</p>
                                <p className="text-xs text-gray-400 mt-1">Accepted requests will appear here.</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const isSelected = selectedConv?.id === conv.id;
                                return (
                                    <button
                                        key={conv.id}
                                        onClick={() => setSelectedConv(conv)}
                                        className={`w-full p-4 border-b border-gray-100 text-left transition-colors flex items-start gap-3 ${
                                            isSelected ? "bg-indigo-50/70 border-l-4 border-l-indigo-600" : "hover:bg-gray-100/60"
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {conv.recipient?.avatar_url ? (
                                                <img src={conv.recipient.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                conv.recipient?.name?.charAt(0) || "U"
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{conv.recipient?.name || "User"}</p>
                                                <span className="text-xs text-gray-400">
                                                    {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate mt-1">{conv.last_message || "No messages yet"}</p>
                                        </div>
                                    </button>
                                );
                            })
                        )
                    ) : (
                        loadingRequests ? (
                            <div className="p-4 text-center text-sm text-gray-500">Loading requests...</div>
                        ) : requests.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <UserPlus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm font-medium">No pending requests</p>
                                <p className="text-xs text-gray-400 mt-1">Incoming mentorship, team, or investor requests appear here.</p>
                            </div>
                        ) : (
                            requests.map((req) => (
                                <div key={req.id} className="p-4 border-b border-gray-100 bg-white">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                            {req.sender_name?.charAt(0) || "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900">{req.sender_name}</p>
                                            <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-600 rounded mt-0.5">
                                                {req.type || "Message Request"}
                                            </span>
                                            <p className="text-xs text-gray-600 mt-1 italic">"{req.initial_message}"</p>
                                            
                                            <div className="flex items-center gap-2 mt-3">
                                                <button
                                                    onClick={() => handleRequestAction(req.id, "accept")}
                                                    className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 flex items-center gap-1 transition-colors"
                                                >
                                                    <Check className="w-3.5 h-3.5" /> Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRequestAction(req.id, "reject")}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md hover:bg-gray-200 flex items-center gap-1 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" /> Decline
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>

            {/* Chat Pane */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedConv ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                    {selectedConv.recipient?.name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-gray-900">{selectedConv.recipient?.name || "User"}</h2>
                                    <span className="text-xs text-indigo-600 font-medium">{selectedConv.recipient?.role || "Member"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/30">
                            {loadingMsgs ? (
                                <div className="p-4 text-center text-sm text-gray-500">Loading messages...</div>
                            ) : messages.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">Say hello! Send your first message.</div>
                            ) : (
                                messages.map((msg) => {
                                    const isMe = msg.sender_id === user?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`max-w-md px-4 py-2.5 rounded-2xl text-sm shadow-xs ${
                                                    isMe
                                                        ? "bg-indigo-600 text-white rounded-br-none"
                                                        : "bg-white border border-gray-200 text-gray-900 rounded-bl-none"
                                                }`}
                                            >
                                                <p>{msg.content}</p>
                                                <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${isMe ? "text-indigo-200" : "text-gray-400"}`}>
                                                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {isMe && <CheckCheck className="w-3 h-3" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || sendMutation.isPending}
                                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare className="w-12 h-12 mb-2 text-gray-300" />
                        <p className="text-sm font-medium">Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
