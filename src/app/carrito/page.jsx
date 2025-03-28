"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation";
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
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/carrito`, {
          credentials: "include",
        });
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

  return (
    <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <Breadcrumbs pages={breadcrumbsPages} />
      <h1 className="text-3xl font-bold text-center mb-8">Tu Carrito</h1>
      {isLoading ? (
        <p className="text-center">Cargando carrito...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : carrito.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {carrito.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                {item.producto.imagenes && item.producto.imagenes.length > 0 ? (
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
                  <p className="text-sm text-gray-600">${item.producto.precio.toFixed(2)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">Cantidad: {item.cantidad}</p>
                <p className="text-sm font-semibold">
                  Total: ${(item.producto.precio * item.cantidad).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CarritoPage;
