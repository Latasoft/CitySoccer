'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PaymentCancelContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pago Cancelado
        </h1>
        <p className="text-gray-600 mb-4">
          Has cancelado el proceso de pago.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-4">
            Order ID: {orderId}
          </p>
        )}
        <div className="space-y-2">
          <Link 
            href="/"
            className="block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Intentar de nuevo
          </Link>
          <Link 
            href="/"
            className="block bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

function PaymentCancelFallback() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Cargando...
        </h2>
      </div>
    </div>
  )
}

export default function PaymentCancel() {
  return (
    <Suspense fallback={<PaymentCancelFallback />}>
      <PaymentCancelContent />
    </Suspense>
  )
}