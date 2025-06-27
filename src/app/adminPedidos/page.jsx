"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function AdminPedidosPage() {
    const { theme } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const estados = [
        { value: "EN ESPERA", label: "EN ESPERA" },
        { value: "RECIBIDO", label: "Recibido" },
        { value: "EN_PREPARACION", label: "En preparación" },
        { value: "LISTO_ENTREGA", label: "Listo para entrega" },
        { value: "EN_CAMINO", label: "En camino" },
        { value: "ENTREGADO", label: "Entregado" },
    ];

    useEffect(() => {
        fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/obtener`, {
            credentials: "include",
        })
            .then((res) =>
                res.ok ? res.json() : Promise.reject("Error al cargar pedidos")
            )
            .then(({ pedidos }) => setPedidos(pedidos))
            .catch((err) => setError(err.toString()))
            .finally(() => setLoading(false));
    }, []);

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
            setPedidos((prev) =>
                prev.map((p) => (p.id === pedido.id ? pedido : p))
            );
        } catch {
            alert("No se pudo actualizar el estado");
        }
    };

    if (loading) return <p className="text-center py-8">Cargando pedidos…</p>;
    if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

    return (
        <div
            className={`container mx-auto pt-36 pb-8 px-4 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
                }`}
        >
            <div className="mb-6">
                <Breadcrumbs
                    pages={[
                        { name: "Home", path: "/" },
                        { name: "Admin", path: "/admin" },
                        { name: "Pedidos", path: "/admin/pedidos" },
                    ]}
                />
            </div>

            <h1 className="text-3xl font-bold mb-6">Gestión de Pedidos</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-500">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Pedido</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase">Total</th>
                            <th className="px-6 py-3 text-center text-xs font-medium uppercase">Acciones</th>
                        </tr>
                    </thead>

                    {/* Ahora el body es uniforme: blanco en claro, gris-oscuro en oscuro, sin azules ni rayas */}
                    <tbody className={`${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                        {pedidos.map((p) => (
                            <tr key={p.id} className="border-b border-gray-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{p.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {new Date(p.fecha_pedido).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {p.usuario.name}
                                    <div className="text-xs text-gray-500">{p.usuario.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={p.estado}
                                        onChange={(e) => handleChangeEstado(p.id, e.target.value)}
                                        className="border rounded px-2 py-1 bg-white focus:outline-none"
                                    >
                                        {estados.map((e) => (
                                            <option key={e.value} value={e.value}>
                                                {e.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right">
                                    ${p.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => alert(`Ver detalles del pedido #${p.id}`)}
                                        className="text-gray-700 hover:text-gray-900 text-sm"
                                    >
                                        Ver
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}