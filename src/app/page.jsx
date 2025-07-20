"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  // Imágenes para el slideshow
  const slideshowImages = [
    "/assets/baner1.jpg",
    "/assets/baner2.jpg",
    "/assets/baner3.jpg",
    "/assets/baner4.jpg",
    "/assets/baner5.jpg",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Lista de productos
  const productos = [
    { id: 1, nombre: "Curado de zarzamora", descripcion: "Sabor Zarzamora.", precio: 50, imagen: "/assets/producto1.jpg" },
    { id: 2, nombre: "Curado de jobo", descripcion: "Sabor Jobo.", precio: 100, imagen: "/assets/producto2.jpg" },
    { id: 3, nombre: "Curado de mango", descripcion: "Sabor Mango.", precio: 130, imagen: "/assets/producto3.jpg" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">

      {/* Hero Section */}
      <section className="relative w-full h-96 md:h-[600px] overflow-hidden rounded-lg shadow-lg mb-12 mt-12">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={slideshowImages[currentIndex]}
              alt={`Banner ${currentIndex + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center px-6">
              <h1
                className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-200 to-yellow-200 text-4xl md:text-6xl font-extrabold drop-shadow-2xl text-center">
                Encuentra los mejores productos
              </h1>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* QR & Slideshow Trio */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* QR Block */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <Image src="/assets/QR.jpg" alt="Código QR" width={120} height={120} className="mb-4" />
          <p className="font-medium text-lg">Escanea este código QR para ver un ejemplo</p>
        </div>

        {/* Center Slideshow Preview */}
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
          <div className="w-full h-64 md:h-72 lg:h-80">
            <AnimatePresence>
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <Image
                  src={slideshowImages[currentIndex]}
                  alt={`Preview ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* QR Block 2 */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <Image src="/assets/QR.jpg" alt="Código QR" width={120} height={120} className="mb-4" />
          <p className="font-medium text-lg">Toda la información en un clic</p>
        </div>
      </section>

      {/* Catálogo Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Catálogo de Productos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map(({ id, nombre, descripcion, precio, imagen }) => (
            <motion.div
              key={id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition"
            >
              <div className="relative h-48">
                <Image
                  src={imagen}
                  alt={nombre}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-2">{nombre}</h3>
                <p className="text-gray-600 mb-4 flex-1">{descripcion}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-pink-600">${precio.toFixed(2)} MXN</span>
                  <Link href="/producto">
  <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition">
    Ver más
  </button>
</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
