"use client";

import CanchaPageBase from "../components/CanchaPageBase";
import ArrendamientoBase from "../components/ArrendamientoBase";

const ArrendamientoPBIndividual = ({ onBack }) => (
  <ArrendamientoBase 
    onBack={onBack}
    tipoCancha="pickleball"
    titulo="Pickleball Individual"
    colorPrimario="#ff6b35"
    requiereSeleccionCancha={true}
  />
);

export default function PickleballIndividualPage() {
  return (
    <CanchaPageBase
      tipoCancha="pickleball"
      titulo="Pickleball Individual"
      colorPrimario="#ff6b35"
      ArrendamientoComponent={ArrendamientoPBIndividual}
      mostrarEquipos={false} // Pickleball no tiene equipos adicionales
    />
  );
}