"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthTest() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const router = useRouter();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'testpassword123',
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      addLog(`Sign up successful: ${data.user?.id}`);
    } catch (error) {
      addLog(`Sign up error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: 'testpassword123',
      });

      if (error) throw error;
      addLog(`Sign in successful: ${data.user.id}`);
    } catch (error) {
      addLog(`Sign in error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      addLog('Sign out successful');
    } catch (error) {
      addLog(`Sign out error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>
      
      <div className="space-y-4 mb-8">
        <div>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        
        <div>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        
        <div className="space-x-4">
          <button
            onClick={() => void handleSignUp()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign Up
          </button>
          <button
            onClick={() => void handleSignIn()}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => void handleSignOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Logs:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
        </pre>
      </div>
    </div>
  );
} 