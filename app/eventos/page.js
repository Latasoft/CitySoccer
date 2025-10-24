"use client";

import HeroSection from '@/components/HeroSection';
import ProgramsSection from '@/components/ProgramsSection';
import CTASection from '@/components/CTASection';

export default function Eventos() {
  const eventData = {
    whatsapp: "+56974265019",
    heroProps: {
      title: { first: "Eventos", second: "Deportivos" },
      subtitle: " ",
      titleColors: { first: "text-purple-400", second: "text-yellow-400" },
      description: "Nuestras canchas y espacios están disponibles para cumpleaños, campeonatos, clínicas deportivas, actividades empresariales y más.",
      buttonText: "Ver Nuestros Eventos",
      buttonLink: "#eventos",
      images: {
        img1: "/Birthday.jpeg",
        img2: "/Pelota.jpg",
        img3: "/Cancha1.jpeg"
      },
      backgroundGradient: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800"
    },
    categories: [
      {
        name: "Eventos Corporativos",
        description: "Fortalece el equipo de trabajo con actividades deportivas profesionales",
        age: "Empresas",
        focus: [
          "Team Building Deportivo",
          "Campeonatos Empresariales", 
          "Inauguraciones Deportivas",
          "Integración de Equipos"
        ]
      },
      {
        name: "Cumpleaños Deportivos",
        description: "Celebra tu día especial con diversión y deporte para todas las edades",
        age: "Todas las edades",
        focus: [
          "Cumpleaños Infantiles",
          "Celebraciones Juveniles",
          "Fiestas de Adultos", 
          "Animación Deportiva"
        ]
      }
    ],
    services: [
      "Planificación completa del evento",
      "Coordinación el día del evento", 
      "Equipamiento deportivo incluido",
      "Servicio de catering personalizado",
      "Decoración temática profesional",
      "Fotografía y video del evento",
      "Animación y entretenimiento",
      "Seguro de responsabilidad civil",
      "Limpieza post-evento incluida",
      "Souvenirs personalizados"
    ]
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection {...eventData.heroProps} />
      
      {/* Tipos de Eventos */}
      <ProgramsSection 
        title="Tipos de Eventos"
        programs={eventData.categories}
        whatsappNumber={eventData.whatsapp}
      />
      
      
      
      {/* Call to Action */}
      <CTASection 
        title="¿Tienes una idea diferente?"
        subtitle="Organizamos eventos personalizados según tus necesidades. ¡Cuéntanos tu idea y la haremos realidad!"
        primaryButton={{
          text: "Planificar Mi Evento",
          type: "whatsapp",
          message: "Hola! Quiero organizar un evento personalizado. ¿Podrían ayudarme con la planificación?"
        }}
        secondaryButton={{
          text: "Ver Más Información",
          type: "whatsapp", 
          message: "Hola! Necesito más detalles sobre los tipos de eventos y servicios disponibles"
        }}
        whatsappNumber={eventData.whatsapp}
        backgroundImage="./Birthday.jpeg"
      />
    </div>
  );
}