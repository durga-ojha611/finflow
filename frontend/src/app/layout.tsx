import type { Metadata } from 'next';
import './globals.css';
import { FinFlowProvider } from '../context/FinFlowContext';

export const metadata: Metadata = {
  title: 'FinFlow — Smarter Finance. Faster Flow.',
  description:
    'FinFlow — Smarter Finance. Faster Flow. AI-powered financial process intelligence, executive cash flow tracking, and automated ledger operations.',
  icons: {
    icon: '/logo-icon-trans.png',
    apple: '/logo-icon-trans.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8FAF9] text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <FinFlowProvider>{children}</FinFlowProvider>
      </body>
    </html>
  );
}
