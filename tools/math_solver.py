from openai import OpenAI
import os

class MathSolver:
    def __init__(self, api_key):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.sambanova.ai/v1",
        )

    def solve_equation(self, equation):
        response = self.client.chat.completions.create(
            model="DeepSeek-R1-0528",
            messages=[{"role":"system","content":"You are a helpful assistant"},{"role":"user","content":equation}],
            temperature=0.1,
            top_p=0.1
        )
        result = response.choices[0].message.content
        self.save_result(equation, result)

    def save_result(self, equation, result):
        if not os.path.exists("math problems"):
            os.makedirs("math problems")
        file_name = f"math problems/{equation.replace(' ', '_')}.md"
        with open(file_name, 'w') as f:
            f.write(f"# Equation:\n`{equation}`\n\n## Result:\n{result}")
