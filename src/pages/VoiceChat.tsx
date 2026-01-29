import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  Mic, 
  MicOff, 
  MessageSquare, 
  Clock, 
  Sparkles, 
  X, 
  Send,
  Volume2,
  VolumeX,
  Flame,
  Heart,
  Zap,
  Save,
  Trash2,
  AlertCircle
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  saved?: boolean;
}

type IntensityMode = "soft" | "direct" | "no_mercy";

const stopWords = ["pause", "ground", "switch tone", "stop memory"];

export default function VoiceChat() {
  const { user, profile, subscription, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  
  // Conversation state
  const [messages, setMessages] = useState<Message[]>([]);
  const [intensity, setIntensity] = useState<IntensityMode>("direct");
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  // Voice minutes
  const voiceMinutesUsed = subscription?.voice_minutes_used || 0;
  const voiceMinutesLimit = subscription?.voice_minutes_limit || 5;
  const voiceMinutesRemaining = Math.max(0, voiceMinutesLimit - voiceMinutesUsed);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && user && profile && !profile.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [user, profile, loading, navigate]);

  // Set initial intensity from profile
  useEffect(() => {
    if (profile?.intensity_preference) {
      setIntensity(profile.intensity_preference);
    }
  }, [profile]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Session timer
  useEffect(() => {
    if (isSessionActive) {
      sessionTimerRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    }
    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, [isSessionActive]);

  // Check for stop words in user input
  const checkForStopWords = (text: string): string | null => {
    const lowerText = text.toLowerCase();
    for (const word of stopWords) {
      if (lowerText.includes(word)) {
        return word;
      }
    }
    return null;
  };

  // Handle stop word responses
  const handleStopWord = (stopWord: string) => {
    switch (stopWord) {
      case "pause":
        toast({
          title: "Taking a pause",
          description: "Take all the time you need. I'm here when you're ready.",
        });
        break;
      case "ground":
        addAssistantMessage(
          "Let's ground together. Take a deep breath. Feel your feet on the floor. " +
          "You are safe. You are present. What do you notice around you right now?"
        );
        break;
      case "switch tone": {
        const newIntensity: IntensityMode = 
          intensity === "soft" ? "direct" : 
          intensity === "direct" ? "no_mercy" : "soft";
        setIntensity(newIntensity);
        toast({
          title: "Intensity changed",
          description: `Switched to ${newIntensity.replace("_", " ")} mode.`,
        });
        break;
      }
      case "stop memory":
        toast({
          title: "Memory paused",
          description: "I won't remember anything from this point until you say otherwise.",
        });
        break;
    }
  };

  // Generate unique message ID
  const generateMessageId = () => {
    return crypto.randomUUID();
  };

  // Add a message from the assistant
  const addAssistantMessage = (content: string) => {
    const newMessage: Message = {
      id: generateMessageId(),
      role: "assistant",
      content,
      timestamp: new Date(),
      saved: profile?.memory_consent ?? true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Add a message from the user
  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: generateMessageId(),
      role: "user",
      content,
      timestamp: new Date(),
      saved: profile?.memory_consent ?? true,
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  // Start voice recording (placeholder for ElevenLabs integration)
  const startRecording = async () => {
    if (voiceMinutesRemaining <= 0) {
      toast({
        variant: "destructive",
        title: "Voice minutes exhausted",
        description: "You've used all your voice minutes. Upgrade your plan or switch to text mode.",
      });
      return;
    }

    setIsRecording(true);
    setIsSessionActive(true);
    
    // Placeholder: In production, this would start the ElevenLabs voice recording
    toast({
      title: "Voice mode activated",
      description: "Hold the button and speak. Release when done.",
    });
  };

  // Stop voice recording
  const stopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      // Placeholder: In production, this would process the audio with ElevenLabs
      const mockTranscript = "This is a simulated voice message for demo purposes.";
      processUserInput(mockTranscript);
      setIsProcessing(false);
    }, 1000);
  };

  // Process user input (text or transcribed voice)
  const processUserInput = (input: string) => {
    if (!input.trim()) return;

    // Check for stop words
    const detectedStopWord = checkForStopWords(input);
    if (detectedStopWord) {
      handleStopWord(detectedStopWord);
      addUserMessage(input);
      return;
    }

    // Add user message
    addUserMessage(input);
    setIsSessionActive(true);

    // Generate response based on intensity
    setIsProcessing(true);
    setTimeout(() => {
      const response = generateResponse(input);
      addAssistantMessage(response);
      setIsProcessing(false);
    }, 1500);
  };

  // Generate response based on intensity (placeholder for AI integration)
  const generateResponse = (input: string): string => {
    const userName = profile?.nickname || "there";
    
    const responses: Record<IntensityMode, string[]> = {
      soft: [
        `${userName}, I hear you. What you're feeling is valid. Can you tell me more about what brought this up?`,
        `Thank you for sharing that with me, ${userName}. I sense there's something deeper here. What does your heart want to say?`,
        `${userName}, I'm here with you. Take your time. What would feel supportive right now?`,
      ],
      direct: [
        `${userName}, I notice a pattern here. You've mentioned something similar before. What do you think keeps bringing you back to this?`,
        `Let's get real for a moment, ${userName}. What's the truth you're avoiding in what you just said?`,
        `${userName}, that's interesting. But I'm curious - is that what you really feel, or what you think you should feel?`,
      ],
      no_mercy: [
        `${userName}, you know exactly what's going on here. Stop dancing around it. What are you afraid to admit?`,
        `I'm going to be blunt, ${userName}. You keep telling this same story. When are you going to write a new one?`,
        `${userName}, that's the comfortable lie you tell yourself. But we both know the uncomfortable truth, don't we?`,
      ],
    };

    const intensityResponses = responses[intensity];
    return intensityResponses[Math.floor(Math.random() * intensityResponses.length)];
  };

  // Handle text input submission
  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    processUserInput(textInput);
    setTextInput("");
  };

  // Toggle memory save for a message
  const toggleMessageSave = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, saved: !msg.saved } : msg
      )
    );
  };

  // Delete a message
  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  // End session
  const endSession = () => {
    setIsSessionActive(false);
    if (messages.length > 0) {
      toast({
        title: "Session ended",
        description: `You spoke for ${formatDuration(sessionDuration)}. Your insights have been saved.`,
      });
    }
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  const intensityIcons = {
    soft: Heart,
    direct: Zap,
    no_mercy: Flame,
  };

  const IntensityIcon = intensityIcons[intensity];

  return (
    <Layout showParticles={false}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">
              Speak with <span className="text-gradient-primary">NewMe</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Your astrological psychology guide
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Intensity Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const modes: IntensityMode[] = ["soft", "direct", "no_mercy"];
                  const currentIndex = modes.indexOf(intensity);
                  const nextIndex = (currentIndex + 1) % modes.length;
                  setIntensity(modes[nextIndex]);
                }}
                className="gap-2"
              >
                <IntensityIcon className="h-4 w-4" />
                <span className="capitalize">{intensity.replace("_", " ")}</span>
              </Button>
            </div>
            
            {/* Voice Minutes */}
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {voiceMinutesRemaining} min left
            </Badge>
          </div>
        </div>

        {/* Warning for low minutes */}
        {voiceMinutesRemaining <= 1 && (
          <Card className="glass-card border-destructive/50 mb-4">
            <CardContent className="py-3 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm">
                You have less than 1 minute of voice time remaining.{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/membership")}>
                  Upgrade your plan
                </Button>{" "}
                or use text mode.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Chat Area */}
        <Card className="glass-card mb-4">
          <CardHeader className="py-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base">NewMe</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {isSessionActive ? `Session: ${formatDuration(sessionDuration)}` : "Ready to connect"}
                  </p>
                </div>
              </div>
              {isSessionActive && (
                <Button variant="ghost" size="sm" onClick={endSession}>
                  <X className="h-4 w-4 mr-1" />
                  End
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                  <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">
                    Hello, {profile.nickname || "beautiful soul"}
                  </p>
                  <p className="text-sm max-w-md">
                    I'm NewMe, your astrological psychology guide. 
                    Press and hold the microphone button to speak, or switch to text mode.
                  </p>
                  <p className="text-xs mt-4 opacity-70">
                    Stop words: "Pause", "Ground", "Switch tone", "Stop memory"
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "glass"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </span>
                        {profile.memory_consent && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                              onClick={() => toggleMessageSave(message.id)}
                            >
                              <Save 
                                className={`h-3 w-3 ${message.saved ? "fill-current" : ""}`} 
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                              onClick={() => deleteMessage(message.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50">
              {isTextMode ? (
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleTextSubmit();
                      }
                    }}
                    className="min-h-[60px] resize-none"
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      size="icon"
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim() || isProcessing}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsTextMode(false)}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    size="lg"
                    className={`w-20 h-20 rounded-full transition-all duration-300 ${
                      isRecording
                        ? "bg-destructive hover:bg-destructive/90 animate-pulse-glow"
                        : "bg-gradient-primary hover:opacity-90"
                    }`}
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={() => isRecording && stopRecording()}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    onKeyDown={(e) => {
                      if ((e.key === " " || e.key === "Enter") && !isRecording) {
                        e.preventDefault();
                        startRecording();
                      }
                    }}
                    onKeyUp={(e) => {
                      if ((e.key === " " || e.key === "Enter") && isRecording) {
                        e.preventDefault();
                        stopRecording();
                      }
                    }}
                    disabled={isProcessing || voiceMinutesRemaining <= 0}
                    aria-label={isRecording ? "Release to stop recording" : "Hold to record"}
                    aria-pressed={isRecording}
                  >
                    {isRecording ? (
                      <MicOff className="h-8 w-8" />
                    ) : (
                      <Mic className="h-8 w-8" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsTextMode(true)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Usage Indicator */}
        <Card className="glass-card">
          <CardContent className="py-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Voice minutes used this period</span>
              <span className="font-medium">{voiceMinutesUsed}/{voiceMinutesLimit} min</span>
            </div>
            <Progress 
              value={(voiceMinutesUsed / voiceMinutesLimit) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
