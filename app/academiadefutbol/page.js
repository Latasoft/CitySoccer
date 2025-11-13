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

  // Datos hardcoded como fallback - el contenido editable viene de JSON
  const academyData = {
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
    ]
  };

  const heroProps = {
    title: { first: "Academia de", second: "Fútbol" },
    subtitle: "",
    titleColors: { first: "text-blue-400", second: "text-red-400" },
    description: "La pasión por el fútbol se vive en nuestra Academia CitySoccer.",
    buttonText: "Ver Programas",
    buttonLink: "/academiadefutbol",
    backgroundGradient: "bg-gradient-to-br from-green-900 via-blue-900 to-green-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      <HeroSection {...heroProps} pageKey="academiadefutbol" imageCategory="academia-futbol" />
      
      <ProgramsSection 
        title="Nuestros Programas"
        programs={academyData.categories}
        whatsappNumber={getWhatsAppNumber()}
        onWhatsAppClick={openWhatsApp}
        pageKey="academiadefutbol"
      />
      
      <BenefitsSection 
        title="¿Por qué elegir nuestra Academia?"
        benefits={academyData.benefits}
        pageKey="academiadefutbol"
      />
      
      <SchedulePricingSection 
        schedules={[
          { day: "Lunes a Viernes", time: "16:00 - 20:00" },
          { day: "Sábados", time: "9:00 - 17:00" },
          { day: "Domingos", time: "9:00 - 15:00" }
        ]}
        whatsappNumber={getWhatsAppNumber()}
        pageKey="academiadefutbol"
      />
      
      <CTASection 
        title="¿Listo para comenzar?"
        subtitle="Únete a nuestra Academia y desarrolla tu potencial futbolístico"
        primaryButton={{
          text: "Inscríbete Ahora",
          type: "whatsapp",
          message: "Hola! Me interesa inscribirme en la Academia de Fútbol"
        }}
        secondaryButton={{
          text: "Más Información",
          type: "whatsapp",
          message: "Hola! Necesito más información sobre la Academia de Fútbol"
        }}
        whatsappNumber={getWhatsAppNumber()}
        pageKey="academiadefutbol"
      />
    </div>
  );
}