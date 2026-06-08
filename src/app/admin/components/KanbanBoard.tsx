"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";

const STAGES = ["New Lead", "Contacted", "Designing Trip", "Booked", "Completed", "Cancelled"];

const STAGE_COLORS: Record<string, string> = {
  "New Lead": "bg-blue-100 text-blue-800 border-blue-200",
  "Contacted": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Designing Trip": "bg-purple-100 text-purple-800 border-purple-200",
  "Booked": "bg-green-100 text-green-800 border-green-200",
  "Completed": "bg-gray-100 text-gray-800 border-gray-200",
  "Cancelled": "bg-red-100 text-red-800 border-red-200",
};

import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function DraggableLead({ lead, onSelect }: { lead: any, onSelect: (lead: any) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead._id,
    data: { lead },
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 rounded-xl border bg-white shadow-sm cursor-grab active:cursor-grabbing mb-3 group hover:border-brand-blue transition-colors ${isDragging ? "opacity-50 z-50 ring-2 ring-brand-blue" : "border-brand-dark/10"}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold text-brand-dark">{lead.customerName}</h4>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-dark/40">{lead.travelers} Pax</span>
      </div>
      <p className="text-xs font-medium text-brand-dark/60 mb-3 truncate">{lead.email}</p>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-brand-dark/5 mb-2">
        <span className="text-xs font-bold text-brand-dark">₹{lead.totalPrice ? lead.totalPrice.toLocaleString() : "TBD"}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50">
          {lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "No Date"}
        </span>
      </div>
      
      <button 
        type="button"
        onPointerDown={(e) => e.stopPropagation()} // prevent drag when clicking button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(lead);
        }}
        className="w-full py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-blue border border-brand-blue/20 rounded-lg hover:bg-brand-blue hover:text-white transition-colors"
      >
        View Details
      </button>
    </div>
  );
}

function DroppableColumn({ stage, leads, onSelectLead }: { stage: string; leads: any[]; onSelectLead: (lead: any) => void }) {
  const { isOver, setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 shrink-0 rounded-2xl border p-4 transition-colors ${
        isOver ? "bg-brand-blue/5 border-brand-blue border-dashed" : "bg-brand-offwhite/50 border-brand-dark/5"
      }`}
    >
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${STAGE_COLORS[stage] || "bg-gray-100"}`}>
          {stage}
        </h3>
        <span className="text-xs font-bold text-brand-dark/40">{leads.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-[300px]">
        {leads.map((lead) => (
          <DraggableLead key={lead._id} lead={lead} onSelect={() => onSelectLead(lead)} />
        ))}
      </div>
    </div>
  );
}

