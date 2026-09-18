import type { Metadata } from "next";
import { shell } from "@/content/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: `${shell.title}: ${shell.tagline}`,
  description:
    "Six small hand-made toys on one page. No signup, no accounts, no analytics, no backend. Everything you do here stays in your browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
