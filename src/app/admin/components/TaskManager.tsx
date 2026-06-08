"use client";

import React, { useState } from "react";

export default function TaskManager({ initialTasks }: { initialTasks: any[] }) {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleToggle = async (taskId: string, currentStatus: boolean) => {
    setTasks(tasks.map(t => t._id === taskId ? { ...t, isCompleted: !currentStatus } : t));
    
    try {
      await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutations: [{ patch: { id: taskId, set: { isCompleted: !currentStatus } } }]
        })
      });
    } catch (e) {
      // Rollback on error
      setTasks(tasks.map(t => t._id === taskId ? { ...t, isCompleted: currentStatus } : t));
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const newTask = {
      _id: tempId,
      _type: "agentTask",
      title: newTaskTitle,
      isCompleted: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");

    try {
      const res = await fetch("/api/admin/mutate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mutations: [{ create: { _type: "agentTask", title: newTaskTitle, isCompleted: false } }]
        })
      });
      // Replace temp ID if needed, but not strictly necessary for simple demo
    } catch (e) {
      setTasks(tasks.filter(t => t._id !== tempId));
      alert("Failed to create task");
    }
  };

  const pendingCount = tasks.filter(t => !t.isCompleted).length;

  return (
    <div className="bg-brand-white border border-brand-dark/10 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark">Agent Tasks</h3>
          <p className="text-xs font-medium text-brand-dark/60">{pendingCount} pending task{pendingCount !== 1 && "s"}</p>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-2 bg-brand-offwhite border border-brand-dark/10 rounded-lg text-sm focus:outline-none focus:border-brand-blue"
        />
        <button type="submit" className="px-4 py-2 bg-brand-dark text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-brand-blue transition-colors">
          Add
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-[200px]">
        {tasks.length === 0 ? (
          <div className="text-center text-xs font-medium text-brand-dark/40 py-8">
            No tasks found. You're all caught up!
          </div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="flex items-start gap-3 p-3 hover:bg-brand-offwhite rounded-lg transition-colors group">
              <button 
                onClick={() => handleToggle(task._id, task.isCompleted)}
                className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-brand-dark/30 text-transparent hover:border-brand-blue'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </button>
              <div className="flex-1">
                <p className={`text-sm font-semibold transition-colors ${task.isCompleted ? 'text-brand-dark/40 line-through' : 'text-brand-dark'}`}>
                  {task.title}
                </p>
                {task.relatedLead && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-blue mt-1">
                    Related: {task.relatedLead.customerName}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
