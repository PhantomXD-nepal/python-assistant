from openai import OpenAI

class WikipediaSearcher:
    def __init__(self, api_key):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.sambanova.ai/v1",
        )

    def search(self, query):
        prompt = f"Search for the following on Wikipedia and provide a summary: '{query}'"
        response = self.client.chat.completions.create(
            model="DeepSeek-R1-0528",
            messages=[{"role":"system","content": "You are a Wikipedia search assistant."}, {"role":"user","content":prompt}],
            temperature=0.1,
        )
        return response.choices[0].message.content
