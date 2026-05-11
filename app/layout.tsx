import type { Metadata } from 'next';
import { Outfit, Figtree, Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'AgriConnect — Farm-to-Table Marketplace',
    template: '%s | AgriConnect',
  },
  description:
    'AgriConnect connects farmers directly with consumers and wholesalers. Fresh produce, fair prices, zero middlemen.',
  keywords: ['agriculture', 'farm fresh', 'organic', 'marketplace', 'farmers', 'India'],
  openGraph: {
    title: 'AgriConnect — Farm-to-Table Marketplace',
    description: 'Fresh produce directly from Indian farmers.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable} ${figtree.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="grain">
        {children}
      </body>
    </html>
  );
}
