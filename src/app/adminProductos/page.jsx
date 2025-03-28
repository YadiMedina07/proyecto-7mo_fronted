"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";

function AdminProductsPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
    }
  }, [isAuthenticated, user]);

  const [activeTab, setActiveTab] = useState("create");

  const [form, setForm] = useState({
    name: "",
    description: "",
    precio: "",
    sabor: "",
    tamano: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" o "error"
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const invalid = files.find((file) => !allowedTypes.includes(file.type));
    if (invalid) {
      setImages([]);
      setMessage("Formato de imagen no permitido. Usa JPG, PNG o GIF.");
      setMessageType("error");
      return;
    }
    setImages(files);
    setMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setForm({
      name: "",
      description: "",
      precio: "",
      sabor: "",
      tamano: "",
      stock: "" 
    });
    setImages([]);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    // Validamos que los campos obligatorios (Nombre y Precio) estén completos
    if (!form.name || !form.precio) {
      setMessage("Los campos Nombre y Precio son obligatorios.");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    images.forEach((file) => formData.append("images", file));

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/crear`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        await response.json();
        setMessage("Producto creado exitosamente.");
        setMessageType("success");
        clearForm();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Error al crear el producto.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error al crear producto:", error);
      setMessage("Error al crear el producto.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <h1 className="text-3xl font-bold text-center mb-8">Crear Producto</h1>
      <div className={`shadow-xl rounded-lg p-8 max-w-3xl mx-auto ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
        <form onSubmit={handleCreateProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 font-medium">Nombre</label>
              <input type="text" name="name" value={form.name} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-pink-500" required />
            </div>
            <div>
              <label className="block mb-2 font-medium">Precio</label>
              <input type="number" name="precio" value={form.precio} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-pink-500" step="0.01" required />
            </div>
            <div>
              <label className="block mb-2 font-medium">Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-pink-500" placeholder="Cantidad disponible" required />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium">Descripción</label>
            <textarea name="description" value={form.description} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-pink-500" rows="3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">Sabor</label>
              <input type="text" name="sabor" value={form.sabor} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-pink-500" placeholder="Ej. Vainilla" />
            </div>
            <div>
              <label className="block mb-2 font-medium">Tamaño</label>
              <input type="number" name="tamano" value={form.tamano} onChange={handleInputChange} className="w-full border p-3 rounded-lg focus:ring-pink-500" placeholder="Ej. 750" />
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium">Imágenes</label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="w-full border p-3 rounded-lg focus:ring-pink-500" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg bg-pink-700 text-white hover:bg-pink-800 disabled:bg-gray-400">
            {isLoading ? "Creando producto..." : "Crear Producto"}
          </button>
          {message && (
            <p className={`mt-4 text-center ${messageType === "success" ? "text-pink-500" : "text-red-500"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AdminProductsPage;