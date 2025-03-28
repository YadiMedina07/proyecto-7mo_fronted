"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";
import Breadcrumbs from "../../components/Breadcrumbs";

function InventarioPage() {
  const { theme } = useAuth();
  const router = useRouter();
  
  // Lista de sabores (ejemplo)
  const sabores = ["Liche", "Café", "Jobo", "Caña", "Zarzamora"];

  // Estado para el sabor seleccionado (opcional, si quieres mostrar algo en la vista)
  const [saborSeleccionado, setSaborSeleccionado] = useState("");

  // Migas de pan (si las usas)
  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Inventario", path: "/inventario" },
  ];

  // Cuando el usuario selecciona un sabor, se redirige inmediatamente
  const handleSelectChange = (e) => {
    const valor = e.target.value;
    setSaborSeleccionado(valor);
    if (valor) {
      router.push(`/inventario/proyeccion?sabor=${valor}`);
    }
  };

  return (
    <div
      className={`container mx-auto pt-36 px-4 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs pages={breadcrumbsPages} />
      
      <h1 className="text-3xl font-bold text-center mb-2">Inventario de curados</h1>
      <p className="text-center text-gray-600 mb-8">
        Analiza y proyecta el inventario de los curados
      </p>

      {/* Contenedor principal (rosa, opcional) */}
      <div className="max-w-xl mx-auto bg-pink-100 border border-pink-300 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Selección de un curado</h2>
        
        {/* Menú desplegable */}
        <div className="mb-4">
          <label htmlFor="curado" className="block mb-2 font-medium">
            Curado
          </label>
          <select
            id="curado"
            value={saborSeleccionado}
            onChange={handleSelectChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">-- Selecciona un sabor --</option>
            {sabores.map((sabor) => (
              <option key={sabor} value={sabor}>
                {sabor}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default InventarioPage;
