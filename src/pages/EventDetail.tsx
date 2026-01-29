import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getSupabase } from "@/lib/supabase";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Crown, Phone, Check, Loader2 } from "lucide-react";

// Mock event data (will be replaced with real data)
const mockEvent = {
  id: "1",
  title: "Shadow Integration Workshop",
  description: `Join us for a transformative workshop where you'll learn to embrace and integrate the shadow aspects of your personality.

## What You'll Experience

- **Guided Shadow Work Exercises**: Safely explore the parts of yourself you've kept hidden
- **Group Processing**: Share and witness in a supportive container
- **Integration Practices**: Learn tools to continue the work after the workshop
- **NewMe AI Session**: A personalized AI-led integration session

## Who This Is For

This workshop is perfect for those who:
- Feel stuck in repeating patterns
- Want to understand their triggers better
- Are ready to embrace all parts of themselves
- Seek deeper self-awareness

## What's Included

- 3-hour live workshop
- Workbook and exercises
- Recording access for 30 days
- Follow-up NewMe AI session`,
  short_description: "Explore and integrate your shadow aspects through guided exercises and group work.",
  date: "2026-02-15T14:00:00Z",
  end_date: "2026-02-15T17:00:00Z",
  location: "Online via Zoom",
  is_online: true,
  capacity: 50,
  spots_taken: 38,
  price: 49,
  currency: "USD",
  image_url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80",
  gallery_images: [
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80",
  ],
  tags: ["Workshop", "Shadow Work", "Online"],
  member_free_access: false,
  transformation_only: false,
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, subscription } = useAuth();
  const { toast } = useToast();
  
  const [isBooking, setIsBooking] = useState(false);
  const [isMembershipFormOpen, setIsMembershipFormOpen] = useState(false);
  const [membershipForm, setMembershipForm] = useState({ fullName: "", whatsapp: "" });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const event = mockEvent; // Will be fetched from DB
  const spotsLeft = event.capacity - event.spots_taken;
  const isTransformationMember = subscription?.tier === "transformation";
  const isFreeForMember = event.member_free_access && isTransformationMember;

  const handleBookTicket = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book a ticket.",
      });
      navigate("/login");
      return;
    }

    setIsBooking(true);
    try {
      const supabase = await getSupabase();
      if (!supabase) {
        throw new Error("Backend not configured");
      }

      // For now, just create a pending booking
      // PayPal integration will be added later
      const { error } = await supabase.from("event_bookings").insert({
        event_id: event.id,
        user_id: user.id,
        status: "pending",
        amount_paid: isFreeForMember ? 0 : event.price,
        is_member_access: isFreeForMember,
      });

      if (error) throw error;

      toast({
        title: "Booking created!",
        description: isFreeForMember 
          ? "You have free access as a Transformation member." 
          : "Please complete payment to confirm your spot.",
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Booking error:", err);
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: err.message || "Please try again or contact support.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleMembershipLead = async () => {
    if (!membershipForm.fullName.trim() || !membershipForm.whatsapp.trim()) {
      toast({
        variant: "destructive",
        title: "Please fill all fields",
        description: "We need your name and WhatsApp number to contact you.",
      });
      return;
    }

    setIsSubmittingLead(true);
    try {
      const supabase = await getSupabase();
      if (!supabase) {
        throw new Error("Backend not configured");
      }

      const { error } = await supabase.from("membership_leads").insert({
        full_name: membershipForm.fullName.trim(),
        whatsapp_number: membershipForm.whatsapp.trim(),
        event_id: event.id,
        source: "event_page",
      });

      if (error) throw error;

      setLeadSubmitted(true);
      toast({
        title: "Thank you!",
        description: "We'll contact you soon about membership options.",
      });
    } catch (err: any) {
      console.error("Lead submission error:", err);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Please try again or contact us on WhatsApp: 510522089",
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/events")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video">
              <img
                src={event.image_url || ""}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                {event.tags.map((tag) => (
                  <Badge key={tag} className="bg-primary/90 text-primary-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
              {event.member_free_access && (
                <Badge className="absolute top-4 right-4 bg-gold text-gold-foreground">
                  <Crown className="h-3 w-3 mr-1" />
                  Free for Transformation Members
                </Badge>
              )}
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {event.title}
              </h1>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {event.description.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return <h2 key={i} className="text-xl font-semibold text-foreground mt-6 mb-3">{line.replace("## ", "")}</h2>;
                  }
                  if (line.startsWith("- **")) {
                    const [bold, rest] = line.replace("- **", "").split("**:");
                    return (
                      <p key={i} className="flex items-start gap-2 mb-2">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span><strong className="text-foreground">{bold}:</strong>{rest}</span>
                      </p>
                    );
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <p key={i} className="flex items-start gap-2 mb-2">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span>{line.replace("- ", "")}</span>
                      </p>
                    );
                  }
                  return line ? <p key={i} className="mb-2">{line}</p> : null;
                })}
              </div>
            </div>

            {/* Gallery */}
            {event.gallery_images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Event Gallery</h3>
                <div className="grid grid-cols-2 gap-4">
                  {event.gallery_images.map((img, i) => (
                    <div key={i} className="rounded-lg overflow-hidden aspect-video">
                      <img src={img} alt={`${event.title} gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {isFreeForMember ? (
                    <span className="text-gradient-primary">Free Access</span>
                  ) : (
                    <span className="text-gradient-primary">${event.price}</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{spotsLeft} spots remaining</span>
                  </div>
                </div>

                {spotsLeft > 0 ? (
                  <div className="space-y-3 pt-4">
                    <Button
                      className="w-full bg-gradient-primary hover:opacity-90"
                      size="lg"
                      onClick={handleBookTicket}
                      disabled={isBooking}
                    >
                      {isBooking ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : isFreeForMember ? (
                        "Claim Free Access"
                      ) : (
                        "Buy Ticket"
                      )}
                    </Button>

                    <Dialog open={isMembershipFormOpen} onOpenChange={setIsMembershipFormOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" size="lg">
                          <Crown className="mr-2 h-4 w-4" />
                          Become a Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Interested in Membership?</DialogTitle>
                          <DialogDescription>
                            Leave your details and we'll contact you about our membership plans.
                          </DialogDescription>
                        </DialogHeader>
                        {leadSubmitted ? (
                          <div className="text-center py-6">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                              <Check className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-lg font-medium">Thank you!</p>
                            <p className="text-muted-foreground">We'll be in touch soon.</p>
                          </div>
                        ) : (
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor="fullName">Full Name</Label>
                              <Input
                                id="fullName"
                                placeholder="Your full name"
                                value={membershipForm.fullName}
                                onChange={(e) => setMembershipForm({ ...membershipForm, fullName: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="whatsapp">WhatsApp Number</Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="whatsapp"
                                  placeholder="+1 234 567 8900"
                                  className="pl-10"
                                  value={membershipForm.whatsapp}
                                  onChange={(e) => setMembershipForm({ ...membershipForm, whatsapp: e.target.value })}
                                />
                              </div>
                            </div>
                            <Button
                              className="w-full bg-gradient-primary hover:opacity-90"
                              onClick={handleMembershipLead}
                              disabled={isSubmittingLead}
                            >
                              {isSubmittingLead ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                "Submit"
                              )}
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-destructive font-medium">Event is sold out</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Join the waitlist for future events
                    </p>
                  </div>
                )}

                {/* Payment Support */}
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Having payment issues? Contact us on{" "}
                  <a href="https://wa.me/510522089" className="text-primary hover:underline">
                    WhatsApp: 510522089
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
