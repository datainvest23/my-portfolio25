// src/components/Layout.tsx
"use client";

import Head from 'next/head';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const passkey = searchParams.get('passkey');
  const email = searchParams.get('email');
  
  // Create links with both passkey and email if they exist
  const createLink = (path: string) => {
    const params = new URLSearchParams();
    if (passkey) params.append('passkey', passkey);
    if (email) params.append('email', email);
    return `${path}${params.toString() ? `?${params.toString()}` : ''}`;
  };

  const portfolioLink = createLink('/');
  const contactLink = createLink('/contact');

  return (
    <div>
      <Head>
        <title>Marc Muller - Portfolio</title>
        <meta name="description" content="Portfolio website" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={portfolioLink} className="text-xl font-bold">
            Marc Muller
          </Link>
          <nav>
            <ul className="flex space-x-6">
              {isAuthenticated && (
                <li>
                  <Link 
                    href={portfolioLink}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Portfolio
                  </Link>
                </li>
              )}
              <li>
                <Link 
                  href={contactLink}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Marc Muller</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;