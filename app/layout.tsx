import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Universal Memory Journal",
  description: "Save and rediscover meaningful moments from YouTube, Twitter, Instagram, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
