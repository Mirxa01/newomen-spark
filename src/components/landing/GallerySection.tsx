import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Camera, Users } from "lucide-react";

export function GallerySection() {
  // Mock past events data
  const pastEvents = [
    {
      id: "1",
      title: "Full Moon Shadow Work Circle",
      date: "December 2025",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      attendees: 24,
    },
    {
      id: "2",
      title: "Sacred Wounds Workshop",
      date: "November 2025",
      imageUrl: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=800&h=600&fit=crop",
      attendees: 18,
    },
    {
      id: "3",
      title: "Archetypal Feminine Retreat",
      date: "October 2025",
      imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop",
      attendees: 32,
    },
    {
      id: "4",
      title: "Embodying Your Authentic Power",
      date: "September 2025",
      imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=600&fit=crop",
      attendees: 28,
    },
  ];

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Camera className="h-4 w-4" />
            <span>Past Events Gallery</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Transformative <span className="text-gradient-primary">Experiences</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See the magic that happens in our circles. These moments capture the 
            depth and transformation of our community gatherings.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {pastEvents.map((event) => (
            <Card key={event.id} className="glass-card overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-medium text-sm line-clamp-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm line-clamp-1">{event.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{event.attendees} attended</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                    <Link to={`/events/${event.id}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/events">See All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}