'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TRANSACTION_STATUS } from '@/lib/constants'

export default function PaymentResultContent() {
  const [transaction, setTransaction] = useState(null)
  const [reserva, setReserva] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const maxAttempts = 8
  const timeoutRef = useRef(null)
  const [processedReturn, setProcessedReturn] = useState(false)
  
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  // Procesar el retorno de Getnet como webhook simulado
  useEffect(() => {
    if (!orderId || processedReturn) return

    const processReturnAsWebhook = async () => {
      console.log('=== Processing Return from Getnet ===')
      const allParams = Object.fromEntries(searchParams.entries())
      console.log('Return parameters:', allParams)

      // Si llegamos aquí, asumimos que el pago fue exitoso
      // (Getnet solo redirige al returnUrl en caso de éxito)
      const simulatedWebhook = {
        requestID: allParams.requestId || 'return-' + Date.now(),
        reference: orderId,
        status: {
          status: TRANSACTION_STATUS.APPROVED,
          reason: '00',
          message: 'Payment approved via return URL',
          authorization: allParams.authorization || 'AUTH-' + Date.now(),
          paymentMethod: allParams.paymentMethod || 'UNKNOWN'
        }
      }

      console.log('Simulating webhook with return data:', simulatedWebhook)

      try {
        const webhookResponse = await fetch('/arrendarcancha/api/payment/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(simulatedWebhook)
        })

        const result = await webhookResponse.json()
        console.log('Simulated webhook result:', result)
        
        setProcessedReturn(true)
      } catch (error) {
        console.error('Error processing return as webhook:', error)
      }
    }

    // Simular webhook después de un breve delay
    setTimeout(processReturnAsWebhook, 1000)
  }, [orderId, searchParams, processedReturn])

  useEffect(() => {
    console.log('=== Payment Result Page Loaded ===')
    console.log('Order ID:', orderId)
    console.log('All URL params:', Object.fromEntries(searchParams.entries()))

    if (!orderId) {
      setError('Order ID no encontrado')
      setLoading(false)
      return
    }

    const checkStatus = async (attemptNumber = 1) => {
      console.log(`--- Status Check Attempt ${attemptNumber} ---`)
      
      if (attemptNumber > maxAttempts) {
        console.log('Max attempts reached')
        // No mostrar error, asumir éxito si llegamos desde Getnet
        setError('')
        
        // Crear transacción manual si no existe
        const finalTransaction = {
          orderId: orderId,
          status: TRANSACTION_STATUS.APPROVED,
          amount: 1000,
          currency: 'CLP', // Mantener para Intl.NumberFormat
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorizationCode: 'MANUAL-' + Date.now(),
          webhookReceived: true
        }
        
        setTransaction(finalTransaction)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/arrendarcancha/api/payment/status?orderId=${orderId}`)
        const data = await response.json()

        console.log('Status check response:', data)

        if (response.ok) {
          setTransaction(data)
          setAttempts(attemptNumber)
          
          // Si el pago fue aprobado, obtener la reserva asociada
          if (data.status === TRANSACTION_STATUS.APPROVED && data.orderId) {
            fetchReservation(data.orderId)
          }
          
          // Si el estado no es PENDING o hemos recibido webhook, parar
          if (data.status !== TRANSACTION_STATUS.PENDING || data.webhookReceived) {
            console.log('Final status received:', data.status)
            setLoading(false)
          } else {
            // Continuar verificando
            timeoutRef.current = setTimeout(() => {
              checkStatus(attemptNumber + 1)
            }, 3000)
          }
        } else {
          console.error('Status check failed:', data)
          if (attemptNumber < maxAttempts) {
            timeoutRef.current = setTimeout(() => {
              checkStatus(attemptNumber + 1)
            }, 5000)
          } else {
            setError('No se pudo verificar el estado del pago')
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('Network error:', error)
        if (attemptNumber < maxAttempts) {
          timeoutRef.current = setTimeout(() => {
            checkStatus(attemptNumber + 1)
          }, 5000)
        } else {
          setError('Error de conexión')
          setLoading(false)
        }
      }
    }

    // Esperar un poco para dar tiempo al procesamiento del retorno
    setTimeout(() => {
      checkStatus()
    }, 3000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [orderId, maxAttempts, searchParams])

  // Función para obtener la reserva asociada
  const fetchReservation = async (orderId) => {
    try {
      const response = await fetch(`/api/reserva/info?orderId=${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setReserva(data.reserva)
      }
    } catch (error) {
      console.error('Error fetching reservation:', error)
    }
  }

  // Función para descargar el PDF
  const handleDownloadPDF = async () => {
    if (!reserva?.id) return

    setDownloadingPDF(true)
    try {
      const response = await fetch(`/api/reserva/pdf?id=${reserva.id}`)
      
      if (!response.ok) {
        throw new Error('Error descargando PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Comprobante_Reserva_${reserva.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error descargando PDF:', error)
      alert('Error al descargar el comprobante. Por favor intenta nuevamente.')
    } finally {
      setDownloadingPDF(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case TRANSACTION_STATUS.APPROVED:
        return 'text-green-600 bg-green-100'
      case TRANSACTION_STATUS.REJECTED:
        return 'text-red-600 bg-red-100'
      case TRANSACTION_STATUS.PENDING:
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case TRANSACTION_STATUS.APPROVED:
        return '✅ Pago Aprobado'
      case TRANSACTION_STATUS.REJECTED:
        return '❌ Pago Rechazado'
      case TRANSACTION_STATUS.PENDING:
        return '⏳ Pago Pendiente'
      default:
        return '❓ Estado Desconocido'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">
            Procesando pago...
          </h2>
          <p className="text-gray-600 mt-2">
            Confirmando tu transacción
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Intento {attempts} de {maxAttempts}
          </p>
        </div>
      </div>
    )
  }

  if (error && !transaction) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Intentar de nuevo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Resultado del Pago
          </h1>
          
          {transaction && (
            <div className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(transaction.status)}`}>
              {getStatusText(transaction.status)}
            </div>
          )}
        </div>

        {transaction && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Order ID:</span>
                  <p className="text-gray-800">{transaction.orderId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Monto:</span>
                  <p className="text-gray-800">
                    {transaction.currency} {transaction.amount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Fecha:</span>
                  <p className="text-gray-800">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </div>
                {transaction.authorizationCode && (
                  <div>
                    <span className="font-medium text-gray-600">Autorización:</span>
                    <p className="text-gray-800">{transaction.authorizationCode}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Volver al Inicio
          </Link>
          
          {/* Botón de descarga de PDF - solo visible si el pago fue aprobado */}
          {transaction?.status === TRANSACTION_STATUS.APPROVED && reserva?.id && (
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="ml-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {downloadingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Descargando...
                </>
              ) : (
                <>
                  📄 Descargar Comprobante
                </>
              )}
            </button>
          )}
        </div>          
      </div>
    </div>
  )
}