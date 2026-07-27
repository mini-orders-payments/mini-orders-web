import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'mini-order-payments-web',
  description: 'Frontend for mini-order-payments workshop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
