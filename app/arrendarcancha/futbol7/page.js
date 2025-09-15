"use client";

import CanchaPageBase from "../components/CanchaPageBase";
import ArrendamientoBase from "../components/ArrendamientoBase";

const ArrendamientoF7 = ({ onBack }) => (
  <ArrendamientoBase
    onBack={onBack}
    tipoCancha="f7"
    titulo="Fútbol 7"
    colorPrimario="#eeff00"
    requiereSeleccionCancha={true}
  />
);

export default function Futbol7Page() {
  return (
    <CanchaPageBase
      tipoCancha="futbol7"
      titulo="Fútbol 7"
      colorPrimario="#eeff00"
      ArrendamientoComponent={ArrendamientoF7}
      mostrarEquipos={true}
    />
  );
}
