'use client';
import EditableContent from '@/components/EditableContent';

export default function Servicios() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <EditableContent 
          pageKey="servicios"
          fieldKey="page_title"
          fieldType="text"
          defaultValue="Nuestros Servicios"
          as="h1"
          className="text-4xl md:text-5xl font-bold mb-8 text-[#eeff00] text-center"
        />
        
        <EditableContent 
          pageKey="servicios"
          fieldKey="page_description"
          fieldType="textarea"
          defaultValue="En City Soccer ofrecemos experiencias deportivas de primer nivel para toda la familia"
          as="p"
          className="text-xl text-gray-300 text-center mb-12"
        />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <EditableContent 
              pageKey="servicios"
              fieldKey="service1_title"
              fieldType="text"
              defaultValue="Arriendo de Canchas"
              as="h2"
              className="text-2xl font-bold mb-3 text-[#eeff00]"
            />
            <EditableContent 
              pageKey="servicios"
              fieldKey="service1_description"
              fieldType="textarea"
              defaultValue="Canchas profesionales de fútbol y pickleball disponibles para arriendo. Reserva online las 24 horas."
              as="p"
              className="text-gray-300"
            />
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <EditableContent 
              pageKey="servicios"
              fieldKey="service2_title"
              fieldType="text"
              defaultValue="Clases de Fútbol"
              as="h2"
              className="text-2xl font-bold mb-3 text-[#eeff00]"
            />
            <EditableContent 
              pageKey="servicios"
              fieldKey="service2_description"
              fieldType="textarea"
              defaultValue="Academia y clases particulares con entrenadores certificados. Para todas las edades y niveles."
              as="p"
              className="text-gray-300"
            />
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <EditableContent 
              pageKey="servicios"
              fieldKey="service3_title"
              fieldType="text"
              defaultValue="Clases de Pickleball"
              as="h2"
              className="text-2xl font-bold mb-3 text-[#eeff00]"
            />
            <EditableContent 
              pageKey="servicios"
              fieldKey="service3_description"
              fieldType="textarea"
              defaultValue="Aprende el deporte de más rápido crecimiento con instructores especializados."
              as="p"
              className="text-gray-300"
            />
          </div>
          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
            <EditableContent 
              pageKey="servicios"
              fieldKey="service4_title"
              fieldType="text"
              defaultValue="Eventos Deportivos"
              as="h2"
              className="text-2xl font-bold mb-3 text-[#eeff00]"
            />
            <EditableContent 
              pageKey="servicios"
              fieldKey="service4_description"
              fieldType="textarea"
              defaultValue="Organizamos cumpleaños, eventos corporativos y campeonatos deportivos."
              as="p"
              className="text-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
