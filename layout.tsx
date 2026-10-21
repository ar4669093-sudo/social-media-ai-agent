import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Media AI Agent",
  description: "Manage social media content drafts and scheduling."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hi"><body>{children}</body></html>;
}
