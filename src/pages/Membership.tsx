import { Layout } from "@/components/layout/Layout";
import { MembershipSection } from "@/components/landing/MembershipSection";

export default function Membership() {
  return (
    <Layout>
      <div className="py-12">
        <MembershipSection />
      </div>
    </Layout>
  );
}
