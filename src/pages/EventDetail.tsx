import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEventById, useCreateBooking, useSubmitMembershipLead } from "@/hooks/useEvents";
import { membershipLeadSchema } from "@/lib/validation";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Crown, Phone, Check, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { PageLoader } from "@/components/ui/loading-skeleton";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "EEEE, MMMM d, yyyy");
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return format(date, "h:mm a");
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, subscription } = useAuth();
  const { toast } = useToast();
  
  const { data: event, isLoading, error } = useEventById(id || "");
  const createBooking = useCreateBooking();
  const submitLead = useSubmitMembershipLead();
  
  const [isMembershipFormOpen, setIsMembershipFormOpen] = useState(false);
  const [membershipForm, setMembershipForm] = useState({ fullName: "", whatsapp: "" });
  const [formErrors, setFormErrors] = useState<{ fullName?: string; whatsapp?: string }>({});
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <PageLoader />
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" className="mb-6" onClick={() => navigate("/events")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <div className="text-center text-destructive">
            <p>Event not found or failed to load.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const spotsLeft = event.capacity ? event.capacity - (event.spots_taken || 0) : null;
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

    try {
      await createBooking.mutateAsync({
        eventId: event.id,
        userId: user.id,
        isMemberAccess: isFreeForMember || false,
        amountPaid: isFreeForMember ? 0 : (event.price || 0),
      });

      toast({
        title: "Booking created!",
        description: isFreeForMember 
          ? "You have free access as a Transformation member." 
          : `Your booking for "${event.title}" has been created. Complete payment to confirm.`,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Booking error:", err);
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  const handleMembershipLead = async () => {
    setFormErrors({});

    // Validate with zod schema
    const validationResult = membershipLeadSchema.safeParse(membershipForm);
    
    if (!validationResult.success) {
      const errors: { fullName?: string; whatsapp?: string } = {};
      validationResult.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof errors;
        errors[field] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    try {
      await submitLead.mutateAsync({
        fullName: validationResult.data.fullName,
        whatsapp: validationResult.data.whatsapp,
        eventId: event.id,
        source: "event_page",
      });

      setLeadSubmitted(true);
      toast({
        title: "Thank you!",
        description: "We'll contact you soon about membership options.",
      });
    } catch (err) {
      console.error("Lead submission error:", err);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Please try again.",
      });
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
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                  <Calendar className="h-20 w-20 text-white/30" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                {event.tags?.map((tag) => (
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
              {event.description && (
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
              )}
            </div>

            {/* Gallery */}
            {event.gallery_images && event.gallery_images.length > 0 && (
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
                  {event.price === 0 || isFreeForMember ? (
                    <span className="text-gradient-primary">Free Access</span>
                  ) : (
                    <span className="text-gradient-primary">${event.price}</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  {event.date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date ? formatTime(event.date) : "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.is_online ? "Online" : event.location}</span>
                  </div>
                  {spotsLeft !== null && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{spotsLeft} spots remaining</span>
                    </div>
                  )}
                </div>

                {spotsLeft !== null && spotsLeft > 0 ? (
                  <div className="space-y-3 pt-4">
                    <Button
                      className="w-full bg-gradient-primary hover:opacity-90"
                      size="lg"
                      onClick={handleBookTicket}
                      disabled={createBooking.isPending}
                    >
                      {createBooking.isPending ? (
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
                                onChange={(e) => {
                                  setMembershipForm({ ...membershipForm, fullName: e.target.value });
                                  if (formErrors.fullName) {
                                    setFormErrors({ ...formErrors, fullName: undefined });
                                  }
                                }}
                                className={formErrors.fullName ? "border-destructive" : ""}
                              />
                              {formErrors.fullName && (
                                <p className="text-sm text-destructive mt-1">{formErrors.fullName}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="whatsapp">WhatsApp Number</Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="whatsapp"
                                  placeholder="+1234567890"
                                  className={`pl-10 ${formErrors.whatsapp ? "border-destructive" : ""}`}
                                  value={membershipForm.whatsapp}
                                  onChange={(e) => {
                                    setMembershipForm({ ...membershipForm, whatsapp: e.target.value });
                                    if (formErrors.whatsapp) {
                                      setFormErrors({ ...formErrors, whatsapp: undefined });
                                    }
                                  }}
                                />
                              </div>
                              {formErrors.whatsapp && (
                                <p className="text-sm text-destructive mt-1">{formErrors.whatsapp}</p>
                              )}
                            </div>
                            <Button
                              className="w-full bg-gradient-primary hover:opacity-90"
                              onClick={handleMembershipLead}
                              disabled={submitLead.isPending}
                            >
                              {submitLead.isPending ? (
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