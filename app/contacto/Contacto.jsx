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
        <div className="min-h-screen bg-[#ECECEA] py-12 px-4">
            <div className={`max-w-6xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-4xl font-bold mb-8 text-[#57AA32] text-center">Contacto</h1>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Información de contacto */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-8 border border-[#D0D1D4]">
                            <h2 className="text-2xl font-semibold mb-6 text-[#3B3F44]">Información de contacto</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#57AA32] rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[#3B3F44] font-medium">Dirección:</p>
                                        <p className="text-[#3B3F44] text-sm">Santiago, Chile</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#57AA32] rounded-full flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[#3B3F44] font-medium">Teléfono:</p>
                                        <a href="tel:+56912345678" className="text-[#57AA32] hover:text-[#469026] transition-colors">
                                            +56 9 1234 5678
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#57AA32] rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[#3B3F44] font-medium">Email:</p>
                                        <a href="mailto:contacto@citysoccer.cl" className="text-[#57AA32] hover:text-[#469026] transition-colors">
                                            contacto@citysoccer.cl
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#EBEB78] rounded-full flex items-center justify-center">
                                        <Instagram className="w-5 h-5 text-[#3B3F44]" />
                                    </div>
                                    <div>
                                        <p className="text-[#3B3F44] font-medium">Instagram:</p>
                                        <a href="https://www.instagram.com/citysoccersantiago" target="_blank" rel="noopener noreferrer" className="text-[#57AA32] hover:text-[#469026] transition-colors">
                                            @citysoccersantiago
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-8 border border-[#D0D1D4]">
                            <h2 className="text-2xl font-semibold mb-6 text-[#3B3F44]">Envíanos un mensaje</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#3B3F44] mb-2">
                                            Nombre y apellido *
                                        </label>
                                        <input 
                                            type="text" 
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu nombre completo"
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-[#ECECEA] text-[#3B3F44] placeholder-gray-500 ${
                                                errors.nombre ? 'border-red-500 focus:border-red-500' : 'border-[#D0D1D4] focus:border-[#57AA32]'
                                            }`}
                                        />
                                        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-[#3B3F44] mb-2">
                                            Número de teléfono *
                                        </label>
                                        <input 
                                            type="tel" 
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            placeholder="+56 9 1234 5678"
                                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-[#ECECEA] text-[#3B3F44] placeholder-gray-500 ${
                                                errors.telefono ? 'border-red-500 focus:border-red-500' : 'border-[#D0D1D4] focus:border-[#57AA32]'
                                            }`}
                                        />
                                        {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#3B3F44] mb-2">
                                        Correo electrónico *
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="tu@email.com"
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-[#ECECEA] text-[#3B3F44] placeholder-gray-500 ${
                                            errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#D0D1D4] focus:border-[#57AA32]'
                                        }`}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[#3B3F44] mb-2">
                                        Mensaje *
                                    </label>
                                    <textarea 
                                        rows="6" 
                                        name="mensaje"
                                        value={formData.mensaje}
                                        onChange={handleChange}
                                        placeholder="Escribe tu mensaje aquí..."
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-[#ECECEA] text-[#3B3F44] placeholder-gray-500 resize-none ${
                                            errors.mensaje ? 'border-red-500 focus:border-red-500' : 'border-[#D0D1D4] focus:border-[#57AA32]'
                                        }`}
                                    ></textarea>
                                    {errors.mensaje && <p className="text-red-500 text-sm mt-1">{errors.mensaje}</p>}
                                </div>
                                
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full bg-[#57AA32] text-white py-3 px-6 rounded-lg hover:bg-[#469026] transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center transform transition-all duration-300 scale-100">
                        <div className="w-16 h-16 bg-[#57AA32] rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#3B3F44] mb-2">¡Mensaje enviado!</h3>
                        <p className="text-[#3B3F44] mb-4">Te redirigiremos a WhatsApp para completar el contacto</p>
                        <button 
                            onClick={() => setShowSuccess(false)}
                            className="bg-[#57AA32] text-white px-6 py-2 rounded-lg hover:bg-[#469026] transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}