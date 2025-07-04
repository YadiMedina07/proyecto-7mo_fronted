"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useRouter } from "next/navigation"; 

export default function AdminPedidosPage() {
  const { theme } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();    

  const estados = [
    { value: "RECIBIDO", label: "Recibido" },
    { value: "EN_PREPARACION", label: "En preparación" },
    { value: "LISTO_ENTREGA", label: "Listo para entrega" },
    { value: "EN_CAMINO", label: "En camino" },
    { value: "ENTREGADO", label: "Entregado" },
    // si quieres ver también "RECIBIDO_CLIENTE" en algún filtro, añádelo aquí
  ];

  // 1) Carga de usuarios
  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/auth/users`, {
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setUsuarios(data))
      .catch(() => console.error("No se pudieron cargar los usuarios"));
  }, []);

  // 2) Carga de pedidos al cambiar usuario seleccionado
  useEffect(() => {
    setLoading(true);
    setError("");
    const url = new URL(
      `${CONFIGURACIONES.BASEURL2}/pedidos/obtener`,
      window.location.origin
    );
    if (selectedUser) url.searchParams.set("usuarioId", selectedUser);

    fetch(url.toString(), { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar pedidos");
        return res.json();
      })
      .then(({ pedidos }) => {
        // Filtramos fuera los que ya confirmó el cliente
        setPedidos(
          pedidos.filter(p => p.estado !== "RECIBIDO_CLIENTE")
        );
      })
      .catch(() => setError("No se pudieron cargar los pedidos"))
      .finally(() => setLoading(false));
  }, [selectedUser]);

  // 3) Cuando el admin cambia estado de un pedido
  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/pedidos/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );
      if (!res.ok) throw new Error();
      const { pedido } = await res.json();

      if (pedido.estado === "RECIBIDO_CLIENTE") {
        // si el admin accidentalmente lo marca así, también lo ocultamos
        setPedidos(prev => prev.filter(p => p.id !== pedido.id));
      } else {
        // solo actualizamos el estado en la tabla
        setPedidos(prev =>
          prev.map(p => (p.id === pedido.id ? pedido : p))
        );
      }
    } catch {
      alert("No se pudo actualizar el estado");
    }
  };

  return (
    <div
      className={`container mx-auto py-8 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Admin", path: "/admin" },
          { name: "Pedidos", path: "/admin/pedidos" },
        ]}
      />

      <h1 className="text-3xl font-bold mb-4">Gestión de Pedidos</h1>

      {/* Selector de cliente */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Filtrar por cliente:</label>
        <select
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">— Todos los clientes —</option>
          {usuarios.map(u => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center py-8">Cargando pedidos…</p>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className={`${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
              {pedidos.map(p => (
                <tr key={p.id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm font-medium">#{p.id}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(p.fecha_pedido).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">{p.usuario.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={p.estado}
                      onChange={e => handleChangeEstado(p.id, e.target.value)}
                      className="border rounded px-2 py-1 bg-white focus:outline-none"
                    >
                      {estados.map(e => (
                        <option key={e.value} value={e.value}>
                          {e.label}
                        </option>
                      ))}
                    </select>
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
