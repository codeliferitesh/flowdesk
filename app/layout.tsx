import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "FlowDesk — Modern Productivity",
  description: "A beautiful, modern productivity platform combining todos, notes, and kanban boards.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </AuthProvider>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){const t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}})();`
        }} />
      </body>
    </html>
  );
}
