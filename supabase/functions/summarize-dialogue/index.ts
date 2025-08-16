// supabase/functions/summarize-dialogue/index.ts
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
console.info("server started");
Deno.serve(async (req)=>{
  try {
    const { dialogue } = await req.json();
    if (!dialogue) {
      return new Response(JSON.stringify({
        error: "Missing 'dialogue' in request body"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    // Call SambaNova AI
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
            content: "You are a helpful assistant that summarizes study-related conversations. Your goal is to provide a concise, well-structured summary that highlights the most important points.  When summarizing, always include:1. **Key Concepts** – main ideas, theories, or definitions discussed.2. **Notes** – condensed explanations, formulas, or facts that are useful for revision.3. **Takeaways** – practical insights, advice, or important reminders.4. **Optional Additions** – if relevant, add examples, mnemonics, or tips to make the material easier to remember.Output Format: --- 📌 **Summary** [One short paragraph capturing the overall context of the conversation.]📖 **Key Concepts**- Point 1- Point 2- Point 3📝 **Notes**- Note 1- Note 2- Note 3🎯 **Takeaways**- Takeaway 1- Takeaway 2- Takeaway 3💡 **Extra Tips (if any)**- Tip or example that strengthens understanding.---"
          },
          {
            role: "user",
            content: `Summarize the following dialogue:nn${dialogue}`
          }
        ]
      })
    });
    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({
        error: "SambaNova request failed",
        details: errText
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const result = await resp.json();
    const summary = result.choices?.[0]?.message?.content ?? "No summary found.";
    return new Response(JSON.stringify({
      summary
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: "Server error",
      details: String(err)
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});