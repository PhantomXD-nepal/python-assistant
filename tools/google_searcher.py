from openai import OpenAI

class GoogleSearcher:
    def __init__(self, api_key):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.sambanova.ai/v1",
        )

    def search(self, query):
        prompt = f"Please search the web for the following query and provide a concise answer: '{query}'"
        response = self.client.chat.completions.create(
            model="DeepSeek-R1-0528",
            messages=[{"role":"system","content": "You are a web search assistant."}, {"role":"user","content":prompt}],
            temperature=0.1,
        )
        return response.choices[0].message.content
