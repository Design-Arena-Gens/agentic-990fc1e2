import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaFlow Automator",
  description: "Create and publish Instagram posts automatically via the Instagram Graph API."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-100 bg-slate-950">
        {children}
      </body>
    </html>
  );
}
