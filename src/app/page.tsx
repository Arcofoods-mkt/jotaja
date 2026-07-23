import React from 'react';
import HeroSection from '../components/home/HeroSection';
import IndustryCarousel from '../components/home/IndustryCarousel';
import EventStats from '../components/home/EventStats';
import AboutSection from '../components/home/AboutSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <IndustryCarousel />
      <EventStats />
      <AboutSection />
      <Footer />
    </main>
  );
}
