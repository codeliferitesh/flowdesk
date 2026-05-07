"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { noteService } from "@/services/notes.service";
import type { Note } from "@/types";
import { NOTE_COLORS } from "@/types";
import { toast } from "sonner";
import { cn } from "@/utils";
import { Plus, Pin, Archive, Trash2, Search, X, Edit3, Check } from "lucide-react";

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", content: "", color: NOTE_COLORS[0] });

  useEffect(() => {
    if (!user) return;
    return noteService.subscribe(user.uid, setNotes);
  }, [user]);

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter(n => n.pinned);
  const unpinned = filtered.filter(n => !n.pinned);

  const handleSave = async () => {
    if (!user || !form.title.trim()) return;
    try {
      if (editNote) {
        await noteService.update(editNote.id, form);
        toast.success("Note updated");
      } else {
        await noteService.create(user.uid, form);
        toast.success("Note created");
      }
      setForm({ title: "", content: "", color: NOTE_COLORS[0] });
      setShowForm(false);
      setEditNote(null);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const startEdit = (note: Note) => {
    setEditNote(note);
    setForm({ title: note.title, content: note.content, color: note.color });
    setShowForm(true);
  };

  const NoteCard = ({ note }: { note: Note }) => (
    <div className="rounded-2xl p-4 shadow-card group relative flex flex-col gap-2 hover:shadow-md transition-shadow duration-200 break-inside-avoid"
      style={{ backgroundColor: note.color }}>
      {note.pinned && <Pin className="w-3.5 h-3.5 text-amber-600 absolute top-3 right-3" />}
      {note.title && <p className="font-display font-semibold text-gray-800 text-sm leading-tight">{note.title}</p>}
      {note.content && <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
        <button onClick={() => noteService.pin(note.id, !note.pinned)} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors" title={note.pinned ? "Unpin" : "Pin"}>
          <Pin className={cn("w-3.5 h-3.5", note.pinned ? "text-amber-600" : "text-gray-600")} />
        </button>
        <button onClick={() => startEdit(note)} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors">
          <Edit3 className="w-3.5 h-3.5 text-gray-600" />
        </button>
        <button onClick={() => noteService.archive(note.id).then(() => toast.success("Archived"))} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors">
          <Archive className="w-3.5 h-3.5 text-gray-600" />
        </button>
        <button onClick={() => noteService.delete(note.id).then(() => toast.success("Deleted"))} className="p-1.5 rounded-lg hover:bg-black/10 transition-colors">
          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Notes</h1>
        <button onClick={() => { setShowForm(!showForm); setEditNote(null); setForm({ title: "", content: "", color: NOTE_COLORS[0] }); }}
          className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Note</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="rounded-2xl p-5 shadow-card animate-slide-up" style={{ backgroundColor: form.color }}>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Title"
            className="w-full bg-transparent border-none outline-none font-display font-semibold text-gray-800 text-lg placeholder:text-gray-500 mb-2"
          />
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="Take a note..."
            rows={4}
            className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-500 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              {NOTE_COLORS.map(color => (
                <button key={color} onClick={() => setForm(f => ({ ...f, color }))}
                  className={cn("w-6 h-6 rounded-full border-2 transition-transform hover:scale-110", form.color === color ? "border-gray-700 scale-110" : "border-transparent")}
                  style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setShowForm(false); setEditNote(null); }} className="p-2 rounded-lg hover:bg-black/10">
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={handleSave} disabled={!form.title.trim()} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800/80 text-white text-sm rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-colors">
                <Check className="w-3.5 h-3.5" /> {editNote ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..." className="input pl-10" />
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-purple-500" />
          </div>
          <p className="font-display font-semibold text-lg">No notes yet</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Create your first note</p>
        </div>
      ) : (
        <div>
          {pinned.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Pin className="w-3 h-3" /> Pinned
              </p>
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {pinned.map(note => <NoteCard key={note.id} note={note} />)}
              </div>
            </div>
          )}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-3">Others</p>}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {unpinned.map(note => <NoteCard key={note.id} note={note} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
