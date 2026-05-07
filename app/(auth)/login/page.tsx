"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Chrome } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.login(data.email, data.password);
      router.replace("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await authService.loginWithGoogle();
      router.replace("/dashboard");
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Sign in to your FlowDesk account</p>
      </div>

      <button onClick={handleGoogle} disabled={googleLoading} className="w-full flex items-center justify-center gap-3 border border-[hsl(var(--border))] rounded-xl px-4 py-3 text-sm font-medium hover:bg-[hsl(var(--muted))] transition-all duration-200 disabled:opacity-60">
        {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4" />}
        Continue with Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[hsl(var(--border))]" />
        <span className="text-xs text-[hsl(var(--muted-foreground))]">or</span>
        <div className="flex-1 h-px bg-[hsl(var(--border))]" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <input {...register("email")} placeholder="Email address" className="input pl-10" />
          </div>
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <input {...register("password")} type="password" placeholder="Password" className="input pl-10" />
          </div>
          {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
        </div>
        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Create one</Link>
      </p>
    </div>
  );
}
