'use client';
import { useSession } from '@clerk/nextjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect } from 'react';

// ----------
// Replacing the Superbase browser client (./client.ts) with context for integrating the user database with Clerk/nextjs
// ----------

type SupabaseContextType = {
  supabase: SupabaseClient | null;
  isLoaded: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({ supabase: null, isLoaded: false });

export default function SupabaseProvider(props: React.PropsWithChildren) {
  const { session } = useSession();

  const [supabase, setSupabase] = React.useState<SupabaseClient | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    if (!session) return;

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { accessToken: async () => session?.getToken() ?? null },
    );

    setSupabase(client);
    setIsLoaded(true);
  }, [session]);

  return (
    <SupabaseContext.Provider value={{ supabase, isLoaded }}>
      {isLoaded ? props.children : <div>Loading...</div>}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) throw new Error('useSupabase must be used within a SupabaseProvider');

  return context;
};
