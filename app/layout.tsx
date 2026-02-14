import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Bookmark App",
  description:
    "A beautifully simple bookmark manager with real-time sync across all your devices.",
  keywords: ["bookmarks", "bookmark manager", "real-time", "next.js", "supabase"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100"
        style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className:
                "border border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100",
            }}
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
