'use client'

import { Suspense } from 'react'
import PaymentResultContent from './PaymentResultContent'

function PaymentResultFallback() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Cargando resultado del pago...
        </h2>
        <p className="text-gray-600">
          Por favor espera mientras verificamos tu pago
        </p>
      </div>
    </div>
  )
}

export default function PaymentResult() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <PaymentResultContent />
    </Suspense>
  )
}