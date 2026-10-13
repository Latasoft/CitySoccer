import EventosSeccion from '@/components/EventosSeccion';

// La página /eventos se mantiene para no romper links antiguos.
// El contenido está en el componente EventosSeccion, que también se usa en la landing.
export default function Eventos() {
  return <EventosSeccion />;
}