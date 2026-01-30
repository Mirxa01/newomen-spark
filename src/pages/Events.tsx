import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react";
import { useEvents, type Event } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return format(date, "h:mm a");
}

export default function Events() {
  const { data: events, isLoading, error } = useEvents();
  const { subscription } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const isTransformationMember = subscription?.tier === "transformation";

  const filteredEvents = events?.filter((event) => {
    if (!searchQuery && typeFilter === "all") return true;

    let matchesSearch = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matchesSearch =
        event.title?.toLowerCase().includes(query) ||
        event.short_description?.toLowerCase().includes(query) ||
        event.tags?.some((t) => t.toLowerCase().includes(query));
    }

    let matchesType = true;
    if (typeFilter !== "all") {
      matchesType = typeFilter === "online" ? event.is_online : !event.is_online;
    }

    return matchesSearch && matchesType;
  }) || [];

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
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            <p>Failed to load events. Please try again later.</p>
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
              const spotsLeft = event.capacity ? event.capacity - (event.spots_taken || 0) : null;
              const isFreeForMember = event.member_free_access && isTransformationMember;

              return (
                <Card key={event.id} className="glass-card overflow-hidden group hover:shadow-lg transition-all duration-300">
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                        <Calendar className="h-12 w-12 text-white/50" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      {event.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} className="bg-primary/90 text-primary-foreground text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {spotsLeft !== null && spotsLeft <= 10 && (
                      <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs">
                        {spotsLeft} spots left
                      </Badge>
                    )}
                    {isFreeForMember && (
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
                        <span>{event.date ? `${formatDate(event.date)} at ${formatTime(event.date)}` : "TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.is_online ? "Online" : event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{spotsLeft !== null ? `${spotsLeft} of ${event.capacity} spots available` : "Open registration"}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2 pt-0">
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-2xl font-bold text-gradient-primary">
                        {event.price === 0 || isFreeForMember ? (
                          <span>Free</span>
                        ) : (
                          <span>${event.price}</span>
                        )}
                      </span>
                    </div>
                    <Button className="flex-1 bg-gradient-primary hover:opacity-90" asChild>
                      <Link to={`/events/${event.id}`}>View Details</Link>
                    </Button>
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