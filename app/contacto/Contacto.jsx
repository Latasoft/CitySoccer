'use client';

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Instagram, MessageCircle } from "lucide-react";

export default function Contacto() {
    const [isVisible, setIsVisible] = useState(false);
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleChange = (e) => {
        setNombre(e.target.value);
        if (error) {
            setError('');
        }
    };

    const handleWhatsAppSubmit = (e) => {
        e.preventDefault();
        
        if (!nombre.trim()) {
            setError('Por favor ingresa tu nombre');
            return;
        }

        const mensajePredefinido = `Hola! Mi nombre es ${nombre.trim()}. Me gustaría obtener más información sobre los servicios de CitySoccer. ¡Gracias!`;
        const whatsappUrl = `https://wa.me/56974265019?text=${encodeURIComponent(mensajePredefinido)}`;
        
        window.open(whatsappUrl, '_blank');
        setNombre(''); // Limpiar el campo después de enviar
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
                                        <a href="tel:+56974265019" className="text-[#eeff00] hover:text-[#d4d400] transition-colors">
                                            +56 9 7426 5019
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

                    {/* Formulario simplificado */}
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700 shadow-xl">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#eeff00] to-[#d4d400] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="w-10 h-10 text-black" />
                                </div>
                                <h2 className="text-2xl font-semibold text-white mb-2">Contáctanos por WhatsApp</h2>
                                <p className="text-gray-300">Ingresa tu nombre y te conectaremos directamente</p>
                            </div>
                            
                            <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Tu nombre *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={nombre}
                                        onChange={handleChange}
                                        placeholder="Ingresa tu nombre"
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-gray-700 text-white placeholder-gray-400 ${
                                            error ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-[#eeff00]'
                                        }`}
                                    />
                                    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-lg transition-all font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Contactar por WhatsApp
                                </button>                            
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}