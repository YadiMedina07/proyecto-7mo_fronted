"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../../../context/authContext";
import Breadcrumbs from "../../../../components/Breadcrumbs";

// Importar Chart y Bar de react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Componente wrapper que envuelve al contenido en Suspense
export default function DetalleProyeccionPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DetalleProyeccionContent />
    </Suspense>
  );
}

// Componente que contiene la lógica y el contenido de la página
function DetalleProyeccionContent() {
  const { theme } = useAuth();
  const searchParams = useSearchParams();

  const sabor = searchParams.get("sabor") || "";
  const tamano = searchParams.get("tamano") || "";
  const precio = searchParams.get("precio") || "";
  const imageUrl = searchParams.get("imageUrl") || "";

  // Estado para mostrar/ocultar el historial
  const [showHistorial, setShowHistorial] = useState(false);
  // Estado para mostrar/ocultar la gráfica
  const [showGrafica, setShowGrafica] = useState(false);

  // Datos de ejemplo para el historial
  const historialData = [
    {
      parametro: "Producción Inicial",
      semana: "Semana 1",
      fecha: "16/03/2025",
      produccion: 200,
      crecimiento: "+25.0%",
    },
    {
      parametro: "Producción Actual",
      semana: "Semana 2",
      fecha: "23/03/2025",
      produccion: 250,
      crecimiento: "+25.0%",
    },
    {
      parametro: "Proyección",
      semana: "Semana 3",
      fecha: "30/03/2025",
      produccion: 300,
      crecimiento: "+20.0% (estimado)",
    },
    {
      parametro: "Proyección",
      semana: "Semana 4",
      fecha: "06/04/2025",
      produccion: 350,
      crecimiento: "+16.7% (estimado)",
    },
    {
      parametro: "Proyección",
      semana: "Semana 5",
      fecha: "13/04/2025",
      produccion: 400,
      crecimiento: "+14.3% (estimado)",
    },
  ];

  // Datos de ejemplo para la tabla de proyecciones
  const proyeccionesData = [
    { semana: "Semana 1", produccion: 200, tiempo: 0, fechaEstimada: "16/03/2025" },
    { semana: "Semana 2", produccion: 250, tiempo: 1, fechaEstimada: "23/03/2025" },
    { semana: "Semana 3", produccion: 300, tiempo: 2, fechaEstimada: "30/03/2025" },
    { semana: "Semana 4", produccion: 350, tiempo: 3, fechaEstimada: "06/04/2025" },
    { semana: "Semana 5", produccion: 400, tiempo: 4, fechaEstimada: "13/04/2025" },
  ];

  // Datos para la gráfica
  const chartLabels = proyeccionesData.map((item) => item.semana);
  const dataProduccionReal = [200, 250, 300, 350, 400];
  const dataProduccionEstimada = [220, 270, 320, 370, 420];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Producción Real",
        data: dataProduccionReal,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Producción Estimada",
        data: dataProduccionEstimada,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Comparativo por Producción Semanal - Curado ${sabor} ${tamano}`,
      },
    },
  };

  // Migas de pan
  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Inventario", path: "/inventario" },
    { name: "Proyección", path: `/inventario/proyeccion?sabor=${sabor}` },
    { name: "Detalle", path: "#" },
  ];

  return (
    <div
      className={`min-h-screen pt-36 px-4 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs pages={breadcrumbsPages} />

      <h1 className="text-3xl font-bold text-center mb-4">
        Proyección de {sabor} ({tamano})
      </h1>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Columna: Curado seleccionado */}
        <div className="flex-1 border border-pink-300 bg-pink-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Curado seleccionado
          </h2>
          <div className="flex flex-col items-center">
            <img
              src={imageUrl}
              alt={`Imagen de ${sabor}`}
              className="w-40 h-auto mb-4 object-contain"
            />
            <p className="mb-2">
              <strong>Tipo:</strong> {sabor}
            </p>
            <p className="mb-2">
              <strong>Tamaño:</strong> {tamano}
            </p>
            <p className="mb-2">
              <strong>Precio:</strong> ${precio}
            </p>
          </div>
        </div>

        {/* Columna: Producción actual */}
        <div className="flex-1 border border-pink-300 bg-pink-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Producción actual
          </h2>
          <div className="space-y-2 text-center">
            <p>
              <strong>Última semana:</strong> 250 botellas
            </p>
            <p>
              <strong>Último mes:</strong> 900 botellas
            </p>
            <p>
              <strong>Stock máximo:</strong> 1500 botellas
            </p>
          </div>
          <div className="text-center mt-6 flex flex-col gap-4">
            <button
              onClick={() => setShowHistorial(!showHistorial)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {showHistorial ? "Ocultar historial" : "Historial de producción"}
            </button>
            <button
              onClick={() => setShowGrafica(!showGrafica)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              {showGrafica ? "Ocultar gráfica" : "Ver gráfica"}
            </button>
          </div>
        </div>
      </div>

      {/* Sección Historial */}
      {showHistorial && (
        <div className="max-w-5xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Historial de Inventario
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead className="bg-pink-200">
                <tr>
                  <th className="border border-pink-300 px-4 py-2">Parámetro</th>
                  <th className="border border-pink-300 px-4 py-2">Semana</th>
                  <th className="border border-pink-300 px-4 py-2">Fecha</th>
                  <th className="border border-pink-300 px-4 py-2">
                    Producción (botellas)
                  </th>
                  <th className="border border-pink-300 px-4 py-2">
                    Crecimiento
                  </th>
                </tr>
              </thead>
              <tbody>
                {historialData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-pink-300 px-4 py-2">
                      {item.parametro}
                    </td>
                    <td className="border border-pink-300 px-4 py-2">
                      {item.semana}
                    </td>
                    <td className="border border-pink-300 px-4 py-2">
                      {item.fecha}
                    </td>
                    <td className="border border-pink-300 px-4 py-2">
                      {item.produccion}
                    </td>
                    <td className="border border-pink-300 px-4 py-2">
                      {item.crecimiento}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sección Tabla de proyecciones y Gráfica */}
      {showGrafica && (
        <div className="max-w-5xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Tabla de proyecciones</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse text-center">
              <thead className="bg-pink-200">
                <tr>
                  <th className="border border-pink-300 px-4 py-2">Semana</th>
                  <th className="border border-pink-300 px-4 py-2">
                    Producción (botellas)
                  </th>
                  <th className="border border-pink-300 px-4 py-2">
                    T (Tiempo en semanas)
                  </th>
                  <th className="border border-pink-300 px-4 py-2">Fecha estimada</th>
                </tr>
              </thead>
              <tbody>
                {proyeccionesData.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-pink-300 px-4 py-2">
                      {item.semana}
                    </td>
                    <td className="border border-pink-300 px-4 py-2">
                      {item.produccion}
                    </td>
                    <td className="border border-pink-300 px-4 py-2">
                      {item.tiempo}
                    </td>
                    <td className="border border-pink-300 px-4 py-2">
                      {item.fechaEstimada}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Gráfico de proyección
          </h2>
          <div className="bg-pink-100 p-4 rounded-lg">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}