export default function KanbanBoard({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads || []);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const handleUpdateNotes = async (newNotes: string) => {
    if (!selectedLead) return;
    
    const oldLead = { ...selectedLead };
    const updatedLead = { ...selectedLead, agentNotes: newNotes };
    
    setSelectedLead(updatedLead);
    setLeads(leads.map(l => l._id === updatedLead._id ? updatedLead : l));

    try {
      await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutations: [{ patch: { id: updatedLead._id, set: { agentNotes: newNotes } } }]
        })
      });
    } catch (e) {
      setSelectedLead(oldLead);
      setLeads(leads.map(l => l._id === oldLead._id ? oldLead : l));
      alert("Failed to save notes");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.data.current?.lead) {
      const leadId = active.id as string;
      const newStage = over.id as string;
      const oldStage = active.data.current.lead.status;

      if (newStage === oldStage) return;

      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStage } : l))
      );

      // Mutate in Sanity
      try {
        const res = await fetch("/api/admin/mutate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mutations: [{ patch: { id: leadId, set: { status: newStage } } }]
          })
        });
        if (!res.ok) throw new Error("Mutation failed");
      } catch (e) {
        // Rollback
        setLeads((prev) =>
          prev.map((l) => (l._id === leadId ? { ...l, status: oldStage } : l))
        );
        alert("Failed to update lead status");
      }
    }
  };

  return (
    <div className="bg-brand-white border border-brand-dark/10 rounded-2xl shadow-sm overflow-hidden flex flex-col mb-12">
      <div className="p-6 border-b border-brand-dark/10 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold uppercase tracking-wider text-brand-dark">Lead Pipeline</h3>
          <p className="text-xs font-medium text-brand-dark/60">Drag and drop leads to update their status.</p>
        </div>
      </div>
      
      <div className="p-6 overflow-x-auto flex gap-6 pb-8">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {STAGES.map((stage) => (
            <DroppableColumn
              key={stage}
              stage={stage}
              leads={leads.filter((l) => {
                const currentStatus = l.status || "New Lead";
                if (stage === "New Lead" && currentStatus === "Pending") return true;
                return currentStatus === stage;
              })}
              onSelectLead={(l) => setSelectedLead(l)}
            />
          ))}
        </DndContext>
      </div>

      {/* LEAD DETAILS MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-brand-dark/10">
            <button 
              onClick={() => setSelectedLead(null)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-brand-offwhite text-brand-dark/50 hover:text-brand-dark hover:bg-brand-dark/5 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div className="p-8">
              <div className="mb-8 border-b border-brand-dark/10 pb-6">
                <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border mb-4 ${STAGE_COLORS[selectedLead.status || "New Lead"] || "bg-gray-100"}`}>
                  {selectedLead.status || "New Lead"}
                </span>
                <h2 className="text-3xl font-heading font-black uppercase tracking-tight text-brand-dark mb-1">
                  {selectedLead.customerName}
                </h2>
                <div className="flex gap-4 text-xs font-semibold text-brand-dark/60">
                  <span>Created: {new Date(selectedLead._createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-widest border-b border-brand-dark/10 pb-2 mb-4">Contact Info</h3>
                  <div className="space-y-3 text-sm">
                    <p><span className="font-bold text-brand-dark/60 inline-block w-20">Email:</span> <a href={`mailto:${selectedLead.email}`} className="text-brand-blue hover:underline font-semibold">{selectedLead.email}</a></p>
                    <p><span className="font-bold text-brand-dark/60 inline-block w-20">Phone:</span> <a href={`tel:${selectedLead.phone}`} className="text-brand-blue hover:underline font-semibold">{selectedLead.phone}</a></p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-widest border-b border-brand-dark/10 pb-2 mb-4">Trip Details</h3>
                  <div className="space-y-3 text-sm">
                    <p><span className="font-bold text-brand-dark/60 inline-block w-24">Travel Date:</span> <span className="font-semibold">{selectedLead.travelDate ? new Date(selectedLead.travelDate).toLocaleDateString() : "N/A"}</span></p>
                    <p><span className="font-bold text-brand-dark/60 inline-block w-24">Travelers:</span> <span className="font-semibold">{selectedLead.travelers} Pax</span></p>
                    <p><span className="font-bold text-brand-dark/60 inline-block w-24">Duration:</span> <span className="font-semibold">{selectedLead.durationDays} Days</span></p>
                    <p><span className="font-bold text-brand-dark/60 inline-block w-24">Budget:</span> <span className="font-semibold text-brand-blue">₹{selectedLead.totalPrice ? selectedLead.totalPrice.toLocaleString() : "N/A"}</span></p>
                  </div>
                </div>
              </div>

              {selectedLead.notes && (
                <div className="mb-8 bg-brand-offwhite p-4 rounded-xl border border-brand-dark/5">
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-widest mb-2">Customer Special Requests / Notes</h3>
                  <p className="text-sm text-brand-dark/80 italic">"{selectedLead.notes}"</p>
                </div>
              )}

              <div>
                <h3 className="text-xs font-black text-brand-dark uppercase tracking-widest mb-2">Internal Agent Notes</h3>
                <textarea 
                  value={selectedLead.agentNotes || ""}
                  onChange={(e) => setSelectedLead({...selectedLead, agentNotes: e.target.value})}
                  onBlur={(e) => handleUpdateNotes(e.target.value)}
                  className="w-full h-32 px-4 py-3 rounded-xl border border-brand-dark/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                  placeholder="Private notes for agents (e.g. Needs wheelchair access, vegetarian)... This saves automatically when you click outside."
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
