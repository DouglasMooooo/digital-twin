import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://douglasmo.vercel.app'),
  title: {
    default: 'Douglas Mo - Digital Twin | AI-Powered Professional Profile',
    template: '%s | Douglas Mo Digital Twin',
  },
  description: 'Interactive AI-powered professional profile for Douglas Mo. Business Analytics graduate with expertise in AI/ML systems, RAG architecture, Python, TypeScript, and data analytics. Built production-grade digital twin with Next.js and vector databases.',
  keywords: [
    'Douglas Mo',
    'Digital Twin',
    'AI Engineer',
    'Data Analyst',
    'Business Analytics',
    'RAG System',
    'Machine Learning',
    'Python Developer',
    'TypeScript Developer',
    'Next.js',
    'Vector Database',
    'Upstash',
    'Groq AI',
    'Professional Portfolio',
    'Interview Preparation',
    'Cursor AI',
    'Claude Sonnet',
    'AI-Assisted Development',
  ],
  authors: [{ name: 'Douglas Mo', url: 'https://github.com/DouglasMooooo' }],
  creator: 'Douglas Mo',
  publisher: 'Douglas Mo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://douglasmo.vercel.app',
    title: 'Douglas Mo - Digital Twin | AI-Powered Professional Profile',
    description: 'AI-powered professional profile with interactive interview preparation. Built with Next.js, RAG architecture, and vector databases.',
    siteName: 'Douglas Mo Digital Twin',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Douglas Mo - Digital Twin Professional Profile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Douglas Mo - Digital Twin | AI Engineer & Data Analyst',
    description: 'AI-powered professional profile with RAG system. Expertise in Python, TypeScript, Machine Learning, and Business Analytics.',
    images: ['/og-image.png'],
    creator: '@douglasmo',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://douglasmo.vercel.app',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Douglas Mo',
    url: 'https://douglasmo.vercel.app',
    image: 'https://douglasmo.vercel.app/profile-photo.jpg',
    sameAs: [
      'https://github.com/DouglasMooooo',
      'https://www.linkedin.com/in/douglas-mo-67344531b/',
    ],
    jobTitle: 'Business Analytics Graduate | AI Systems Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Victoria University',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Victoria University',
    },
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'Data Analytics',
      'Python Programming',
      'TypeScript Development',
      'RAG Systems',
      'Vector Databases',
      'Business Intelligence',
      'Financial Accounting',
    ],
    description: 'Analytically-driven professional transitioning from financial accounting to AI/data systems development. Master\'s student in Business Analytics with hands-on experience building production RAG systems, digital twins, and full-stack AI applications.',
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Structured Data */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
