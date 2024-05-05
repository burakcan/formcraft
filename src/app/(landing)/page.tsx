import { FeaturesSections } from "@/components/landing/FeaturesSections";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { PricingSection } from "@/components/landing/PricingSection";
import { SummarySection } from "@/components/landing/SummarySection";

export default async function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SummarySection />
      <FeaturesSections />
      <PricingSection />
    </>
  );
}
