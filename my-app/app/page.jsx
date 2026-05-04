"use client";

import { useLandingPage } from "@/hooks/useLandingPage";
import { HeroSection } from "@/app/components/landing/HeroSection";
import { TrustSection } from "@/app/components/landing/TrustSection";
import { CategoriesSection } from "@/app/components/landing/CategoriesSection";
import { FeaturedStreams } from "@/app/components/landing/FeaturedStreams";
import { CallToAction } from "@/app/components/landing/CallToAction";

export default function HomePage() {
  const {
    searchQuery,
    setSearchQuery,
    featuredJobs,
    handleSearch,
  } = useLandingPage();

  return (
    <div className="min-h-screen relative overflow-hidden bg-bg-page transition-colors duration-500">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] translate-y-1/2"></div>

      <HeroSection 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        handleSearch={handleSearch} 
      />

      <TrustSection />

      <CategoriesSection />

      <FeaturedStreams featuredJobs={featuredJobs} />

      <CallToAction />
    </div>
  );
}
