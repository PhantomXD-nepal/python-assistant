
'use server';

import { createSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export const addToSessionHistory = async (teacherId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from('session_history')
    .insert({
      teacher_id: teacherId,
      user_id: userId,
    })

  if (error) throw new Error(error.message);

  return data;
}

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('session_history')
        .select(`teachers:teacher_id (*)`)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ teachers }) => teachers);
}

export const getUserSessions = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('session_history')
        .select(`teachers:teacher_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ teachers }) => teachers);
}
