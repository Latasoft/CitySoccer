'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdminMode } from '@/contexts/AdminModeContext'
import { useContent } from '@/contexts/ContentContext'

export default function ArriendaCanchaSelector() {
  const router = useRouter()
  const { isAdminMode } = useAdminMode()
  const { getField } = useContent()
  const [reserveLink, setReserveLink] = useState('https://www.easycancha.com/book/clubs/1886/sports')

  useEffect(() => {
    let mounted = true

    const loadLink = async () => {
      try {
        const { data, error } = await getField('arrendarcancha', 'reserve_button_link')
        if (!mounted) return
        if (!error && data) {
          setReserveLink(data)
        }
      } catch (e) {
        // Silencioso: usamos el valor por defecto si ocurre un error
      }
    }

    loadLink()

    const handler = (event) => {
      if (event.detail?.pageKey === 'arrendarcancha' && event.detail?.fieldKey === 'reserve_button_link') {
        loadLink()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('content-updated', handler)
    }

    return () => {
      mounted = false
      if (typeof window !== 'undefined') {
        window.removeEventListener('content-updated', handler)
      }
    }
  }, [getField])

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Arrienda tu Cancha
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elige el tipo de cancha que deseas reservar y disfruta de nuestras instalaciones de primer nivel
          </p>

          {/* Botón de reserva */}
          <div className="mt-8 flex justify-center">
            <a
              href={reserveLink || 'https://www.easycancha.com/book/clubs/1886/sports'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center uppercase"
              style={{ backgroundColor: '#F6C200', color: '#FFFFFF' }}
            >
              Reservar aquí
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}