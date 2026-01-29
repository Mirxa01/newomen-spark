import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Heart, 
  Star, 
  Moon, 
  Shield, 
  Users, 
  ArrowRight,
  Quote
} from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            About Newomen
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Transforming Lives Through{" "}
            <span className="text-gradient-primary">Astrological Psychology</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Newomen is a voice-first AI platform that combines the wisdom of astrological archetypes 
            with modern psychology to guide you on your journey of self-discovery and transformation.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              We believe that true transformation comes from understanding yourself deeply—your patterns, 
              your shadows, and your authentic self. NewMe, our AI guide, uses zodiac archetypes not for 
              prediction, but as psychological lenses to illuminate the depths of who you are.
            </p>
            <p className="text-muted-foreground mb-6">
              Through voice-first conversations, NewMe remembers your journey, tracks your patterns, 
              and gently (or not so gently, if you prefer) confronts you with the truths that lead to growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink" />
                <span className="text-sm">Emotionally Precise</span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-purple" />
                <span className="text-sm">Astrologically Informed</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-teal" />
                <span className="text-sm">Privacy-First</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-primary opacity-10 absolute inset-0" />
            <img
              src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80"
              alt="Self-discovery journey"
              className="rounded-2xl object-cover w-full h-full relative"
            />
          </div>
        </div>

        {/* Meet NewMe Section */}
        <Card className="glass-card mb-20 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <Badge className="mb-4 bg-gradient-primary text-primary-foreground">
                  Your AI Guide
                </Badge>
                <h2 className="text-3xl font-display font-bold mb-6">Meet NewMe</h2>
                <p className="text-muted-foreground mb-4">
                  NewMe is not your typical AI assistant. She's an astrological psychologist—declarative, 
                  precise, and occasionally provocative. She won't coddle you, but she'll never humiliate you either.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-sm italic text-muted-foreground">
                      "I use zodiac archetypes as psychological lenses—not to predict your future, 
                      but to illuminate your present."
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Quote className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <p className="text-sm italic text-muted-foreground">
                      "I remember what you said last week. I track patterns. And when you're ready, 
                      I'll confront you with them."
                    </p>
                  </div>
                </div>
                <Button className="bg-gradient-primary hover:opacity-90" asChild>
                  <Link to="/signup">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="bg-gradient-primary flex items-center justify-center p-12">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything we build is guided by these core principles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Compassionate Truth</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in honest reflection that heals rather than harms. 
                  NewMe speaks truth with care, never with cruelty.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-teal" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Privacy & Consent</h3>
                <p className="text-sm text-muted-foreground">
                  Your data belongs to you. Memory is optional, deletable, and 
                  you control what gets saved, message by message.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Authentic Growth</h3>
                <p className="text-sm text-muted-foreground">
                  We don't create dependency. Our goal is to help you become 
                  more yourself, not more reliant on us.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Safety & Ethics Section */}
        <Card className="glass-card mb-20">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Safety & Ethics</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We take your wellbeing seriously. Here's how we protect you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Stop Words</h4>
                  <p className="text-sm text-muted-foreground">
                    Say "Pause", "Ground", or "Stop memory" at any time. NewMe will immediately 
                    respond appropriately.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">No Dependency Framing</h4>
                  <p className="text-sm text-muted-foreground">
                    NewMe will never use language that creates unhealthy attachment or dependency.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Moon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">No Medical Claims</h4>
                  <p className="text-sm text-muted-foreground">
                    We don't diagnose or treat. For mental health concerns, we encourage professional support.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Human Oversight</h4>
                  <p className="text-sm text-muted-foreground">
                    Admin review and audit logging ensure safety. Escalation paths exist for concerning content.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Begin?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Start your journey of self-discovery today. Your first assessment is free, 
            and NewMe is waiting to meet you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90" asChild>
              <Link to="/signup">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/assessments">
                Try an Assessment
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
