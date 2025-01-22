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

  async function testSignup() {
    addLog("Starting signup test");
    try {
      const password = "test123!@#";

      // Try signup
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      addLog(`SignUp result: ${JSON.stringify({ signUpData, signUpError }, null, 2)}`);

      // If user exists, try sign in
      if (signUpError?.message === 'User already registered') {
        addLog("User exists, trying sign in");
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        addLog(`SignIn result: ${JSON.stringify({ signInData, signInError }, null, 2)}`);
      }

      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      addLog(`Session check: ${JSON.stringify({ session, sessionError }, null, 2)}`);

      if (session) {
        addLog("Got session, redirecting in 3 seconds...");
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 3000);
      }

    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>
      
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Name:</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter email"
          />
        </div>

        <button
          onClick={testSignup}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Sign Up/Sign In
        </button>
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