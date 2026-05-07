"use client";
import { Instagram, Heart, ExternalLink, Code2, Zap, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold">About</h1>
        <p className="text-[hsl(var(--muted-foreground))] mt-1">The story behind FlowDesk</p>
      </div>

      {/* App Info */}
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-brand-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow">
          <span className="text-white font-display font-bold text-2xl">F</span>
        </div>
        <h2 className="font-display text-3xl font-bold mb-2">FlowDesk</h2>
        <p className="text-[hsl(var(--muted-foreground))] max-w-md mx-auto leading-relaxed">
          A modern, open-source productivity platform that brings together todos, sticky notes,
          and kanban boards in one beautiful, fast interface.
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[hsl(var(--muted-foreground))]">
          {[
            { icon: Zap, label: "Real-time sync" },
            { icon: Code2, label: "Open source" },
            { icon: Globe, label: "Works anywhere" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="w-4 h-4 text-brand-500" /> {label}
            </div>
          ))}
        </div>
      </div>

      {/* Developer Card */}
      <div className="card p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-glow-lg">
            <span className="font-display font-bold text-4xl text-white">R</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-1">Built by</p>
            <h2 className="font-display text-2xl font-bold mb-1">Ritesh Verma</h2>
            <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">
              Full-stack developer passionate about building beautiful, functional products.
              I love crafting developer tools and productivity apps that make people&apos;s lives easier.
              FlowDesk is my take on a modern, delightful productivity experience.
            </p>

            <div className="flex flex-wrap gap-3 mt-5 justify-center sm:justify-start">
              <a
                href="https://instagram.com/hieritesh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                <Instagram className="w-4 h-4" />
                Follow on Instagram
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://hieritesh.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-sm font-semibold hover:bg-[hsl(var(--surface-overlay))] transition-colors"
              >
                <Globe className="w-4 h-4 text-brand-500" />
                hieritesh.netlify.app
                <ExternalLink className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="card p-8 bg-gradient-to-br from-brand-500/5 to-emerald-500/5 border-brand-500/20">
        <div className="text-center">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">Support the Project</h3>
          <p className="text-[hsl(var(--muted-foreground))] text-sm max-w-sm mx-auto mb-6">
            If FlowDesk has helped boost your productivity, consider supporting the developer.
            Every contribution keeps the project going! ❤️
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] shadow-card">
            <div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">UPI / Donate via</p>
              <p className="font-mono font-bold text-brand-600 dark:text-brand-400">riteshverma.in@ptyes</p>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText("riteshverma.in@ptyes"); }}
              className="text-xs bg-brand-500 text-white px-3 py-1.5 rounded-lg hover:bg-brand-600 transition-colors font-semibold"
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-3">Pay using any UPI app — GPay, PhonePe, Paytm & more</p>
        </div>
      </div>

      {/* Tech stack */}
      <div className="card p-6">
        <h3 className="font-display font-semibold mb-4">Built with</h3>
        <div className="flex flex-wrap gap-2">
          {["Next.js 15", "TypeScript", "Tailwind CSS", "Firebase", "Framer Motion", "Zod", "React Hook Form", "Zustand"].map(tech => (
            <span key={tech} className="text-xs bg-[hsl(var(--muted))] px-3 py-1.5 rounded-full font-medium">{tech}</span>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-[hsl(var(--muted-foreground))] pb-4">
        Made with ❤️ by Ritesh Verma · FlowDesk v1.0
      </p>
    </div>
  );
}
