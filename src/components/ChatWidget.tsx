"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ChatMessage {
  role: "bot" | "user";
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Hi there! 👋 I'm Riya, your friendly travel assistant at roodh.ways. Ask me anything about our destinations, trips, or travel tips!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if chatbot is enabled
  useEffect(() => {
    const checkEnabled = async () => {
      try {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
        const query = encodeURIComponent(`*[_type == "siteSettings"][0].chatbotEnabled`);
        const res = await fetch(`https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${query}`);
        if (res.ok) {
          const data = await res.json();
          setIsEnabled(data.result !== false);
        } else {
          setIsEnabled(true);
        }
      } catch {
        setIsEnabled(true);
      }
    };
    checkEnabled();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Listen for external open events
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(true);
      if (customEvent.detail?.destination) {
        setMessages(prev => [
          ...prev, 
          { role: "bot", text: `I see you're interested in ${customEvent.detail.destination}! I can help you plan your trip or you can go straight to booking.` },
          { role: "bot", text: "[SHOW_LEAD_FORM]" }
        ]);
      }
    };
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  // Don't render anything while loading or if disabled
  if (isEnabled === null || isEnabled === false) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .map((m) => ({ role: m.role === "user" ? "user" : "model", text: m.text }))
        .concat({ role: "user", text: userMessage });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: data.message || "Sorry, I couldn't process that. Please try again!" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Oops, something went wrong. Please try again in a moment!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-brand-white rounded-2xl shadow-2xl overflow-hidden border border-brand-dark/10 flex flex-col animate-[slideUp_0.3s_ease-out]">
          {/* Header */}
          <div className="bg-brand-dark p-4 flex justify-between items-center text-brand-white">
            <div className="flex items-center gap-3">
              <div className="bg-brand-white/20 p-2 rounded-full">
                <Image src="/logo-white.png" alt="Logo" width={32} height={32} className="opacity-90" />
              </div>
              <div>
                <span className="font-heading font-bold uppercase tracking-wider text-sm block">Roodh.ways Guide</span>
                <span className="text-[10px] text-brand-white/60 font-sans uppercase tracking-widest">
                  {isLoading ? "Typing..." : "Online"}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-brand-sand transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="h-[350px] overflow-y-auto p-4 flex flex-col gap-3 bg-[#f8f9fa]">
            {messages.map((msg, i) => {
              if (msg.role === "bot" && msg.text.includes("[SHOW_LEAD_FORM]")) {
                // If this is not the latest form message, or if it was already successfully submitted,
                // we can just show a success pill. For simplicity, we'll render the form and let it handle its own state
                // but actually it's better if we track submission state per form.
                // We'll pass the message index so we can track it.
                return (
                  <div key={i} className="flex justify-start w-full my-2">
                    <div className="bg-brand-white border border-brand-dark/10 p-4 rounded-2xl w-full shadow-sm relative">
                      <h4 className="text-xs font-black uppercase tracking-widest text-brand-dark mb-3">Trip Details</h4>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const data = {
                          customerName: fd.get("name") as string,
                          email: fd.get("email") as string,
                          phone: fd.get("phone") as string,
                          travelDate: fd.get("date") as string,
                          travelers: parseInt(fd.get("travelers") as string) || 1,
                          destination: fd.get("destination") as string,
                        };
                        
                        // Disable form
                        const btn = e.currentTarget.querySelector('button');
                        if(btn) { btn.disabled = true; btn.textContent = "Sending..."; }

                        fetch("/api/admin/mutate", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            mutations: [{
                              create: {
                                _type: "booking",
                                customerName: data.customerName,
                                email: data.email || "N/A",
                                phone: data.phone || "N/A",
                                travelDate: data.travelDate || new Date().toISOString().split("T")[0],
                                durationDays: 1,
                                travelers: data.travelers,
                                status: "Pending",
                                notes: `--- CHATBOT FORM LEAD ---\nDestination: ${data.destination}`
                              }
                            }]
                          })
                        }).then(() => {
                           // Fake user message
                           setMessages(prev => [...prev, { role: "user", text: "I have submitted my contact details via the form." }]);
                           
                           // Send it to AI
                           setIsLoading(true);
                           const history = messages
                             .map((m) => ({ role: m.role === "user" ? "user" : "model", text: m.text }))
                             .concat({ role: "user", text: "I have submitted my contact details via the form." });
                     
                           fetch("/api/chat", {
                             method: "POST",
                             headers: { "Content-Type": "application/json" },
                             body: JSON.stringify({ messages: history }),
                           }).then(res => res.json()).then(resData => {
                             if (resData.ok !== false && resData.reply) {
                               setMessages(prev => [...prev, { role: "bot", text: resData.reply }]);
                             }
                           }).finally(() => setIsLoading(false));
                        });
                      }} className="flex flex-col gap-2.5">
                        <input name="name" required placeholder="Your Name" className="w-full text-xs font-sans px-3 py-2 bg-brand-offwhite border border-brand-dark/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                        <div className="flex gap-2">
                          <input name="email" type="email" placeholder="Email Address" className="w-full text-xs font-sans px-3 py-2 bg-brand-offwhite border border-brand-dark/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                          <input name="phone" type="tel" required placeholder="Phone No. *" className="w-full text-xs font-sans px-3 py-2 bg-brand-offwhite border border-brand-dark/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                        </div>
                        <input name="destination" required placeholder="Where do you want to go?" className="w-full text-xs font-sans px-3 py-2 bg-brand-offwhite border border-brand-dark/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                        <div className="flex gap-2">
                          <input name="date" type="date" required className="w-full text-xs font-sans px-3 py-2 bg-brand-offwhite border border-brand-dark/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                          <input name="travelers" type="number" min="1" placeholder="Guests" className="w-20 text-xs font-sans px-3 py-2 bg-brand-offwhite border border-brand-dark/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                        </div>
                        <button type="submit" className="w-full mt-1 bg-brand-blue text-white text-xs font-bold uppercase tracking-wider py-2 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50">Submit Details</button>
                      </form>
                    </div>
                  </div>
                );
              }

              return (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm font-sans leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-brand-blue text-brand-white rounded-br-sm"
                        : "bg-brand-white text-brand-dark border border-brand-dark/5 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-brand-white border border-brand-dark/5 rounded-2xl rounded-bl-sm p-3.5 shadow-sm flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-brand-dark/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-brand-dark/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-brand-dark/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-brand-dark/10 bg-brand-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-brand-offwhite border border-brand-dark/10 rounded-full px-5 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-brand-blue hover:bg-brand-dark disabled:bg-brand-dark/30 text-brand-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 shadow-md disabled:shadow-none"
            >
              <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative text-brand-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 ${
          isOpen ? "bg-brand-dark" : "bg-brand-blue hover:bg-brand-blue/90"
        }`}
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <Image src="/logo-white.png" alt="Roodh.ways" width={40} height={40} />
        )}
        {!isOpen && (
          <span className="absolute -top-12 right-0 bg-brand-dark text-brand-white text-xs px-4 py-2 rounded-full whitespace-nowrap font-sans font-bold opacity-0 group-hover:opacity-100 transition-all shadow-lg translate-y-2 group-hover:translate-y-0">
            Chat with us
          </span>
        )}
      </button>
    </div>
  );
}
