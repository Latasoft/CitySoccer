"use client";
import React from 'react';
import HeroSection from '@/components/HeroSection';
import ProgramsSection from '@/components/ProgramsSection';
import BenefitsSection from '@/components/BenefitsSection';
import SchedulePricingSection from '@/components/SchedulePricingSection';
import CTASection from '@/components/CTASection';
import { useWhatsApp } from '@/hooks/useWhatsApp';

export default function AcademiaFutbol() {
  const { openWhatsApp, getWhatsAppNumber } = useWhatsApp();

  const academyData = {
    title: "Academia de Fútbol",
    description: "Formación integral para futbolistas de todas las edades. Desarrolla tu talento en un ambiente profesional",
    categories: [
      {
        name: "Escuela de Fútbol (4-8 años)",
        description: "Iniciación deportiva a través del juego",
        focus: ["Coordinación motriz", "Trabajo en equipo", "Diversión", "Disciplina básica"]
      },
      {
        name: "Fútbol Formativo (9-13 años)",
        description: "Desarrollo de fundamentos técnicos y tácticos",
        focus: ["Técnica individual", "Táctica básica", "Condición física", "Valores deportivos"]
      },
      {
        name: "Fútbol Competitivo (14-17 años)",
        description: "Preparación para competencias de alto nivel",
        focus: ["Táctica avanzada", "Preparación física", "Mentalidad competitiva", "Liderazgo"]
      },
      {
        name: "Fútbol Adulto (18+ años)",
        description: "Mantente en forma mientras juegas",
        focus: ["Condición física", "Técnica", "Recreación", "Bienestar"]
      }
    ],
    benefits: [
      "Entrenadores certificados por la ANFP",
      "Metodología de entrenamiento profesional",
      "Participación en torneos y campeonatos",
      "Evaluaciones técnicas periódicas",
      "Seguimiento personalizado del progreso",
      "Instalaciones de primer nivel",
      "Equipamiento deportivo incluido",
      "Certificados de participación"
    ],
    schedule: [
      "Lunes a Viernes: 16:00 - 20:00",
      "Sábados: 9:00 - 17:00",
      "Domingos: 9:00 - 15:00"
    ]
  };

  const handleWhatsAppClick = () => {
    const message = "Hola! Me interesa información sobre la Academia de Fútbol. ¿Podrían contarme más detalles sobre las categorías, precios y horarios disponibles?";
    openWhatsApp(message);
  };

  const heroProps = {
    title: { first: "Academia de", second: "Fútbol" },
    subtitle: "",
    titleColors: { first: "text-blue-400", second: "text-red-400" },
    description: "La pasión por el fútbol se vive en nuestra Academia CitySoccer. Aquí formamos a niños, jóvenes y adultos bajo un programa integral que combina técnica, táctica y valores deportivos. Nuestros entrenadores profesionales trabajan con metodologías modernas para potenciar el talento y desarrollar habilidades dentro y fuera de la cancha. Ven a entrenar en un ambiente sano, motivador y lleno de energía.",
    buttonText: "Ver Programas",
    buttonLink: "/academiadefutbol",
    images: {
      img1: "/Entrenamiento3.jpeg",
      img2: "/Entrenamiento5.jpeg",
      img3: "/Entrenamiento4.jpeg"
    },
    backgroundGradient: "bg-gradient-to-br from-green-900 via-blue-900 to-green-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      <HeroSection {...heroProps} />
      
      <ProgramsSection 
        title="Nuestros Programas"
        programs={academyData.categories}
        whatsappNumber={getWhatsAppNumber()}
        onWhatsAppClick={openWhatsApp}
      />
      
      <BenefitsSection 
        title="¿Por qué elegir nuestra Academia?"
        benefits={academyData.benefits}
      />
      
      <SchedulePricingSection 
        schedules={[
          { day: "Lunes a Viernes", time: "16:00 - 20:00" },
          { day: "Sábados", time: "9:00 - 17:00" },
          { day: "Domingos", time: "9:00 - 15:00" }
        ]}
        whatsappNumber={getWhatsAppNumber()}
      />
      
      <CTASection 
        title="¿Listo para comenzar?"
        subtitle="Únete a nuestra Academia y desarrolla tu potencial futbolístico"
        primaryButton={{
          text: "Inscríbete Ahora",
          type: "whatsapp",
          message: "Hola! Quiero inscribirme en la Academia de Fútbol",
          action: () => openWhatsApp("Hola! Quiero inscribirme en la Academia de Fútbol")
        }}
        secondaryButton={{
          text: "Más Información",
          type: "whatsapp", 
          message: "Hola! Necesito más información sobre la Academia",
          action: () => openWhatsApp("Hola! Necesito más información sobre la Academia")
        }}
        whatsappNumber={getWhatsAppNumber()}
      />
    </div>
  );
}