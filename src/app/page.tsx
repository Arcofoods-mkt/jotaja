import React from 'react';
import HeroSection from '../components/home/HeroSection';
import IndustryCarousel from '../components/home/IndustryCarousel';
import AulasShow from '../components/home/AulasShow';
import EventStats from '../components/home/EventStats';
import OQueEsperar from '../components/home/OQueEsperar';
import AboutTheDraw from '../components/home/AboutTheDraw';
import AboutSectionArcofoods from '../components/home/AboutSectionArcofoods';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <OQueEsperar />
      <AboutTheDraw />
      <AulasShow />
      <IndustryCarousel />
      <AboutSectionArcofoods />
      <EventStats />
      <Footer />
    </main>
  );
}
