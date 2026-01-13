'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import EditableContent from '@/components/EditableContent'
import CardBackgroundImage from '@/components/CardBackgroundImage'
import { useAdminMode } from '@/contexts/AdminModeContext'

export default function ArriendaCanchaSelector() {
  const router = useRouter()
  const { isAdminMode } = useAdminMode()

  // No necesitamos cargar contenido aquí, los componentes EditableContent/EditableImage
  // lo hacen automáticamente usando ContentContext

  // const canchaOptions = [
  //   {
  //     id: 'futbol7',
  //     titleKey: 'card1_title',
  //     descKey: 'card1_description',
  //     playersKey: 'card1_players',
  //     durationKey: 'card1_duration',
  //     buttonKey: 'card1_button_text',
  //     imageKey: 'card1_image',
  //     image: '',  // Vacío para que cargue desde Supabase
  //     href: '/arrendarcancha/futbol7',
  //     categoria: 'cancha-futbol7'
  //   },
  //   {
  //     id: 'futbol9',
  //     titleKey: 'card2_title',
  //     descKey: 'card2_description',
  //     playersKey: 'card2_players',
  //     durationKey: 'card2_duration',
  //     buttonKey: 'card2_button_text',
  //     imageKey: 'card2_image',
  //     image: '',
  //     href: '/arrendarcancha/futbol9',
  //     categoria: 'cancha-futbol9'
  //   },
  //   {
  //     id: 'pickleball-single',
  //     titleKey: 'card3_title',
  //     descKey: 'card3_description',
  //     playersKey: 'card3_players',
  //     durationKey: 'card3_duration',
  //     buttonKey: 'card3_button_text',
  //     imageKey: 'card3_image',
  //     image: '',
  //     href: '/arrendarcancha/pickleball-individual',
  //     categoria: 'cancha-pickleball-single'
  //   },
  //   {
  //     id: 'pickleball-dobles',
  //     titleKey: 'card4_title',
  //     descKey: 'card4_description',
  //     playersKey: 'card4_players',
  //     durationKey: 'card4_duration',
  //     buttonKey: 'card4_button_text',
  //     imageKey: 'card4_image',
  //     image: '',
  //     href: '/arrendarcancha/pickleball-dobles',
  //     categoria: 'cancha-pickleball-dobles'
  //   }
  // ]

  // No necesitamos bloquear toda la página mientras carga
  // Los componentes EditableContent/EditableImage muestran sus propios skeletons

  //Dentro de este componente se lanza a reserva dentro de CitySoccer

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
            defaultValue="Servicio de arrendamiento vía CitySoccer no disponible. Favor reservar a través de EasyCancha"
            as="p"
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          />
        </div>
            </div>
          </div>

  )
}
