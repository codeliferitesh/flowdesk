"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import {
  LayoutDashboard, CheckSquare, StickyNote, Kanban, Settings,
  LogOut, Moon, Sun, Menu, X, Plus, Info,
} from "lucide-react";
import { cn } from "@/utils";

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/todos", icon: CheckSquare, label: "Todos" },
  { href: "/dashboard/notes", icon: StickyNote, label: "Notes" },
  { href: "/dashboard/board", icon: Kanban, label: "Board" },
  { href: "/dashboard/about", icon: Info, label: "About" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Signed out");
    router.replace("/login");
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const Sidebar = ({ mobile = false }) => (
    <aside className={cn(
      "flex flex-col h-full",
      mobile ? "p-4" : "w-64 p-4 border-r border-[hsl(var(--border))]"
    )}>
      <div className="flex items-center gap-2 px-3 py-2 mb-6">
        <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
          <span className="text-white font-display font-bold">F</span>
        </div>
        <span className="font-display font-bold text-xl">FlowDesk</span>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
            className={cn("sidebar-item", pathname === href ? "sidebar-item-active" : "sidebar-item-inactive")}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-[hsl(var(--border))] pt-4 space-y-2">
        <button onClick={toggleTheme} className="sidebar-item sidebar-item-inactive w-full">
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{dark ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <div className="flex items-center gap-3 px-3 py-2">
          {user.photoURL ? (
            <Image src={user.photoURL} alt="avatar" width={32} height={32} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-600 font-bold text-sm">
              {user.displayName?.[0] ?? user.email?.[0] ?? "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.displayName ?? "User"}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{user.email}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors" title="Logout">
            <LogOut className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[hsl(var(--surface))] shadow-xl">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-display font-bold">FlowDesk</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))]">
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        <main className="flex-1 overflow-auto scrollbar-thin">
          {children}
        </main>
      </div>

      {/* FAB */}
      <Link href="/dashboard/todos" className="fixed bottom-6 right-6 w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center shadow-glow-lg hover:shadow-glow hover:bg-brand-600 transition-all duration-200 active:scale-95 md:hidden z-40">
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
}
