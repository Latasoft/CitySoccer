'use client';

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Instagram, CheckCircle, Loader2 } from "lucide-react";

export default function Contacto() {
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar error cuando el usuario empiece a escribir
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
        if (!formData.mensaje.trim()) newErrors.mensaje = 'El mensaje es requerido';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        // Simular envío y redireccionar a WhatsApp
        const mensaje = `Hola! Mi nombre es ${formData.nombre}.\nEmail: ${formData.email}\nTeléfono: ${formData.telefono}\nMensaje: ${formData.mensaje}`;
        const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(mensaje)}`;
        
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccess(true);
            setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
            
            // Abrir WhatsApp después de mostrar el mensaje de éxito
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 1000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-12 px-4">
            <div className={`max-w-6xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-[#eeff00] text-center">Contacto</h1>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Información de contacto */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-xl">
                            <h2 className="text-2xl font-semibold mb-6 text-white">Información de contacto</h2>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#eeff00] to-[#d4d400] rounded-full flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Dirección:</p>
                                        <p className="text-gray-300 text-sm">Santiago, Chile</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#eeff00] to-[#d4d400] rounded-full flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Teléfono:</p>
                                        <a href="tel:+56912345678" className="text-[#eeff00] hover:text-[#d4d400] transition-colors">
                                            +56 9 1234 5678
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#eeff00] to-[#d4d400] rounded-full flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Email:</p>
                                        <a href="mailto:contacto@citysoccer.cl" className="text-[#eeff00] hover:text-[#d4d400] transition-colors">
                                            contacto@citysoccer.cl
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#eeff00] to-[#d4d400] rounded-full flex items-center justify-center">
                                        <Instagram className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">Instagram:</p>
                                        <a href="https://www.instagram.com/citysoccersantiago" target="_blank" rel="noopener noreferrer" className="text-[#eeff00] hover:text-[#d4d400] transition-colors">
                                            @citysoccersantiago
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-xl">
                            <h2 className="text-2xl font-semibold mb-6 text-white">Envíanos un mensaje</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Nombre y apellido *
                                        </label>
                                        <input 
                                            type="text" 
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu nombre completo"
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                                                errors.nombre ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-[#eeff00]'
                                            }`}
                                        />
                                        {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Número de teléfono *
                                        </label>
                                        <input 
                                            type="tel" 
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            placeholder="+56 9 1234 5678"
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                                                errors.telefono ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-[#eeff00]'
                                            }`}
                                        />
                                        {errors.telefono && <p className="text-red-400 text-sm mt-1">{errors.telefono}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Correo electrónico *
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                                            errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-[#eeff00]'
                                        }`}
                                    />
                                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Mensaje *
                                    </label>
                                    <textarea 
                                        rows="6" 
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        placeholder="Escribe tu mensaje aquí..."
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 resize-none ${
                                            errors.mensaje ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-[#eeff00]'
                                        }`}
                                    ></textarea>
                                    {errors.mensaje && <p className="text-red-400 text-sm mt-1">{errors.mensaje}</p>}
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-br from-[#eeff00] to-[#d4d400] text-black py-3 px-6 rounded-lg hover:from-[#d4d400] hover:to-[#c0c000] transition-all font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Enviando...
                                        </span>
                                    ) : (
                                        'Enviar mensaje'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de éxito */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 max-w-md mx-4 text-center transform transition-all duration-300 scale-100">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#eeff00] to-[#d4d400] rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-black" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">¡Mensaje enviado!</h3>
                        <p className="text-gray-300 mb-4">Te redirigiremos a WhatsApp para completar el contacto</p>
                        <button 
                            onClick={() => setShowSuccess(false)}
                            className="bg-gradient-to-br from-[#eeff00] to-[#d4d400] text-black px-6 py-2 rounded-lg hover:from-[#d4d400] hover:to-[#c0c000] transition-all transform hover:-translate-y-0.5"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}