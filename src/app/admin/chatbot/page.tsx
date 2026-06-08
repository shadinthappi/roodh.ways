"use client";

import React, { useEffect, useState, useRef } from "react";

const DEFAULT_SYSTEM_PROMPT = `You are the friendly travel assistant for "Roodh.ways", a premium Indian travel company offering domestic (India) and international trips.

Your role:
- Answer questions about Indian destinations, culture, food, weather, visa requirements, packing tips, and travel advice.
- Suggest destinations and experiences based on what the user is looking for.
- Keep answers concise (2–4 sentences) and conversational — you are chatting, not writing an essay.
- If someone asks to book a trip or plan one in detail, tell them to check out our "Plan A Trip" page at /plan for the full AI itinerary builder.
- Be warm, enthusiastic, and knowledgeable. Use emojis sparingly (1-2 max per message).
- If you don't know something, say so honestly rather than making things up.
- You can mention specific Roodh.ways pages like Destinations, Experiences, International Trips, and The Kit when relevant.

Never respond with markdown formatting (no bold, headers, or bullet lists). Keep it plain conversational text.`;

export default function ChatbotAdminPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [chatbotEnabled, setChatbotEnabled] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState("");

  // Test chat state
  const [testMessages, setTestMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hi! I'm the chatbot preview. Send a message to test the AI." },
  ]);
  const [testInput, setTestInput] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const testEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    testEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [testMessages]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const query = encodeURIComponent(`*[_type == "siteSettings"][0] { _id, _type, chatbotEnabled, chatbotSystemPrompt }`);
        const res = await fetch(
          `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${process.env.NEXT_PUBLIC_SANITY_DATASET}?query=${query}`
        );
        if (res.ok) {
          const data = await res.json();
          const result = data.result || {};
          setSettings(result);
          setChatbotEnabled(result.chatbotEnabled !== false);
          setSystemPrompt(result.chatbotSystemPrompt || "");
        }
      } catch (err) {
        console.error("Failed to fetch chatbot settings", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        mutations: [
          {
            createIfNotExists: {
              _id: "siteSettings",
              _type: "siteSettings",
            },
          },
          {
            patch: {
              id: "siteSettings",
              set: {
                chatbotEnabled,
                chatbotSystemPrompt: systemPrompt || "",
              },
            },
          },
        ],
      };

      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Chatbot settings saved successfully!");
      } else {
        alert(`Failed to save: ${data.message || data.error || "Unknown error"}`);
      }
    } catch {
      alert("Error saving chatbot settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim() || isTesting) return;

    const userMessage = testInput.trim();
    setTestInput("");
    setTestMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsTesting(true);

    try {
      const history = testMessages
        .map((m) => ({ role: m.role === "user" ? "user" : "model", text: m.text }))
        .concat({ role: "user", text: userMessage });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      } else {
        setTestMessages((prev) => [...prev, { role: "bot", text: data.message || "Error getting response." }]);
      }
    } catch {
      setTestMessages((prev) => [...prev, { role: "bot", text: "Error connecting to API." }]);
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <div className="w-8 h-8 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
        <p className="mt-4 text-xs font-bold text-brand-dark/50 uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-brand-offwhite">
      {/* Header */}
      <header className="h-20 shrink-0 border-b border-brand-dark/10 bg-brand-white px-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter text-brand-dark">Chatbot</h1>
          <p className="text-sm font-sans text-brand-dark/60 font-medium">Manage the AI chat widget that appears on your website.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-blue hover:bg-brand-blue/90 shadow-sm disabled:opacity-50 transition-all text-sm"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Settings */}
          <div className="flex flex-col gap-6">
            {/* Toggle */}
            <div className="bg-brand-white rounded-2xl border border-brand-dark/10 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest">Chat Widget</h2>
                  <p className="text-xs text-brand-dark/60 font-medium mt-1">
                    Show or hide the floating chat button on all pages.
                  </p>
                </div>
                <button
                  onClick={() => setChatbotEnabled(!chatbotEnabled)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 ${
                    chatbotEnabled ? "bg-brand-blue" : "bg-brand-dark/20"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                      chatbotEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className={`mt-4 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-center ${chatbotEnabled ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {chatbotEnabled ? "● Active — Chat is visible to visitors" : "● Disabled — Chat is hidden from visitors"}
              </div>
            </div>

            {/* System Prompt */}
            <div className="bg-brand-white rounded-2xl border border-brand-dark/10 shadow-sm p-6">
              <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-1">System Prompt</h2>
              <p className="text-xs text-brand-dark/60 font-medium mb-4">
                Customise the AI personality and what it knows. Leave blank to use the built-in travel guide prompt.
              </p>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder={DEFAULT_SYSTEM_PROMPT}
                rows={14}
                className="w-full bg-brand-offwhite/50 border border-brand-dark/10 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all resize-y leading-relaxed"
              />
              {systemPrompt && (
                <button
                  onClick={() => setSystemPrompt("")}
                  className="mt-2 text-xs text-brand-blue hover:text-brand-dark font-bold uppercase tracking-widest transition-colors"
                >
                  Reset to Default
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Test */}
          <div className="bg-brand-white rounded-2xl border border-brand-dark/10 shadow-sm flex flex-col overflow-hidden">
            <div className="bg-brand-dark p-4 flex items-center gap-3 text-brand-white shrink-0">
              <div className="bg-brand-white/20 w-8 h-8 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-bold uppercase tracking-wider text-sm">Live Test</h3>
                <p className="text-[10px] text-brand-white/60 uppercase tracking-widest font-sans">
                  {isTesting ? "AI is typing..." : "Test your chatbot here"}
                </p>
              </div>
              <button
                onClick={() =>
                  setTestMessages([{ role: "bot", text: "Hi! I'm the chatbot preview. Send a message to test the AI." }])
                }
                className="ml-auto text-xs text-brand-white/60 hover:text-brand-white font-bold uppercase tracking-widest transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#f8f9fa] min-h-[400px] max-h-[500px]">
              {testMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm font-sans leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-brand-blue text-brand-white rounded-br-sm"
                        : "bg-brand-white text-brand-dark border border-brand-dark/5 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTesting && (
                <div className="flex justify-start">
                  <div className="bg-brand-white border border-brand-dark/5 rounded-2xl rounded-bl-sm p-3 shadow-sm flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-brand-dark/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-brand-dark/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-brand-dark/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={testEndRef} />
            </div>

            <form onSubmit={handleTestSend} className="p-3 border-t border-brand-dark/10 bg-brand-white flex gap-2 shrink-0">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Test a message..."
                disabled={isTesting}
                className="flex-1 bg-brand-offwhite border border-brand-dark/10 rounded-full px-5 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isTesting || !testInput.trim()}
                className="bg-brand-blue hover:bg-brand-dark disabled:bg-brand-dark/30 text-brand-white w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 shadow-md disabled:shadow-none"
              >
                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
