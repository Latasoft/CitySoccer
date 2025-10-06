"use client";

import HeroSection from '@/components/HeroSection';
import BenefitsSection from '@/components/BenefitsSection';
import SchedulePricingSection from '@/components/SchedulePricingSection';
import CTASection from '@/components/CTASection';

export default function ClasesParticulareFutbol() {
  const classData = {
    whatsapp: "+56912345678",
    heroProps: {
      title: { first: "Clases", second: "Particulares" },
      subtitle: "de Fútbol",
      titleColors: { first: "text-green-400", second: "text-blue-400" },
      description: "Las clases particulares de fútbol CitySoccer están diseñadas para que trabajes mano a mano con un entrenador especializado. Ajustamos cada sesión a tus necesidades: técnica, velocidad, resistencia, táctica y control del balón.",
      buttonText: "Agendar Clase",
      buttonLink: "#contacto",
      images: {
        img1: "/Entrenamiento.jpeg",
        img2: "/Pelota.jpg",
        img3: "/Cancha1.jpeg"
      },
      backgroundGradient: "bg-gradient-to-br from-green-900 via-blue-900 to-emerald-800"
    },
    includes: [
      "Entrenador profesional certificado ANFP",
      "Evaluación técnica inicial personalizada",
      "Plan de entrenamiento adaptado a tu nivel",
      "Material de entrenamiento profesional incluido",
      "Seguimiento detallado del progreso",
      "Ejercicios específicos para tu posición",
      "Análisis de video de tu desempeño",
      "Consejos nutricionales deportivos",
      "Certificado de participación",
      "Flexibilidad total de horarios"
    ],
    schedules: [
      { day: "Lunes a Viernes", time: "9:00 - 18:00" },
      { day: "Sábados", time: "9:00 - 16:00" },
      { day: "Domingos", time: "10:00 - 14:00" }
    ]
  };

  return (
    <div className="min-h-screen">
      <HeroSection {...classData.heroProps} />
      
      
      <SchedulePricingSection 
        schedules={classData.schedules}
        whatsappNumber={classData.whatsapp}
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
        whatsappNumber={classData.whatsapp}
      />
    </div>
  );
}