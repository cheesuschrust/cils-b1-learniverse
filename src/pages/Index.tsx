
import React from "react";
import LandingNavbar from "@/components/layout/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import WordOfDaySection from "@/components/landing/WordOfDaySection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CallToActionSection from "@/components/landing/CallToActionSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <HeroSection />
      <WordOfDaySection />
      <FeaturesSection />
      <HowItWorksSection />
      <CallToActionSection />
      <TestimonialsSection />
    </div>
  );
};

export default Index;
