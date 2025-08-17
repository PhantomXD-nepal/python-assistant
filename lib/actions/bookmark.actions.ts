'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { revalidatePath } from "next/cache";

export const toggleBookmark = async (teacherId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    if (!userId) {
        throw new Error("User not found");
    }

    // Check if the bookmark already exists
    const { data: existingBookmark, error: selectError } = await supabase
        .from('bookmarked_teachers')
        .select('*')
        .eq('user_id', userId)
        .eq('teacher_id', teacherId)
        .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("Error checking for bookmark:", selectError);
        throw new Error("Failed to check bookmark status.");
    }

    if (existingBookmark) {
        // Remove bookmark
        const { error: deleteError } = await supabase
            .from('bookmarked_teachers')
            .delete()
            .eq('user_id', userId)
            .eq('teacher_id', teacherId);

        if (deleteError) {
            console.error("Error removing bookmark:", deleteError);
            throw new Error("Failed to remove bookmark.");
        }
    } else {
        // Add bookmark
        const { error: insertError } = await supabase
            .from('bookmarked_teachers')
            .insert({ user_id: userId, teacher_id: teacherId });

        if (insertError) {
            console.error("Error adding bookmark:", insertError);
            throw new Error("Failed to add bookmark.");
        }
    }

    // Revalidate paths to update UI
    revalidatePath('/');
    revalidatePath('/Teachers');
    revalidatePath(`/Teachers/${teacherId}`);
    revalidatePath('/my-journey'); // If bookmarked teachers are shown there

    return { success: true };
}

export const getBookmarkedTeachers = async () => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    if (!userId) {
        return [];
    }

    const { data, error } = await supabase
        .from('bookmarked_teachers')
        .select('teachers(*)')
        .eq('user_id', userId);

    if (error) {
        console.error("Error fetching bookmarked teachers:", error);
        return [];
    }

    return data.map(item => item.teachers);
}

export const isTeacherBookmarked = async (teacherId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    if (!userId) {
        return false;
    }

    const { data, error } = await supabase
        .from('bookmarked_teachers')
        .select('*')
        .eq('user_id', userId)
        .eq('teacher_id', teacherId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error("Error checking bookmark status:", error);
        return false;
    }

    return !!data;
}
