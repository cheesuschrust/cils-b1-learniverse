
import React from "react";
import LandingNavbar from "@/components/layout/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import WordOfDaySection from "@/components/landing/WordOfDaySection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CallToActionSection from "@/components/landing/CallToActionSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import { PageSEO } from "@/components/SEO";

const Index = () => {
  // Prepare structured data for the homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Italian Language Learning Platform",
    "description": "Learn Italian for citizenship, exams, and everyday use with our comprehensive language learning platform.",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <PageSEO 
        title="Italian Language Learning Platform | Learn for Citizenship Tests & B1 Exam"
        description="Master Italian language with our comprehensive learning platform. Prepare for citizenship tests and B1 exams with flashcards, exercises, and AI-powered assistance."
        keywords={["learn italian", "italian language", "italian citizenship test", "B1 exam preparation", "italian flashcards"]}
        ogTitle="Master Italian Language for Citizenship & B1 Exams"
        ogDescription="Interactive Italian language learning with citizenship test preparation, B1 exam materials, and spaced repetition exercises."
        ogImage={`${window.location.origin}/assets/og-homepage.jpg`}
        structuredData={homepageStructuredData}
      />
      
      <div className="flex flex-col min-h-screen">
        <LandingNavbar />
        <HeroSection />
        <WordOfDaySection />
        <FeaturesSection />
        <HowItWorksSection />
        <CallToActionSection />
        <TestimonialsSection />
      </div>
    </>
  );
};

export default Index;
