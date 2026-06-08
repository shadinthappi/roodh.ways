"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AILog {
  _id: string;
  feature: string;
  prompt: string;
  response: string;
  isApprovedKnowledge: boolean;
  _createdAt: string;
}

export default function AILogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AILog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
      const ds = process.env.NEXT_PUBLIC_SANITY_DATASET;
      const query = encodeURIComponent(`*[_type == "aiLog"] | order(_createdAt desc) { _id, feature, prompt, response, isApprovedKnowledge, _createdAt }`);
      const res = await fetch(`https://${pid}.api.sanity.io/v2023-01-01/data/query/${ds}?query=${query}`);
      
      if (res.ok) {
        const data = await res.json();
        setLogs(data.result || []);
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const mutations = [{ patch: { id, set: { isApprovedKnowledge: !currentStatus } } }];
      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations }),
      });

      if (res.ok) {
        setLogs(prev => prev.map(log => log._id === id ? { ...log, isApprovedKnowledge: !currentStatus } : log));
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm("Delete this log permanently?")) return;
    setUpdatingId(id);
    try {
      const mutations = [{ delete: { id } }];
      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations }),
      });

      if (res.ok) {
        setLogs(prev => prev.filter(log => log._id !== id));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-brand-offwhite">
      {/* Header */}
      <header className="h-20 shrink-0 border-b border-brand-dark/10 bg-brand-white px-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter text-brand-dark">AI Knowledge Base</h1>
          <p className="text-sm font-sans text-brand-dark/60 font-medium">
            Review AI interactions and approve them to teach the AI how to respond in the future.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
              <p className="mt-4 text-xs font-bold text-brand-dark/50 uppercase tracking-widest">Loading Logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-brand-white rounded-2xl border border-brand-dark/10 p-12 text-center">
              <h3 className="font-heading font-bold text-xl text-brand-dark mb-2">No AI logs yet</h3>
              <p className="text-brand-dark/60 font-sans text-sm">Once users interact with the Chatbot or Trip Planner, their queries will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {logs.map((log) => (
                <div key={log._id} className={`bg-brand-white rounded-2xl border transition-all shadow-sm overflow-hidden flex flex-col ${log.isApprovedKnowledge ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-brand-dark/10'}`}>
                  <div className="bg-brand-offwhite/50 px-5 py-3 border-b border-brand-dark/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${log.feature === 'Chatbot' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {log.feature}
                      </span>
                      <span className="text-xs font-sans text-brand-dark/50">
                        {new Date(log._createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleApproval(log._id, log.isApprovedKnowledge)}
                        disabled={updatingId === log._id}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                          log.isApprovedKnowledge 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                            : 'bg-brand-offwhite text-brand-dark/60 hover:bg-brand-dark/10 border border-brand-dark/10'
                        } ${updatingId === log._id ? 'opacity-50' : ''}`}
                      >
                        {log.isApprovedKnowledge ? '⭐ Knowledge Approved' : 'Mark as Knowledge'}
                      </button>
                      <button 
                        onClick={() => deleteLog(log._id)}
                        disabled={updatingId === log._id}
                        className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete log"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-2">User Prompt</h4>
                      <div className="bg-[#f8f9fa] border border-brand-dark/5 rounded-xl p-3.5 text-sm font-sans text-brand-dark whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {log.prompt}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 mb-2">AI Response</h4>
                      <div className="bg-[#f8f9fa] border border-brand-dark/5 rounded-xl p-3.5 text-sm font-sans text-brand-dark whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {log.response}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
