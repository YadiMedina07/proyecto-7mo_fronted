"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useRouter } from "next/navigation";

export default function HistorialPedidosPage() {
  const { theme } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/historial`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar el historial");
        return res.json();
      })
      .then(({ pedidos }) => setPedidos(pedidos))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className={`container mx-auto py-32 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Historial", path: "/historialPedidos" },
        ]}
      />

      <h1 className="text-3xl font-bold mb-6">Historial de Pedidos</h1>

      {loading ? (
        <p>Cargando historial…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : pedidos.length === 0 ? (
        <p>No hay pedidos en tu historial.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 text-sm font-medium">#{p.id}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(p.fecha_pedido).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-right">
                    ${p.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => router.push(`/detallePedido/`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
