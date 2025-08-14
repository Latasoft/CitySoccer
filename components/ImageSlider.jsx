'use client';
import { useState } from 'react';

const slides = [
  {
    image: '/imgCitySoccer.jpeg',
  },
  {
    image: '/imgCitySoccer2.jpeg',
  },
  {
    image: '/imgCitySoccer3.jpeg',
  },
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 rounded-2xl shadow-2xl bg-white overflow-hidden">
      <div className="relative">
        <img
          src={slides[current].image}
          alt={`Slide ${current + 1}`}
          className="w-full h-[500px] object-cover transition-all duration-500"
        />
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-6 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-3 shadow transition"
          aria-label="Anterior"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-6 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-3 shadow transition"
          aria-label="Siguiente"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="flex justify-center gap-3 py-6">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-4 h-4 rounded-full ${current === idx ? 'bg-blue-500' : 'bg-gray-300'} transition`}
            aria-label={`Ir al slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}