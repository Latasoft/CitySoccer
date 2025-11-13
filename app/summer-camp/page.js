"use client";
import HeroSection from "@/components/HeroSection";
import EditableContent from "@/components/EditableContent";
import { useWhatsApp } from '@/hooks/useWhatsApp';

export default function SummerCamp() {
  const { openWhatsApp } = useWhatsApp();

  const handleWhatsAppClick = () => {
    const message = "¡Hola! Me interesa inscribir a mi hijo/a en el Summer Camp 2026. ¿Podrían contarme más sobre precios, fechas disponibles y el proceso de inscripción?";
    openWhatsApp(message);
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
    <HeroSection
        pageKey="summer-camp"
        title={{ first: "Summer", second: "Camp" }}
        subtitle="En City Soccer."
        description="Este verano vive la mejor experiencia deportiva en el Summer Camp CitySoccer. Un programa lleno de actividades para niños y jóvenes, donde se combinan entrenamientos de fútbol y pickleball con dinámicas recreativas, trabajo en equipo y valores de compañerismo."
        buttonText="Más Información"
        buttonAction={handleWhatsAppClick}
        imageCategory="summer-camp"
        backgroundGradient = "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
      />  
      

    </div>

  );
}