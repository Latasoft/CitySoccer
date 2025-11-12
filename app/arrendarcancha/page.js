'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import EditableContent from '@/components/EditableContent'

export default function ArriendaCanchaSelector() {
  const router = useRouter()

  const canchaOptions = [
    {
      id: 'futbol7',
      title: 'Fútbol 7',
      description: 'Canchas de fútbol 7 con césped sintético de última generación',
      image: '/Cancha1.jpeg',
      href: '/arrendarcancha/futbol7',
      players: '7 vs 7',
      duration: '60 min'
    },
    {
      id: 'futbol9',
      title: 'Fútbol 9',
      description: 'Canchas de fútbol 9 profesionales para un juego más dinámico',
      image: '/Cancha1.jpeg',
      href: '/arrendarcancha/futbol9',
      players: '9 vs 9',
      duration: '60 min'
    },
    {
      id: 'pickleball-single',
      title: 'Pickleball Individual',
      description: 'Canchas de Pickleball para partidos individuales',
      image: '/Pickleball2.jpeg',
      href: '/arrendarcancha/pickleball-individual',
      players: '1 vs 1',
      duration: '60 min'
    },
    {
      id: 'pickleball-dobles',
      title: 'Pickleball Dobles',
      description: 'Canchas de Pickleball para partidos de dobles',
      image: '/Pickleball2.jpeg',
      href: '/arrendarcancha/pickleball-dobles',
      players: '2 vs 2',
      duration: '60 min'
    }
  ]

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <EditableContent 
            pageKey="arrendarcancha"
            fieldKey="page_title"
            fieldType="text"
            defaultValue="Arrienda tu Cancha"
            as="h1"
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          />
          <EditableContent 
            pageKey="arrendarcancha"
            fieldKey="page_description"
            fieldType="textarea"
            defaultValue="Elige el tipo de cancha que deseas reservar y disfruta de nuestras instalaciones de primer nivel"
            as="p"
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {canchaOptions.map((cancha) => (
            <Link 
              key={cancha.id} 
              href={cancha.href}
              className="group block"
            >
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cancha.image})` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">{cancha.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{cancha.description}</p>
                    
                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cancha.players}
                      </div>
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {cancha.duration}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors group-hover:bg-green-500">
                      RESERVAR AHORA
                      <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-white">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Reserva Online</h3>
              <p className="text-gray-300">Sistema de reservas disponible las 24 horas</p>
            </div>
            
            <div className="text-white">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Instalaciones Premium</h3>
              <p className="text-gray-300">Canchas profesionales con la mejor tecnología</p>
            </div>
            
            <div className="text-white">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Soporte 24/7</h3>
              <p className="text-gray-300">Atención personalizada para todas tus consultas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
