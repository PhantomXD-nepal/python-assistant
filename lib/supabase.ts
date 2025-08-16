import { auth } from "@clerk/nextjs/server";

export const createSupabaseClient = () => {
  const { createClient } = require('@supabase/supabase-js');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be provided');
  }


  return createClient(supabaseUrl, supabaseAnonKey,{
      async accessToken(){
    return((await auth()).getToken())
  }
  });
}