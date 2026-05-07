"use client";
import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { todoService } from "@/services/todo.service";
import { categoryService } from "@/services/category.service";
import type { Todo, Category, Priority } from "@/types";
import { PRIORITY_CONFIG } from "@/types";
import { toast } from "sonner";
import { cn, formatDate, isOverdue } from "@/utils";
import {
  Plus, Trash2, CheckCircle2, Circle, Calendar, Tag, Filter,
  Search, Edit3, X, ChevronDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
  categoryId: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function TodosPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterCompleted, setFilterCompleted] = useState<"all" | "pending" | "done">("all");

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "medium" },
  });

  useEffect(() => {
    if (!user) return;
    const u1 = todoService.subscribe(user.uid, setTodos);
    const u2 = categoryService.subscribe(user.uid, setCategories);
    return () => { u1(); u2(); };
  }, [user]);

  const filtered = todos.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchCompleted = filterCompleted === "all" || (filterCompleted === "done" ? t.completed : !t.completed);
    return matchSearch && matchPriority && matchCompleted;
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    try {
      const dueDate = data.dueDate ? Timestamp.fromDate(new Date(data.dueDate)) : undefined;
      const payload = {
        title: data.title,
        description: data.description,
        priority: data.priority as Priority,
        dueDate,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        categoryId: data.categoryId,
      };
      if (editId) {
        await todoService.update(editId, payload);
        toast.success("Task updated");
      } else {
        await todoService.create(user.uid, {
          title: data.title,
          description: data.description,
          priority: data.priority as Priority,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
          categoryId: data.categoryId,
          order: Date.now(),
        });
        toast.success("Task created");
      }
      reset({ priority: "medium" });
      setShowForm(false);
      setEditId(null);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await todoService.toggle(id, !completed);
  };

  const handleDelete = async (id: string) => {
    await todoService.delete(id);
    toast.success("Task deleted");
  };

  const startEdit = (todo: Todo) => {
    setEditId(todo.id);
    setValue("title", todo.title);
    setValue("description", todo.description ?? "");
    setValue("priority", todo.priority);
    setValue("tags", todo.tags.join(", "));
    setValue("categoryId", todo.categoryId ?? "");
    if (todo.dueDate) setValue("dueDate", todo.dueDate.toDate().toISOString().split("T")[0]);
    setShowForm(true);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Todos</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); reset({ priority: "medium" }); }}
          className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">{editId ? "Edit Task" : "New Task"}</h2>
            <button onClick={() => { setShowForm(false); setEditId(null); reset({ priority: "medium" }); }}>
              <X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input {...register("title")} placeholder="Task title" className="input" />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
            </div>
            <textarea {...register("description")} placeholder="Description (optional)" rows={2} className="input resize-none" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Priority</label>
                <select {...register("priority")} className="input">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Due Date</label>
                <input {...register("dueDate")} type="date" className="input" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-1 block">Category</label>
                <select {...register("categoryId")} className="input">
                  <option value="">None</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <input {...register("tags")} placeholder="Tags (comma separated)" className="input" />
            <div className="flex gap-3">
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                {isSubmitting ? "Saving..." : editId ? "Update Task" : "Create Task"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="input pl-10" />
        </div>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value as Priority | "all")} className="input w-auto">
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={filterCompleted} onChange={e => setFilterCompleted(e.target.value as "all" | "pending" | "done")} className="input w-auto">
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="done">Completed</option>
        </select>
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 card">
            <CheckCircle2 className="w-12 h-12 text-brand-500 mx-auto mb-3 opacity-40" />
            <p className="font-display font-semibold text-lg">No tasks found</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Create a new task to get started</p>
          </div>
        ) : filtered.map(todo => (
          <div key={todo.id}
            className={cn("card p-4 flex items-start gap-3 group hover:shadow-md transition-all duration-200",
              todo.completed && "opacity-60")}>
            <button onClick={() => handleToggle(todo.id, todo.completed)} className="mt-0.5 flex-shrink-0">
              {todo.completed
                ? <CheckCircle2 className="w-5 h-5 text-brand-500" />
                : <Circle className="w-5 h-5 text-[hsl(var(--muted-foreground))] hover:text-brand-500 transition-colors" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn("font-medium", todo.completed && "line-through text-[hsl(var(--muted-foreground))]")}>
                {todo.title}
              </p>
              {todo.description && <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-1">{todo.description}</p>}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", PRIORITY_CONFIG[todo.priority].bg, PRIORITY_CONFIG[todo.priority].color)}>
                  {PRIORITY_CONFIG[todo.priority].label}
                </span>
                {todo.dueDate && (
                  <span className={cn("text-xs flex items-center gap-1", isOverdue(todo.dueDate.toDate()) && !todo.completed ? "text-rose-500" : "text-[hsl(var(--muted-foreground))]")}>
                    <Calendar className="w-3 h-3" />{formatDate(todo.dueDate.toDate())}
                  </span>
                )}
                {todo.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs bg-[hsl(var(--muted))] px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(todo)} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors">
                <Edit3 className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              </button>
              <button onClick={() => handleDelete(todo.id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                <Trash2 className="w-4 h-4 text-rose-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
