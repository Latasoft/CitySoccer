"use client";

import HeroSection from '@/components/HeroSection';
import SchedulePricingSection from '@/components/SchedulePricingSection';
import CTASection from '@/components/CTASection';
import { useWhatsApp } from '@/hooks/useWhatsApp';

export default function ClasesParticularePickleball() {
  const { openWhatsApp, getWhatsAppNumber } = useWhatsApp();

  const classData = {
    heroProps: {
      title: { first: "Clases", second: "Particulares" },
      subtitle: "de Pickleball",
      titleColors: { first: "text-orange-400", second: "text-pink-400" },
      description: "Nuestras clases particulares de pickleball son ideales si buscas avanzar rápido, mejorar tu técnica de saque, voleas y estrategia de juego. Los entrenadores se adaptan a tu ritmo y objetivos, entregándote una experiencia enfocada 100% en ti.",
      buttonText: "Reservar Clase",
      buttonLink: "#contacto",
      images: {
        img1: "/Pickleball.jpeg",
        img2: "/Pickleball2.jpeg",
        img3: "/Pickleball.jpeg"
      },
      backgroundGradient: "bg-gradient-to-br from-orange-900 via-pink-900 to-purple-800"
    },
    includes: [
      "Instructor certificado en Pickleball",
      "Evaluación inicial de habilidades",
      "Técnicas específicas de golpeo",
      "Estrategias de posicionamiento en cancha",
      "Raquetas y pelotas profesionales incluidas",
      "Ejercicios de precisión y control",
      "Tácticas de juego individual y dobles",
      "Análisis personalizado de tu juego",
      "Consejos para prevenir lesiones",
      "Horarios completamente flexibles",
      "Progresión adaptada a tu nivel",
      "Certificado de participación"
    ],
    schedules: [
      { day: "Lunes a Viernes", time: "8:00 - 19:00" },
      { day: "Sábados", time: "8:00 - 17:00" },
      { day: "Domingos", time: "9:00 - 15:00" }
    ]
  };

  return (
    <div className="min-h-screen">
      <HeroSection {...classData.heroProps} />
      
      
      
      <SchedulePricingSection 
        schedules={classData.schedules}
        whatsappNumber={getWhatsAppNumber()}
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
        backgroundImage="./Pickleball2.jpeg"
      />
    </div>
  );
}