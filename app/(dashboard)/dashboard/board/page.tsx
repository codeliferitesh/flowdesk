"use client";
import { useState } from "react";
import { Plus, Trash2, Edit3, GripVertical, X, Check } from "lucide-react";
import { cn } from "@/utils";
import { nanoid } from "nanoid";
import { toast } from "sonner";

interface Card {
  id: string;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
}
interface Column {
  id: string;
  title: string;
  color: string;
  cards: Card[];
}

const INITIAL_COLUMNS: Column[] = [
  { id: "backlog", title: "Backlog", color: "#94a3b8", cards: [
    { id: nanoid(), title: "Research competitors", description: "Analyze top 5 competitors" },
    { id: nanoid(), title: "Setup analytics", priority: "medium" },
  ]},
  { id: "todo", title: "Todo", color: "#6366f1", cards: [
    { id: nanoid(), title: "Design new dashboard", description: "Figma mockups first", priority: "high" },
    { id: nanoid(), title: "Write unit tests", priority: "low" },
  ]},
  { id: "progress", title: "In Progress", color: "#f59e0b", cards: [
    { id: nanoid(), title: "Build API integration", priority: "high" },
  ]},
  { id: "done", title: "Done", color: "#22c55e", cards: [
    { id: nanoid(), title: "Project setup", description: "Initialized Next.js project" },
  ]},
];

const PRIORITY_COLORS = { low: "bg-blue-100 text-blue-700", medium: "bg-amber-100 text-amber-700", high: "bg-rose-100 text-rose-700" };

export default function BoardPage() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [dragging, setDragging] = useState<{ cardId: string; colId: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [newCardCol, setNewCardCol] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newColName, setNewColName] = useState("");
  const [addingCol, setAddingCol] = useState(false);

  const addCard = (colId: string) => {
    if (!newCardTitle.trim()) return;
    setColumns(cols => cols.map(c => c.id === colId
      ? { ...c, cards: [...c.cards, { id: nanoid(), title: newCardTitle }] } : c));
    setNewCardTitle("");
    setNewCardCol(null);
    toast.success("Card added");
  };

  const deleteCard = (colId: string, cardId: string) => {
    setColumns(cols => cols.map(c => c.id === colId
      ? { ...c, cards: c.cards.filter(card => card.id !== cardId) } : c));
  };

  const addColumn = () => {
    if (!newColName.trim()) return;
    const colors = ["#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];
    setColumns(cols => [...cols, { id: nanoid(), title: newColName, color: colors[cols.length % colors.length], cards: [] }]);
    setNewColName("");
    setAddingCol(false);
  };

  const deleteColumn = (colId: string) => {
    setColumns(cols => cols.filter(c => c.id !== colId));
  };

  const onDragStart = (cardId: string, colId: string) => setDragging({ cardId, colId });
  const onDragOver = (e: React.DragEvent, colId: string) => { e.preventDefault(); setDragOver(colId); };
  const onDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    if (!dragging) return;
    if (dragging.colId === targetColId) { setDragging(null); setDragOver(null); return; }
    setColumns(cols => {
      const srcCol = cols.find(c => c.id === dragging.colId)!;
      const card = srcCol.cards.find(c => c.id === dragging.cardId)!;
      return cols.map(c => {
        if (c.id === dragging.colId) return { ...c, cards: c.cards.filter(cc => cc.id !== dragging.cardId) };
        if (c.id === targetColId) return { ...c, cards: [...c.cards, card] };
        return c;
      });
    });
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in h-full">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Kanban Board</h1>
        <button onClick={() => setAddingCol(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Column</span>
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin min-h-[70vh]">
        {columns.map(col => (
          <div
            key={col.id}
            className={cn("flex-shrink-0 w-72 flex flex-col rounded-2xl bg-[hsl(var(--muted))] p-3 transition-colors",
              dragOver === col.id && "ring-2 ring-brand-500")}
            onDragOver={(e) => onDragOver(e, col.id)}
            onDrop={(e) => onDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className="font-display font-semibold text-sm">{col.title}</h3>
                <span className="text-xs bg-[hsl(var(--surface))] px-2 py-0.5 rounded-full font-medium">{col.cards.length}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setNewCardCol(col.id)} className="p-1 rounded-lg hover:bg-[hsl(var(--surface))] transition-colors">
                  <Plus className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                </button>
                <button onClick={() => deleteColumn(col.id)} className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                  <X className="w-3.5 h-3.5 text-rose-500" />
                </button>
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-2 min-h-16">
              {col.cards.map(card => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => onDragStart(card.id, col.id)}
                  className={cn("bg-[hsl(var(--surface))] rounded-xl p-3 shadow-card cursor-grab active:cursor-grabbing group hover:shadow-md transition-all",
                    dragging?.cardId === card.id && "opacity-50")}
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{card.title}</p>
                      {card.description && <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">{card.description}</p>}
                      {card.priority && (
                        <span className={cn("text-xs px-2 py-0.5 rounded-full mt-1.5 inline-block font-medium", PRIORITY_COLORS[card.priority])}>
                          {card.priority}
                        </span>
                      )}
                    </div>
                    <button onClick={() => deleteCard(col.id, card.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all flex-shrink-0">
                      <Trash2 className="w-3 h-3 text-rose-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add card */}
            {newCardCol === col.id ? (
              <div className="mt-2">
                <input
                  autoFocus
                  value={newCardTitle}
                  onChange={e => setNewCardTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addCard(col.id); if (e.key === "Escape") setNewCardCol(null); }}
                  placeholder="Card title..."
                  className="input text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => addCard(col.id)} className="btn-primary text-xs py-1.5 flex-1">Add</button>
                  <button onClick={() => setNewCardCol(null)} className="btn-ghost text-xs py-1.5">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setNewCardCol(col.id)}
                className="mt-2 w-full text-xs text-[hsl(var(--muted-foreground))] py-2 rounded-xl hover:bg-[hsl(var(--surface))] transition-colors flex items-center justify-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add card
              </button>
            )}
          </div>
        ))}

        {/* Add column */}
        {addingCol ? (
          <div className="flex-shrink-0 w-72 p-3 rounded-2xl border-2 border-dashed border-[hsl(var(--border))]">
            <input autoFocus value={newColName} onChange={e => setNewColName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addColumn(); if (e.key === "Escape") setAddingCol(false); }}
              placeholder="Column name..." className="input text-sm mb-2" />
            <div className="flex gap-2">
              <button onClick={addColumn} className="btn-primary text-xs py-1.5 flex-1">Create</button>
              <button onClick={() => setAddingCol(false)} className="btn-ghost text-xs py-1.5">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingCol(true)}
            className="flex-shrink-0 w-72 rounded-2xl border-2 border-dashed border-[hsl(var(--border))] flex items-center justify-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:border-brand-500 hover:text-brand-500 transition-colors">
            <Plus className="w-4 h-4" /> Add Column
          </button>
        )}
      </div>
    </div>
  );
}
