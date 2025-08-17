"use client";

import { useEffect, useRef, useState } from "react";
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { CompanionComponentProps, SavedMessage } from "@/types";
import { createTeacherSession, sendMessageToSambaNova } from "@/lib/actions/teacher.actions";
import { getUser, updateUserDuration } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const CompanionComponent = ({
  companionId,
  subject,
  topic,
  name,
  userName,
  userImage,
  style,
  voice,
}: CompanionComponentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [user, setUser] = useState({ duration: 0 });
  const [callDuration, setCallDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState("");

  const handleSendMessage = async () => {
    if (currentMessage.trim() === "") return;

    const newUserMessage = { role: "user", content: currentMessage };
    setChatMessages((prev) => [...prev, newUserMessage]);

    setCurrentMessage("");

    try {
      const aiResponse = await sendMessageToSambaNova([...chatMessages, newUserMessage]);
      setChatMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      console.log("Error object:", JSON.stringify(error, Object.getOwnPropertyNames(error))); // Log the full error object
      if (error.message.includes("chat instances") || error.message.includes("duration")) {
        setLimitModalMessage(error.message);
        setIsLimitModalOpen(true);
      } else {
        setChatMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not get a response." }]);
      }
    }
  };

  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const callStartTime = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) {
        lottieRef.current?.play();
      } else {
        lottieRef.current?.stop();
      }
    }
  }, [isSpeaking, lottieRef]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === CallStatus.ACTIVE) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      callStartTime.current = Date.now();
    };

    const onCallEnd = async () => {
            const transcript = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const { sessionId } = await createTeacherSession({ teacherId: companionId, transcript });
      setCallStatus(CallStatus.FINISHED);
      if (callStartTime.current) {
        const duration = (Date.now() - callStartTime.current) / 1000;
        const newDuration = user.duration - duration;
        updateUserDuration(newDuration);
      }
      router.push(`/session-summary/${sessionId}`);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [newMessage, ...prev]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.log("Error", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, [messages, user.duration]);

  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleCall = async () => {
    if (user.duration <= 0) {
      router.push("/plans");
      return;
    }

    setCallStatus(CallStatus.CONNECTING);

    const assistantOverrides = {
      variableValues: { subject, topic, style },
      clientMessages: ["transcript"],
      serverMessages: [],
    };


    console.log('Starting call with voice:', voice, 'and style:', style);
        // @ts-expect-error
    vapi.start(configureAssistant(voice, style), assistantOverrides);
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  

  const formatDuration = (seconds: number) => {
    
    const minutes = Math.floor(Math.floor(seconds) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <section className="flex flex-col h-[70vh]">
      <section className="flex gap-8 max-sm:flex-col">
        <div className="companion-section">
          <div
            className="companion-avatar"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === CallStatus.FINISHED ||
                  callStatus === CallStatus.INACTIVE
                  ? "opacity-1001"
                  : "opacity-0",
                callStatus === CallStatus.CONNECTING &&
                  "opacity-100 animate-pulse"
              )}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={150}
                height={150}
                className="max-sm:w-fit"
              />
            </div>

            <div
              className={cn(
                "absolute transition-opacity duration-1000",
                callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0"
              )}
            >
              <Lottie
                  lottieRef={lottieRef}
                  animationData={require("@/public/soundwaves.json")}
                  loop={true}
                  autoplay={false}
                  className="companion-lottie"
                />
            </div>
          </div>
          <p className="font-bold text-2xl">{name}</p>
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="text-lg">
              {callStatus === CallStatus.INACTIVE
                ? "Ready to start a session."
                : callStatus === CallStatus.CONNECTING
                ? "Connecting to your companion..."
                : callStatus === CallStatus.ACTIVE
                ? "Session in progress."
                : "Session finished."}
            </p>
          </div>
        </div>

        <div className="user-section">
          <div className="user-avatar">
            <Image
              src={userImage}
              alt={userName}
              width={130}
              height={130}
              className="rounded-lg"
            />
            <p className="font-bold text-2xl">{userName}</p>
          </div>
          <div className="text-center">
            <p>Time Remaining: {formatDuration(user.duration - callDuration)}</p>
          </div>
          <button
            className="btn-mic"
            onClick={toggleMicrophone}
            disabled={callStatus !== CallStatus.ACTIVE}
          >
            <Image
              src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"}
              alt="mic"
              width={36}
              height={36}
            />
            <p className="max-sm:hidden">
              {isMuted ? "Turn on microphone" : "Turn off microphone"}
            </p>
          </button>
          <button
            className={cn(
              "rounded-lg py-2 cursor-pointer transition-colors w-full text-white",
              callStatus === CallStatus.ACTIVE ? "bg-red-700" : "bg-primary",
              callStatus === CallStatus.CONNECTING && "animate-pulse"
            )}
            onClick={
              callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall
            }
          >
            {callStatus === CallStatus.ACTIVE
              ? "End Session"
              : callStatus === CallStatus.CONNECTING
              ? "Connecting"
              : "Start Session"}
          </button>
        </div>
      </section>

      <section className="mt-8 p-4 border rounded-lg flex flex-col h-[400px]">
        <h2 className="text-2xl font-bold mb-4">Chat with {name}</h2>
        <div className="flex-1 overflow-y-auto mb-4 p-2 border rounded-lg bg-gray-50">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block p-2 rounded-lg ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </section>
    </section>
  );
};

export default CompanionComponent;

