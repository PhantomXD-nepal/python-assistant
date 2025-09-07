import os
import time
import ctypes

from transcriber import SambaNovaTranscriber
from intent_parser import IntentParser
from tts import TTSManager
from audio_recorder import AudioRecorder
from intent_processor import process_intent

from tools.youtube_player import YoutubePlayer
from tools.web_opener import WebOpener
from tools.time_teller import TimeTeller
from tools.math_solver import MathSolver
from tools.todo_manager import TodoManager

class VoiceAssistant:
    def __init__(self):
        self.api_key = "23aed871-8963-417f-b59b-3fc396b6702a"
        self.transcriber = SambaNovaTranscriber(self.api_key)
        self.intent_parser = IntentParser(self.api_key)
        self.tts_manager = TTSManager()
        self.audio_recorder = AudioRecorder()
        
        self.tools = self._initialize_tools()
        
        self.is_listening = False
        self.shutdown = False

    def _initialize_tools(self):
        """Initializes and returns a dictionary of tools."""
        try:
            return {
                "youtube_player": YoutubePlayer(),
                "web_opener": WebOpener(),
                "time_teller": TimeTeller(),
                "math_solver": MathSolver(self.api_key),
                "todo_manager": TodoManager(),
            }
        except Exception as e:
            print(f"Error initializing tools: {e}")
            return {}

    def speak(self, text: str):
        """Add text to the TTS queue to be spoken."""
        self.tts_manager.speak(text)

    def handle_conversation(self, query: str):
        """Handle general conversation queries"""
        try:
            print(f"Handling conversation: {query}")
            response = self.intent_parser.client.chat.completions.create(
                model="DeepSeek-V3.1",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a helpful voice assistant. Keep responses brief, natural, and conversational. Avoid long explanations unless specifically asked."
                    },
                    {
                        "role": "user", 
                        "content": query
                    }
                ],
                temperature=0.7,
                top_p=0.9,
                max_tokens=150
            )
            response_text = response.choices[0].message.content.strip()
            self.speak(response_text)
        except Exception as e:
            print(f"Conversation handling error: {e}")
            self.speak("Sorry, I encountered an error processing your request.")

    def is_caps_lock_on(self) -> bool:
        """Check if Caps Lock is currently active (Windows only)"""
        try:
            return ctypes.windll.user32.GetKeyState(0x14) & 0xFFFF != 0
        except:
            return False

    def run(self):
        """Main run loop"""
        print("Voice Assistant Started!")
        print("Press and hold Caps Lock to speak, release to process")
        
        self.speak("Voice assistant ready. Press caps lock to talk to me.")
        
        caps_lock_pressed = False
        
        try:
            while not self.shutdown:
                try:
                    current_caps_state = self.is_caps_lock_on()
                    
                    if current_caps_state and not caps_lock_pressed and not self.tts_manager.is_speaking:
                        caps_lock_pressed = True
                        self.is_listening = True
                        
                        audio_path, has_speech = self.audio_recorder.record_audio()
                        self.is_listening = False
                        
                        if has_speech and audio_path:
                            print("Processing audio...")
                            self.speak("Processing your request")
                            
                            transcribed_text = self.transcriber.transcribe(audio_path)
                            print(f"Transcribed: '{transcribed_text}'")
                            
                            if transcribed_text.strip():
                                intent = self.intent_parser.get_intent(transcribed_text)
                                print(f"Intent: {intent}")
                                process_intent(self, intent, transcribed_text)
                            else:
                                self.speak("I didn't catch that. Could you repeat?")
                            
                            if os.path.exists(audio_path):
                                os.remove(audio_path)
                        else:
                            self.speak("No speech detected. Try speaking louder.")
                    
                    elif not current_caps_state and caps_lock_pressed:
                        caps_lock_pressed = False
                    
                    time.sleep(0.1)
                    
                except KeyboardInterrupt:
                    print("Shutting down voice assistant...")
                    self.shutdown = True
                except Exception as e:
                    print(f"Unexpected error in main loop: {e}")
                    time.sleep(1)
        
        finally:
            self.shutdown = True
            self.speak("Goodbye!")
            self.tts_manager.stop()
