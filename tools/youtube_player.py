
import webbrowser

class YoutubePlayer:
    def play_song(self, song_name):
        url = f"https://www.youtube.com/results?search_query={song_name}"
        webbrowser.open(url)

