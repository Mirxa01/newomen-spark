import { Layout } from "@/components/layout/Layout";
import { AssessmentsSection } from "@/components/landing/AssessmentsSection";

export default function Assessments() {
  return (
    <Layout>
      <div className="py-12">
        <AssessmentsSection />
      </div>
    </Layout>
  );
}
