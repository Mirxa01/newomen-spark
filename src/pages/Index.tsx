import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/landing/HeroSection";
import { UpcomingEventsSection } from "@/components/landing/UpcomingEventsSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { AssessmentsSection } from "@/components/landing/AssessmentsSection";
import { MembershipSection } from "@/components/landing/MembershipSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CTASection } from "@/components/landing/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <UpcomingEventsSection />
      <GallerySection />
      <AssessmentsSection />
      <MembershipSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
