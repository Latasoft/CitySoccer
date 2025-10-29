import { useConfig } from "@/lib/dynamicConfigService";

export const useContactInfo = () => {
  const { config, loading } = useConfig();
  
  const getInstagramUsername = () => {
    const instagram = config.instagram || 'citysoccersantiago';
    return instagram.replace('@', ''); // Remueve @ si existe
  };

  const getInstagramUrl = () => {
    return `https://www.instagram.com/${getInstagramUsername()}`;
  };

  const getWhatsAppNumber = () => {
    return config.whatsapp || '+56974265020';
  };

  const getCleanWhatsAppNumber = () => {
    const number = config.whatsapp || '56974265020';
    return number.replace(/[^0-9]/g, '');
  };

  const openWhatsApp = (message) => {
    const cleanNumber = getCleanWhatsAppNumber();
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getEmailAddress = () => {
    return config.email_principal || 'contacto@citysoccer.cl';
  };

  const getPhoneNumber = () => {
    return config.telefono_principal || '+56974265020';
  };

  const getAddress = () => {
    return config.direccion || 'Tiltil 2569, Macul';
  };

  const getSchedule = (day) => {
    switch(day) {
      case 'weekdays':
        return config.horario_semana || 'Lunes a Viernes: 9:00 - 23:00';
      case 'saturday':
        return config.horario_sabado || 'Sábados: 9:00 - 23:00';
      case 'sunday':
        return config.horario_domingo || 'Domingos: 9:00 - 23:00';
      default:
        return config.horario_semana || 'Lunes a Viernes: 9:00 - 23:00';
    }
  };

  return {
    config,
    loading,
    getInstagramUsername,
    getInstagramUrl,
    getWhatsAppNumber,
    getCleanWhatsAppNumber,
    openWhatsApp,
    getEmailAddress,
    getPhoneNumber,
    getAddress,
    getSchedule
  };
};