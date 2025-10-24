"use client";
import React from 'react';
import HeroSection from '@/components/HeroSection';
import CTASection from '@/components/CTASection';

export default function AcademiaPickleball() {
  const academyData = {
    title: "Academia de Pickleball",
    description: "Formación integral en el deporte de más rápido crecimiento. Desarrolla tu técnica en un ambiente profesional",
    categories: [
      {
        name: "Iniciación Pickleball (8-12 años)",
        description: "Primeros pasos en el deporte más divertido",
        focus: ["Coordinación mano-ojo", "Golpes básicos", "Reglas del juego", "Diversión garantizada"]
      },
      {
        name: "Pickleball Juvenil (13-17 años)",
        description: "Desarrollo técnico y competitivo para jóvenes",
        focus: ["Técnica avanzada", "Estrategias de juego", "Preparación competitiva", "Trabajo en equipo"]
      },
      {
        name: "Pickleball Adulto Principiante (18+ años)",
        description: "Aprende desde cero el deporte más emocionante",
        focus: ["Fundamentos técnicos", "Posicionamiento", "Reglas oficiales", "Condición física"]
      },
      {
        name: "Pickleball Intermedio/Avanzado (18+ años)",
        description: "Perfecciona tu juego y compite al más alto nivel",
        focus: ["Técnicas especiales", "Táctica avanzada", "Preparación para torneos", "Mentalidad competitiva"]
      }
    ],
    benefits: [
      "Instructores certificados internacionalmente",
      "Metodología de enseñanza moderna",
      "Participación en torneos nacionales",
      "Evaluaciones técnicas periódicas",
      "Seguimiento personalizado del progreso",
      "Canchas profesionales de pickleball",
      "Raquetas y pelotas profesionales incluidas",
      "Certificados de participación",
      "Programa de ranking interno",
      "Clínicas especializadas con profesionales"
    ],
    schedule: [
      "Lunes a Viernes: 15:00 - 21:00",
      "Sábados: 8:00 - 18:00",
      "Domingos: 9:00 - 16:00"
    ],
    whatsapp: "+56974265019"
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola! Me interesa información sobre la Academia de Pickleball. ¿Podrían contarme más detalles sobre las categorías, precios y horarios disponibles?");
    window.open(`https://wa.me/${academyData.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  const heroProps = {
    title: { first: "Academia de", second: "Pickleball" },
    subtitle: "",
    titleColors: { first: "text-orange-400", second: "text-pink-400" },
    description: "Descubre la emoción del pickleball en nuestra Academia CitySoccer. El deporte de raqueta de más rápido crecimiento mundial ahora tiene su hogar en Chile. Nuestros instructores especializados te guiarán desde los fundamentos hasta el nivel competitivo, en un ambiente profesional, divertido y lleno de energía. Únete a la revolución del pickleball.",
    buttonText: "Ver Programas",
    buttonLink: "/academiadepickleball",
    images: {
      img1: "/Pickleball.jpeg",
      img2: "/Pickleball2.jpeg",
      img3: "/Pickleball.jpeg"
    },
    backgroundGradient: "bg-gradient-to-br from-orange-900 via-pink-900 to-purple-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      <HeroSection {...heroProps} />
      

      
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
        whatsappNumber={academyData.whatsapp}
        backgroundImage="/Pickleball2.jpeg"
      />
    </div>
  );
}