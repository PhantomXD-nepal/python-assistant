import asyncio
import edge_tts
import os
from playsound import playsound
import threading
from queue import Queue

class TTSManager:
    def __init__(self):
        self.queue = Queue()
        self.thread = threading.Thread(target=self._worker, daemon=True)
        self.is_speaking = False
        self.shutdown = False
        self.thread.start()
        self.VOICE = "en-US-AriaNeural"  # A good default voice

    async def _generate_speech(self, text, path):
        """Asynchronously generates speech and saves to a file."""
        try:
            communicate = edge_tts.Communicate(text, self.VOICE)
            await communicate.save(path)
        except Exception as e:
            print(f"Error during speech generation: {e}")

    def _worker(self):
        """Worker thread to process TTS requests from the queue."""
        while not self.shutdown:
            try:
                text = self.queue.get(timeout=1)
                if text is None:  # Shutdown signal
                    break

                self.is_speaking = True
                output_file = f"temp_speech_{threading.get_ident()}.mp3"
                
                try:
                    # Run the async function in a new event loop for this thread
                    asyncio.run(self._generate_speech(text, output_file))
                    
                    if os.path.exists(output_file):
                        playsound(output_file)
                        os.remove(output_file)
                        
                except Exception as e:
                    print(f"TTS worker error: {e}")
                finally:
                    self.is_speaking = False
                    self.queue.task_done()

            except:
                # Queue timeout, continue loop
                continue

    def speak(self, text: str):
        """Adds text to the TTS queue."""
        if text and text.strip():
            self.queue.put(text)

    def stop(self):
        """Stops the TTS manager and cleans up."""
        self.shutdown = True
        self.queue.put(None)  # Signal worker to exit
        self.thread.join(timeout=2)