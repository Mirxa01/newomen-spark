import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/ui/loading-skeleton";
import { ArrowLeft, ArrowRight, Brain, Heart, Compass, Moon, Star, Sparkles, Clock, CheckCircle, Loader2 } from "lucide-react";

// Color mappings for Tailwind (static classes for purging)
const colorClasses: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  teal: { bg: "bg-teal/10", text: "text-teal" },
  gold: { bg: "bg-gold/10", text: "text-gold" },
  pink: { bg: "bg-pink/10", text: "text-pink" },
  purple: { bg: "bg-purple/10", text: "text-purple" },
  accent: { bg: "bg-accent/10", text: "text-accent" },
};

// Assessment data with questions
const assessmentsData: Record<string, {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: React.ElementType;
  questions: { id: number; question: string; options: string[] }[];
  duration: string;
  color: string;
  resultCategories: { range: [number, number]; title: string; description: string }[];
}> = {
  "shadow-self": {
    id: "shadow-self",
    title: "Shadow Self Discovery",
    description: "Uncover hidden aspects of your personality that influence your behavior and relationships.",
    longDescription: "The shadow self represents the parts of our personality that we've pushed into the unconscious—traits we deny, suppress, or project onto others. This assessment helps you recognize these hidden aspects so you can integrate them into a more complete sense of self.",
    icon: Moon,
    duration: "10 min",
    color: "primary",
    questions: [
      { id: 1, question: "When someone criticizes a trait you don't like about yourself, you typically...", options: ["Get defensive immediately", "Feel hurt but reflect on it", "Dismiss it as their problem", "Acknowledge and work on it"] },
      { id: 2, question: "You find yourself most judgmental of people who are...", options: ["Too emotional", "Too rigid or controlling", "Too passive or weak", "Too attention-seeking"] },
      { id: 3, question: "In your dreams, you often...", options: ["Face threatening situations", "Experience embarrassment", "Feel powerful or aggressive", "Have difficulty remembering them"] },
      { id: 4, question: "When you feel envy towards someone, you usually...", options: ["Deny feeling envious at all", "Criticize them to feel better", "Use it as motivation", "Feel ashamed of the feeling"] },
      { id: 5, question: "Your biggest fear about others seeing the 'real you' is...", options: ["They'd think you're not good enough", "They'd see how angry you really are", "They'd think you're weak", "They'd find you boring or uninteresting"] },
      { id: 6, question: "When you make a mistake, your first instinct is to...", options: ["Blame external circumstances", "Hide it if possible", "Criticize yourself harshly", "Learn from it and move on"] },
      { id: 7, question: "The trait you most deny having is...", options: ["Selfishness", "Jealousy", "Aggression", "Neediness"] },
      { id: 8, question: "In relationships, your hidden pattern tends to be...", options: ["Pushing people away when they get close", "Becoming dependent on approval", "Trying to control or change others", "Losing yourself in the other person"] },
      { id: 9, question: "When you feel powerless, you cope by...", options: ["Withdrawing and isolating", "Trying to control what you can", "Getting angry at others", "Pretending everything is fine"] },
      { id: 10, question: "Your relationship with your own darkness is...", options: ["What darkness? I'm a good person", "I'm aware of it but afraid of it", "I try to use it constructively", "I've made peace with most of it"] },
    ],
    resultCategories: [
      { range: [0, 25], title: "Shadow Awareness Beginner", description: "You may be at the early stages of shadow work. There's significant potential for growth as you begin to acknowledge the parts of yourself you've kept hidden." },
      { range: [26, 50], title: "Shadow Explorer", description: "You're becoming aware of your shadow aspects. Continue this exploration with compassion—what you're discovering is valuable for your growth." },
      { range: [51, 75], title: "Shadow Integrator", description: "You've developed good awareness of your shadow self. The next step is deeper integration—allowing these aspects to inform rather than control your behavior." },
      { range: [76, 100], title: "Shadow Master", description: "You have strong shadow awareness and integration. You likely understand that owning your whole self—light and dark—is the path to authenticity." },
    ],
  },
  "love-language": {
    id: "love-language",
    title: "Love Language Profile",
    description: "Discover how you give and receive love to improve your relationships.",
    longDescription: "Understanding how you naturally express and receive love can transform your relationships. This assessment reveals your primary love language so you can communicate your needs more effectively and understand your partner's needs better.",
    icon: Heart,
    duration: "8 min",
    color: "pink",
    questions: [
      { id: 1, question: "I feel most loved when my partner...", options: ["Tells me they love me", "Gives me a thoughtful gift", "Spends quality time with me", "Does something helpful for me", "Gives me a hug or physical affection"] },
      { id: 2, question: "I'm most hurt when my partner...", options: ["Criticizes me or speaks harshly", "Forgets special occasions", "Is distracted when we're together", "Doesn't help when I need it", "Avoids physical closeness"] },
      { id: 3, question: "To show love, I most naturally...", options: ["Express appreciation verbally", "Give meaningful gifts", "Plan special time together", "Do things to help", "Give hugs and affection"] },
      { id: 4, question: "In a perfect world, my partner would...", options: ["Tell me what they appreciate about me daily", "Surprise me with thoughtful gifts", "Always prioritize our time together", "Take things off my plate without being asked", "Be physically affectionate throughout the day"] },
      { id: 5, question: "I feel disconnected when...", options: ["We go without meaningful conversation", "They seem thoughtless about occasions", "We're always busy with separate activities", "I feel like I'm doing everything alone", "There's no physical intimacy"] },
      { id: 6, question: "The most memorable relationship moment was when...", options: ["They said something that touched my heart", "They gave me the perfect unexpected gift", "We had an amazing day just the two of us", "They went out of their way to help me", "We shared tender physical moments"] },
      { id: 7, question: "I would rather my partner...", options: ["Write me a heartfelt letter", "Buy me something I've wanted", "Take a trip with me", "Handle a stressful task for me", "Hold my hand more often"] },
      { id: 8, question: "When I'm stressed, I need my partner to...", options: ["Tell me it will be okay and they believe in me", "Bring me something to cheer me up", "Just be present with me", "Take something off my list", "Give me a comforting embrace"] },
    ],
    resultCategories: [
      { range: [0, 20], title: "Words of Affirmation", description: "Your primary love language is Words of Affirmation. You feel most loved when you receive verbal compliments, encouragement, and expressions of appreciation." },
      { range: [21, 40], title: "Receiving Gifts", description: "Your primary love language is Receiving Gifts. Thoughtful gifts and symbols of love speak deeply to your heart." },
      { range: [41, 60], title: "Quality Time", description: "Your primary love language is Quality Time. Undivided attention and meaningful shared experiences make you feel most loved." },
      { range: [61, 80], title: "Acts of Service", description: "Your primary love language is Acts of Service. When others do helpful things for you, it speaks volumes about their love." },
      { range: [81, 100], title: "Physical Touch", description: "Your primary love language is Physical Touch. Physical affection and closeness are essential for you to feel connected and loved." },
    ],
  },
  "life-purpose": {
    id: "life-purpose",
    title: "Life Purpose Compass",
    description: "Gain clarity on your deeper calling and what truly motivates you.",
    longDescription: "Finding your life purpose isn't about discovering one perfect job or role—it's about understanding what drives you at your core. This assessment helps you identify your values, strengths, and the impact you're meant to have on the world.",
    icon: Compass,
    duration: "12 min",
    color: "teal",
    questions: [
      { id: 1, question: "When you lose track of time, you're usually...", options: ["Creating something", "Helping or teaching others", "Solving complex problems", "Learning something new", "Connecting with people"] },
      { id: 2, question: "What frustrates you most about the world?", options: ["Injustice and inequality", "Lack of creativity and beauty", "Inefficiency and waste", "Ignorance and closed-mindedness", "Disconnection between people"] },
      { id: 3, question: "You feel most alive when...", options: ["Making a difference in someone's life", "Expressing yourself authentically", "Overcoming a challenge", "Discovering something new", "Building meaningful relationships"] },
      { id: 4, question: "As a child, you dreamed of...", options: ["Helping people in need", "Being famous for your talents", "Inventing or discovering something", "Traveling and exploring", "Having a loving family/community"] },
      { id: 5, question: "Your ideal legacy would be...", options: ["The lives you changed", "The art or work you created", "The problems you solved", "The knowledge you shared", "The love you spread"] },
      { id: 6, question: "What do people consistently come to you for?", options: ["Support and encouragement", "Creative ideas", "Practical solutions", "Information and insights", "Connection and understanding"] },
      { id: 7, question: "When faced with a difficult decision, you prioritize...", options: ["What's right for others", "What feels authentic to you", "What makes logical sense", "What creates growth", "What maintains harmony"] },
      { id: 8, question: "Your greatest fear about not living purposefully is...", options: ["Not making a difference", "Not expressing your true self", "Not achieving your potential", "Not understanding life deeply enough", "Not being truly connected to others"] },
      { id: 9, question: "The activity that gives you the most energy is...", options: ["Volunteering or service work", "Creative projects", "Strategic planning", "Reading and learning", "Deep conversations"] },
      { id: 10, question: "Success, to you, ultimately means...", options: ["Positive impact on others", "Authentic self-expression", "Achieving meaningful goals", "Wisdom and understanding", "Love and belonging"] },
    ],
    resultCategories: [
      { range: [0, 25], title: "The Healer", description: "Your purpose is rooted in service and healing. You're called to make a direct difference in people's lives through care, support, and transformation." },
      { range: [26, 50], title: "The Creator", description: "Your purpose is rooted in creative expression. You're called to bring beauty, innovation, and authentic self-expression into the world." },
      { range: [51, 75], title: "The Builder", description: "Your purpose is rooted in achievement and problem-solving. You're called to create systems, solve problems, and build things that matter." },
      { range: [76, 100], title: "The Connector", description: "Your purpose is rooted in relationships and community. You're called to bring people together and create understanding between individuals and groups." },
    ],
  },
  "emotional-iq": {
    id: "emotional-iq",
    title: "Emotional Intelligence",
    description: "Measure your ability to understand and manage emotions effectively.",
    longDescription: "Emotional intelligence is your ability to recognize, understand, and manage your own emotions while also being aware of and influencing the emotions of others. This assessment measures the key components of EQ.",
    icon: Brain,
    duration: "15 min",
    color: "purple",
    questions: [
      { id: 1, question: "When you feel a strong negative emotion, you typically...", options: ["Get overwhelmed by it", "Try to suppress it", "Notice it and try to understand it", "Can name it specifically and manage it"] },
      { id: 2, question: "In conversations, you're aware of others' emotional states...", options: ["Rarely", "Sometimes, if it's obvious", "Usually", "Almost always, even subtle changes"] },
      { id: 3, question: "When someone shares their problems, you tend to...", options: ["Offer solutions immediately", "Feel uncomfortable and change subjects", "Listen and acknowledge their feelings", "Really understand their perspective and validate them"] },
      { id: 4, question: "Under stress, your emotional reactions are...", options: ["Intense and hard to control", "Suppressed until they explode", "Noticeable but manageable", "Acknowledged and regulated effectively"] },
      { id: 5, question: "You can accurately identify your emotions...", options: ["Rarely—I often feel 'bad' or 'good' without more detail", "Sometimes—I know basic emotions", "Usually—I can name most of what I feel", "Almost always—I have nuanced emotional vocabulary"] },
      { id: 6, question: "When receiving criticism, you...", options: ["Get defensive or upset", "Shut down emotionally", "Feel hurt but consider the feedback", "Separate the feedback from personal attack and evaluate it"] },
      { id: 7, question: "You're able to motivate yourself when discouraged...", options: ["Rarely—I need external motivation", "Sometimes—depends on the situation", "Usually—I can rally myself", "Almost always—I manage my motivation well"] },
      { id: 8, question: "In group settings, you're typically...", options: ["Unaware of the emotional dynamics", "Somewhat aware but unsure how to respond", "Aware and can adjust your behavior", "Highly attuned and can influence the group mood"] },
      { id: 9, question: "When conflicts arise, you...", options: ["Avoid them or escalate them", "Get caught up in emotions", "Try to stay calm but struggle", "Can manage your emotions and address issues constructively"] },
      { id: 10, question: "Your ability to empathize with very different people is...", options: ["Limited to people like me", "Possible but challenging", "Generally good", "Strong even with very different perspectives"] },
    ],
    resultCategories: [
      { range: [0, 25], title: "EQ Novice", description: "You're at the beginning of your emotional intelligence journey. Building awareness of your emotions and their impact is the first step to growth." },
      { range: [26, 50], title: "EQ Learner", description: "You have foundational emotional intelligence skills. Continue developing your ability to recognize and manage emotions for better relationships and well-being." },
      { range: [51, 75], title: "EQ Proficient", description: "You have good emotional intelligence. You're able to navigate emotions effectively most of the time and can work on refinement in challenging situations." },
      { range: [76, 100], title: "EQ Expert", description: "You have high emotional intelligence. You're skilled at understanding and managing emotions in yourself and others, which serves you well in all areas of life." },
    ],
  },
  "inner-child": {
    id: "inner-child",
    title: "Inner Child Healing",
    description: "Explore childhood patterns that may be affecting your adult life.",
    longDescription: "Your inner child holds the memories, emotions, and patterns from your early years. This assessment helps you understand how childhood experiences may be influencing your present behavior, beliefs, and relationships.",
    icon: Star,
    duration: "10 min",
    color: "gold",
    questions: [
      { id: 1, question: "When you think about your childhood, you most often feel...", options: ["Sad or longing", "Angry or resentful", "Numb or disconnected", "Warm but with some pain", "Mostly positive"] },
      { id: 2, question: "As a child, you learned that to be loved, you needed to...", options: ["Be perfect", "Take care of others", "Stay invisible", "Perform or achieve", "Nothing—love was unconditional"] },
      { id: 3, question: "Your biggest unmet need as a child was...", options: ["Safety and security", "Attention and validation", "Freedom to be yourself", "Emotional attunement", "I had my needs met"] },
      { id: 4, question: "When you feel criticized, your inner child...", options: ["Feels worthless", "Gets defensive and angry", "Withdraws and hides", "Tries harder to please", "Can handle it maturely"] },
      { id: 5, question: "Your relationship with play and spontaneity is...", options: ["I don't really play anymore", "I feel guilty when I'm not productive", "I can only play when everything is done", "I'm learning to have more fun", "I embrace play regularly"] },
      { id: 6, question: "When you're overwhelmed, you tend to...", options: ["Shut down completely", "Overwork to distract myself", "Seek comfort in unhealthy ways", "Ask for help", "Self-soothe effectively"] },
      { id: 7, question: "The message you needed to hear as a child was...", options: ["You are safe", "You are seen and matter", "It's okay to be you", "You are loved no matter what", "I received these messages"] },
      { id: 8, question: "Your relationship with self-compassion is...", options: ["I'm very hard on myself", "I'm critical but trying to change", "I'm compassionate sometimes", "I treat myself kindly most of the time", "I have a strong self-compassion practice"] },
    ],
    resultCategories: [
      { range: [0, 25], title: "Wounded Inner Child", description: "Your inner child carries significant wounds that likely affect your daily life. Prioritizing healing work could bring profound transformation." },
      { range: [26, 50], title: "Healing Inner Child", description: "You've begun the healing journey but there's more work to do. Continue nurturing your inner child with patience and compassion." },
      { range: [51, 75], title: "Integrating Inner Child", description: "You've done significant inner child work. Continue integrating these healed aspects into your adult self." },
      { range: [76, 100], title: "Healed Inner Child", description: "Your inner child feels safe and integrated. You've done profound healing work that benefits all areas of your life." },
    ],
  },
  "authenticity": {
    id: "authenticity",
    title: "Authenticity Score",
    description: "Discover how aligned you are with your true self in daily life.",
    longDescription: "Authenticity is living in alignment with your true values, beliefs, and self—not the version others expect you to be. This assessment helps you understand where you're being authentic and where you might be wearing masks.",
    icon: Sparkles,
    duration: "7 min",
    color: "accent",
    questions: [
      { id: 1, question: "In social situations, you typically...", options: ["Adapt yourself to fit in", "Feel anxious about being judged", "Are mostly yourself with some filtering", "Express yourself freely"] },
      { id: 2, question: "Your career/life choices have been primarily driven by...", options: ["What others expect of me", "What's safe and practical", "A mix of passion and practicality", "What truly excites and aligns with me"] },
      { id: 3, question: "When you disagree with popular opinion, you...", options: ["Keep quiet to avoid conflict", "Feel the need to explain myself", "Share my view if asked", "Express my opinion confidently"] },
      { id: 4, question: "Your relationship with your true desires is...", options: ["I'm not sure what I really want", "I know but suppress my wants", "I'm learning to honor my desires", "I'm clear about and pursue what I want"] },
      { id: 5, question: "How often do you say 'yes' when you mean 'no'?", options: ["Very often", "Often", "Sometimes", "Rarely"] },
      { id: 6, question: "Your closest relationships are based on...", options: ["The role I play", "Mutual need", "Genuine connection with some performance", "Full authenticity and acceptance"] },
      { id: 7, question: "When you make a mistake in front of others, you...", options: ["Feel deeply ashamed", "Try to cover it up", "Acknowledge it but feel uncomfortable", "Own it without much distress"] },
      { id: 8, question: "Your sense of self-worth comes from...", options: ["Others' approval and validation", "Achievement and success", "A mix of internal and external", "A solid internal foundation"] },
    ],
    resultCategories: [
      { range: [0, 25], title: "Masked Self", description: "You may be living behind masks that hide your true self. Exploring who you really are beneath the personas could be transformative." },
      { range: [26, 50], title: "Emerging Self", description: "You're beginning to discover and express your authentic self. Continue this journey of self-discovery and honest self-expression." },
      { range: [51, 75], title: "Growing Authenticity", description: "You're fairly authentic in many areas of life. Look for remaining masks and areas where you could express yourself more freely." },
      { range: [76, 100], title: "Authentic Self", description: "You have a strong relationship with your authentic self. You express your true nature with confidence and self-acceptance." },
    ],
  },
};

