
import pyttsx3
import datetime

class TimeTeller:
    def tell_time(self):
        now = datetime.datetime.now()
        return f"The current time is {now.strftime('%I:%M %p')}"

