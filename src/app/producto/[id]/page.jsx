"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/authContext";
import { CONFIGURACIONES } from "../../config/config";
import Breadcrumbs from "../../../components/Breadcrumbs";

export default function ProductoDetailPage() {
  const { theme } = useAuth();
  const { id } = useParams();
  const router = useRouter();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true);
      try {
        console.log("⏳ Iniciando fetch de producto", id);
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${id}`);
        console.log("🔄 Response status:", res.status, res.statusText);

        const raw = await res.text();
        console.log("📥 Raw response text:", raw);

        let data;
        try {
          data = JSON.parse(raw);
          console.log("✅ Parsed JSON:", data);
        } catch (parseErr) {
          console.error("❌ Error parseando JSON:", parseErr);
          throw new Error("Respuesta no es JSON válido");
        }

        const prod = data.producto ?? data;
        console.log("🏷️ Producto final a setear:", prod);

        setProducto(prod);
      } catch (err) {
        console.error("🚨 Error en fetchProducto:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) return <p className="text-center py-8">Cargando…</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  return (
    <div
      className={`container mx-auto py-8 mt-32 ml-4 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Productos", path: "/ventaProducto" },
          { name: producto?.name, path: `/producto/${id}` },
        ]}
      />

      {/* Detalle del Producto */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Imagen */}
        <div className="w-full md:w-1/2">
          {producto.imagenes?.[0] ? (
            <img
              src={producto.imagenes[0].imageUrl}
              alt={producto.name}
              className="w-full h-auto rounded"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
              <span className="text-gray-500">Sin imagen</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{producto.name}</h1>
          <p className="text-gray-700">{producto.description}</p>
          <p className="text-2xl font-semibold">
            ${producto.precio.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            Tamaño: {producto.tamano} ml
          </p>
          <p className="text-sm text-gray-600">Sabor: {producto.sabor}</p>

          {/* Botones de acción */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => router.push("/carrito")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Agregar al carrito
            </button>
            <button
              onClick={() => alert("Funcionalidad de compra directa")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Reseñas */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Reseñas</h2>

        {producto.review && producto.review.length > 0 ? (
          <div className="space-y-6">
            {producto.review.map((r) => (
              <div key={r.id} className="border-b pb-6">
                <p className="font-semibold">{r.usuario.name}</p>
                <p className="text-yellow-500 mb-1">
                  {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                </p>
                <p className="text-gray-800 mb-2">{r.comment}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>

                {/* aquí mostramos las imágenes de la reseña */}
                {r.images && r.images.length > 0 && (
                  <div className="flex space-x-2 mb-4">
                    {r.images.map((img) => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt={`Reseña ${r.id} imagen`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            Aún no hay reseñas para este producto.
          </p>
        )}
      </div>
    </div>
  );
}
