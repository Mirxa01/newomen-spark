"use client";

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
import { PageLoader } from "@/components/ui/loading-skeleton";
import { supabase } from "@/integrations/supabase/client";
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
  AlertCircle,
  Loader2
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
  const { user, profile, subscription, loading, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [intensity, setIntensity] = useState<IntensityMode>("direct");
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const voiceMinutesUsed = subscription?.voice_minutes_used || 0;
  const voiceMinutesLimit = subscription?.voice_minutes_limit || 5;
  const voiceMinutesRemaining = Math.max(0, voiceMinutesLimit - voiceMinutesUsed);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && user && profile && !profile.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [user, profile, loading, navigate]);

  useEffect(() => {
    if (profile?.intensity_preference) {
      setIntensity(profile.intensity_preference as IntensityMode);
    }
  }, [profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isSessionActive) {
      sessionTimerRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    }
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isSessionActive]);

  const startNewSession = async () => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, intensity_preference: intensity })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating session:", error);
      return null;
    }
    setCurrentSessionId(data.id);
    return data.id;
  };

  const processUserInput = async (input: string) => {
    if (!input.trim() || !user || !session) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = await startNewSession();
    }
    if (!sessionId) return;

    const lowerInput = input.toLowerCase();
    for (const word of stopWords) {
      if (lowerInput.includes(word)) {
        handleStopWord(word);
        return;
      }
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
      saved: true
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsSessionActive(true);
    setIsProcessing(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/newme-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          intensity,
          sessionId,
          memoryConsent: profile?.memory_consent ?? true
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
        saved: true
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: err.message || "Failed to get response from NewMe",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStopWord = (stopWord: string) => {
    if (stopWord === "pause") {
      setIsSessionActive(false);
      toast({ title: "Session paused" });
    } else if (stopWord === "switch tone") {
      const modes: IntensityMode[] = ["soft", "direct", "no_mercy"];
      const next = modes[(modes.indexOf(intensity) + 1) % modes.length];
      setIntensity(next);
      toast({ title: `Switched to ${next} tone` });
    }
    // Add other stop word logic here
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    processUserInput(textInput);
    setTextInput("");
  };

  const startRecording = async () => {
    if (voiceMinutesRemaining <= 0) {
      toast({
        variant: "destructive",
        title: "No minutes remaining",
        description: "Please upgrade your plan to use voice chat.",
      });
      return;
    }
    setIsRecording(true);
    // Placeholder for real audio recording logic
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Placeholder for audio transcription + processing
  };

  if (loading || !profile) return <Layout><PageLoader /></Layout>;

  const intensityIcons = { soft: Heart, direct: Zap, no_mercy: Flame };
  const IntensityIcon = intensityIcons[intensity];

  return (
    <Layout showParticles={false}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">
              Speak with <span className="text-gradient-primary">NewMe</span>
            </h1>
            <p className="text-sm text-muted-foreground">Astrological psychology guide</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const modes: IntensityMode[] = ["soft", "direct", "no_mercy"];
                setIntensity(modes[(modes.indexOf(intensity) + 1) % modes.length]);
              }}
              className="gap-2"
            >
              <IntensityIcon className="h-4 w-4" />
              <span className="capitalize">{intensity.replace("_", " ")}</span>
            </Button>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {voiceMinutesRemaining} min left
            </Badge>
          </div>
        </div>

        <Card className="glass-card mb-4 min-h-[500px] flex flex-col">
          <CardHeader className="py-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base">NewMe</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {isSessionActive ? `Session: ${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60).toString().padStart(2, '0')}` : "Ready"}
                  </p>
                </div>
              </div>
              {isSessionActive && (
                <Button variant="ghost" size="sm" onClick={() => setIsSessionActive(false)}>
                  <X className="h-4 w-4 mr-1" /> End
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                  <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Hello, {profile.nickname}</p>
                  <p className="text-sm">Speak or type to begin your session.</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 ${m.role === "user" ? "bg-primary text-primary-foreground" : "glass"}`}>
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="glass rounded-2xl p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border/50">
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
                <Button
                  size="icon"
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim() || isProcessing}
                  className="bg-gradient-primary h-auto"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}