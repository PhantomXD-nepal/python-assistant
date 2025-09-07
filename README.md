# Python Voice Assistant

This is a voice assistant that listens for user commands, understands the intent, and performs actions using a variety of tools. The assistant is activated by pressing the Caps Lock key.

## How it Works

1.  **Activation**: The assistant is activated by pressing and holding the Caps Lock key.
2.  **Audio Recording**: When activated, it records audio from the user.
3.  **Transcription**: The recorded audio is transcribed into text using the SambaNova API.
4.  **Intent Parsing**: The transcribed text is parsed to understand the user's intent and identify the appropriate tool to use.
5.  **Tool Execution**: The corresponding tool is executed to perform the requested action.
6.  **Response**: The assistant provides a spoken response to the user.

## Features

-   **Voice-activated**: Uses Caps Lock as a push-to-talk button.
-   **Modular Tool System**: Easily extendable with new tools.
-   **Text-to-Speech**: Provides spoken feedback.

## Available Tools

The assistant currently supports the following tools:

-   **YouTube Player**: Plays YouTube videos.
-   **Web Opener**: Opens websites in a web browser.
-   **Time Teller**: Tells the current time.
-   **Math Solver**: Solves mathematical problems.
-   **Todo Manager**: Manages a to-do list.
-   **Google Searcher**: Performs Google searches.
-   **Wikipedia Searcher**: Searches for information on Wikipedia.

## Requirements

The following Python packages are required:

-   `pyaudio`
-   `openai`
-   `edge-tts`
-   `playsound==1.2.2`

You will also need a SambaNova API key for transcription and intent parsing.

## Usage

1.  Install the required packages:
    ```bash
    pip install -r requirements.txt
    ```
2.  Set your SambaNova API key in `voice_assistant.py`.
3.  Run the application:
    ```bash
    python main.py
    ```
4.  Press and hold the Caps Lock key to speak to the assistant.