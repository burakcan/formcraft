import { FeaturesSections } from "@/components/landing/FeaturesSections";
import { Hero } from "@/components/landing/Hero";
import { PricingSection } from "@/components/landing/PricingSection";
import { SummarySection } from "@/components/landing/SummarySection";

export default async function Home() {
  return (
    <>
      <Hero />
      <SummarySection />
      <FeaturesSections />
      <PricingSection />
    </>
  );
}
