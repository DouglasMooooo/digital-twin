import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Douglas Mo - Digital Twin | AI-Powered Professional Profile',
  description: 'Interactive AI-powered professional profile for Douglas Mo. Business Analytics graduate with expertise in AI/ML systems, data analytics, and financial operations.',
  keywords: 'Douglas Mo, Digital Twin, AI, RAG, Business Analytics, Data Analyst, AI Engineer, Portfolio',
  authors: [{ name: 'Douglas Mo' }],
  openGraph: {
    title: 'Douglas Mo - Digital Twin',
    description: 'AI-powered professional profile with interactive interview preparation',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
