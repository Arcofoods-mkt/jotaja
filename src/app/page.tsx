import React from 'react';
import HeroSection from '../components/home/HeroSection';
import IndustryCarousel from '../components/home/IndustryCarousel';
import EventStats from '../components/home/EventStats';
import AboutSection from '../components/home/AboutSection';
import AboutSectionArcofoods from '../components/home/AboutSectionArcofoods';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <IndustryCarousel />
      <EventStats />
      <AboutSectionArcofoods />
      <Footer />
    </main>
  );
}
