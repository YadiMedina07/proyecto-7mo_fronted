"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useRouter } from "next/navigation";

export default function MisPedidosPage() {
  const { theme } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1) Carga inicial, excluyendo los que ya confirmó el cliente
  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/obtener-usuario`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar tus pedidos");
        return res.json();
      })
      .then(({ pedidos }) => {
        setPedidos(
          // quitamos los ya “RECIBIDO_CLIENTE”
          pedidos.filter(p => p.estado !== "RECIBIDO_CLIENTE")
        );
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // 2) Lógica de “confirmar recibido”
  const handleConfirmReceived = async (id) => {
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/pedidos/confirmar-recibo/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al confirmar");

      // al confirmar, lo quitamos de la lista
      setPedidos(prev => prev.filter(p => p.id !== Number(id)));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={`container mx-auto py-32 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}>
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Mis Pedidos", path: "/misPedidos" },
        ]}
      />

      <h1 className="text-3xl font-bold mb-6">Mis Pedidos</h1>

      {loading ? (
        <p>Cargando pedidos…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : pedidos.length === 0 ? (
        <p>No tienes pedidos pendientes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">Total</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 text-sm font-medium">#{p.id}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(p.fecha_pedido).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">{p.estado}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-right">
                    ${p.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    {/* 1) Ver detalles */}
                    <button
                      onClick={() => router.push(`/detallePedido/${p.id}`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
                    >
                      Ver detalles
                    </button>
                    {/* 2) Confirmar recibido sólo si llegó */}
                    {p.estado === "ENTREGADO" && (
                      <button
                        onClick={() => handleConfirmReceived(p.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 text-sm"
                      >
                        Confirmar recibido
                      </button>
                    )}
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
