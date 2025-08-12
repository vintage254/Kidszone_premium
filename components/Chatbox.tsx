'use client';
import React, { useEffect, useRef, useState } from "react";
import { X, Send, MessageSquareText, LogIn } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import MagicLoader from "@/components/ui/magicloader";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  createdAt?: string | null;
}

interface ApiMessage {
  id: string;
  userId: string;
  sender: "USER" | "ADMIN";
  content: string;
  createdAt?: string | null;
}

const mapApiToUi = (m: ApiMessage): Message => ({
  id: m.id,
  text: m.content,
  sender: m.sender === "USER" ? "user" : "admin",
  createdAt: m.createdAt ?? null,
});

const ChatBox: React.FC = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/chat", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const ui: Message[] = Array.isArray(data?.data)
          ? data.data.map((m: ApiMessage) => mapApiToUi(m))
          : [];
        setMessages(ui);
        setTimeout(scrollToBottom, 0);
      }
    } catch (e) {
      console.error("Failed to load messages", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isSignedIn) {
      loadMessages();
    }
  }, [isOpen, isSignedIn]);

  useEffect(() => {
    if (!isOpen || !isSignedIn) return;
    const id = setInterval(() => {
      loadMessages();
    }, 8000);
    return () => clearInterval(id);
  }, [isOpen, isSignedIn]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || sending) return;
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          const uiMsg = mapApiToUi(data.data as ApiMessage);
          setMessages((prev) => [...prev, uiMsg]);
          setInput("");
          setTimeout(scrollToBottom, 0);
          return;
        }
      }
      // Fallback optimistic append
      const temp: Message = {
        id: `temp-${Date.now()}`,
        text: content,
        sender: "user",
      };
      setMessages((prev) => [...prev, temp]);
      setInput("");
      setTimeout(scrollToBottom, 0);
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Button with tooltip */}
      <div className="fixed bottom-5 right-5 z-[1000] group">
        <div
          id="chatbox-tooltip"
          className="absolute -top-9 right-0 mb-2 px-2 py-1 rounded bg-gray-900 text-white text-xs shadow opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition pointer-events-none"
        >
          Talk with us
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          aria-describedby="chatbox-tooltip"
          className="text-white rounded-full shadow-lg h-14 w-14 flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 ring-2 ring-white/70"
        >
          {isOpen ? <X size={24} /> : <MessageSquareText size={24} />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-xl rounded-lg overflow-hidden flex flex-col border border-gray-200 z-[1000]">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 flex justify-between items-center">
            <h2 className="font-semibold">KidsZone Support</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {loading && (
              <div className="mb-2">
                <MagicLoader text="Loading messages..." />
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[70%] ${
                    msg.sender === "user"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 flex items-center border-t border-gray-200">
            {!isSignedIn ? (
              <div className="w-full flex items-center justify-between gap-2">
                <input
                  type="text"
                  placeholder="Sign in to send a message"
                  disabled
                  className="flex-1 px-3 py-2 text-sm border rounded-lg bg-gray-100 text-gray-400"
                />
                <button
                  onClick={() => router.push(`/sign-in?redirect_url=${encodeURIComponent(pathname || "/")}`)}
                  className="ml-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md flex items-center gap-1"
                >
                  <LogIn size={16} /> Sign in
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending}
                  className={`ml-2 bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-full ${sending ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Send size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;