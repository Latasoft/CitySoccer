"use client";
import HeroSection from "@/components/HeroSection";
export default function SummerCamp() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("¡Hola! Me interesa inscribir a mi hijo/a en el Summer Camp 2026. ¿Podrían contarme más sobre precios, fechas disponibles y el proceso de inscripción?");
    window.open(`https://wa.me/${campData.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white px-4">
    <HeroSection
        title={{ first: "Summer", second: "Camp" }}
        subtitle="En City Soccer."
        description="Este verano vive la mejor experiencia deportiva en el Summer Camp CitySoccer. Un programa lleno de actividades para niños y jóvenes, donde se combinan entrenamientos de fútbol y pickleball con dinámicas recreativas, trabajo en equipo y valores de compañerismo."
        buttonText="Más Información"
        buttonLink="/summer-camp"
        images={{
          img1: "/Entrenamiento3.jpeg",
          img2: "/Entrenamiento2.jpeg",
          img3: "/Entrenamiento5.jpeg"
        }}
        backgroundGradient = "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
      />  
      

    </div>

  );
}