import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getSupabase } from "@/lib/supabase";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Globe, User, Calendar, Brain, Flame, Shield } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: OnboardingStep[] = [
  { id: "language", title: "Language & Region", description: "Choose your preferred language", icon: Globe },
  { id: "nickname", title: "Your Name", description: "What should NewMe call you?", icon: User },
  { id: "dob", title: "Date of Birth", description: "For astrological psychology insights", icon: Calendar },
  { id: "assessment", title: "Deep Dive", description: "10 questions to understand you", icon: Brain },
  { id: "intensity", title: "Intensity Level", description: "How direct should NewMe be?", icon: Flame },
  { id: "consent", title: "Memory & Privacy", description: "Your data, your rules", icon: Shield },
];

const assessmentQuestions = [
  { id: 1, question: "When faced with conflict, I typically...", options: ["Avoid it completely", "Address it head-on", "Seek compromise", "Analyze before acting"] },
  { id: 2, question: "My inner critic is...", options: ["Constantly loud", "Occasionally present", "Mostly quiet", "Almost silent"] },
  { id: 3, question: "In relationships, I fear most...", options: ["Abandonment", "Engulfment", "Betrayal", "Being truly seen"] },
  { id: 4, question: "When I'm stressed, I...", options: ["Withdraw completely", "Seek connection", "Take control", "Distract myself"] },
  { id: 5, question: "My relationship with my emotions is...", options: ["Disconnected", "Overwhelming", "Controlled", "Flowing"] },
  { id: 6, question: "I find it hardest to...", options: ["Ask for help", "Set boundaries", "Express anger", "Show vulnerability"] },
  { id: 7, question: "My biggest shadow trait is...", options: ["Perfectionism", "People-pleasing", "Control", "Self-sabotage"] },
  { id: 8, question: "In my childhood, I learned to...", options: ["Be invisible", "Be the caretaker", "Be perfect", "Be tough"] },
  { id: 9, question: "I feel most alive when...", options: ["Creating something", "Connecting deeply", "Achieving goals", "Being spontaneous"] },
  { id: 10, question: "My transformation goal is...", options: ["Self-acceptance", "Authentic expression", "Emotional freedom", "Purpose clarity"] },
];

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  // Form data
  const [language, setLanguage] = useState("en");
  const [nickname, setNickname] = useState("");
  const [dob, setDob] = useState("");
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
  const [intensity, setIntensity] = useState<"soft" | "direct" | "no_mercy">("direct");
  const [memoryConsent, setMemoryConsent] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (profile?.onboarding_completed) {
      navigate("/dashboard");
    }
  }, [user, profile, navigate]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const calculateHoroscope = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const supabase = await getSupabase();
      if (!supabase) {
        throw new Error("Backend not configured");
      }

      const horoscope = dob ? calculateHoroscope(dob) : null;
      
      const { error } = await supabase
        .from("profiles")
        .update({
          nickname,
          language,
          date_of_birth: dob || null,
          horoscope_sign: horoscope,
          intensity_preference: intensity,
          memory_consent: memoryConsent,
          psychological_profile: { assessment_answers: assessmentAnswers },
          onboarding_completed: true,
          onboarding_step: steps.length,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      // Create discovery subscription
      await supabase.from("subscriptions").insert({
        user_id: user.id,
        tier: "discovery",
        status: "active",
        voice_minutes_limit: 5,
        voice_minutes_used: 0,
      });

      await refreshProfile();

      toast({
        title: "Welcome to Newomen!",
        description: "Your journey of self-discovery begins now.",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case "language":
        return !!language;
      case "nickname":
        return nickname.trim().length >= 2;
      case "dob":
        return true; // Optional
      case "assessment":
        return Object.keys(assessmentAnswers).length >= 5; // At least 5 answered
      case "intensity":
        return !!intensity;
      case "consent":
        return true;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case "language":
        return (
          <div className="space-y-4">
            <RadioGroup value={language} onValueChange={setLanguage}>
              {languages.map((lang) => (
                <div key={lang.code} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={lang.code} id={lang.code} />
                  <Label htmlFor={lang.code} className="flex-1 cursor-pointer">{lang.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "nickname":
        return (
          <div className="space-y-4">
            <Input
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="text-lg py-6"
            />
            <p className="text-sm text-muted-foreground">
              This is how NewMe will address you. Choose something that feels authentic to you.
            </p>
          </div>
        );

      case "dob":
        return (
          <div className="space-y-4">
            <Input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="text-lg py-6"
            />
            <div className="glass p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Why we ask:</strong> Your birth date helps NewMe understand your astrological psychology profile. 
                We use zodiac archetypes as psychological lenses—not for prediction, but for deeper self-understanding.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">This is optional, but recommended for the full experience.</p>
          </div>
        );

      case "assessment":
        return (
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
            {assessmentQuestions.map((q) => (
              <div key={q.id} className="space-y-3">
                <p className="font-medium text-sm">{q.id}. {q.question}</p>
                <RadioGroup
                  value={assessmentAnswers[q.id] || ""}
                  onValueChange={(value) => setAssessmentAnswers({ ...assessmentAnswers, [q.id]: value })}
                >
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`q${q.id}-${option}`} />
                        <Label htmlFor={`q${q.id}-${option}`} className="text-xs cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        );

      case "intensity":
        return (
          <div className="space-y-4">
            <RadioGroup value={intensity} onValueChange={(v) => setIntensity(v as typeof intensity)}>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="soft" id="soft" className="mt-1" />
                  <div>
                    <Label htmlFor="soft" className="font-medium cursor-pointer">Soft & Gentle</Label>
                    <p className="text-sm text-muted-foreground">Supportive, warm, and nurturing approach</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-primary bg-primary/5">
                  <RadioGroupItem value="direct" id="direct" className="mt-1" />
                  <div>
                    <Label htmlFor="direct" className="font-medium cursor-pointer">Direct & Honest</Label>
                    <p className="text-sm text-muted-foreground">Clear, perceptive, occasionally provocative</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="no_mercy" id="no_mercy" className="mt-1" />
                  <div>
                    <Label htmlFor="no_mercy" className="font-medium cursor-pointer">No Mercy</Label>
                    <p className="text-sm text-muted-foreground">Brutally honest, confrontational, no filters</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        );

      case "consent":
        return (
          <div className="space-y-4">
            <RadioGroup value={memoryConsent ? "yes" : "no"} onValueChange={(v) => setMemoryConsent(v === "yes")}>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="yes" id="consent-yes" className="mt-1" />
                  <div>
                    <Label htmlFor="consent-yes" className="font-medium cursor-pointer">Enable Memory</Label>
                    <p className="text-sm text-muted-foreground">
                      NewMe remembers our conversations and tracks patterns over time. You can delete memories anytime.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="no" id="consent-no" className="mt-1" />
                  <div>
                    <Label htmlFor="consent-no" className="font-medium cursor-pointer">No Memory</Label>
                    <p className="text-sm text-muted-foreground">
                      Each session starts fresh. No patterns tracked, no memories stored.
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
            <div className="glass p-4 rounded-lg">
              <p className="text-xs text-muted-foreground">
                You can change this preference anytime in your profile settings. We never share your data with third parties.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <Layout showParticles={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="glass-card">
            <CardHeader className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-4">
                <StepIcon className="h-7 w-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl font-display">{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
            <div className="p-6 pt-0 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="bg-gradient-primary hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
