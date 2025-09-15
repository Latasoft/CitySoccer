export const canchasConfig = {
  futbol7: {
    id: 'futbol7',
    title: 'Fútbol 7',
    description: 'Canchas de fútbol 7 profesionales',
    color: 'yellow',
    canchas: [
      { id: 'f7-1', nombre: 'Cancha F7 - 1', disponible: true },
      { id: 'f7-2', nombre: 'Cancha F7 - 2', disponible: true },
      { id: 'f7-3', nombre: 'Cancha F7 - 3', disponible: true }
    ],
    image: '/images/futbol7.jpg',
    imageAlt: 'Cancha de Fútbol 7',
    horarios: {
      inicio: 6,
      fin: 22,
      duracionSlot: 60 // minutos
    },
    precios: {
      dia: 25000,
      noche: 30000,
      finSemana: 35000
    }
  },
  futbol9: {
    id: 'futbol9',
    title: 'Fútbol 9',
    description: 'Cancha de fútbol 9 profesional',
    color: 'blue',
    canchas: [
      { id: 'f9-1', nombre: 'Cancha F9 - Principal', disponible: true }
    ],
    image: '/images/futbol9.jpg',
    imageAlt: 'Cancha de Fútbol 9',
    horarios: {
      inicio: 6,
      fin: 22,
      duracionSlot: 90 // minutos
    },
    precios: {
      dia: 45000,
      noche: 55000,
      finSemana: 65000
    }
  },
  'pickleball-individual': {
    id: 'pickleball-individual',
    title: 'Pickleball Individual',
    description: 'Canchas de pickleball para juego individual',
    color: 'green',
    canchas: [
      { id: 'pb-1', nombre: 'Cancha PB - 1', disponible: true },
      { id: 'pb-2', nombre: 'Cancha PB - 2', disponible: true },
      { id: 'pb-3', nombre: 'Cancha PB - 3', disponible: true }
    ],
    image: '/images/pickleball.jpg',
    imageAlt: 'Cancha de Pickleball',
    horarios: {
      inicio: 6,
      fin: 22,
      duracionSlot: 60 // minutos
    },
    precios: {
      dia: 15000,
      noche: 18000,
      finSemana: 22000
    }
  },
  'pickleball-dobles': {
    id: 'pickleball-dobles',
    title: 'Pickleball Dobles',
    description: 'Canchas de pickleball para juego de dobles',
    color: 'green',
    canchas: [
      { id: 'pb-1', nombre: 'Cancha PB - 1', disponible: true },
      { id: 'pb-2', nombre: 'Cancha PB - 2', disponible: true },
      { id: 'pb-3', nombre: 'Cancha PB - 3', disponible: true }
    ],
    image: '/images/pickleball.jpg',
    imageAlt: 'Cancha de Pickleball',
    horarios: {
      inicio: 6,
      fin: 22,
      duracionSlot: 60 // minutos
    },
    precios: {
      dia: 20000,
      noche: 25000,
      finSemana: 30000
    }
  }
};

export const getTiposDisponibles = () => {
  return Object.values(canchasConfig).map(config => ({
    value: config.id,
    label: config.title
  }));
};