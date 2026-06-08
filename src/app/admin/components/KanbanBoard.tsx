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

function DraggableLead({ lead }: { lead: any }) {
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
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-brand-dark/5">
        <span className="text-xs font-bold text-brand-dark">₹{lead.totalPrice ? lead.totalPrice.toLocaleString() : "TBD"}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/50">
          {lead.travelDate ? new Date(lead.travelDate).toLocaleDateString() : "No Date"}
        </span>
      </div>
    </div>
  );
}

function DroppableColumn({ stage, leads }: { stage: string; leads: any[] }) {
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
          <DraggableLead key={lead._id} lead={lead} />
        ))}
      </div>
    </div>
  );
}

export default function KanbanBoard({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads || []);

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
                // Map legacy "Pending" status to "New Lead"
                if (stage === "New Lead" && currentStatus === "Pending") return true;
                return currentStatus === stage;
              })}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
