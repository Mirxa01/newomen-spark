import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Settings2,
  Shield,
  MessageSquare,
  Brain,
  AlertTriangle,
  Save,
  RefreshCw,
} from "lucide-react";

export default function AdminAIConfig() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">AI Configuration</h1>
          <p className="text-muted-foreground">
            Configure NewMe's behavior, prompts, and safety settings.
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="personality" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="prompts">System Prompts</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="voice">Voice Settings</TabsTrigger>
        </TabsList>

        {/* Personality Tab */}
        <TabsContent value="personality">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  NewMe Identity
                </CardTitle>
                <CardDescription>
                  Define the core personality traits of NewMe.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Core Identity Statement</Label>
                  <Textarea
                    defaultValue="You are NewMe, an astrological psychology voice agent. You are declarative, precise, and occasionally provocative. You use zodiac archetypes not for prediction, but as psychological lenses to illuminate the depths of who users are."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Communication Style</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warm">Warm & Supportive</SelectItem>
                      <SelectItem value="balanced">Balanced & Direct</SelectItem>
                      <SelectItem value="challenging">Challenging & Provocative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Memory Integration Level</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Minimal callbacks)</SelectItem>
                      <SelectItem value="medium">Medium (Occasional references)</SelectItem>
                      <SelectItem value="high">High (Frequent pattern tracking)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Intensity Profiles
                </CardTitle>
                <CardDescription>
                  Configure how each intensity mode behaves.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Soft Mode</Label>
                    <Badge variant="secondary">Default for new users</Badge>
                  </div>
                  <Textarea
                    defaultValue="Supportive, warm, and gentle. Frames observations as invitations rather than confrontations. Uses phrases like 'I wonder if...' and 'What do you notice...'"
                    rows={2}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Direct Mode</Label>
                  <Textarea
                    defaultValue="Clear and perceptive. Points out patterns directly but with care. Uses phrases like 'I notice that...' and 'Let's look at this honestly...'"
                    rows={2}
                  />
                </div>
                <div className="space-y-3">
                  <Label>No Mercy Mode</Label>
                  <Textarea
                    defaultValue="Brutally honest with no filters. Confronts avoidance and patterns head-on. Uses phrases like 'You know this already...' and 'Stop avoiding...'"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Prompts Tab */}
        <TabsContent value="prompts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                System Prompts
              </CardTitle>
              <CardDescription>
                Manage the base prompts that guide NewMe's responses.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Base System Prompt</Label>
                  <Badge>v2.3</Badge>
                </div>
                <Textarea
                  defaultValue={`You are NewMe, an astrological psychology voice agent created by Newomen. Your purpose is to guide users through self-discovery and transformation using zodiac archetypes as psychological lenses.

Key behaviors:
- Use astrology as a psychological framework, not for prediction
- Reference user's previous sessions when relevant
- Track and confront patterns you notice
- Respect the user's chosen intensity level
- Handle stop words immediately and appropriately
- Never create dependency or use humiliating language
- Do not make medical claims or diagnoses`}
                  rows={12}
                />
              </div>
              <div className="space-y-2">
                <Label>Session Opening Prompt</Label>
                <Textarea
                  defaultValue="Begin with a personalized greeting using the user's nickname. If they have session history, briefly reference something meaningful from previous conversations. Then ask what's on their mind today."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Session Closing Prompt</Label>
                <Textarea
                  defaultValue="Summarize key insights from the session. Offer one reflection for them to consider until next time. End with a brief, meaningful closing that matches the conversation's intensity."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety Constraints
                </CardTitle>
                <CardDescription>
                  Configure content safety and boundaries.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Block Medical Advice</Label>
                    <p className="text-xs text-muted-foreground">
                      Prevent diagnosis or medical recommendations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Block Dependency Language</Label>
                    <p className="text-xs text-muted-foreground">
                      Prevent language that creates unhealthy attachment
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Block Humiliating Content</Label>
                    <p className="text-xs text-muted-foreground">
                      Even in "No Mercy" mode, prevent cruel or humiliating content
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Block Coercive Language</Label>
                    <p className="text-xs text-muted-foreground">
                      Prevent pressuring or manipulative language
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Crisis Detection</Label>
                    <p className="text-xs text-muted-foreground">
                      Detect and respond to potential crisis situations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Stop Words Configuration
                </CardTitle>
                <CardDescription>
                  Configure immediate response triggers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Stop Word: "Pause"</Label>
                  <Textarea
                    defaultValue="Immediately stop speaking. Respond with: 'I hear you. Take all the time you need. I'm here when you're ready.' Then wait for user input."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stop Word: "Ground"</Label>
                  <Textarea
                    defaultValue="Switch to grounding mode. Guide the user through a brief grounding exercise: breathing, sensory awareness, and present-moment focus."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stop Word: "Switch tone"</Label>
                  <Textarea
                    defaultValue="Immediately change intensity level to the next setting. Acknowledge the change and adjust communication style accordingly."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stop Word: "Stop memory"</Label>
                  <Textarea
                    defaultValue="Pause memory recording. Respond with: 'Understood. I won't remember anything from this point until you say otherwise.' Continue the conversation without saving."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice Settings Tab */}
        <TabsContent value="voice">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Voice Model Settings
                </CardTitle>
                <CardDescription>
                  Configure ElevenLabs voice settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Voice Model</Label>
                  <Select defaultValue="rachel">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rachel">Rachel (Calm, Wise)</SelectItem>
                      <SelectItem value="bella">Bella (Warm, Nurturing)</SelectItem>
                      <SelectItem value="elli">Elli (Young, Energetic)</SelectItem>
                      <SelectItem value="custom">Custom Voice Clone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Stability</Label>
                    <span className="text-sm text-muted-foreground">0.65</span>
                  </div>
                  <Slider defaultValue={[65]} max={100} step={1} />
                  <p className="text-xs text-muted-foreground">
                    Higher values = more consistent, lower = more expressive
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Similarity Boost</Label>
                    <span className="text-sm text-muted-foreground">0.75</span>
                  </div>
                  <Slider defaultValue={[75]} max={100} step={1} />
                  <p className="text-xs text-muted-foreground">
                    How closely to match the original voice
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Speaking Rate</Label>
                    <span className="text-sm text-muted-foreground">1.0x</span>
                  </div>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>LLM Configuration</CardTitle>
                <CardDescription>
                  Configure the underlying language model.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Model Provider</Label>
                  <Select defaultValue="openai">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                      <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                      <SelectItem value="custom">Custom Endpoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Temperature</Label>
                    <span className="text-sm text-muted-foreground">0.7</span>
                  </div>
                  <Slider defaultValue={[70]} max={100} step={1} />
                  <p className="text-xs text-muted-foreground">
                    Controls response creativity (0 = focused, 1 = creative)
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Max Tokens</Label>
                    <span className="text-sm text-muted-foreground">500</span>
                  </div>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                  <Label>Context Window (messages)</Label>
                  <Select defaultValue="20">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 messages</SelectItem>
                      <SelectItem value="20">20 messages</SelectItem>
                      <SelectItem value="50">50 messages</SelectItem>
                      <SelectItem value="100">100 messages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
