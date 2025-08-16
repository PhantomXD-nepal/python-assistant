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
    if (!data || data.length === 0) {
        return null;
    }
    return data[0]
    
}

export const createTeacherSession = async ({ teacherId, transcript }: { teacherId: string, transcript: string }) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();

    if (!userId) {
        throw new Error("User not found");
    }

    try {
        const resp = await fetch("https://api.sambanova.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer 83c38b60-fc10-4a61-bbbd-7a57aa3d10b9`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "DeepSeek-V3-0324",
                stream: false,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that summarizes study-related conversations. Your goal is to provide a concise, well-structured summary that highlights the most important points.  When summarizing, always include:1. **Key Concepts** – main ideas, theories, or definitions discussed.2. **Notes** – condensed explanations, formulas, or facts that are useful for revision.3. **Takeaways** – practical insights, advice, or important reminders.4. **Actionable Steps** - specific tasks or next steps derived from the conversation.5. **Follow-up Questions** - questions that arise from the discussion for further exploration.6. **Optional Additions** – if relevant, add examples, mnemonics, or tips to make the material easier to remember.Output Format: --- 📌 **Summary** [One short paragraph capturing the overall context of the conversation.]📖 **Key Concepts**- Point 1- Point 2- Point 3📝 **Notes**- Note 1- Note 2- Note 3🎯 **Takeaways**- Takeaway 1- Takeaway 2- Takeaway 3✅ **Actionable Steps**- Step 1- Step 2❓ **Follow-up Questions**- Question 1- Question 2💡 **Extra Tips (if any)**- Tip or example that strengthens understanding.---"
                    },
                    {
                        role: "user",
                        content: `Summarize the following dialogue:nn${transcript}`
                    }
                ]
            })
        });

        if (!resp.ok) {
            const errText = await resp.text();
            console.error("SambaNova request failed", errText);
            throw new Error("Failed to get summary from transcript.");
        }

        const result = await resp.json();
        const summary = result.choices?.[0]?.message?.content ?? "No summary found.";

        const { data, error } = await supabase
            .from('session_history')
            .insert({ user_id: userId, teacher_id: teacherId, summary })
            .select('id')
            .single();

        if (error || !data) {
            console.error("Error creating session:", error);
            throw new Error("Failed to create session");
        }

        return { success: true, sessionId: data.id };
    } catch (error) {
        console.error("Error in createTeacherSession:", error);
        throw new Error("Failed to create teacher session.");
    }
}