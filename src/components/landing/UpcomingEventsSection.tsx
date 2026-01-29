import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: "1",
    title: "Shadow Integration Workshop",
    date: "2026-02-15",
    time: "14:00",
    location: "Online",
    capacity: 50,
    spotsLeft: 12,
    price: 49,
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80",
    tags: ["Workshop", "Shadow Work"],
  },
  {
    id: "2",
    title: "Full Moon Transformation Circle",
    date: "2026-02-12",
    time: "20:00",
    location: "Dubai, UAE",
    capacity: 30,
    spotsLeft: 8,
    price: 75,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80",
    tags: ["In-Person", "Moon Ritual"],
  },
  {
    id: "3",
    title: "Couples Compatibility Deep Dive",
    date: "2026-02-20",
    time: "18:00",
    location: "Online",
    capacity: 20,
    spotsLeft: 6,
    price: 99,
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&q=80",
    tags: ["Couples", "Relationship"],
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UpcomingEventsSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Calendar className="h-3 w-3 mr-1" />
            Upcoming Events
          </Badge>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Transform Together
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our transformative events—workshops, circles, and deep-dive sessions 
            designed to accelerate your journey of self-discovery.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="glass-card overflow-hidden group hover:shadow-lg transition-all duration-300">
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} className="bg-primary/90 text-primary-foreground text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {event.spotsLeft <= 10 && (
                  <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs">
                    {event.spotsLeft} spots left
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-2">
                <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{event.spotsLeft} of {event.capacity} spots available</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 pt-0">
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-2xl font-bold text-gradient-primary">${event.price}</span>
                </div>
                <div className="flex gap-2 w-full">
                  <Button className="flex-1 bg-gradient-primary hover:opacity-90" asChild>
                    <Link to={`/events/${event.id}/book`}>Buy Ticket</Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/membership">Join Free</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/events" className="flex items-center gap-2">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
