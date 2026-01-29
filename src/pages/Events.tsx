import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react";

interface Event {
  id: string;
  title: string;
  short_description: string | null;
  date: string;
  location: string | null;
  is_online: boolean;
  capacity: number;
  spots_taken: number;
  price: number;
  currency: string;
  image_url: string | null;
  tags: string[];
  member_free_access: boolean;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// Mock events for display (will be replaced with real data)
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Shadow Integration Workshop",
    short_description: "Explore and integrate your shadow aspects through guided exercises and group work.",
    date: "2026-02-15T14:00:00Z",
    location: "Online",
    is_online: true,
    capacity: 50,
    spots_taken: 38,
    price: 49,
    currency: "USD",
    image_url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80",
    tags: ["Workshop", "Shadow Work"],
    member_free_access: false,
  },
  {
    id: "2",
    title: "Full Moon Transformation Circle",
    short_description: "Join us for a powerful full moon ritual and transformation circle in Dubai.",
    date: "2026-02-12T20:00:00Z",
    location: "Dubai, UAE",
    is_online: false,
    capacity: 30,
    spots_taken: 22,
    price: 75,
    currency: "USD",
    image_url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80",
    tags: ["In-Person", "Moon Ritual"],
    member_free_access: true,
  },
  {
    id: "3",
    title: "Couples Compatibility Deep Dive",
    short_description: "An AI-led exploration of relationship dynamics and compatibility patterns.",
    date: "2026-02-20T18:00:00Z",
    location: "Online",
    is_online: true,
    capacity: 20,
    spots_taken: 14,
    price: 99,
    currency: "USD",
    image_url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&q=80",
    tags: ["Couples", "Relationship"],
    member_free_access: true,
  },
  {
    id: "4",
    title: "Inner Child Healing Journey",
    short_description: "A gentle yet powerful journey to reconnect with and heal your inner child.",
    date: "2026-02-25T16:00:00Z",
    location: "Online",
    is_online: true,
    capacity: 40,
    spots_taken: 25,
    price: 59,
    currency: "USD",
    image_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
    tags: ["Workshop", "Inner Child"],
    member_free_access: false,
  },
  {
    id: "5",
    title: "Authenticity Breakthrough Intensive",
    short_description: "A full-day intensive designed to break through barriers to authentic self-expression.",
    date: "2026-03-01T10:00:00Z",
    location: "Online",
    is_online: true,
    capacity: 25,
    spots_taken: 8,
    price: 149,
    currency: "USD",
    image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    tags: ["Intensive", "Authenticity"],
    member_free_access: true,
  },
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Filter events based on search and type
    let filtered = events;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.short_description?.toLowerCase().includes(query) ||
          e.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((e) =>
        typeFilter === "online" ? e.is_online : !e.is_online
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, typeFilter]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold mb-4">
            Upcoming <span className="text-gradient-primary">Events</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our transformative gatherings—workshops, circles, and intensives 
            designed to accelerate your journey of self-discovery.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="online">Online Only</SelectItem>
              <SelectItem value="in-person">In-Person Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No events found matching your criteria.</p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setTypeFilter("all"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const spotsLeft = event.capacity - event.spots_taken;
              return (
                <Card key={event.id} className="glass-card overflow-hidden group hover:shadow-lg transition-all duration-300">
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      {event.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} className="bg-primary/90 text-primary-foreground text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {spotsLeft <= 10 && (
                      <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs">
                        {spotsLeft} spots left
                      </Badge>
                    )}
                    {event.member_free_access && (
                      <Badge className="absolute bottom-3 right-3 bg-gold text-gold-foreground text-xs">
                        Free for Members
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {event.short_description}
                    </p>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.date)} at {formatTime(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{spotsLeft} of {event.capacity} spots available</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2 pt-0">
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-2xl font-bold text-gradient-primary">
                        ${event.price}
                      </span>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button className="flex-1 bg-gradient-primary hover:opacity-90" asChild>
                        <Link to={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
