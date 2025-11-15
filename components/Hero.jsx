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
  const [videoError, setVideoError] = useState(false);
  const { isAdminMode } = useAdminMode();
  
  // Cargar imagen principal del logo desde admin (sin fallback específico)
  const { imageUrl: logoUrl, loading: logoLoading } = usePrimaryImage('logos', null);
  
  // Cargar imagen de fondo desde admin (sin fallback específico)
  const { imageUrl: backgroundUrl, loading: bgLoading } = usePrimaryImage('hero', null);

  // Cargar URL del video desde archivo JSON
  useEffect(() => {
    const loadVideoUrl = async () => {
      try {
        const { localContentService } = await import('@/lib/localContentService');
        const { data } = await localContentService.getPageContent('home');
        if (data && data.hero_video_url) {
          setVideoUrl(data.hero_video_url);
          setVideoError(false);
        }
      } catch (error) {
        console.error('Error cargando video URL:', error);
        // Mantener video por defecto
        setVideoUrl('/videofutbol.mp4');
        setVideoError(false);
      }
    };
    loadVideoUrl();
  }, []);

  useEffect(() => {
    let playAttempts = 0;
    const maxAttempts = 3;
    
    // Asegurar que el video se reproduzca automáticamente
    const playVideo = async () => {
      if (videoRef.current && playAttempts < maxAttempts) {
        try {
          // Forzar configuración antes de reproducir
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          videoRef.current.setAttribute('playsinline', '');
          videoRef.current.setAttribute('webkit-playsinline', '');
          
          await videoRef.current.play();
          setVideoError(false);
        } catch (error) {
          playAttempts++;
          // No mostrar error, solo reintentar silenciosamente
          if (playAttempts < maxAttempts) {
            setTimeout(() => playVideo(), 200 * playAttempts);
          }
        }
      }
    };

    // Intentar reproducir cuando el video cargue
    const handleLoadedData = () => playVideo();
    
    // Observar cuando el video se pausa y volverlo a reproducir
    const handlePause = () => {
      if (videoRef.current && !videoRef.current.ended) {
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }, 100);
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('pause', handlePause);
      // Intentar reproducir inmediatamente
      playVideo();
    }

    return () => {
      if (video) {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('pause', handlePause);
      }
    };
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
          preload="metadata"
          poster={backgroundUrl}
          key={videoUrl}
          onLoadedData={() => {
            // Intentar reproducir apenas cargue
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.error('Error en onLoadedData:', e));
            }
          }}
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
            pageKey="home"
            fieldKey="home_logo"
            className="mx-auto mb-8 w-150 h-150 object-contain"
            style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
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
