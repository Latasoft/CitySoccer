"use client";

import CanchaPageBase from "../components/CanchaPageBase";
import ArrendamientoBase from "../components/ArrendamientoBase";

const ArrendamientoPBDobles = ({ onBack }) => (
  <ArrendamientoBase 
    onBack={onBack}
    tipoCancha="pickleball"
    titulo="Pickleball Dobles"
    colorPrimario="#ff6b35"
    requiereSeleccionCancha={true}
  />
);

export default function PickleballDoblesPage() {
  return (
    <CanchaPageBase
      tipoCancha="pickleball"
      titulo="Pickleball Dobles"
      colorPrimario="#ff6b35"
      ArrendamientoComponent={ArrendamientoPBDobles}
      mostrarEquipos={false}
    />
  );
}