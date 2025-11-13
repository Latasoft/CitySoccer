"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePrimaryImage, useDynamicImages } from "@/lib/dynamicImageService";
import EditableImage from './EditableImage';
import EditableContent from './EditableContent';
import EditableVideo from './EditableVideo';
import { useAdminMode } from '@/contexts/AdminModeContext';

const Hero = () => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState('/videofutbol.mp4');
  const { isAdminMode } = useAdminMode();
  
  // Cargar imagen principal del logo desde admin
  const { imageUrl: logoUrl, loading: logoLoading } = usePrimaryImage('logos', '/Logo2.png');
  
  // Cargar imagen de fondo desde admin (categoría hero)
  const { imageUrl: backgroundUrl, loading: bgLoading } = usePrimaryImage('hero', '/imgPrincipal.jpeg');

  // Cargar URL del video desde archivo JSON
  useEffect(() => {
    const loadVideoUrl = async () => {
      try {
        const { localContentService } = await import('@/lib/localContentService');
        const { data } = await localContentService.getPageContent('home');
        if (data && data.hero_video_url) {
          setVideoUrl(data.hero_video_url);
        }
      } catch (error) {
        console.error('Error cargando video URL:', error);
      }
    };
    loadVideoUrl();
  }, []);

  useEffect(() => {
    // Asegurar que el video se reproduzca automáticamente
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Error al reproducir el video:", error);
      });
    }
  }, [videoUrl]);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster={backgroundUrl}
          key={videoUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          {/* Fallback para navegadores que no soportan video */}
          Tu navegador no soporta videos HTML5.
        </video>

        {/* Overlay oscuro para mejor legibilidad del texto */}
        <div className="absolute inset-0 bg-brand-dark-gray/50"></div>
        
        {/* Botón de edición del video en modo admin */}
        {isAdminMode && (
          <div className="absolute top-4 right-4 z-20">
            <EditableVideo
              pageKey="home"
              fieldKey="hero_video_url"
              defaultValue="/videofutbol.mp4"
              onSave={(newValue) => setVideoUrl(newValue)}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {/* Logo dinámico desde admin */}
        {!logoLoading && (
          <EditableImage
            src={logoUrl}
            alt="City Soccer Logo"
            categoria="logos"
            className="mx-auto mb-8 w-150 h-150 object-contain"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
            fallbackSrc="/Logo2.png"
          />
        )}

        {/* Título editable */}
        <EditableContent 
          pageKey="home"
          fieldKey="hero_title"
          fieldType="text"
          defaultValue="Bienvenido a City Soccer"
          as="h1"
          className="text-5xl font-bold mb-4 drop-shadow-lg"
        />

        {/* Subtítulo editable */}
        <EditableContent 
          pageKey="home"
          fieldKey="hero_subtitle"
          fieldType="textarea"
          defaultValue="El mejor lugar para jugar fútbol y pickleball"
          as="p"
          className="text-xl mb-8 drop-shadow-md"
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/arrendarcancha">
            <button
              className="text-2xl px-16 py-6 text-black rounded-lg font-black flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wider"
              style={{
                backgroundColor: "#FFED00",
                fontFamily: "Arial Black, Arial, sans-serif",
              }}
            >
              <EditableContent 
                pageKey="home"
                fieldKey="hero_cta_text"
                fieldType="text"
                defaultValue="RESERVA HOY"
                as="span"
              />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
