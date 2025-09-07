
import webbrowser

class WebOpener:
    def open_website(self, site_name):
        url = f"https://www.{site_name.lower()}.com"
        webbrowser.open(url)

