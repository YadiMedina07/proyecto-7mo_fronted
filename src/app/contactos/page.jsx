"use client";

import { useState } from "react";

export default function ContactPage() {
  const [contactType, setContactType] = useState("general");

  return (
    <div className="container mx-auto p-6 pt-40">
      <h1 className="text-3xl font-bold text-center mb-6">CONTÁCTENOS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imagen decorativa */}
        <div className="hidden md:block">
          <img
            src="/assets/empresa.jpg" // Asegúrate de tener la imagen en public/assets/
            alt="Copa con bebida"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Formulario de contacto */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          {/* Menú de selección */}
          <div className="relative mb-4">
            <select
              value={contactType}
              onChange={(e) => setContactType(e.target.value)}
              className="w-full border p-2 rounded-lg bg-gray-100"
            >
              <option value="general">Contacto general</option>
              <option value="experiencia">Contacto sobre experiencias</option>
            </select>
          </div>

          {/* Campos del formulario */}
          <form>
            <label className="block mb-2">Tu nombre</label>
            <input type="text" className="w-full border p-2 rounded-lg mb-4" />

            <label className="block mb-2">Correo electrónico *</label>
            <input type="email" className="w-full border p-2 rounded-lg mb-4" />

            <label className="block mb-2">Razón de contacto *</label>
            <select className="w-full border p-2 rounded-lg mb-4">
              <option>Selecciona un motivo</option>
              <option>Consulta sobre productos</option>
              <option>Problema con un pedido</option>
              <option>Otro</option>
            </select>

            <label className="block mb-2">Teléfono fijo *</label>
            <input type="text" className="w-full border p-2 rounded-lg mb-4" />

            <label className="block mb-2">Comentarios *</label>
            <textarea className="w-full border p-2 rounded-lg mb-4" rows="4"></textarea>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
