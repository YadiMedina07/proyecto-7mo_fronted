"use client";

import { useState } from "react";
import { CONFIGURACIONES } from "../config/config";

export default function ContactPage() {
  const [contactType, setContactType] = useState("general");
  const [nombre, setNombre]         = useState("");
  const [email, setEmail]           = useState("");
  const [razon, setRazon]           = useState("");
  const [telefono, setTelefono]     = useState("");
  const [comentarios, setComentarios] = useState("");
  const [status, setStatus]         = useState(""); // "", "loading", "success", "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/contactos`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motivo:      razon,
          nombre,
          email,
          telefono,
          comentario:  comentarios,
        }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setStatus("success");
      // Limpiar formulario
      setNombre("");
      setEmail("");
      setRazon("");
      setTelefono("");
      setComentarios("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto p-6 pt-40">
      <h1 className="text-3xl font-bold text-center mb-6">CONTÁCTENOS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imagen decorativa */}
        <div className="hidden md:block">
          <img
            src="/assets/empresa.jpg"
            alt="Copa con bebida"
            className="w-full h-auto object-cover rounded"
          />
        </div>

        {/* Formulario de contacto */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          {/* Menú de tipo de contacto (opcional para lógica futura) */}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Tu nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1">Correo electrónico *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1">Razón de contacto *</label>
              <select
                value={razon}
                onChange={(e) => setRazon(e.target.value)}
                required
                className="w-full border p-2 rounded-lg"
              >
                <option value="">Selecciona un motivo</option>
                <option value="Consulta sobre productos">
                  Consulta sobre productos
                </option>
                <option value="Problema con un pedido">
                  Problema con un pedido
                </option>
                <option value="Otra">Otro</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Teléfono fijo</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1">Comentarios *</label>
              <textarea
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                required
                rows={4}
                className="w-full border p-2 rounded-lg"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {status === "loading" ? "Enviando…" : "Enviar"}
            </button>

            {status === "success" && (
              <p className="text-green-600 mt-2">
                ¡Tu mensaje ha sido enviado correctamente!
              </p>
            )}
            {status === "error" && (
              <p className="text-red-600 mt-2">
                Ocurrió un error. Por favor inténtalo de nuevo.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
