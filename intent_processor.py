def process_intent(assistant, intent: dict, transcribed_text: str):
    """Process the parsed intent and execute appropriate actions."""
    print(f"Processing intent: {intent}")
    
    if not intent or not intent.get("tools_to_activate"):
        assistant.handle_conversation(transcribed_text)
        return

    tools_to_activate = intent["tools_to_activate"]
    
    for tool_name, params in tools_to_activate.items():
        print(f"Activating tool: {tool_name} with params: {params}")
        
        try:
            if tool_name == "youtube":
                search_query = params.get("search_query", "")
                if search_query:
                    assistant.tools["youtube_player"].play_song(search_query)
                    assistant.speak(f"Playing {search_query} on YouTube")
                else:
                    assistant.speak("What would you like me to play?")
            
            elif tool_name == "instagram":
                search_query = params.get("search_query", "")
                assistant.tools["web_opener"].open_website("instagram", search_query)
                assistant.speak(f"Opening Instagram with {search_query}")
            
            elif tool_name == "facebook":
                search_query = params.get("search_query", "")
                assistant.tools["web_opener"].open_website("facebook", search_query)
                assistant.speak(f"Opening Facebook with {search_query}")
            
            elif tool_name == "time_teller":
                time_string = assistant.tools["time_teller"].tell_time()
                assistant.speak(f"The time is {time_string}")
            
            elif tool_name == "math_solver":
                equation = params.get("equation", "")
                if equation:
                    result = assistant.tools["math_solver"].solve_equation(equation)
                    assistant.speak(f"The answer is {result}")
                else:
                    assistant.speak("What math problem would you like me to solve?")
            
            elif tool_name == "todos_system":
                action = params.get("action", "")
                content = params.get("content", "")
                
                if action == "add" and content:
                    assistant.tools["todo_manager"].add_todo(content)
                    assistant.speak(f"Added '{content}' to your todos")
                elif action == "read":
                    assistant.speak(assistant.tools["todo_manager"].list_todos())
                elif action == "delete" and content:
                    success = assistant.tools["todo_manager"].delete_todo(content)
                    if success:
                        assistant.speak(f"Removed '{content}' from your todos")
                    else:
                        assistant.speak(f"Could not find '{content}' in your todos")
                else:
                    assistant.speak("What would you like me to do with your todos?")
            
            elif tool_name == "conversation":
                query = params.get("query", transcribed_text)
                if "time" in query.lower():
                    time_string = assistant.tools["time_teller"].tell_time()
                    assistant.speak(f"The time is {time_string}")
                else:
                    assistant.handle_conversation(query)
            
            else:
                assistant.speak(f"I don't know how to use the {tool_name} tool")
                
        except Exception as e:
            print(f"Error executing tool {tool_name}: {e}")
            assistant.speak(f"Sorry, I encountered an error with {tool_name}")
