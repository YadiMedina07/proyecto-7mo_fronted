"use client";

import Image from "next/image";
import { useAuth } from "../../context/authContext";

export default function NosotrosPage() {
  const { theme } = useAuth();
  const light = (s) => theme === "light" ? s : "";
  const dark  = (s) => theme === "dark"  ? s : "";

  return (
    <div className={`${light("bg-gray-100 text-gray-800")} ${dark("bg-gray-900 text-gray-200")} min-h-screen`}>
      {/* Hero banner */}
      <section className="relative w-full h-96 overflow-hidden">
        <Image
          src="/assets/nosotros.jpg"
          alt="Artesano preparando curados"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center px-6"
             style={{ backgroundColor: theme === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)" }}>
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-white">
            Nosotros
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16 space-y-20">
        {/* Historia */}
        <section className={`${light("bg-white")} ${dark("bg-gray-800")} rounded-lg shadow-lg p-8`}>
          <h2 className={`${light("text-pink-600")} ${dark("text-blue-400")} text-3xl font-bold mb-4`}>
            Historia
          </h2>
          <p className="text-lg leading-relaxed">
            Desde nuestros inicios, hemos combinado la tradición familiar con
            la pasión por el sabor auténtico. Cada lote de curados es el
            resultado de años de perfección, transmitidos de generación en
            generación para ti.
          </p>
        </section>

        {/* Misión & Visión */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className={`${light("bg-white")} ${dark("bg-gray-800")} rounded-lg shadow-lg p-8`}>
            <h3 className={`${light("text-pink-600")} ${dark("text-blue-400")} text-2xl font-semibold mb-3`}>
              Misión
            </h3>
            <p className="text-base leading-relaxed">
              Elaborar curados artesanales de la más alta calidad, fusionando
              tradición y sabor con ingredientes naturales, brindando a nuestros
              clientes una experiencia única y auténtica en cada sorbo.
            </p>
          </div>
          <div className={`${light("bg-white")} ${dark("bg-gray-800")} rounded-lg shadow-lg p-8`}>
            <h3 className={`${light("text-pink-600")} ${dark("text-blue-400")} text-2xl font-semibold mb-3`}>
              Visión
            </h3>
            <p className="text-base leading-relaxed">
              Ser la marca líder en curados artesanales a nivel nacional,
              reconocida por la excelencia en nuestros productos y nuestro
              compromiso con la cultura y la tradición mexicana.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className={`${light("bg-white")} ${dark("bg-gray-800")} rounded-lg shadow-lg p-8`}>
          <h2 className={`${light("text-pink-600")} ${dark("text-blue-400")} text-3xl font-bold mb-6`}>
            Valores
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            <li>
              <strong>Calidad:</strong> Seleccionamos los mejores ingredientes
              naturales.
            </li>
            <li>
              <strong>Tradición:</strong> Respetamos las recetas originales y
              las técnicas artesanales.
            </li>
            <li>
              <strong>Innovación:</strong> Exploramos nuevos sabores sin perder
              nuestra esencia.
            </li>
            <li>
              <strong>Compromiso:</strong> Trabajamos con pasión para ofrecer lo
              mejor a nuestros clientes.
            </li>
            <li>
              <strong>Sostenibilidad:</strong> Promovemos prácticas responsables
              con el medio ambiente.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
