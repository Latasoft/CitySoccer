"use client";
import React from 'react';
import HeroSection from '@/components/HeroSection';
import CTASection from '@/components/CTASection';
import { useWhatsApp } from '@/hooks/useWhatsApp';

// ISR: Regenerar cada 60 segundos
export const revalidate = 60;


export default function AcademiaPickleball() {
  const { openWhatsApp, getWhatsAppNumber } = useWhatsApp();

  const heroProps = {
    title: { first: "Academia de", second: "Pickleball" },
    subtitle: "",
    titleColors: { first: "text-orange-400", second: "text-pink-400" },
    description: "Descubre la emoción del pickleball en nuestra Academia CitySoccer.",
    buttonText: "Ver Programas",
    buttonLink: "/academiadepickleball",
    backgroundGradient: "bg-gradient-to-br from-orange-900 via-pink-900 to-purple-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      <HeroSection {...heroProps} pageKey="academiadepickleball" imageCategory="academia-pickleball" />
      
      <CTASection 
        title="¿Te animas a jugar pickleball?"
        subtitle="Únete a nuestra Academia de Pickleball y descubre por qué es el deporte que está conquistando el mundo"
        primaryButton={{
          text: "Inscríbete Ahora",
          type: "whatsapp",
          message: "Hola! Quiero inscribirme en la Academia de Pickleball"
        }}
        secondaryButton={{
          text: "Más Información",
          type: "whatsapp", 
          message: "Hola! Necesito más información sobre la Academia de Pickleball"
        }}
        whatsappNumber={getWhatsAppNumber()}
        pageKey="academiadepickleball"
        imageCategory="academia-pickleball-cta"
      />
    </div>
  );
}