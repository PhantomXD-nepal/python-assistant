"use server";

import { auth, currentUser } from "@clerk/nextjs/server"
import { createSupabaseClient } from "../supabase"
import { addToSessionHistory } from "./session.actions"
import { CreateCompanion, GetAllCompanions } from "@/types";



export const CreateTeacher = async (formData: CreateCompanion) => {
    const { userId: author } = await auth()
    const supabase = createSupabaseClient()

    if (!author) {
        throw new Error("User not found");
    }

    let { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, remaining_instances')
        .eq('id', author)
        .single();

    if (userError && userError.code !== 'PGRST116') {
        console.error(userError);
        throw new Error("Failed to fetch user information.");
    }

    if (!userData) {
        const clerkUser = await currentUser();
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({ id: author, email: clerkUser?.emailAddresses[0].emailAddress, plan: 'free', remaining_instances: 10 })
            .select('id, remaining_instances')
            .single();

        if (insertError || !newUser) {
            console.error(insertError);
            throw new Error("Failed to create user profile.");
        }
        userData = newUser;
    }

    if (userData.remaining_instances <= 0) {
        throw new Error("You have no remaining instances to create a new teacher. Please upgrade your plan.");
    }

    const { data, error } = await supabase
        .from("teachers")
        .insert({ ...formData, author })
        .select()

    if (error || !data || data.length === 0) {
        throw new Error("Failed to create teacher companion")
    }

    const { error: updateError } = await supabase
        .from('users')
        .update({ remaining_instances: userData.remaining_instances - 1 })
        .eq('id', author);

    if (updateError) {
        console.error("Failed to update user instance count:", updateError);
        throw new Error("Failed to update your remaining instances count, but the teacher was created.");
    }

    return data[0]
}

export const getAllTeacher = async({ limit=10, page=1, subject,topic}:GetAllCompanions) =>{
    const supabase = createSupabaseClient()

    let query = supabase.from('teachers').select()

    if(subject && topic){
        query= query.ilike('subject',`%${subject}%`).or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }else if (subject){
        query = query.ilike('subject',`%${subject}%`)
    }else if (topic){
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page-1) * limit, page*limit - 1)
    const {data:companions,error} = await query;


    return companions
}

export const getTeacher = async(id:string) => {
    const supabase = createSupabaseClient()

    const {data,error} = await supabase.from('teachers').select().eq('id',id)
    return data[0]
    
}

export const createTeacherSession = async ({ teacherId }: { teacherId: string }) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    if (!userId) {
        throw new Error("User not found");
    }

    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('remaining_instances')
        .eq('id', userId)
        .single();

    if (userError || !userData) {
        throw new Error("User not found");
    }

    if (userData.remaining_instances <= 0) {
        throw new Error("You have no remaining instances");
    }

    const { data, error } = await supabase
        .from('users')
        .update({ remaining_instances: userData.remaining_instances - 1 })
        .eq('id', userId);

    await addToSessionHistory(teacherId);


    if (error) {
        throw new Error("Failed to update user");
    }

    

    return { success: true };

}