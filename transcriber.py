from openai import OpenAI

class SambaNovaTranscriber:
    def __init__(self, api_key: str):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.sambanova.ai/v1",
        )

    def transcribe(self, path: str) -> str:
        try:
            with open(path, "rb") as audio:
                resp = self.client.audio.transcriptions.create(
                    model="Whisper-Large-v3",
                    file=audio,
                    response_format="text",
                )
            return resp.strip() if resp else ""
        except Exception as e:
            print(f"Transcription error: {e}")
            return ""
