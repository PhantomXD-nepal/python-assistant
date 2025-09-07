1. Play {songName} on Youtube -> use basic sppech recognition and browser 
2. Lauch Ai launches vapi to talk
3. Perfrom this mathematical eqn {equation is given then it is passed to sambanova cloud}
```
from openai import OpenAI

client = OpenAI(
    api_key="<YOUR API KEY>",
    base_url="https://api.sambanova.ai/v1",
)

response = client.chat.completions.create(
    model="DeepSeek-R1-0528",
    messages=[{"role":"system","content":"You are a helpful assistant"},{"role":"user","content":"Hello"}],
    temperature=0.1,
    top_p=0.1
)

print(response.choices[0].message.content)
```

which is saved to a folder called math problem where the ai's detailed answer is saved in a markdown file

4.Open instagram(opens instagram.com) in the browser likewise for youtube, facebook.
5. what is the time? (fetches current time and says through pyttsx3)
6. Todos system by using JSON speech recognition and 

when the audio is being transcribed and response is being sent make it so it responds in following way

{
    "tools_to_activate":{
        "youtube":{
            search_query:{...}
        }
        "instagram":{
            search_query:{...}
        }
        "facebook":{
            search_query:{...}
        }
        time_teller:{},
        todos_system:{
            add:{query} or del:{query} or edit{query} or read{query}
        }
        basic_chatting:{}


    }
        
}