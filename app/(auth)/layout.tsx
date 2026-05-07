"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand-500 rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-white font-display font-bold text-lg">F</span>
            </div>
            <span className="font-display font-bold text-2xl">FlowDesk</span>
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Modern productivity, beautifully designed</p>
        </div>
        <div className="card p-8 shadow-xl">{children}</div>
      </div>
    </div>
  );
}
