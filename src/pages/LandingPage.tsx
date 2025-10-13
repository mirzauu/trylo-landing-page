import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import DemoSection from '../components/DemoSection';
import DemoTabs from '../components/show';
import ReviewsSection from '../components/ReviewsSection';
import PricingSection from '../components/PricingSection';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <HeroSection />
      <DemoTabs />
      <ReviewsSection />
      <DemoSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

