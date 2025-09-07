# Python Voice Assistant with Vapi Integration

A voice assistant that listens for a wake word, connects to the Vapi service for conversation, and manages its state between idle and chatting.

## Features

- Wake word detection ("Hey", "Oye").
- Two states: `idle` (listening for wake word) and `chatting` (connected to Vapi).
- Automatic connection to Vapi on wake word detection.
- Disconnection from Vapi after a period of inactivity.

## Requirements

- `speechrecognition`
- `pyaudio`
- `vapi`

## Development Plan (To-Do)

- [ ] Setup project structure.
- [ ] Create `main.py` with the main application logic.
- [ ] Implement the `idle` state with wake word detection using `speechrecognition`.
- [ ] Implement the `chatting` state with Vapi integration.
- [ ] Implement state transitions between `idle` and `chatting`.
- [ ] Add error handling.
- [ ] (Optional) Add configuration for Vapi API keys.
- [ ] (Optional) Implement a timeout to disconnect from Vapi and return to the `idle` state.

## Usage

1. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the application:
   ```bash
   python main.py
   ```
"# python-assistant" 
