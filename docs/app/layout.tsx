import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MrDemonWolf App Docs',
    template: '%s | MrDemonWolf App Docs',
  },
  description:
    'Documentation for the MrDemonWolf Official App — an Expo SDK 55 portfolio & blog app powered by WordPress.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
