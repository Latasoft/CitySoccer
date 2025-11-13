'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import EditableContent from '@/components/EditableContent'
import EditableImage from '@/components/EditableImage'
import { localContentService } from '@/lib/localContentService'

export default function ArriendaCanchaSelector() {
  const router = useRouter()
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      const { data } = await localContentService.getPageContent('arrendarcancha')
      if (data) setContent(data)
      setLoading(false)
    }
    loadContent()
  }, [])

  const canchaOptions = [
    {
      id: 'futbol7',
      titleKey: 'card1_title',
      descKey: 'card1_description',
      playersKey: 'card1_players',
      durationKey: 'card1_duration',
      buttonKey: 'card1_button_text',
      image: '/Cancha1.jpeg',
      href: '/arrendarcancha/futbol7',
      categoria: 'cancha-futbol7'
    },
    {
      id: 'futbol9',
      titleKey: 'card2_title',
      descKey: 'card2_description',
      playersKey: 'card2_players',
      durationKey: 'card2_duration',
      buttonKey: 'card2_button_text',
      image: '/Cancha1.jpeg',
      href: '/arrendarcancha/futbol9',
      categoria: 'cancha-futbol9'
    },
    {
      id: 'pickleball-single',
      titleKey: 'card3_title',
      descKey: 'card3_description',
      playersKey: 'card3_players',
      durationKey: 'card3_duration',
      buttonKey: 'card3_button_text',
      image: '/Pickleball2.jpeg',
      href: '/arrendarcancha/pickleball-individual',
      categoria: 'cancha-pickleball-single'
    },
    {
      id: 'pickleball-dobles',
      titleKey: 'card4_title',
      descKey: 'card4_description',
      playersKey: 'card4_players',
      durationKey: 'card4_duration',
      buttonKey: 'card4_button_text',
      image: '/Pickleball2.jpeg',
      href: '/arrendarcancha/pickleball-dobles',
      categoria: 'cancha-pickleball-dobles'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

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
                {/* Background Image - Editable */}
                <div className="absolute inset-0">
                  <EditableImage
                    src={cancha.image}
                    alt={content[cancha.titleKey] || cancha.titleKey}
                    categoria={cancha.categoria}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  <div>
                    <EditableContent
                      pageKey="arrendarcancha"
                      fieldKey={cancha.titleKey}
                      fieldType="text"
                      defaultValue={cancha.titleKey.replace('card', 'Cancha ').replace('_title', '')}
                      as="h3"
                      className="text-2xl font-bold mb-3"
                    />
                    <EditableContent
                      pageKey="arrendarcancha"
                      fieldKey={cancha.descKey}
                      fieldType="textarea"
                      defaultValue="Descripción de la cancha"
                      as="p"
                      className="text-sm opacity-90 mb-4"
                    />
                    
                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <EditableContent
                          pageKey="arrendarcancha"
                          fieldKey={cancha.playersKey}
                          fieldType="text"
                          defaultValue="7 vs 7"
                          as="span"
                        />
                      </div>
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <EditableContent
                          pageKey="arrendarcancha"
                          fieldKey={cancha.durationKey}
                          fieldType="text"
                          defaultValue="60 min"
                          as="span"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors group-hover:bg-green-500">
                      <EditableContent
                        pageKey="arrendarcancha"
                        fieldKey={cancha.buttonKey}
                        fieldType="text"
                        defaultValue="RESERVAR AHORA"
                        as="span"
                      />
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
              <EditableContent
                pageKey="arrendarcancha"
                fieldKey="feature1_title"
                fieldType="text"
                defaultValue="Reserva Online"
                as="h3"
                className="text-xl font-bold mb-2"
              />
              <EditableContent
                pageKey="arrendarcancha"
                fieldKey="feature1_description"
                fieldType="text"
                defaultValue="Sistema de reservas disponible las 24 horas"
                as="p"
                className="text-gray-300"
              />
            </div>
            
            <div className="text-white">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <EditableContent
                pageKey="arrendarcancha"
                fieldKey="feature2_title"
                fieldType="text"
                defaultValue="Instalaciones Premium"
                as="h3"
                className="text-xl font-bold mb-2"
              />
              <EditableContent
                pageKey="arrendarcancha"
                fieldKey="feature2_description"
                fieldType="text"
                defaultValue="Canchas profesionales con la mejor tecnología"
                as="p"
                className="text-gray-300"
              />
            </div>
            
            <div className="text-white">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <EditableContent
                pageKey="arrendarcancha"
                fieldKey="feature3_title"
                fieldType="text"
                defaultValue="Soporte 24/7"
                as="h3"
                className="text-xl font-bold mb-2"
              />
              <EditableContent
                pageKey="arrendarcancha"
                fieldKey="feature3_description"
                fieldType="text"
                defaultValue="Atención personalizada para todas tus consultas"
                as="p"
                className="text-gray-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
