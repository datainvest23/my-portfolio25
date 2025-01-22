// src/app/layout.tsx
import { Inter, Work_Sans } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { SupabaseProvider } from '@/providers/SupabaseProvider';
import { ToastProvider } from '@/providers/ToastProvider';

const inter = Inter({ subsets: ['latin'] });
const workSans = Work_Sans({ 
  subsets: ['latin'],
  variable: '--font-work-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${workSans.variable}`}>
        <SupabaseProvider>
          <ToastProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ToastProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}