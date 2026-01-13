'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Gradient diagonal suave */}
      <div className="w-1/2 bg-gradient-to-br from-slate-900 via-slate-700 to-slate-400 flex items-center justify-start p-12">
        <div className="w-full">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-left drop-shadow-lg">
            Arrienda tu Cancha
          </h1>
        </div>
      </div>

      {/* Lado derecho - Negro */}
      <div className="w-1/2 bg-black flex flex-col items-end justify-center p-12">
        <div className="w-full max-w-md">
          <p className="text-xl text-gray-300 mb-8 text-right">
            Servicio de arriendo de canchas no disponible a través de CitySoccer. Favor dirigirse a EasyCancha para gestionar el arriendo.
          </p>

          {/* Botón de reserva */}
          <div className="flex justify-end">
            <a
              href={reserveLink || 'https://www.easycancha.com/book/clubs/1886/sports'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center uppercase"
              style={{ backgroundColor: '#F6C200', color: '#FFFFFF' }}
            >
              Ir a EasyCancha
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}