import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeCraft AI - Unlimited AI Coding Assistant",
  description: "Your unlimited AI coding assistant for code generation, folder exploration, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
