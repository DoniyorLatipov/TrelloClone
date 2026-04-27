// import { useSession } from '@clerk/nextjs';
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // const { session } = useSession();

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    // { accessToken: async () => session?.getToken() ?? null },
  );
}
