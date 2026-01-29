import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, Star } from "lucide-react";

const tiers = [
  {
    id: "discovery",
    name: "Discovery",
    price: "Free",
    period: "",
    description: "Begin your journey of self-discovery",
    icon: Sparkles,
    features: [
      "5 free assessments",
      "Basic insights and results",
      "Event notifications",
      "Community access (view only)",
      "1 voice session demo (5 min)",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "$22",
    period: "/month",
    description: "Deepen your transformation journey",
    icon: Star,
    features: [
      "All Discovery features",
      "20 advanced assessments",
      "60 minutes voice sessions/month",
      "Memory-enabled conversations",
      "Personalized daily insights",
      "Full community participation",
      "Priority event booking",
    ],
    cta: "Start Growing",
    highlighted: true,
  },
  {
    id: "transformation",
    name: "Transformation",
    price: "$222",
    period: "/month",
    description: "All-inclusive premium experience",
    icon: Crown,
    features: [
      "All Growth features",
      "Unlimited voice sessions",
      "Free access to all events",
      "1-on-1 AI coaching sessions",
      "Advanced pattern recognition",
      "Couples compatibility access",
      "Exclusive transformation circles",
      "WhatsApp priority support",
    ],
    cta: "Transform Now",
    highlighted: false,
  },
];

export function MembershipSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Crown className="h-3 w-3 mr-1" />
            Membership
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Choose Your <span className="text-gradient-primary">Path</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the membership that matches your transformation goals. 
            Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <Card 
                key={tier.id} 
                className={`glass-card relative overflow-hidden transition-all duration-300 ${
                  tier.highlighted 
                    ? "border-primary shadow-lg scale-105 md:scale-110 z-10" 
                    : "hover:scale-[1.02]"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-primary text-primary-foreground text-center text-sm py-1 font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader className={`text-center ${tier.highlighted ? "pt-10" : "pt-6"}`}>
                  <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                    tier.highlighted ? "bg-gradient-primary" : "bg-primary/10"
                  }`}>
                    <Icon className={`h-7 w-7 ${tier.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <h3 className="font-semibold text-xl">{tier.name}</h3>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          tier.highlighted ? "text-primary" : "text-muted-foreground"
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${tier.highlighted ? "bg-gradient-primary hover:opacity-90" : ""}`}
                    variant={tier.highlighted ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link to={`/signup?plan=${tier.id}`}>{tier.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Money Back Guarantee */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          💜 30-day money-back guarantee on all paid plans
        </p>
      </div>
    </section>
  );
}
