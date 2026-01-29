import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { Mic, Calendar, Brain, Sparkles, Clock, ArrowRight, Crown } from "lucide-react";

export default function Dashboard() {
  const { user, profile, subscription, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && user && profile && !profile.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [user, profile, loading, navigate]);

  if (loading || !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading your dashboard...</div>
        </div>
      </Layout>
    );
  }

  const voiceMinutesUsed = subscription?.voice_minutes_used || 0;
  const voiceMinutesLimit = subscription?.voice_minutes_limit || 5;
  const voiceMinutesPercent = (voiceMinutesUsed / voiceMinutesLimit) * 100;

  // Mock daily insight
  const dailyInsight = {
    title: "Today's Provocation",
    content: profile.intensity_preference === "soft"
      ? `${profile.nickname || "Beautiful soul"}, what small truth are you avoiding today?`
      : profile.intensity_preference === "no_mercy"
        ? `${profile.nickname || "Beautiful soul"}, you're still running from the same thing. Ready to face it?`
        : `${profile.nickname || "Beautiful soul"}, the pattern you're repeating—do you see it yet?`,
  };

  // Mock featured event
  const featuredEvent = {
    id: "1",
    title: "Shadow Integration Workshop",
    date: "Feb 15, 2026",
    time: "2:00 PM",
    spotsLeft: 12,
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">
            Welcome back, <span className="text-gradient-primary">{profile.nickname || "Beautiful Soul"}</span>
          </h1>
          <p className="text-muted-foreground">
            Your journey continues. What will you discover today?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Insight Card */}
            <Card className="glass-card overflow-hidden">
              <div className="absolute inset-0 bg-gradient-primary opacity-5" />
              <CardHeader className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">{dailyInsight.title}</span>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-lg font-medium leading-relaxed">
                  "{dailyInsight.content}"
                </p>
                <p className="text-sm text-muted-foreground mt-4">— NewMe</p>
              </CardContent>
            </Card>

            {/* Speak with NewMe CTA */}
            <Card className="glass-card border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                    <Mic className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">Ready to talk?</h3>
                    <p className="text-muted-foreground mb-4">
                      NewMe is waiting to continue your conversation.
                    </p>
                    <Button size="lg" className="bg-gradient-primary hover:opacity-90" asChild>
                      <Link to="/chat">
                        <Mic className="mr-2 h-5 w-5" />
                        Speak with NewMe
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/assessments")}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium">Take Assessment</h4>
                    <p className="text-sm text-muted-foreground">Discover more about yourself</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>

              <Card className="glass-card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/events")}>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-pink" />
                  </div>
                  <div>
                    <h4 className="font-medium">Browse Events</h4>
                    <p className="text-sm text-muted-foreground">Join transformative gatherings</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your Plan</CardTitle>
                  <Badge variant={subscription?.tier === "discovery" ? "secondary" : "default"} className="capitalize">
                    {subscription?.tier === "transformation" && <Crown className="h-3 w-3 mr-1" />}
                    {subscription?.tier || "Discovery"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Voice Minutes
                      </span>
                      <span>{voiceMinutesUsed}/{voiceMinutesLimit} min</span>
                    </div>
                    <Progress value={voiceMinutesPercent} className="h-2" />
                  </div>
                  {subscription?.tier === "discovery" && (
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/membership">Upgrade Plan</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Featured Event */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Featured Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium">{featuredEvent.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{featuredEvent.date} at {featuredEvent.time}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {featuredEvent.spotsLeft} spots left
                  </Badge>
                  <Button className="w-full bg-gradient-primary hover:opacity-90" asChild>
                    <Link to={`/events/${featuredEvent.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Memory */}
            {profile.memory_consent && (
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Memory Fragment</CardTitle>
                  <CardDescription>From your recent sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic text-muted-foreground">
                    "You mentioned feeling stuck in the same patterns..."
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">3 days ago</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
