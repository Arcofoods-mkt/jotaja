"use client";
import { useEffect } from 'react';

export default function TabTitleAnimator() {
  useEffect(() => {
    const titles = ["Arcofoods | Jotajá Summit", "Participe do sorteio!"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % titles.length;
      document.title = titles[currentIndex];
    }, 2000);

    // Initial set
    document.title = titles[0];

    return () => clearInterval(interval);
  }, []);

  return null;
}
