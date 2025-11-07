import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Avito Clone - Classifieds Marketplace',
  description: 'Buy and sell goods, services, and more with Avito Clone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
