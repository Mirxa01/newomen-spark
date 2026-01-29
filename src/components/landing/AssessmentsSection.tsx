import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Compass, Moon, Star, Sparkles, ArrowRight } from "lucide-react";

const assessments = [
  {
    id: "shadow-self",
    title: "Shadow Self Discovery",
    description: "Uncover hidden aspects of your personality that influence your behavior and relationships.",
    icon: Moon,
    questions: 15,
    duration: "10 min",
    color: "primary",
  },
  {
    id: "love-language",
    title: "Love Language Profile",
    description: "Discover how you give and receive love to improve your relationships.",
    icon: Heart,
    questions: 12,
    duration: "8 min",
    color: "pink",
  },
  {
    id: "life-purpose",
    title: "Life Purpose Compass",
    description: "Gain clarity on your deeper calling and what truly motivates you.",
    icon: Compass,
    questions: 18,
    duration: "12 min",
    color: "teal",
  },
  {
    id: "emotional-iq",
    title: "Emotional Intelligence",
    description: "Measure your ability to understand and manage emotions effectively.",
    icon: Brain,
    questions: 20,
    duration: "15 min",
    color: "purple",
  },
  {
    id: "inner-child",
    title: "Inner Child Healing",
    description: "Explore childhood patterns that may be affecting your adult life.",
    icon: Star,
    questions: 14,
    duration: "10 min",
    color: "gold",
  },
  {
    id: "authenticity",
    title: "Authenticity Score",
    description: "Discover how aligned you are with your true self in daily life.",
    icon: Sparkles,
    questions: 10,
    duration: "7 min",
    color: "accent",
  },
];

export function AssessmentsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Brain className="h-3 w-3 mr-1" />
            Free Assessments
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Discover Your <span className="text-gradient-primary">Inner Truth</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start your journey with our psychology-backed assessments. 
            Each one reveals unique insights about who you truly are.
          </p>
        </div>

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {assessments.map((assessment) => {
            const Icon = assessment.icon;
            return (
              <Card 
                key={assessment.id} 
                className="glass-card group hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-${assessment.color}/10 flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 text-${assessment.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg">{assessment.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {assessment.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{assessment.questions} questions</span>
                    <span>{assessment.duration}</span>
                  </div>
                  <Button className="w-full bg-gradient-primary hover:opacity-90" asChild>
                    <Link to={`/assessments/${assessment.id}`}>
                      Take Assessment
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/assessments" className="flex items-center gap-2">
              Explore All Assessments
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
