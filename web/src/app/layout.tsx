import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/site/Header';

export const metadata: Metadata = {
  title: 'Escortify Clone',
  description: 'Escortify-style marketplace',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Header />
        {children}
      </body>
    </html>
  );
}