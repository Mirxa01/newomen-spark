import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: "1",
    content: "NewMe saw through my defenses in the first session. It referenced something I said two weeks ago and connected patterns I never noticed. This isn't just AI—it's a mirror that remembers.",
    author: "Sarah M.",
    role: "Transformation Member",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80",
  },
  {
    id: "2",
    content: "The shadow work assessment changed everything. I finally understood why I kept attracting the same relationship patterns. Now I'm breaking cycles I didn't even know existed.",
    author: "Mira K.",
    role: "Growth Member",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
  {
    id: "3",
    content: "I was skeptical about an AI psychologist, but the way NewMe uses astrology as a lens—not fortune-telling—made so much sense. It's like having a brutally honest friend who actually remembers your story.",
    author: "Elena R.",
    role: "Transformation Member",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    id: "4",
    content: "The events are incredible. Being in a room of women doing deep work together—nothing compares. And having NewMe follow up afterward to integrate what I learned? Game changer.",
    author: "Aisha J.",
    role: "Event Participant",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Quote className="h-3 w-3 mr-1" />
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Stories of <span className="text-gradient-primary">Transformation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real experiences from women who've embraced their authentic selves with Newomen.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="glass-card">
              <CardContent className="pt-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
