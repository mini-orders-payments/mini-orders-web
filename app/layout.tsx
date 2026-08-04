import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";


const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MINI-ORDERS",
  description: "Create, view, pay for, and delete orders.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${plexMono.variable} antialiased`}>
       
          <div className="flex min-h-screen flex-col md:flex-row">
            <Nav />
            <main className="flex-1 px-4 py-8 sm:px-8 md:px-12 md:py-12">
              <div className="mx-auto w-full max-w-3xl">{children}</div>
            </main>
          </div>
        
      </body>
    </html>
  );
}
