
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function PedidoPage() {
  const { theme } = useAuth();
  const router = useRouter();
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 1. Cargamos el carrito al montar la página
  useEffect(() => {
    const fetchCarrito = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${CONFIGURACIONES.BASEURL2}/carrito/obtener`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Error al cargar el carrito");
        const { carrito: items } = await res.json();
        setCarrito(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCarrito();
  }, []);

  // 2. Calculamos el total
  const total = carrito.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

  // 3. Función para “hacer pedido”
  const handleCreateOrder = async () => {
    setOrderLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/pedidos/crear`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el pedido");
      }
      const { pedido } = await res.json();
      setSuccessMsg(`Pedido #${pedido.id} creado correctamente`);
      setCarrito([]);                  // opcional: vaciar UI
      // router.push('/mis-pedidos');   // opcional: redirigir a “Mis pedidos”
    } catch (err) {
      setError(err.message);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Carrito", path: "/carrito" },
          { name: "Realizar Pedido", path: "/pedido" },
        ]}
      />

      <h1 className="text-3xl font-bold text-center mb-8">Realizar Pedido</h1>

      {loading ? (
        <p className="text-center">Cargando carrito...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : carrito.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {carrito.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  {item.producto.imagenes?.[0] ? (
                    <img
                      src={item.producto.imagenes[0].imageUrl}
                      alt={item.producto.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500 text-xs">Sin imagen</span>
                    </div>
                  )}
                  <div className="ml-4">
                    <h2 className="text-lg font-bold">
                      {item.producto.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.cantidad}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  ${(item.producto.precio * item.cantidad).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="text-right mb-8">
            <span className="text-xl font-bold">
              Total: ${total.toFixed(2)}
            </span>
          </div>

          {successMsg && (
            <p className="text-center text-green-500 mb-4">{successMsg}</p>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleCreateOrder}
              disabled={orderLoading}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded disabled:opacity-50"
            >
              {orderLoading ? "Procesando..." : "Confirmar Pedido"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}