"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation";

export default function LowStockPage() {
  const { theme } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    stock: "",
  });
  const [updateIsLoading, setUpdateIsLoading] = useState(false);

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/low-stock`, { credentials: "include" });
        if (!res.ok) throw new Error("Error al cargar productos de bajo stock");
        const { productos } = await res.json();
        setProductos(productos);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLowStock();
  }, []);

  // Función para abrir el modal de edición del stock
  const handleStockUpdate = (product) => {
    setSelectedProduct(product);
    setUpdateForm({ stock: product.stock }); // Inicializamos con el stock actual
    setShowModal(true);
  };

  // Manejo de cambios en el formulario del modal
  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  // Función para enviar la actualización del stock al backend
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateIsLoading(true);
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${selectedProduct.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: updateForm.stock }), // Enviamos solo el stock
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProductos((prevProducts) =>
          prevProducts.map((product) =>
            product.id === selectedProduct.id
              ? { ...product, stock: updatedProduct.product.stock }
              : product
          )
        );
        setShowModal(false);
      } else {
        setError("Error al actualizar el stock.");
      }
    } catch (error) {
      console.error(error);
      setError("Error al actualizar el stock.");
    } finally {
      setUpdateIsLoading(false);
    }
  };

  return (
    <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Admin", path: "/admin" },
          { name: "Bajo Stock", path: "/admin/low-stock" },
        ]}
      />
      <h1 className="text-3xl font-bold mb-6">Productos con Stock Bajo (≤3)</h1>

      {loading ? (
        <p>Cargando…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : productos.length === 0 ? (
        <p>¡Ningún producto está bajo stock!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Stock</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 text-sm">{p.id}</td>
                  <td className="px-6 py-4 text-sm flex items-center">
                    {p.imagenes?.[0] && (
                      <img
                        src={p.imagenes[0].imageUrl}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded mr-2"
                      />
                    )}
                    <span>{p.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">{p.stock}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleStockUpdate(p)} // Abre el modal para actualizar el stock
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-sm"
                    >
                      Ver / Editar Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de actualización del stock */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
            <h2 className="text-2xl font-bold mb-4">Editar Stock del Producto</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={updateForm.stock}
                  onChange={handleUpdateFormChange}
                  className="w-full border p-2 rounded"
                  min="0"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updateIsLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {updateIsLoading ? "Actualizando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
