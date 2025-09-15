export const canchaConfig = {
  futbol7: {
    title: "Fútbol 7",
    image: "/Cancha1.jpeg",
    imageAlt: "Cancha de Fútbol 7",
    description: "Consulta nuestros precios por horario y día",
    color: "yellow"
  },
  futbol9: {
    title: "Fútbol 9", 
    image: "/Cancha2.jpeg",
    imageAlt: "Cancha de Fútbol 9",
    description: "Consulta nuestros precios por horario y día",
    color: "blue"
  },
  pickleball: {
    title: "Pickleball",
    image: "/imgPickleball.jpeg", 
    imageAlt: "Cancha de Pickleball",
    description: "Consulta nuestros precios por horario y día (Individual / Dobles)",
    color: "green"
  },
  // Nuevas configuraciones para modalidades específicas
  'pickleball-individual': {
    title: "Pickleball Individual",
    image: "/imgPickleball.jpeg", 
    imageAlt: "Cancha de Pickleball Individual",
    description: "Consulta nuestros precios para modalidad individual",
    color: "green",
    modalidad: "individual"
  },
  'pickleball-dobles': {
    title: "Pickleball Dobles",
    image: "/imgPickleball.jpeg", 
    imageAlt: "Cancha de Pickleball Dobles",
    description: "Consulta nuestros precios para modalidad dobles",
    color: "green",
    modalidad: "dobles"
  }
};

export const getDayName = (dayNumber) => {
  const days = {
    1: 'Lunes a Viernes',
    6: 'Sábado', 
    7: 'Domingo'
  };
  return days[dayNumber] || 'N/A';
};

export const sortDays = (days) => {
  return days.sort((a, b) => {
    if (a === 0) return 1; // Domingo al final
    if (b === 0) return -1;
    return a - b;
  });
};

// Nueva función para obtener precio por modalidad
export const getPrecioConModalidad = (data, hora, dia, modalidad = null) => {
  if (modalidad) {
    const tarifa = data.find(item => 
      item.hora_inicio === hora && 
      item.dia_semana === dia && 
      item.modalidad === modalidad
    );
    return tarifa ? `$${tarifa.precio}` : '-';
  }
  
  // Para fútbol (sin modalidad)
  const tarifa = data.find(item => item.hora_inicio === hora && item.dia_semana === dia);
  return tarifa ? `$${tarifa.precio}` : '-';
};

export const getPrecio = (data, hora, dia) => {
  const tarifa = data.find(item => item.hora_inicio === hora && item.dia_semana === dia);
  return tarifa ? `$${tarifa.precio}` : '-';
};

export const getUniqueHorarios = (data) => {
  return [...new Set(data.map(item => item.hora_inicio))].sort();
};

export const getUniqueDias = (data) => {
  const dias = [...new Set(data.map(item => item.dia_semana))];
  return sortDays(dias);
};

// Nueva función para detectar si hay modalidades
export const hasModalidades = (data) => {
  return data.some(item => item.modalidad);
};

export const getUniqueModalidades = (data) => {
  const modalidades = [...new Set(data.map(item => item.modalidad).filter(Boolean))];
  return modalidades.sort(); // individual, dobles
};

// Nueva función para filtrar data por modalidad específica
export const filterByModalidad = (data, modalidad) => {
  if (!modalidad) return data;
  return data.filter(item => item.modalidad === modalidad);
};