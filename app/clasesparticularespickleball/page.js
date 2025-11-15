"use client";

import HeroSection from '@/components/HeroSection';
import SchedulePricingSection from '@/components/SchedulePricingSection';
import CTASection from '@/components/CTASection';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import EditableContent from '@/components/EditableContent';

export default function ClasesParticularesPickleball() {
  const { openWhatsApp, getWhatsAppNumber } = useWhatsApp();

  const classData = {
    heroProps: {
      title: { first: "Clases", second: "Particulares" },
      subtitle: "de Pickleball",
      titleColors: { first: "text-orange-400", second: "text-pink-400" },
      description: "Nuestras clases particulares de pickleball son ideales para ti.",
      buttonText: "Reservar Clase",
      buttonLink: "#contacto",
      backgroundGradient: "bg-gradient-to-br from-orange-900 via-pink-900 to-purple-800"
    },
    schedules: [
      { day: "Lunes a Viernes", time: "8:00 - 19:00" },
      { day: "Sábados", time: "8:00 - 17:00" },
      { day: "Domingos", time: "9:00 - 15:00" }
    ]
  };

  return (
    <div className="min-h-screen">
      <HeroSection {...classData.heroProps} pageKey="clasesparticularespickleball" imageCategory="clases-pickleball" />
      
      <SchedulePricingSection 
        schedules={classData.schedules}
        whatsappNumber={getWhatsAppNumber()}
        pageKey="clasesparticularespickleball"
      />
      
      <CTASection 
        title="¡Descubre tu potencial en Pickleball!"
        subtitle="Únete al deporte más emocionante y de rápido crecimiento. Tu primera clase te esperará para mostrar todo lo que puedes lograr"
        primaryButton={{
          text: "Reservar Mi Clase",
          type: "whatsapp",
          message: "Hola! Me interesa tomar clases particulares de pickleball. ¿Podrían darme información sobre horarios y precios?"
        }}
        secondaryButton={{
          text: "Más Información",
          type: "whatsapp", 
          message: "Hola! Soy principiante en pickleball y quisiera saber más sobre las clases particulares",
          action: () => openWhatsApp("Hola! Soy principiante en pickleball y quisiera saber más sobre las clases particulares")
        }}
        whatsappNumber={getWhatsAppNumber()}
        pageKey="clasesparticularespickleball"
        imageCategory="clases-pickleball-cta"
      />
    </div>
  );
}