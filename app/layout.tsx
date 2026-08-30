import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";


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

export default async function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="en">
      <body className={`${manrope.variable} ${plexMono.variable} antialiased`}>
        <Toaster richColors position="top-center" />
       
              {children}
          
      </body>
    </html>
  );
}