export default function AssessmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ title: string; description: string; score: number } | null>(null);

  const assessment = id ? assessmentsData[id] : null;

  useEffect(() => {
    if (!assessment) {
      navigate("/assessments");
    }
  }, [assessment, navigate]);

  if (!assessment) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Assessment not found.</p>
        </div>
      </Layout>
    );
  }

  const Icon = assessment.icon;
  const totalQuestions = assessment.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const currentQ = assessment.questions[currentQuestion];

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQ.id]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    setIsSubmitting(true);
    
    // Calculate score based on answers
    const totalPoints = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxPoints = totalQuestions * 3; // Max 3 points per question (4 options: 0-3)
    const percentage = Math.round((totalPoints / maxPoints) * 100);

    // Find the appropriate result category
    const category = assessment.resultCategories.find(
      cat => percentage >= cat.range[0] && percentage <= cat.range[1]
    ) || assessment.resultCategories[assessment.resultCategories.length - 1];

    setTimeout(() => {
      setResult({
        title: category.title,
        description: category.description,
        score: percentage,
      });
      setIsComplete(true);
      setIsSubmitting(false);

      toast({
        title: "Assessment Complete!",
        description: "Your results have been saved.",
      });
    }, 1500);
  };

  const handleRetake = () => {
    setHasStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setResult(null);
  };

  if (isComplete && result) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="glass-card overflow-hidden">
            <div className="bg-gradient-primary p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-white mb-2">
                Assessment Complete
              </h1>
              <p className="text-white/80">{assessment.title}</p>
            </div>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Badge className="text-lg px-4 py-2 mb-4" variant="secondary">
                  Score: {result.score}%
                </Badge>
                <h2 className="text-2xl font-bold mb-4 text-gradient-primary">
                  {result.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {result.description}
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full bg-gradient-primary hover:opacity-90"
                  onClick={() => navigate("/chat")}
                >
                  Discuss Results with NewMe
                </Button>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleRetake}
                  >
                    Retake Assessment
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/assessments")}
                  >
                    More Assessments
                  </Button>
                </div>
              </div>

              {user && profile && (
                <p className="text-xs text-center text-muted-foreground mt-6">
                  {profile.memory_consent 
                    ? "Your results have been saved to your profile."
                    : "Enable memory in settings to save results across sessions."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showParticles={false}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/assessments")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>

        {!hasStarted ? (
          // Assessment Intro
          <Card className="glass-card">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-2xl ${colorClasses[assessment.color]?.bg || "bg-primary/10"} flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`h-8 w-8 ${colorClasses[assessment.color]?.text || "text-primary"}`} />
              </div>
              <CardTitle className="text-2xl font-display">{assessment.title}</CardTitle>
              <CardDescription className="text-base mt-2">
                {assessment.longDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center gap-6 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>{totalQuestions} questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{assessment.duration}</span>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90"
                onClick={() => setHasStarted(true)}
              >
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Assessment Questions
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {totalQuestions}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2 mb-4" />
              <CardTitle className="text-lg font-medium leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQ.id]?.toString() || ""}
                onValueChange={(val) => handleAnswer(parseInt(val))}
                className="space-y-3"
              >
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                      answers[currentQ.id] === index
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => handleAnswer(index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={answers[currentQ.id] === undefined || isSubmitting}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculating...
                    </>
                  ) : currentQuestion === totalQuestions - 1 ? (
                    <>
                      Complete
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
