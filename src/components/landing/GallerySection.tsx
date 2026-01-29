import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";

// Mock data for past events gallery
const pastEvents = [
  {
    id: "1",
    title: "Summer Transformation Retreat",
    date: "August 2025",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80",
    ],
    participants: 45,
  },
  {
    id: "2",
    title: "New Moon Circle - January",
    date: "January 2026",
    images: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80",
    ],
    participants: 28,
  },
  {
    id: "3",
    title: "Shadow Work Intensive",
    date: "December 2025",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80",
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&q=80",
    ],
    participants: 60,
  },
];

export function GallerySection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <ImageIcon className="h-3 w-3 mr-1" />
            Past Events
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Moments of <span className="text-gradient-primary">Connection</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Glimpses from our transformative gatherings. Every event is an opportunity 
            for deep connection and personal growth.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {pastEvents.map((event) => (
            <div key={event.id} className="group">
              <div className="glass-card overflow-hidden">
                {/* Main Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-semibold text-lg text-foreground mb-1">{event.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{event.date}</span>
                      <span>{event.participants} participants</span>
                    </div>
                  </div>

                  {/* Image Count Badge */}
                  {event.images.length > 1 && (
                    <Badge className="absolute top-3 right-3 bg-background/80 text-foreground">
                      +{event.images.length - 1} photos
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/events/gallery">View Full Gallery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
