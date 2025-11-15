import Servicios from "./Servicios";

// ISR: Regenerar cada 60 segundos
export const revalidate = 60;


export default function Page() {
  return <Servicios />;
}