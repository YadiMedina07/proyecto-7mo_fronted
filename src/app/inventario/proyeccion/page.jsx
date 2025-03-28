"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/authContext";
import Breadcrumbs from "../../../components/Breadcrumbs";

// Datos de ejemplo
const dataSabores = {
  Liche: [
    { tamano: "1 Lt", stock: 950, precio: 120, imageUrl: "/images/liche.jpg" },
    { tamano: "750 ml", stock: 750, precio: 90, imageUrl: "/images/liche.jpg" },
    { tamano: "250 ml", stock: 600, precio: 60, imageUrl: "/images/liche.jpg" },
  ],
  Café: [
    { tamano: "1 Lt", stock: 500, precio: 110, imageUrl: "/images/cafe.jpg" },
    { tamano: "750 ml", stock: 250, precio: 85, imageUrl: "/images/cafe.jpg" },
    { tamano: "250 ml", stock: 100, precio: 50, imageUrl: "/images/cafe.jpg" },
  ],
  Jobo: [
    { tamano: "1 Lt", stock: 950, precio: 130, imageUrl: "/images/jobo.jpg" },
    { tamano: "750 ml", stock: 750, precio: 100, imageUrl: "/images/jobo.jpg" },
    { tamano: "250 ml", stock: 600, precio: 70, imageUrl: "/images/jobo.jpg" },
  ],
  Caña: [
    { tamano: "1 Lt", stock: 400, precio: 95, imageUrl: "/images/cana.jpg" },
    { tamano: "750 ml", stock: 300, precio: 75, imageUrl: "/images/cana.jpg" },
    { tamano: "250 ml", stock: 200, precio: 50, imageUrl: "/images/cana.jpg" },
  ],
  Zarzamora: [
    { tamano: "1 Lt", stock: 800, precio: 125, imageUrl: "/images/zarzamora.jpg" },
    { tamano: "750 ml", stock: 600, precio: 90, imageUrl: "/images/zarzamora.jpg" },
    { tamano: "250 ml", stock: 400, precio: 65, imageUrl: "/images/zarzamora.jpg" },
  ],
};

export default function ProyeccionPage() {
  const { theme } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Leer la query param "sabor" (viene desde la página anterior)
  const sabor = searchParams.get("sabor") || "";

  // Obtener la data correspondiente a ese sabor
  const dataSeleccionada = dataSabores[sabor] || [];

  // Migas de pan
  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Inventario", path: "/inventario" },
    { name: "Proyección", path: `/inventario/proyeccion?sabor=${sabor}` },
  ];

  // Cuando el usuario presione el botón "Proyección" en la tabla
  const handleProyeccion = (item) => {
    // Redirigir a la vista de detalle, pasando todos los datos necesarios por query
    router.push(
      `/inventario/proyeccion/detalle?sabor=${sabor}&tamano=${item.tamano}&precio=${item.precio}&imageUrl=${item.imageUrl}`
    );
  };

  return (
    <div
      className={`container mx-auto pt-36 px-4 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs pages={breadcrumbsPages} />

      <h1 className="text-3xl font-bold text-center mb-2">Proyección de {sabor}</h1>
      <p className="text-center text-gray-600 mb-8">
        Analiza el inventario y proyecta el futuro stock
      </p>

      {/* Contenedor de la tabla */}
      <div className="mx-auto max-w-3xl border border-pink-300 bg-pink-100 p-6 rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-pink-200">
            <tr>
              <th className="border border-pink-300 px-4 py-2">Tamaño</th>
              <th className="border border-pink-300 px-4 py-2">Stock</th>
              <th className="border border-pink-300 px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {dataSeleccionada.length === 0 ? (
              <tr>
                <td colSpan={3} className="border border-pink-300 px-4 py-2 text-center">
                  No hay datos para {sabor}
                </td>
              </tr>
            ) : (
              dataSeleccionada.map((item, index) => (
                <tr key={index}>
                  <td className="border border-pink-300 px-4 py-2 text-center">
                    {item.tamano}
                  </td>
                  <td className="border border-pink-300 px-4 py-2 text-center">
                    {item.stock} botellas
                  </td>
                  <td className="border border-pink-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleProyeccion(item)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Proyección
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

