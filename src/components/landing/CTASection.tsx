import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center glass-card p-10 md:p-16 relative">
          {/* Decorative Glow */}
          <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-xl" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Meet <span className="text-gradient-primary">NewMe?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Your astrological psychologist is waiting. Start with a free assessment 
              or dive straight into your first voice session.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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

            <p className="text-sm text-muted-foreground mt-6">
              No credit card required for Discovery plan
            </p>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    </section>
  );
}
