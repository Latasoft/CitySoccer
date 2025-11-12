'use client';
import React from 'react';
import EditableContent from './EditableContent';

const BenefitsSection = ({ title, benefits, bgColor = "bg-gray-800" }) => {
  return (
    <section className={`py-20 ${bgColor}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <EditableContent
            pageKey="component_benefits"
            fieldKey="section_title"
            fieldType="text"
            defaultValue={title || "¿Por qué elegirnos?"}
            as="h2"
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          />
          <EditableContent
            pageKey="component_benefits"
            fieldKey="section_subtitle"
            fieldType="textarea"
            defaultValue="Todo lo que obtienes al entrenar con nosotros"
            as="p"
            className="text-xl text-gray-300"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 hover:scale-105">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <EditableContent
                  pageKey="component_benefits"
                  fieldKey={`benefit_${index + 1}_description`}
                  fieldType="textarea"
                  defaultValue={benefit}
                  as="p"
                  className="text-gray-200 font-medium"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;