import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, Sparkles, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Voice-First AI Self-Discovery</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 animate-fade-in-up">
            Discover Your{" "}
            <span className="text-gradient-primary">Authentic Self</span>
            <br />
            with NewMe
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Meet your astrological psychology voice agent. Experience emotionally precise, 
            memory-driven conversations that drive real self-awareness—not surface-level chat.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 glow-primary text-lg px-8 py-6" asChild>
              <Link to="/signup" className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Start Your Journey
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/assessments" className="flex items-center gap-2">
                Try Free Assessment
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-sm text-muted-foreground mb-4">Trusted by women seeking transformation</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="text-center">
                <p className="text-2xl font-bold text-gradient-primary">10,000+</p>
                <p className="text-sm text-muted-foreground">Voice Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gradient-primary">50+</p>
                <p className="text-sm text-muted-foreground">Events Hosted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gradient-primary">95%</p>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-float" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-pink/10 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: "-3s" }} />
      </div>
    </section>
  );
}
