"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/authContext";
import { useParams, useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../../config/config";
import Breadcrumbs from "../../../components/Breadcrumbs";

export default function DetallePedidoPage() {
  const { theme } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/${id}`, {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el pedido");
        return res.json();
      })
      .then(({ pedido }) => setPedido(pedido))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-8 text-center">Cargando…</p>;
  if (error)   return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className={`container mx-auto py-8 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}>
      <Breadcrumbs
        pages={[
          { name: "Home",        path: "/" },
          { name: "Mis Pedidos", path: "/misPedidos" },
          { name: `Pedido #${id}`, path: `/detallePedido/${id}` },
        ]}
      />

      <h1 className="text-2xl font-bold mb-4">Detalle del pedido #{id}</h1>

      <p className="mb-6">
        <strong>Fecha:</strong>{" "}
        {new Date(pedido.fecha_pedido).toLocaleString()}
      </p>

      <table className="w-full table-auto mb-6">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Producto</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-center">Cantidad</th>
            <th className="px-4 py-2 text-right">Precio Unit.</th>
            <th className="px-4 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.detallePedido.map(item => {
            const imgUrl = item.producto.imagenes[0]?.imageUrl || "/fallback-logo.png";
            return (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">
                  <img
                    src={imgUrl}
                    alt={item.producto.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">{item.producto.name}</td>
                <td className="px-4 py-2 text-center">{item.cantidad}</td>
                <td className="px-4 py-2 text-right">
                  ${item.precio_unitario.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-right">
                  ${(item.precio_unitario * item.cantidad).toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>


      <div className="text-right text-xl font-semibold">
        Total: ${pedido.total.toFixed(2)}
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded"
      >
        ← Volver
      </button>
    </div>
  );
}