"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const [passkey, setPasskey] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check URL parameters for auto-login
    const urlPasskey = searchParams.get('passkey');
    const urlEmail = searchParams.get('email');
    
    if (urlPasskey && urlEmail) {
      handleLogin(urlPasskey, urlEmail);
    } else if (urlPasskey) {
      setPasskey(urlPasskey);
    }
  }, [searchParams]);

  const handleLogin = async (submittedPasskey: string, submittedEmail: string) => {
    // Clear any previous errors
    setError('');

    // Check against environment variable
    if (submittedPasskey === process.env.NEXT_PUBLIC_AUTH_PASSKEY) {
      // Successful login
      const params = new URLSearchParams();
      params.append('passkey', submittedPasskey);
      params.append('email', submittedEmail);
      router.push(`/?${params.toString()}`);
    } else {
      setError('Invalid credentials');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(passkey, email);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Login</h1>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passkey">Passkey:</label>
          <input
            type="password"
            id="passkey"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
} 