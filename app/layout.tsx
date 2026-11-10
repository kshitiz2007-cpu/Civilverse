import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CIVILVERSE — Civil Services Learning OS',
  description:
    'An intelligent learning ecosystem for UPSC, State PCS and competitive examination preparation.',
  applicationName: 'CIVILVERSE',
  themeColor: '#090714',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
