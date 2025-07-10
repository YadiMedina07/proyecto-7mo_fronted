"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter, useParams } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";

function AdminProductListPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" o "error"

  // Estados para el modal de edición
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    description: "",
    precio: "",
    sabor: "",
    tamano: "",
    stock: "",
  });
  const [updateImages, setUpdateImages] = useState([]);
  const [updateRemoveOldImages, setUpdateRemoveOldImages] = useState(false);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);

  // Función para obtener los productos desde el endpoint de administración
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Se corrige la URL, eliminando el segmento "admin" para que se invoque el endpoint correcto.
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.productos);
      } else {
        setMessage("Error al obtener los productos.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setMessage("Error al obtener los productos.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
    } else {
      fetchProducts();
    }
  }, [isAuthenticated, user]);

  // Función para eliminar un producto
  const handleDelete = async (productId) => {
    const confirmDelete = confirm("¿Estás seguro de eliminar este producto?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setMessage("Producto eliminado exitosamente.");
        setMessageType("success");
        fetchProducts();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error al eliminar el producto.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setMessage("Error al eliminar el producto.");
      setMessageType("error");
    }
  };

  // Función para abrir el modal de edición
  const handleUpdate = (product) => {
    setSelectedProduct(product);
    // Inicializa el formulario con los datos actuales del producto
    setUpdateForm({
      name: product.name,
      description: product.description,
      precio: product.precio,
      sabor: product.sabor,
      tamano: product.tamano,
      stock: product.stock,
    });
    setUpdateImages([]);
    setUpdateRemoveOldImages(false);
    setShowModal(true);
  };

  // Manejo de cambios en el formulario del modal
  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manejo de selección de nuevas imágenes en el modal
  const handleUpdateImageChange = (e) => {
    const files = Array.from(e.target.files);
    setUpdateImages(files);
  };

  // Función para enviar la actualización del producto desde el modal
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateIsLoading(true);
    const formData = new FormData();
    formData.append("name", updateForm.name);
    formData.append("description", updateForm.description);
    formData.append("precio", updateForm.precio);
    formData.append("sabor", updateForm.sabor);
    formData.append("tamano", updateForm.tamano);
    formData.append("stock", updateForm.stock);
    formData.append("removeOldImages", updateRemoveOldImages);
    updateImages.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${selectedProduct.id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      if (response.ok) {
        await response.json();
        setMessage("Producto actualizado exitosamente.");
        setMessageType("success");
        setShowModal(false);
        fetchProducts();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error al actualizar el producto.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      setMessage("Error al actualizar el producto.");
      setMessageType("error");
    } finally {
      setUpdateIsLoading(false);
    }
  };

  return (
    <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <h1 className="text-3xl font-bold text-center mb-8">Administrar Productos</h1>
      {message && (
        <div className={`mb-4 p-4 rounded-lg text-center text-sm ${messageType === "success"
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-red-100 text-red-700 border border-red-300"
          }`}>
          {message}
        </div>
      )}
      {isLoading ? (
        <p className="text-center">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden border">
              {product.imagenes && product.imagenes.length > 0 && (
                <img
                  src={product.imagenes[0].imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="text-gray-700 mb-2">Precio: ${product.precio.toFixed(2)}</p>
                <p className="text-gray-700 mb-2">Sabor: {product.sabor}</p>
                <p className="text-gray-700 mb-2">Tamaño: {product.tamano}</p>
                <p className="text-gray-700 mb-2">Stock: {product.stock}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleUpdate(product)}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Actualizar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de actualización */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh]  overflow-y-auto  ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"} `}>
            <h2 className="text-2xl font-bold mb-4">Editar Producto</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={updateForm.name}
                  onChange={handleUpdateFormChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={updateForm.description}
                  onChange={handleUpdateFormChange}
                  className="w-full border p-2 rounded"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block mb-1">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={updateForm.precio}
                  onChange={handleUpdateFormChange}
                  className="w-full border p-2 rounded"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Sabor</label>
                <input
                  type="text"
                  name="sabor"
                  value={updateForm.sabor}
                  onChange={handleUpdateFormChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Tamaño</label>
                <input
                  type="number"
                  name="tamano"
                  value={updateForm.tamano}
                  onChange={handleUpdateFormChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
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
              <div>
                <label className="block mb-1">Nuevas Imágenes</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpdateImageChange}
                  className="w-full"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="updateRemoveOldImages"
                  checked={updateRemoveOldImages}
                  onChange={(e) => setUpdateRemoveOldImages(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="updateRemoveOldImages" className="text-sm">Eliminar imágenes anteriores</label>
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

export default AdminProductListPage;
