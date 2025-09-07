import pyaudio
import wave
import audioop
from typing import Optional, Tuple

class AudioRecorder:
    def __init__(self):
        self.CHUNK = 1024
        self.FORMAT = pyaudio.paInt16
        self.CHANNELS = 1
        self.RATE = 16000
        self.SILENCE_THRESHOLD = 300
        self.MIN_RECORD_SECONDS = 1
        self.MAX_RECORD_SECONDS = 10

    def record_audio(self, file_path: str = "temp_audio.wav") -> Tuple[Optional[str], bool]:
        """Record audio with improved voice activity detection"""
        try:
            p = pyaudio.PyAudio()
            
            default_device = p.get_default_input_device_info()
            
            stream = p.open(
                format=self.FORMAT,
                channels=self.CHANNELS,
                rate=self.RATE,
                input=True,
                frames_per_buffer=self.CHUNK,
                input_device_index=default_device['index']
            )

            print("* Recording... (speak now)")
            
            frames = []
            silent_chunks = 0
            audio_started = False
            total_chunks = 0
            max_chunks = int(self.RATE / self.CHUNK * self.MAX_RECORD_SECONDS)
            min_chunks = int(self.RATE / self.CHUNK * self.MIN_RECORD_SECONDS)

            while total_chunks < max_chunks:
                try:
                    data = stream.read(self.CHUNK, exception_on_overflow=False)
                    frames.append(data)
                    
                    rms = audioop.rms(data, 2)
                    total_chunks += 1
                    
                    if rms > self.SILENCE_THRESHOLD:
                        audio_started = True
                        silent_chunks = 0
                    else:
                        silent_chunks += 1
                    
                    if audio_started and silent_chunks > 20 and total_chunks > min_chunks:
                        break
                        
                except Exception as e:
                    print(f"Error reading audio chunk: {e}")
                    break

            print("* Finished recording")

            stream.stop_stream()
            stream.close()
            p.terminate()

            if not audio_started or total_chunks < min_chunks:
                return None, False

            try:
                wf = wave.open(file_path, 'wb')
                wf.setnchannels(self.CHANNELS)
                wf.setsampwidth(p.get_sample_size(self.FORMAT))
                wf.setframerate(self.RATE)
                wf.writeframes(b''.join(frames))
                wf.close()
                return file_path, True
            except Exception as e:
                print(f"Error saving audio file: {e}")
                return None, False

        except Exception as e:
            print(f"Recording error: {e}")
            return None, False
