import type { Metadata } from "next";
import { InfiniteVoidProvider } from "@/components/infinite-void/infinite-void-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARC'S WORLD",
  description: "Software, intelligent systems, and robotics — the portfolio of Marc.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <InfiniteVoidProvider>
          <Navbar />
          {children}
        </InfiniteVoidProvider>
      </body>
    </html>
  );
}
