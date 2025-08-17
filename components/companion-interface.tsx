"use client"
import "katex/dist/katex.min.css"
import { useEffect, useRef, useState } from "react"
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils"
import { vapi } from "@/lib/vapi.sdk"
import Image from "next/image"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import type { CompanionComponentProps, SavedMessage } from "@/types"
import { createTeacherSession, sendMessageToSambaNova } from "@/lib/actions/teacher.actions"
import { getUser, updateUserDuration } from "@/lib/actions/user.actions"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import LimitReachedModal from "./LimitReachedModal"
import MarkdownRenderer from "./MarkdownRenderer"

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
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [messages, setMessages] = useState<SavedMessage[]>([])
  const [user, setUser] = useState({ duration: 0 })
  const [callDuration, setCallDuration] = useState(0)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false)
  const [limitModalMessage, setLimitModalMessage] = useState("")
  const [mode, setMode] = useState<"voice" | "text">("voice")

  const handleSendMessage = async () => {
    if (currentMessage.trim() === "") return

    const newUserMessage = { role: "user", content: currentMessage }
    setChatMessages((prev) => [...prev, newUserMessage])

    setCurrentMessage("")

    try {
      const aiResponse = await sendMessageToSambaNova([...chatMessages, newUserMessage])
      setChatMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
    } catch (error: any) {
      console.error("Error sending message:", error)
      console.log("Error object:", JSON.stringify(error, Object.getOwnPropertyNames(error))) // Log the full error object
      if (error.message.includes("chat instances") || error.message.includes("duration")) {
        setLimitModalMessage(error.message)
        setIsLimitModalOpen(true)
      } else {
        setChatMessages((prev) => [...prev, { role: "assistant", content: "Error: Could not get a response." }])
      }
    }
  }

  const lottieRef = useRef<LottieRefCurrentProps>(null)
  const callStartTime = useRef<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (userData) {
        setUser(userData)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (lottieRef) {
      if (isSpeaking) {
        lottieRef.current?.play()
      } else {
        lottieRef.current?.stop()
      }
    }
  }, [isSpeaking, lottieRef])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (callStatus === CallStatus.ACTIVE) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [callStatus])

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE)
      callStartTime.current = Date.now()
    }

    const onCallEnd = async () => {
      const transcript = messages.map((m) => `${m.role}: ${m.content}`).join("\n")
      const { sessionId } = await createTeacherSession({ teacherId: companionId, transcript })
      setCallStatus(CallStatus.FINISHED)
      if (callStartTime.current) {
        const duration = (Date.now() - callStartTime.current) / 1000
        const newDuration = user.duration - duration
        updateUserDuration(newDuration)
      }
      router.push(`/session-summary/${sessionId}`)
    }

    const onMessage = (message: any) => {
      if (message.type === "transcript") {
        if (message.role === "user") {
          if (message.transcriptType === "partial") {
            setIsListening(true)
          } else if (message.transcriptType === "final") {
            setIsListening(false)
            const newMessage = { role: message.role, content: message.transcript }
            setMessages((prev) => [newMessage, ...prev])
          }
        } else if (message.role === "assistant" && message.transcriptType === "final") {
          const newMessage = { role: message.role, content: message.transcript }
          setMessages((prev) => [newMessage, ...prev])
        }
      }
    }

    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)

    const onError = (error: Error) => console.log("Error", error)

    vapi.on("call-start", onCallStart)
    vapi.on("call-end", onCallEnd)
    vapi.on("message", onMessage)
    vapi.on("error", onError)
    vapi.on("speech-start", onSpeechStart)
    vapi.on("speech-end", onSpeechEnd)

    return () => {
      vapi.off("call-start", onCallStart)
      vapi.off("call-end", onCallEnd)
      vapi.off("message", onMessage)
      vapi.off("error", onError)
      vapi.off("speech-start", onSpeechStart)
      vapi.off("speech-end", onSpeechEnd)
    }
  }, [messages, user.duration, companionId, router])

  const toggleMicrophone = () => {
    const isMuted = vapi.isMuted()
    vapi.setMuted(!isMuted)
    setIsMuted(!isMuted)
  }

  const handleCall = async () => {
    if (user.duration <= 0) {
      setLimitModalMessage("You have no remaining call duration. Please upgrade your plan.")
      setIsLimitModalOpen(true)
      return
    }

    setCallStatus(CallStatus.CONNECTING)

    const assistantOverrides = {
      variableValues: { subject, topic, style },
      clientMessages: ["transcript"],
      serverMessages: [],
    }

    // @ts-expect-error
    vapi.start(configureAssistant(voice, style), assistantOverrides)
  }

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED)
    vapi.stop()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(Math.floor(seconds) / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Companion Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: getSubjectColor(subject) }}
                >
                  <div
                    className={cn(
                      "absolute transition-opacity duration-1000",
                      callStatus === CallStatus.FINISHED || callStatus === CallStatus.INACTIVE
                        ? "opacity-100"
                        : "opacity-0",
                      callStatus === CallStatus.CONNECTING && "opacity-100 animate-pulse",
                    )}
                  >
                    <Image
                      src={`/icons/${subject}.svg`}
                      alt={subject}
                      width={80}
                      height={80}
                      className="md:w-24 md:h-24"
                    />
                  </div>

                  <div
                    className={cn(
                      "absolute transition-opacity duration-1000",
                      callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <Lottie
                      lottieRef={lottieRef}
                      animationData={require("@/public/soundwaves.json")}
                      loop={true}
                      autoplay={false}
                      className="w-20 h-20 md:w-24 md:h-24"
                    />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">{name}</h2>
                  <Badge variant="secondary" className="text-sm">
                    {subject} Tutor
                  </Badge>
                </div>

                <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-4">
                    <p className="text-sm md:text-base text-center text-gray-700 font-medium">
                      {isSpeaking
                        ? "🗣️ Speaking..."
                        : isListening
                          ? "👂 Listening..."
                          : callStatus === CallStatus.INACTIVE
                            ? "✨ Ready to start"
                            : callStatus === CallStatus.CONNECTING
                              ? "🔄 Connecting..."
                              : callStatus === CallStatus.ACTIVE
                                ? "📚 Session active"
                                : "✅ Session complete"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* User Section */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Image
                    src={userImage || "/placeholder.svg"}
                    alt={userName}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-white shadow-lg md:w-32 md:h-32"
                  />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">{userName}</h3>
                  <div className="bg-green-100 px-3 py-1 rounded-full">
                    <p className="text-sm font-medium text-green-800">
                      ⏱️ {formatDuration(user.duration - callDuration)} remaining
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => setMode(mode === "voice" ? "text" : "voice")}
                    className="w-full"
                  >
                    {mode === "voice" ? "💬 Switch to Text" : "🎤 Switch to Voice"}
                  </Button>

                  {mode === "voice" && (
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={toggleMicrophone}
                        disabled={callStatus !== CallStatus.ACTIVE}
                        className="w-full flex items-center gap-2 bg-transparent"
                      >
                        <Image
                          src={isMuted ? "/icons/mic-off.svg" : "/icons/mic-on.svg"}
                          alt="mic"
                          width={20}
                          height={20}
                        />
                        <span className="text-sm">{isMuted ? "Unmute" : "Mute"}</span>
                      </Button>

                      <Button
                        className={cn(
                          "w-full font-semibold py-3 transition-all duration-200",
                          callStatus === CallStatus.ACTIVE
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white",
                          callStatus === CallStatus.CONNECTING && "animate-pulse",
                        )}
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                      >
                        {callStatus === CallStatus.ACTIVE
                          ? "🔴 End Session"
                          : callStatus === CallStatus.CONNECTING
                            ? "🔄 Connecting..."
                            : "🚀 Start Session"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">💬 Chat with {name}</h2>
            </div>

            <div className="p-4 md:p-6">
              <div
                className="h-64 md:h-80 overflow-y-auto mb-4 p-3 md:p-4 bg-gray-50 rounded-lg border-2 border-gray-100 space-y-3"
                style={{ scrollBehavior: "smooth" }}
              >
                {chatMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="text-center">💭 Start a conversation with your AI tutor!</p>
                  </div>
                ) : (
                  chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={cn(
                          "max-w-[85%] md:max-w-[70%] p-3 rounded-2xl shadow-sm",
                          msg.role === "user"
                            ? "bg-blue-500 text-white rounded-br-md"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-md",
                        )}
                      >
                        {msg.role === "assistant" ? (
                          <MarkdownRenderer content={msg.content} />
                        ) : (
                          <p className="text-sm md:text-base">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {mode === "text" && (
                <div className="flex gap-2 md:gap-3">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                    className="flex-1 py-2 md:py-3 text-sm md:text-base"
                  />
                  <Button onClick={handleSendMessage} className="px-4 md:px-6 bg-blue-600 hover:bg-blue-700">
                    <span className="hidden md:inline">Send</span>
                    <span className="md:hidden">📤</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <LimitReachedModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        message={limitModalMessage}
      />
    </div>
  )
}

export default CompanionComponent
