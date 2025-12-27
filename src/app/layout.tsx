import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Renno — Verified Milestones Demo",
  description: "Frontend-only demo: AI milestone verification + escrow trigger + ledger + audit trail",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
