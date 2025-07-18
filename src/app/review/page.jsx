"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function MisResenasPage() {
  const { theme } = useAuth();
  const [productos, setProductos] = useState([]);
  // ahora form[productoId] = { comment, rating, files: File[] }
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/reviews/elegibles`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(({ productos }) => {
        setProductos(productos);
        // inicializar form con comment, rating y files vacíos
        const init = {};
        productos.forEach((p) => {
          init[p.productoId] = {
            comment: "",
            rating: 5,
            files: [],
          };
        });
        setForm(init);
      })
      .catch((e) => setError("No se pudieron cargar los productos para reseña."));
  }, []);

  const handleChangeText = (id, field, value) => {
    setForm((f) => ({
      ...f,
      [id]: { ...f[id], [field]: value },
    }));
  };

  const handleFilesChange = (id, filesList) => {
    setForm((f) => ({
      ...f,
      [id]: { ...f[id], files: Array.from(filesList).slice(0, 5) },
    }));
  };

  const handleSubmit = async (productoId) => {
    setMsg(""); setError("");
    const { comment, rating, files } = form[productoId];
    const fd = new FormData();
    fd.append("productoId", productoId);
    fd.append("comment", comment);
    fd.append("rating", rating);
    files.forEach((f) => fd.append("images", f));

    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/reviews/reviews`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al enviar reseña");
      setMsg("Reseña enviada con éxito");
      // quitar el producto ya reseñado
      setProductos((p) =>
        p.filter((x) => x.productoId !== productoId)
      );
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className={`container mx-auto py-8 mt-24 ${
      theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
    }`}>
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Mis Reseñas", path: "/misResenas" },
        ]}
      />
      <h1 className="text-3xl font-bold mb-6 text-center">Reseñas de Productos</h1>

      {msg && <p className="text-green-500 mb-4">{msg}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {productos.length === 0 ? (
        <p>No hay productos pendientes de reseña.</p>
      ) : (
        <div className="space-y-6">
          {productos.map((p) => (
            <div key={p.productoId} className="p-4 border rounded-lg">
              <div className="flex items-center mb-4">
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                )}
                <h2 className="text-xl font-semibold">{p.name}</h2>
              </div>

              <textarea
                placeholder="Tu comentario..."
                value={form[p.productoId]?.comment || ""}
                onChange={(e) =>
                  handleChangeText(p.productoId, "comment", e.target.value)
                }
                className="w-full border rounded p-2 mb-2"
                rows={3}
              />

              <div className="flex items-center mb-2 space-x-4">
                <div className="flex items-center">
                  <label className="mr-2">Calificación:</label>
                  <select
                    value={form[p.productoId]?.rating || 5}
                    onChange={(e) =>
                      handleChangeText(
                        p.productoId,
                        "rating",
                        Number(e.target.value)
                      )
                    }
                    className="border rounded px-2 py-1"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} ★
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Imágenes (opcional):</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      handleFilesChange(p.productoId, e.target.files)
                    }
                    className="border rounded p-1"
                  />
                  <p className="text-xs text-gray-500">
                    Máx. 5 imágenes
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleSubmit(p.productoId)}
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-500"
              >
                Enviar reseña
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
