'use client';

import Hero from '@/components/Hero';
import CardCarousel from '@/components/CardCarousel';

export default function HomePageClient() {
  return (
    <main className="min-h-screen w-full">
      <div className="min-h-screen w-full bg-[#3B3F44]">
        <Hero />
        <CardCarousel />
      </div>
    </main>
  );
}
