"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { todoService } from "@/services/todo.service";
import { noteService } from "@/services/notes.service";
import type { Todo, Note } from "@/types";
import { CheckSquare, StickyNote, TrendingUp, Calendar, ArrowRight, Circle, CheckCircle2 } from "lucide-react";
import { formatDate, isOverdue } from "@/utils";
import { cn } from "@/utils";
import { PRIORITY_CONFIG } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubTodos = todoService.subscribe(user.uid, setTodos);
    const unsubNotes = noteService.subscribe(user.uid, setNotes);
    return () => { unsubTodos(); unsubNotes(); };
  }, [user]);

  const completed = todos.filter(t => t.completed).length;
  const pending = todos.filter(t => !t.completed).length;
  const overdue = todos.filter(t => !t.completed && t.dueDate && isOverdue(t.dueDate.toDate())).length;
  const todayTodos = todos.filter(t => !t.completed).slice(0, 5);
  const pinnedNotes = notes.filter(n => n.pinned).slice(0, 3);

  const stats = [
    { label: "Total Tasks", value: todos.length, icon: CheckSquare, color: "text-brand-500", bg: "bg-brand-500/10" },
    { label: "Completed", value: completed, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending", value: pending, icon: Circle, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Notes", value: notes.length, icon: StickyNote, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">
          {greeting}, {user?.displayName?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          {overdue > 0 && <span className="ml-2 text-rose-500 font-medium">· {overdue} overdue</span>}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 hover:shadow-md transition-shadow duration-200">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", bg)}>
              <Icon className={cn("w-5 h-5", color)} />
            </div>
            <p className="font-display text-2xl font-bold">{value}</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      {todos.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold">Today&apos;s Progress</h2>
            <span className="text-sm text-[hsl(var(--muted-foreground))]">{completed}/{todos.length}</span>
          </div>
          <div className="h-2.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${todos.length ? (completed / todos.length) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
            {todos.length > 0 ? Math.round((completed / todos.length) * 100) : 0}% complete
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Todos */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-brand-500" /> Tasks
            </h2>
            <Link href="/dashboard/todos" className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {todayTodos.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-brand-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">All caught up! 🎉</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {todayTodos.map(todo => (
                <li key={todo.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[hsl(var(--muted))] transition-colors group">
                  <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", PRIORITY_CONFIG[todo.priority].color.replace("text-", "bg-"))} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{todo.title}</p>
                    {todo.dueDate && (
                      <p className={cn("text-xs mt-0.5", isOverdue(todo.dueDate.toDate()) ? "text-rose-500" : "text-[hsl(var(--muted-foreground))]")}>
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDate(todo.dueDate.toDate())}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pinned Notes */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-purple-500" /> Pinned Notes
            </h2>
            <Link href="/dashboard/notes" className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {pinnedNotes.length === 0 ? (
            <div className="text-center py-8">
              <StickyNote className="w-10 h-10 text-purple-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-[hsl(var(--muted-foreground))]">No pinned notes yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pinnedNotes.map(note => (
                <div key={note.id} className="p-3 rounded-xl text-sm" style={{ backgroundColor: note.color + "80" }}>
                  <p className="font-medium truncate">{note.title || "Untitled"}</p>
                  <p className="text-xs mt-0.5 line-clamp-2 text-gray-700">{note.content || "No content"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
