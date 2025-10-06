import CardCarousel from "@/components/CardCarousel";
import Hero from "@/components/Hero";

export default function Page() {
  return (
    <main className="min-h-screen w-full">
      {/* Overlay para mejorar legibilidad */}
      <div className="min-h-screen w-full bg-[#3B3F44]">
        {/* Hero principal */}
        <Hero />

        {/* Galería */}

        <CardCarousel />
      </div>
    </main>
  );
}
