"use client";

import CanchaPageBase from "../components/CanchaPageBase";
import ArrendamientoBase from "../components/ArrendamientoBase";

const ArrendamientoF9 = ({ onBack }) => (
  <ArrendamientoBase 
    onBack={onBack}
    tipoCancha="f9"
    titulo="Fútbol 9"
    colorPrimario="#00ff88"
    requiereSeleccionCancha={false} // Solo hay una cancha
  />
);

export default function Futbol9Page() {
  return (
    <CanchaPageBase
      tipoCancha="futbol9"
      titulo="Fútbol 9"
      colorPrimario="#00ff88"
      ArrendamientoComponent={ArrendamientoF9}
      mostrarEquipos={true}
    />
  );
}