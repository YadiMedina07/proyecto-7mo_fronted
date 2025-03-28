"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";

function ProductosPage() {
  const { theme } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [busquedaGeneral, setBusquedaGeneral] = useState("");
  const [filtroFlavor, setFiltroFlavor] = useState(""); // Filtro por sabor
  const [filtroSize, setFiltroSize] = useState(""); // Filtro por tamaño
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener todos los productos al cargar la página
  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/`);
        if (response.ok) {
          const data = await response.json();
          // Asumimos que la respuesta tiene la forma { productos: [...] }
          setProductos(data.productos);
        } else {
          throw new Error("Error al obtener los productos");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error al cargar los productos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Filtrar productos usando las propiedades correctas
  const productosFiltrados = productos.filter((producto) => {
    const coincideConBusquedaGeneral =
      busquedaGeneral === "" ||
      producto.name.toLowerCase().includes(busquedaGeneral.toLowerCase()) ||
      producto.description.toLowerCase().includes(busquedaGeneral.toLowerCase()) ||
      producto.sabor.toLowerCase().includes(busquedaGeneral.toLowerCase());
    return (
      coincideConBusquedaGeneral &&
      (filtroFlavor === "" || producto.sabor === filtroFlavor) &&
      (filtroSize === "" || producto.tamano === filtroSize) &&
      (filtroPrecioMin === "" || producto.precio >= parseFloat(filtroPrecioMin)) &&
      (filtroPrecioMax === "" || producto.precio <= parseFloat(filtroPrecioMax))
    );
  });

  // Definir las migajas de pan
  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Productos", path: "/ventaProducto" }
  ];

  // Función para agregar el producto al carrito y redirigir a la página del carrito
  const handleComprar = async (producto) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/carrito`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: producto.id, cantidad: 1 }),
      });
      if (response.ok) {
        // Si se agregó al carrito, redirigir a la página del carrito
        router.push("/carrito");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error al agregar el producto al carrito");
      }
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      alert("Error al agregar el producto al carrito");
    }
  };

  return (
    <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      {/* Migajas de pan */}
      <Breadcrumbs pages={breadcrumbsPages} />
      <h1 className="text-3xl font-bold text-center mb-8">Productos</h1>

      {/* Buscador general */}
      <div className={`shadow-md rounded-lg overflow-hidden p-6 mb-8 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
        <h2 className="text-2xl font-bold mb-4">Buscar Productos</h2>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busquedaGeneral}
            onChange={(e) => setBusquedaGeneral(e.target.value)}
            className={`w-full border p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`}
          />
          <button className={`ml-2 p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-900"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Diseño con Grid: Filtros a la izquierda y productos a la derecha */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sección de Filtros */}
        <div className={`shadow-md rounded-lg p-6 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
          <h2 className="text-2xl font-bold mb-4">Filtrar por:</h2>
          {/* Filtro por sabor */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Sabor</label>
            <select
              value={filtroFlavor}
              onChange={(e) => setFiltroFlavor(e.target.value)}
              className={`w-full border p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`}
            >
              <option value="">Todos</option>
              <option value="Café">Café</option>
              <option value="Jobo">Jobo</option>
              <option value="Fresa">Fresa</option>
              <option value="Arándano">Arándano</option>
              <option value="Zarzamora">Zarzamora</option>
              <option value="Mango">Mango</option>
              <option value="Coco">Coco</option>
              <option value="Horchata">Horchata</option>
              <option value="Piña">Piña</option>
              <option value="Uva">Uva</option>
            </select>
          </div>
          {/* Filtro por tamaño */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Tamaño</label>
            <select
              value={filtroSize}
              onChange={(e) => setFiltroSize(e.target.value)}
              className={`w-full border p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`}
            >
              <option value="">Todos</option>
              <option value="250ml">250ml</option>
              <option value="750ml">750ml</option>
              <option value="1000ml">1000ml</option>
            </select>
          </div>
          {/* Filtro por precio */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Precio</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Mínimo"
                value={filtroPrecioMin}
                onChange={(e) => setFiltroPrecioMin(e.target.value)}
                className={`w-1/2 border p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`}
              />
              <input
                type="number"
                placeholder="Máximo"
                value={filtroPrecioMax}
                onChange={(e) => setFiltroPrecioMax(e.target.value)}
                className={`w-1/2 border p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 border-gray-600 text-gray-200" : "border-gray-300"}`}
              />
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="md:col-span-3">
          {isLoading ? (
            <p className="text-center">Cargando productos...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((producto) => (
                <div key={producto.id} className={`shadow-md rounded-lg overflow-hidden ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
                  {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img
                      src={producto.imagenes[0].imageUrl}
                      alt={producto.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">Sin imagen</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{producto.name}</h2>
                    <p className="text-sm mb-2">{producto.description}</p>
                    <p className="text-lg font-bold">${producto.precio && producto.precio.toFixed(2)}</p>
                    <p className="text-sm">Tamaño: {producto.tamano} ml</p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleComprar(producto)}
                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Comprar
                      </button>
                      <button
                        onClick={() => alert("Funcionalidad de agregar al carrito en desarrollo")}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Agregar al Carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );


}

export default ProductosPage;
