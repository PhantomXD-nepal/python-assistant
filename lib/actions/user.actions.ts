'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

export const getUser = async () => {
    const supabase = createSupabaseClient();
    const { userId } = await auth();
    if (!userId) return null;

    const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error("Error fetching user:", error);
        return null;
    }

    return userData;
}


export const updateUserDuration = async (duration: number) => {
    const supabase = createSupabaseClient();
    const { userId } = await auth();
    if (!userId) return null;

    const { data: userData, error } = await supabase
        .from('users')
        .update({ duration })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error("Error updating user duration:", error);
        return null;
    }

    return userData;
}