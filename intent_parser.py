import json
from openai import OpenAI

class IntentParser:
    def __init__(self, api_key: str):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.sambanova.ai/v1",
        )

    def get_intent(self, text: str) -> dict:
        prompt = f"""You are an intent recognition system. Based on the user's command, generate a JSON object that specifies which tool to activate and with what parameters. The user command is: '{text}'.

        The JSON object should have the following structure:
        {{
            "tools_to_activate": {{
                "youtube": {{
                    "search_query": "..."
                }},
                "instagram": {{
                    "search_query": "..."
                }},
                "facebook": {{
                    "search_query": "..."
                }},
                "time_teller": {{}},
                "math_solver": {{
                    "equation": "..."
                }},
                "todos_system": {{
                    "action": "add|delete|edit|read",
                    "content": "..."
                }},
                "conversation": {{
                    "query": "..."
                }},
                "google": {{
                    "search_query": "..."
                }},
                "wikipedia": {{
                    "search_query": "..."
                }}
            }}
        }}

        Rules:
        1. Your response MUST be a single valid JSON object and nothing else. Do not add any explanatory text or markdown formatting.
        2. If the user's command does not match any of the other tools, or if it is a general question or statement, classify it as 'conversation'.
        3. Only include ONE tool that is being requested.
        4. For todos, use action types: "add", "delete", "edit", "read".
        5. For math problems, use the "math_solver" tool.

        Examples:
        - "hello" -> {{"tools_to_activate": {{"conversation": {{"query": "hello"}}}}}}
        - "play music" -> {{"tools_to_activate": {{"youtube": {{"search_query": "music"}}}}}}
        - "what time is it" -> {{"tools_to_activate": {{"time_teller": {{}}}}}}
        - "add buy milk to todos" -> {{"tools_to_activate": {{"todos_system": {{"action": "add", "content": "buy milk"}}}}}}
        - "google what is a supernova" -> {{"tools_to_activate": {{"google": {{"search_query": "what is a supernova"}}}}}}
        - "wikipedia albert einstein" -> {{"tools_to_activate": {{"wikipedia": {{"search_query": "albert einstein"}}}}}}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="DeepSeek-V3-0324",
                messages=[{"role": "system", "content": prompt}],
                temperature=0.1,
                top_p=0.1
            )
            
            response_content = response.choices[0].message.content
            print(f"Raw response: {response_content}")
            
            # Find the start and end of the JSON object
            json_start = response_content.find('{')
            json_end = response_content.rfind('}') + 1
            
            if json_start != -1 and json_end != 0:
                json_string = response_content[json_start:json_end]
                return json.loads(json_string)
            else:
                # Fallback if no JSON object is found
                raise ValueError("No JSON object found in response")

        except Exception as e:
            print(f"Intent parsing error: {e}")
            return {
                "tools_to_activate": {
                    "conversation": {
                        "query": text
                    }
                }
            }
