from voice_assistant import VoiceAssistant

if __name__ == "__main__":
    try:
        assistant = VoiceAssistant()
        assistant.run()
    except Exception as e:
        print(f"Failed to start voice assistant: {e}")
        input("Press Enter to exit...")