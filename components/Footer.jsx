"use client";
import React, { useEffect, useState } from "react";
import { useAdminMode } from "@/contexts/AdminModeContext";
import { useContent } from "@/contexts/ContentContext";
import localStorageService from "@/lib/localStorageService";
import EditableContent from "./EditableContent";
import EditableImage from "./EditableImage";

// Componente para links de redes sociales con URL dinámica
function SocialLink({ pageKey, fieldKey, defaultUrl, ariaLabel, onClick, children }) {
  const { getField } = useContent();
  const [url, setUrl] = useState(defaultUrl);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadUrl = async () => {
      const { data, error } = await getField(pageKey, fieldKey);
      if (isMounted && data) {
        setUrl(data);
      }
      setLoading(false);
    };
    
    loadUrl();
    return () => { isMounted = false; };
  }, [pageKey, fieldKey, getField]);

  if (loading) {
    return (
      <div className="text-white opacity-50">
        <span className="sr-only">Cargando...</span>
        <svg className="size-7 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" opacity="0.3" />
        </svg>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      className="text-white hover:text-yellow-200 transition-colors duration-300 transform hover:scale-110"
    >
      <span className="sr-only">{ariaLabel}</span>
      <svg className="size-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}

export default function Footer() {
  const { isAdminMode } = useAdminMode();

  // Escuchar actualizaciones de sincronización para footer
  useEffect(() => {
    const handleSync = (event) => {
      const { pageKey, changes } = event.detail;
      if (pageKey === 'footer' && changes && changes.length > 0) {
        console.log('👣 [Footer] Contenido actualizado:', changes.length, 'cambios');
        // Los componentes EditableContent se actualizarán automáticamente
        // Este log es solo para tracking
      }
    };
    
    window.addEventListener('localstorage-sync', handleSync);
    
    return () => {
      window.removeEventListener('localstorage-sync', handleSync);
    };
  }, []);

  const handleWhatsAppClick = () => {
    const message = "¡Hola! Me gustaría saber más sobre City Soccer.";
    const phoneNumber = '56974265020'; // Extraído del footer content
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Prevenir navegación en modo admin
  const handleLinkClick = (e) => {
    if (isAdminMode) {
      e.preventDefault();
    }
  };

  return (
    <>
      <footer className="bg-[#23262C] lg:grid lg:grid-cols-5 relative overflow-hidden">
        {/* Background decorativo */}

        <div className="relative block h-32 lg:col-span-2 lg:h-full">
          <EditableImage
            src="https://ckbebftjgqearfubmgus.supabase.co/storage/v1/object/public/images/footer/footer_1763220945462_footer_1763176402282_ecf49f75-db67-4aad-80e2-289cc4ead146-1_all_21702.jpg"
            categoria="footer"
            pageKey="footer"
            fieldKey="footer_image"
            alt="Instalaciones City Soccer"
            fill={true}
            sizes="(max-width: 1024px) 100vw, 40vw"
            quality={75}
            className="opacity-80"
          />
          {/* Sin gradiente overlay en la imagen */}
        </div>

        <div className="px-4 py-16 sm:px-6 lg:col-span-3 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <p>
                <EditableContent 
                  pageKey="footer" 
                  fieldKey="contact_label" 
                  fieldType="text"
                  defaultValue="Llámanos"
                  as="span"
                  className="text-xs tracking-wide text-yellow-100 uppercase font-bold"
                />

                <EditableContent 
                  pageKey="footer" 
                  fieldKey="contact_phone" 
                  fieldType="text"
                  defaultValue="+56 9 7426 5020"
                  as="a"
                  href="tel:+56974265020"
                  onClick={handleLinkClick}
                  className="block text-2xl font-bold text-white hover:text-yellow-100 sm:text-3xl transition-colors duration-300 drop-shadow-lg"
                />
              </p>

              <ul className="mt-8 space-y-2 text-sm text-yellow-50 font-medium">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-yellow-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <EditableContent 
                    pageKey="footer" 
                    fieldKey="hours_weekdays" 
                    fieldType="text"
                    defaultValue="Lunes a Viernes: 9:00 - 23:00"
                    as="span"
                  />
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-yellow-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <EditableContent 
                    pageKey="footer" 
                    fieldKey="hours_saturday" 
                    fieldType="text"
                    defaultValue="Sábados: 9:00 - 23:00"
                    as="span"
                  />
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-yellow-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <EditableContent 
                    pageKey="footer" 
                    fieldKey="hours_sunday" 
                    fieldType="text"
                    defaultValue="Domingos: 9:00 - 23:00"
                    as="span"
                  />
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-yellow-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <a
                    href="https://maps.google.com/?q=Tiltil+2569,+Macul,+Chile"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="text-yellow-100 hover:text-white transition-colors duration-300"
                  >
                    Ubicación - <EditableContent 
                      pageKey="footer" 
                      fieldKey="contact_address" 
                      fieldType="text"
                      defaultValue="Tiltil 2569, Macul"
                      as="span"
                      onClick={handleLinkClick}
                    />
                  </a>
                </li>
              </ul>

              <ul className="mt-8 flex gap-6">
                <li>
                  <SocialLink
                    pageKey="footer"
                    fieldKey="social_facebook"
                    defaultUrl="https://facebook.com/citysoccer"
                    ariaLabel="Facebook"
                    onClick={handleLinkClick}
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </SocialLink>
                </li>

                <li>
                  <SocialLink
                    pageKey="footer"
                    fieldKey="social_instagram"
                    defaultUrl="https://www.instagram.com/citysoccersantiago"
                    ariaLabel="Instagram"
                    onClick={handleLinkClick}
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </SocialLink>
                </li>

                <li>
                  <button
                    onClick={handleWhatsAppClick}
                    className="text-white hover:text-yellow-200 transition-colors duration-300 transform hover:scale-110"
                  >
                    <span className="sr-only">WhatsApp</span>
                    <svg
                      className="size-7"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="font-bold text-white text-lg mb-4 drop-shadow-md">
                  <EditableContent 
                    pageKey="footer" 
                    fieldKey="services_title" 
                    fieldType="text"
                    defaultValue="Servicios"
                    as="span"
                  />
                </p>

                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="/arrendarcancha/futbol7"
                      onClick={handleLinkClick}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      <EditableContent 
                        pageKey="footer" 
                        fieldKey="services_futbol" 
                        fieldType="text"
                        defaultValue="Arriendo Canchas Fútbol"
                        as="span"
                        onClick={handleLinkClick}
                      />
                    </a>
                  </li>

                  <li>
                    <a
                      href="/arrendarcancha/pickleball-individual"
                      onClick={handleLinkClick}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      <EditableContent 
                        pageKey="footer" 
                        fieldKey="services_pickleball_individual" 
                        fieldType="text"
                        defaultValue="Arriendo Cancha Pickleball Individual"
                        as="span"
                        onClick={handleLinkClick}
                      />
                    </a>
                  </li>

                  <li>
                    <a
                      href="/arrendarcancha/pickleball-dobles"
                      onClick={handleLinkClick}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      <EditableContent 
                        pageKey="footer" 
                        fieldKey="services_pickleball_dobles" 
                        fieldType="text"
                        defaultValue="Arriendo Cancha Pickleball Dobles"
                        as="span"
                        onClick={handleLinkClick}
                      />
                    </a>
                  </li>

                  <li>
                    <a
                      href="/clasesparticularesfutbol"
                      onClick={handleLinkClick}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      <EditableContent 
                        pageKey="footer" 
                        fieldKey="services_clases" 
                        fieldType="text"
                        defaultValue="Clases Particulares"
                        as="span"
                        onClick={handleLinkClick}
                      />
                    </a>
                  </li>

                  <li>
                    <a
                      href="/academiadefutbol"
                      onClick={handleLinkClick}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      <EditableContent 
                        pageKey="footer" 
                        fieldKey="services_academia" 
                        fieldType="text"
                        defaultValue="Academia Deportiva"
                        as="span"
                        onClick={handleLinkClick}
                      />
                    </a>
                  </li>

                  <li>
                    <a
                      href="/summer-camp"
                      onClick={handleLinkClick}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      <EditableContent 
                        pageKey="footer" 
                        fieldKey="services_summer" 
                        fieldType="text"
                        defaultValue="Summer Camp 2026"
                        as="span"
                        onClick={handleLinkClick}
                      />
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-white text-lg mb-4 drop-shadow-md">
                  <EditableContent 
                    pageKey="footer" 
                    fieldKey="company_title" 
                    fieldType="text"
                    defaultValue="Empresa"
                    as="span"
                  />
                </p>

                <ul className="space-y-3 text-sm">
                  <li>
                    <a
                      href="/quienessomos"
                      onClick={handleLinkClick}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      <EditableContent 
                        pageKey="footer" 
                        fieldKey="company_about" 
                        fieldType="text"
                        defaultValue="Quiénes Somos"
                        as="span"
                        onClick={handleLinkClick}
                      />
                    </a>
                  </li>

                  <li>
                    <a
                      href="/contacto"
                      onClick={handleLinkClick}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      <EditableContent 
                        pageKey="footer" 
                        fieldKey="company_contact" 
                        fieldType="text"
                        defaultValue="Contacto"
                        as="span"
                        onClick={handleLinkClick}
                      />
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      onClick={handleLinkClick}
                      className="text-yellow-100 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                      <EditableContent 
                        pageKey="footer" 
                        fieldKey="company_testimonials" 
                        fieldType="text"
                        defaultValue="Testimonios"
                        as="span"
                        onClick={handleLinkClick}
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-yellow-300/30 pt-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <ul className="flex flex-wrap gap-6 text-xs">
                <li>
                  <a
                    href="#"
                    onClick={handleLinkClick}
                    className="text-yellow-200 hover:text-white transition-colors duration-300 font-medium"
                  >
                    <EditableContent 
                      pageKey="footer" 
                      fieldKey="footer_terms" 
                      fieldType="text"
                      defaultValue="Términos y Condiciones"
                      as="span"
                      onClick={handleLinkClick}
                    />
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={handleLinkClick}
                    className="text-yellow-200 hover:text-white transition-colors duration-300 font-medium"
                  >
                    <EditableContent 
                      pageKey="footer" 
                      fieldKey="footer_privacy" 
                      fieldType="text"
                      defaultValue="Política de Privacidad"
                      as="span"
                      onClick={handleLinkClick}
                    />
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={handleLinkClick}
                    className="text-yellow-200 hover:text-white transition-colors duration-300 font-medium"
                  >
                    <EditableContent 
                      pageKey="footer" 
                      fieldKey="footer_cookies" 
                      fieldType="text"
                      defaultValue="Cookies"
                      as="span"
                      onClick={handleLinkClick}
                    />
                  </a>
                </li>
              </ul>

              <div className="mt-6 sm:mt-0 text-right">
                <p className="text-sm text-yellow-100 font-bold drop-shadow-md">
                  <EditableContent 
                    pageKey="footer" 
                    fieldKey="copyright_text" 
                    fieldType="text"
                    defaultValue="© 2025. City Soccer. Todos los derechos reservados."
                    as="span"
                  />
                </p>
                <p className="text-xs text-yellow-200 mt-1">
                  <EditableContent 
                    pageKey="footer" 
                    fieldKey="copyright_tagline" 
                    fieldType="text"
                    defaultValue="🏆 La mejor experiencia deportiva de Chile"
                    as="span"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
