import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getSupabase } from "@/lib/supabase";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  User,
  Mail,
  Calendar,
  Crown,
  Shield,
  Brain,
  Trash2,
  Save,
  Loader2,
  Star,
  Clock,
  Sparkles,
  Heart,
  Zap,
  Flame,
} from "lucide-react";

// Mock assessment history
const mockAssessmentHistory = [
  { id: "1", title: "Shadow Self Discovery", completedAt: "2026-01-15", score: "High Self-Awareness" },
  { id: "2", title: "Love Language Profile", completedAt: "2026-01-18", score: "Words of Affirmation" },
  { id: "3", title: "Emotional Intelligence", completedAt: "2026-01-20", score: "Above Average" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية (Arabic)" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
];

const intensityOptions = [
  { value: "soft", label: "Soft & Gentle", icon: Heart, description: "Supportive, warm approach" },
  { value: "direct", label: "Direct & Honest", icon: Zap, description: "Clear and perceptive" },
  { value: "no_mercy", label: "No Mercy", icon: Flame, description: "Brutally honest, no filters" },
];

export default function Profile() {
  const { user, profile, subscription, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingData, setIsDeletingData] = useState(false);

  // Form state
  const [nickname, setNickname] = useState("");
  const [language, setLanguage] = useState("en");
  const [intensity, setIntensity] = useState<"soft" | "direct" | "no_mercy">("direct");
  const [memoryConsent, setMemoryConsent] = useState(true);

  // Load profile data into form
  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || "");
      setLanguage(profile.language || "en");
      setIntensity(profile.intensity_preference || "direct");
      setMemoryConsent(profile.memory_consent ?? true);
    }
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const supabase = await getSupabase();
      if (!supabase) throw new Error("Backend not configured");

      const { error } = await supabase
        .from("profiles")
        .update({
          nickname,
          language,
          intensity_preference: intensity,
          memory_consent: memoryConsent,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: "Profile updated",
        description: "Your preferences have been saved.",
      });
    } catch (err) {
      console.error("Profile update error:", err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMemories = async () => {
    if (!user) return;

    setIsDeletingData(true);
    try {
      // Placeholder: In production, this would delete user memories
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Memories deleted",
        description: "All your conversation memories have been removed.",
      });
    } catch (err) {
      console.error("Delete memories error:", err);
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "Please try again.",
      });
    } finally {
      setIsDeletingData(false);
    }
  };

  if (loading || !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <LoadingSkeleton variant="profile" />
        </div>
      </Layout>
    );
  }

  const subscriptionTierInfo = {
    discovery: { label: "Discovery", color: "secondary", icon: Star },
    growth: { label: "Growth", color: "primary", icon: Sparkles },
    transformation: { label: "Transformation", color: "gold", icon: Crown },
  };

  const currentTier = subscription?.tier || "discovery";
  const tierInfo = subscriptionTierInfo[currentTier];
  const TierIcon = tierInfo.icon;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your account, preferences, and privacy settings.
          </p>
        </div>

        {/* Profile Overview Card */}
        <Card className="glass-card mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                  {(profile.nickname || user?.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">
                  {profile.nickname || "Beautiful Soul"}
                </h2>
                <p className="text-muted-foreground mb-2">{user?.email}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="gap-1" variant={tierInfo.color === "gold" ? "outline" : "secondary"}>
                    <TierIcon className="h-3 w-3" />
                    {tierInfo.label} Member
                  </Badge>
                  {profile.horoscope_sign && (
                    <Badge variant="outline">{profile.horoscope_sign}</Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/membership")}>
                {currentTier === "transformation" ? "Manage Plan" : "Upgrade Plan"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Subscription Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
                <p className="text-lg font-semibold capitalize">{currentTier}</p>
              </div>
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Voice Minutes</p>
                <p className="text-lg font-semibold">
                  {subscription?.voice_minutes_used || 0} / {subscription?.voice_minutes_limit || 5} used
                </p>
              </div>
              <div className="glass p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={subscription?.status === "active" ? "default" : "secondary"} className="capitalize">
                  {subscription?.status || "Active"}
                </Badge>
              </div>
            </div>
            {subscription?.current_period_end && (
              <p className="text-sm text-muted-foreground mt-4">
                <Clock className="inline h-4 w-4 mr-1" />
                Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="preferences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences" className="gap-2">
              <User className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Brain className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Personal Preferences</CardTitle>
                <CardDescription>
                  Customize how NewMe interacts with you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nickname */}
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="What should NewMe call you?"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is how NewMe will address you in conversations.
                  </p>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Intensity */}
                <div className="space-y-3">
                  <Label>Conversation Intensity</Label>
                  <div className="grid gap-3">
                    {intensityOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={option.value}
                          className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                            intensity === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted/50"
                          }`}
                          onClick={() => setIntensity(option.value as typeof intensity)}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            intensity === option.value ? "bg-primary/10" : "bg-muted"
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              intensity === option.value ? "text-primary" : "text-muted-foreground"
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{option.label}</p>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            intensity === option.value
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`} />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Privacy & Memory</CardTitle>
                <CardDescription>
                  Control how your data is stored and used.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Memory Consent */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="memory-consent">Enable Memory</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow NewMe to remember your conversations and track patterns.
                    </p>
                  </div>
                  <Switch
                    id="memory-consent"
                    checked={memoryConsent}
                    onCheckedChange={setMemoryConsent}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Changes to this setting will only affect future messages.
                </p>

                <Separator />

                {/* Data Management */}
                <div className="space-y-4">
                  <h4 className="font-medium">Data Management</h4>
                  
                  <div className="glass p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Delete All Memories</p>
                        <p className="text-sm text-muted-foreground">
                          Permanently remove all your conversation history and patterns.
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isDeletingData}
                          >
                            {isDeletingData ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </>
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete All Memories?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. All your conversation history, 
                              patterns, and memories will be permanently removed. NewMe will 
                              no longer have context from your previous sessions.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteMemories}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete All Memories
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="glass p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Export Data</p>
                        <p className="text-sm text-muted-foreground">
                          Download all your data in a portable format.
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
                <CardDescription>
                  Your completed assessments and results.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockAssessmentHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-2">No assessments completed yet.</p>
                    <Button variant="outline" onClick={() => navigate("/assessments")}>
                      Take an Assessment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockAssessmentHistory.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-4 glass rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Brain className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{assessment.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Completed {new Date(assessment.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{assessment.score}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                {profile.date_of_birth && (
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">
                        {new Date(profile.date_of_birth).toLocaleDateString()}
                        {profile.horoscope_sign && ` • ${profile.horoscope_sign}`}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
