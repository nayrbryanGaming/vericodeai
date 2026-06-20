import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeriCode AI — AI-Powered Developer Platform",
  description:
    "Practice coding, get AI assistance, track progress, and ace your interviews with VeriCode AI.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('vericode-theme');if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
