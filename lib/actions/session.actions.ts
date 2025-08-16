
'use server';

import { createSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

const supabase = createSupabaseClient();

export const addToSessionHistory = async (teacherId: string) => {
  const { userId } = await auth();
  

  const { data, error } = await supabase.from('session_history')
    .insert({
      teacher_id: teacherId,
      user_id: userId,
    })

  if (error) throw new Error(error.message);

  return data;
}

export const getRecentSessions = async (limit = 10) => {
    
  const { data, error } = await supabase
    .from("session_history")
    .select(`teachers:teacher_id(*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  console.log("Recent sessions data:", data);

  // Deduplicate teachers by id
  const uniqueTeachers = [];
  const seen = new Set();

  for (const { teachers } of data) {
    if (teachers && !seen.has(teachers.id)) {
      seen.add(teachers.id);
      uniqueTeachers.push(teachers);
    }
  }

  return uniqueTeachers;


}

export const getUserSessions = async (userId: string, limit = 10) => {
    

    const { data, error } = await supabase
        .from('session_history')
        .select(`teachers:teacher_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ teachers }) => teachers);
}

export const getSessionById = async (id: string) => {
    const { data, error } = await supabase
        .from('session_history')
        .select('*, teacher:teacher_id(*)')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
}
