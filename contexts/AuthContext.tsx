"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Logger } from '@/lib/logger';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userEmail: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const passkey = searchParams.get('passkey');
    const email = searchParams.get('email');
    const path = window.location.pathname;

    if (passkey === 'test2') { // Your predefined passkey
      setIsAuthenticated(true);
      setUserEmail(email);

      // Log the access
      if (email) {
        Logger.logAccess(email, passkey, path);
      }
    } else {
      setIsAuthenticated(false);
      setUserEmail(null);
    }
  }, [searchParams]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 