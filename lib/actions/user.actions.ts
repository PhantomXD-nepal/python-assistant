'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

export const getRemainingInstances = async (): Promise<number> => {
    const supabase = createSupabaseClient();
    const { userId } = await auth();
    if (!userId) return 0;

    
    const { data: userData, error } = await supabase
        .from('users')
        .select('remaining_instances')
        .eq('id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching remaining instances:", error);
        return 0; // Return 0 on error
    }

    if (!userData) {
        // If user is not in our DB, they are a new user.
        // The `CreateTeacher` action gives 10 free instances.
        // So we can assume they have more than 0.
        return 10;
    }

    return userData.remaining_instances;
}