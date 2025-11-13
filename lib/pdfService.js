/**
 * Servicio de generación de PDFs para CitySoccer
 * Genera comprobantes de reserva con logo, QR y detalles
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

/**
 * Generar comprobante de reserva en PDF
 */
export const generateReservationPDF = async ({
  reservaId,
  orderId,
  clienteNombre,
  clienteEmail,
  clienteTelefono,
  canchaInfo,
  fecha,
  horaInicio,
  horaFin,
  monto,
  metodoPago = 'Tarjeta de Crédito/Débito',
  fechaPago,
  autorizacion = null
}) => {
  try {
    // Crear nuevo documento PDF (A4)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let currentY = margin;

    // ===========================================
    // HEADER CON FONDO AMARILLO
    // ===========================================
    doc.setFillColor(255, 238, 0); // #ffee00
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Logo/Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text('CITY SOCCER', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Tu destino deportivo', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text('COMPROBANTE DE RESERVA', pageWidth / 2, 40, { align: 'center' });

    currentY = 60;

    // ===========================================
    // CÓDIGO QR (lado derecho)
    // ===========================================
    try {
      // Generar QR con información de la reserva
      const qrData = JSON.stringify({
        reservaId,
        orderId,
        fecha,
        hora: horaInicio,
        cancha: canchaInfo
      });

      const qrDataURL = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      // Agregar QR en la esquina superior derecha
      const qrSize = 35;
      doc.addImage(qrDataURL, 'PNG', pageWidth - margin - qrSize, currentY, qrSize, qrSize);
    } catch (qrError) {
      console.error('Error generando QR:', qrError);
    }

    // ===========================================
    // INFORMACIÓN DE LA RESERVA
    // ===========================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Detalles de la Reserva', margin, currentY);
    currentY += 10;

    // Tabla con información de la reserva
    autoTable(doc, {
      startY: currentY,
      head: [],
      body: [
        ['ID Reserva:', `#${reservaId}`],
        ['ID Orden de Pago:', orderId],
        ['Cancha:', canchaInfo],
        ['Fecha:', fecha],
        ['Horario:', `${horaInicio} - ${horaFin}`],
        ['Estado:', 'CONFIRMADA']
      ],
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: 4
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { fontStyle: 'normal' }
      },
      margin: { left: margin, right: pageWidth / 2 + 5 }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // ===========================================
    // INFORMACIÓN DEL CLIENTE
    // ===========================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Información del Cliente', margin, currentY);
    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      head: [],
      body: [
        ['Nombre:', clienteNombre],
        ['Email:', clienteEmail],
        ['Teléfono:', clienteTelefono || 'No proporcionado']
      ],
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: 4
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { fontStyle: 'normal' }
      },
      margin: { left: margin }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // ===========================================
    // INFORMACIÓN DE PAGO
    // ===========================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Información de Pago', margin, currentY);
    currentY += 10;

    const bodyPago = [
      ['Método de Pago:', metodoPago],
      ['Fecha de Pago:', fechaPago || new Date().toLocaleDateString('es-CL')],
      ['Monto Total:', `$${monto.toLocaleString('es-CL')}`]
    ];

    if (autorizacion) {
      bodyPago.push(['Código Autorización:', autorizacion]);
    }

    autoTable(doc, {
      startY: currentY,
      head: [],
      body: bodyPago,
      theme: 'plain',
      styles: {
        fontSize: 11,
        cellPadding: 4
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { fontStyle: 'normal' }
      },
      margin: { left: margin }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // ===========================================
    // CUADRO DE MONTO DESTACADO
    // ===========================================
    doc.setFillColor(34, 197, 94); // Verde
    doc.rect(margin, currentY, pageWidth - 2 * margin, 20, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL PAGADO:', margin + 5, currentY + 13);

    doc.setFontSize(18);
    doc.text(`$${monto.toLocaleString('es-CL')}`, pageWidth - margin - 5, currentY + 13, { align: 'right' });

    currentY += 20;

    // ===========================================
    // FOOTER
    // ===========================================
    const footerY = pageHeight - 30;

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    // Información de contacto
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('City Soccer', pageWidth / 2, footerY + 8, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Direccion de las canchas | Tel: +56 9 1234 5678', pageWidth / 2, footerY + 13, { align: 'center' });
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://citysoccer.cl';
    doc.text(baseUrl, pageWidth / 2, footerY + 18, { align: 'center' });

    // Fecha de emisión
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const emisionDate = new Date().toLocaleString('es-CL');
    doc.text(`Documento generado el ${emisionDate}`, pageWidth / 2, footerY + 23, { align: 'center' });

    // ===========================================
    // MARCA DE AGUA "PAGADO"
    // ===========================================
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(80);
    doc.setTextColor(34, 197, 94); // Verde
    doc.text('PAGADO', pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45
    });
    doc.restoreGraphicsState();

    // ===========================================
    // RETORNAR BUFFER DEL PDF
    // ===========================================
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    console.log('✅ PDF generado exitosamente:', {
      reservaId,
      size: `${(pdfBuffer.length / 1024).toFixed(2)} KB`
    });

    return {
      success: true,
      buffer: pdfBuffer,
      filename: `Comprobante_Reserva_${reservaId}.pdf`
    };

  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generar PDF y descargarlo directamente en el navegador
 * (Para uso en frontend)
 */
export const downloadReservationPDF = ({
  reservaId,
  orderId,
  clienteNombre,
  clienteEmail,
  clienteTelefono,
  canchaInfo,
  fecha,
  horaInicio,
  horaFin,
  monto,
  metodoPago,
  fechaPago,
  autorizacion
}) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // (Mismo código que generateReservationPDF pero sin async/await para QR)
    // Simplificado para descarga directa en navegador

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let currentY = margin;

    // Header
    doc.setFillColor(255, 238, 0);
    doc.rect(0, 0, pageWidth, 50, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text('⚽ CITY SOCCER', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('COMPROBANTE DE RESERVA', pageWidth / 2, 35, { align: 'center' });

    currentY = 60;

    // Detalles
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Detalles de la Reserva', margin, currentY);
    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      head: [],
      body: [
        ['ID Reserva:', `#${reservaId}`],
        ['Cancha:', canchaInfo],
        ['Fecha:', fecha],
        ['Horario:', `${horaInicio} - ${horaFin}`],
        ['Cliente:', clienteNombre],
        ['Monto:', `$${monto.toLocaleString('es-CL')}`]
      ],
      theme: 'striped',
      headStyles: { fillColor: [255, 238, 0], textColor: [0, 0, 0] },
      margin: { left: margin, right: margin }
    });

    // Descargar
    doc.save(`Comprobante_Reserva_${reservaId}.pdf`);
    
    return { success: true };

  } catch (error) {
    console.error('❌ Error descargando PDF:', error);
    return { success: false, error: error.message };
  }
};

// Exportar servicio
export const pdfService = {
  generateReservationPDF,
  downloadReservationPDF
};

export default pdfService;
