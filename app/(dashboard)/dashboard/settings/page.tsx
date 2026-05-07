"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types";
import { toast } from "sonner";
import { Plus, Trash2, Moon, Sun, Monitor } from "lucide-react";

const CAT_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#6366f1", "#a855f7", "#ec4899"];

export default function SettingsPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState(CAT_COLORS[0]);
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    if (!user) return;
    return categoryService.subscribe(user.uid, setCategories);
  }, [user]);

  useEffect(() => {
    setTheme(localStorage.getItem("theme") ?? "system");
  }, []);

  const handleAddCategory = async () => {
    if (!user || !catName.trim()) return;
    await categoryService.create(user.uid, catName, catColor);
    setCatName("");
    toast.success("Category created");
  };

  const handleThemeChange = (t: string) => {
    setTheme(t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (t === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      localStorage.removeItem("theme");
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-brand-500/20 rounded-2xl flex items-center justify-center text-brand-600 font-bold text-xl">
            {user?.displayName?.[0] ?? user?.email?.[0] ?? "U"}
          </div>
          <div>
            <p className="font-semibold">{user?.displayName ?? "User"}</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold">Appearance</h2>
        <div className="flex gap-3">
          {[
            { value: "light", icon: Sun, label: "Light" },
            { value: "dark", icon: Moon, label: "Dark" },
            { value: "system", icon: Monitor, label: "System" },
          ].map(({ value, icon: Icon, label }) => (
            <button key={value} onClick={() => handleThemeChange(value)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
                theme === value ? "border-brand-500 bg-brand-500/5" : "border-[hsl(var(--border))] hover:border-brand-500/40"
              }`}>
              <Icon className={`w-5 h-5 ${theme === value ? "text-brand-500" : "text-[hsl(var(--muted-foreground))]"}`} />
              <span className={`text-sm font-medium ${theme === value ? "text-brand-500" : "text-[hsl(var(--muted-foreground))]"}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold">Categories</h2>
        <div className="flex gap-2">
          <input value={catName} onChange={e => setCatName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddCategory()}
            placeholder="Category name" className="input flex-1" />
          <div className="flex gap-1 flex-shrink-0">
            {CAT_COLORS.slice(0, 4).map(color => (
              <button key={color} onClick={() => setCatColor(color)}
                className={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${catColor === color ? "border-gray-700 scale-110" : "border-transparent"}`}
                style={{ backgroundColor: color }} />
            ))}
          </div>
          <button onClick={handleAddCategory} disabled={!catName.trim()} className="btn-primary flex-shrink-0">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-sm font-medium">{cat.name}</span>
              </div>
              <button onClick={() => categoryService.delete(cat.id).then(() => toast.success("Deleted"))}
                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
                <Trash2 className="w-4 h-4 text-rose-500" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-4">No categories yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
