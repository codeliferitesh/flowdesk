"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

const schema = z.object({ email: z.string().email("Invalid email") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.forgotPassword(data.email);
      toast.success("Reset email sent! Check your inbox.");
    } catch {
      toast.error("Failed to send reset email");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Reset password</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">We&apos;ll send you a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <input {...register("email")} placeholder="Email address" className="input pl-10" />
          </div>
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Send Reset Link
        </button>
      </form>

      <Link href="/login" className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to login
      </Link>
    </div>
  );
}
