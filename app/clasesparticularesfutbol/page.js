"use client";

import HeroSection from '@/components/HeroSection';
import SchedulePricingSection from '@/components/SchedulePricingSection';
import CTASection from '@/components/CTASection';
import { useWhatsApp } from '@/hooks/useWhatsApp';

// ISR: Regenerar cada 60 segundos
export const revalidate = 60;


export default function ClasesParticulareFutbol() {
  const { openWhatsApp, getWhatsAppNumber } = useWhatsApp();

  const classData = {
    heroProps: {
      title: { first: "Clases", second: "Particulares" },
      subtitle: "de Fútbol",
      titleColors: { first: "text-green-400", second: "text-blue-400" },
      description: "Las clases particulares de fútbol CitySoccer están diseñadas para ti.",
      buttonText: "Agendar Clase",
      buttonLink: "#contacto",
      backgroundGradient: "bg-gradient-to-br from-green-900 via-blue-900 to-emerald-800"
    },
    schedules: [
      { day: "Lunes a Viernes", time: "9:00 - 18:00" },
      { day: "Sábados", time: "9:00 - 16:00" },
      { day: "Domingos", time: "10:00 - 14:00" }
    ]
  };

  return (
    <div className="min-h-screen">
      <HeroSection {...classData.heroProps} pageKey="clasesparticularesfutbol" imageCategory="clases-futbol" />
      
      <SchedulePricingSection 
        schedules={classData.schedules}
        whatsappNumber={getWhatsAppNumber()}
        pageKey="clasesparticularesfutbol"
      />
      
      <CTASection 
        title="¡Comienza tu entrenamiento personalizado!"
        subtitle="Agenda tu primera clase particular y experimenta un entrenamiento diseñado exclusivamente para ti"
        primaryButton={{
          text: "Agendar Primera Clase",
          type: "whatsapp",
          message: "Hola! Me interesa agendar mi primera clase particular de fútbol. ¿Podrían contarme sobre disponibilidad y precios?"
        }}
        secondaryButton={{
          text: "Consultar Precios",
          type: "whatsapp", 
          message: "Hola! Quisiera información sobre los precios de las clases particulares de fútbol"
        }}
        whatsappNumber={getWhatsAppNumber()}
        pageKey="clasesparticularesfutbol"
        imageCategory="clases-futbol-cta"
      />
    </div>
  );
}