'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Función utilitaria para crear pagos
export const createPayment = async ({
  amount,
  buyerName,
  buyerEmail,
  description,
  fecha,
  hora,
  cancha_id
}) => {
  const formData = {
    amount,
    currency: 'CLP',
    buyerName,
    buyerEmail,
    description,
    fecha,
    hora,
    cancha_id
  }

  console.log('Sending payment data:', formData)

  try {
    const response = await fetch('/arrendarcancha/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    console.log('Response status:', response.status)
    
    const data = await response.json()
    console.log('Response data:', data)

    if (data.success) {
      console.log('Redirecting to:', data.checkoutUrl)
      window.location.href = data.checkoutUrl
      return { success: true, checkoutUrl: data.checkoutUrl }
    } else {
      console.error('Payment creation failed:', data)
      return { success: false, error: data.error || 'Error creando el pago' }
    }
  } catch (error) {
    console.error('Request error:', error)
    return { success: false, error: 'Error de conexión' }
  }
}

export default function TestPayment() {
  const [formData, setFormData] = useState({
    amount: 1000,
    currency: 'CLP',
    buyerName: 'Juan Pérez',
    buyerEmail: 'juan@example.com',
    description: 'Reserva de cancha CitySoccer',
    fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    hora: '14:00',
    cancha_id: 1
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await createPayment({
        amount: formData.amount,
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        description: formData.description,
        fecha: formData.fecha,
        hora: formData.hora,
        cancha_id: formData.cancha_id
      })

      if (!result.success) {
        setError(result.error)
      }
    } catch (error) {
      setError('Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Test de Pago - CitySoccer
        </h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="buyerEmail"
              value={formData.buyerEmail}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora
            </label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID de Cancha
            </label>
            <input
              type="number"
              name="cancha_id"
              value={formData.cancha_id}
              onChange={handleChange}
              required
              min="1"
              placeholder="ID de la cancha"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : 'Pagar'}
          </button>
        </form>

        {/* Debug info */}
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Debug Info:</h3>
          <pre className="text-xs text-gray-600">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
