"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

function CarritoPage() {
  const { theme } = useAuth();
  const router = useRouter();
  const [carrito, setCarrito] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Migajas de pan para la navegación
  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Carrito", path: "/carrito" },
  ];

  useEffect(() => {
    const fetchCarrito = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${CONFIGURACIONES.BASEURL2}/carrito/obtener`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Se espera que la respuesta tenga la forma: { carrito: [...] }
          setCarrito(data.carrito);
        } else {
          throw new Error("Error al obtener el carrito");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Error al cargar el carrito");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarrito();
  }, []);

  // Actualizar cantidad
  const handleUpdateQuantity = async (itemId, cantidad) => {
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/carrito/actualizar/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ cantidad }),
        }
      );
      if (!res.ok) throw new Error();
      const { carritoItem } = await res.json();
      setCarrito((prev) =>
        prev.map((it) => (it.id === itemId ? carritoItem : it))
      );
    } catch {
      alert("No se pudo actualizar la cantidad");
    }
  };

  // Eliminar ítem
  const handleRemoveItem = async (itemId) => {
    if (!confirm("¿Eliminar este producto del carrito?")) return;
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/carrito/eliminar/${itemId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error();
      setCarrito((prev) => prev.filter((it) => it.id !== itemId));
    } catch {
      alert("No se pudo eliminar el producto");
    }
  };

  // Cálculo del total general
  const totalGeneral = carrito.reduce(
    (sum, it) => sum + it.producto.precio * it.cantidad,
    0
  );

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs pages={breadcrumbsPages} />
      <h1 className="text-3xl font-bold text-center mb-8">Tu Carrito</h1>

      {isLoading ? (
        <p className="text-center">Cargando carrito...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : carrito.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="space-y-4">
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
                    <h2 className="text-lg font-bold">{item.producto.name}</h2>
                    <p className="text-sm text-gray-600">
                      ${item.producto.precio.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Input de cantidad */}
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleUpdateQuantity(item.id, Number(e.target.value))
                    }
                    className="w-16 p-1 border rounded text-center"
                  />

                  <p className="text-sm font-semibold">
                    ${(item.producto.precio * item.cantidad).toFixed(2)}
                  </p>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total general */}
          <div className="mt-6 text-right">
            <span className="text-xl font-bold">
              Total: ${totalGeneral.toFixed(2)}
            </span>
          </div>

          {/* Botón para ir a la página de pedido */}
          <div className="mt-6 flex justify-end">
            <Link href="/pedidos" passHref>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">
                Realizar Pedido
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default CarritoPage;
