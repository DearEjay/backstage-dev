// Root layout component that sets up HTML structure and global styles for the entire application

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CADENCE',
  description: 'Music Project Management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
