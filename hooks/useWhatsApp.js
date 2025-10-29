import { useConfig } from "@/lib/dynamicConfigService";

export const useWhatsApp = () => {
  const { config, loading } = useConfig();
  
  const openWhatsApp = (message) => {
    if (typeof window === 'undefined') return; // Safety check for SSR
    
    const whatsappNumber = config?.whatsapp || '56974265020';
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getWhatsAppNumber = () => {
    return config?.whatsapp || '+56974265020';
  };

  const getCleanWhatsAppNumber = () => {
    const number = config?.whatsapp || '56974265020';
    return number.replace(/[^0-9]/g, '');
  };

  return {
    openWhatsApp,
    getWhatsAppNumber,
    getCleanWhatsAppNumber,
    loading
  };
};