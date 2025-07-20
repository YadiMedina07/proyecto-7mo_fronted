"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";

const RESTOCK_DAYS = 5;

export default function ProductosPage() {
  const { theme } = useAuth();
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [busquedaGeneral, setBusquedaGeneral] = useState("");
  const [filtroFlavor, setFiltroFlavor] = useState("");
  const [filtroSize, setFiltroSize] = useState("");
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Traer todos los productos
  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error al cargar productos");
        const { productos } = await res.json();
        setProductos(productos);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Filtrado con lógica mejorada
  const productosFiltrados = productos.filter((p) => {
    const texto = busquedaGeneral.trim().toLowerCase();
    const matchGeneral =
      p.name.toLowerCase().includes(texto) ||
      p.description.toLowerCase().includes(texto) ||
      p.sabor.toLowerCase().includes(texto);

    const matchFlavor =
      !filtroFlavor ||
      p.sabor.toLowerCase() === filtroFlavor.toLowerCase();

    const matchSize =
      !filtroSize ||
      p.tamano === Number(filtroSize);

    const precio = Number(p.precio);
    const min = filtroPrecioMin ? Number(filtroPrecioMin) : null;
    const max = filtroPrecioMax ? Number(filtroPrecioMax) : null;
    const matchMin = min === null || precio >= min;
    const matchMax = max === null || precio <= max;

    return matchGeneral && matchFlavor && matchSize && matchMin && matchMax;
  });

  // Separar disponibles y agotados
  const disponibles = productosFiltrados.filter((p) => p.stock > 0);
  const agotados = productosFiltrados.filter((p) => p.stock === 0);

  // Funciones de carrito y compra
  const handleAgregarAlCarrito = async (producto) => {
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/carrito/agregar`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: producto.id, cantidad: 1 }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al agregar al carrito");
      }
      alert("Producto agregado al carrito");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleComprarDirecto = async (producto) => {
    await handleAgregarAlCarrito(producto);
    router.push("/pedidos");
  };

  return (
    <div
      className={`container mx-auto py-8 pt-36 px-4 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Productos", path: "/producto" },
        ]}
      />

      <h1 className="text-3xl font-bold text-center mb-8">Productos</h1>

      {/* Buscador */}
      <div className="mb-8 p-6 shadow rounded-lg">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busquedaGeneral}
          onChange={(e) => setBusquedaGeneral(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filtros */}
        <div className="p-6 shadow rounded-lg">
          <h2 className="font-semibold mb-4">Filtrar por:</h2>

          <label className="block mb-2">Sabor</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={filtroFlavor}
            onChange={(e) => setFiltroFlavor(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Cafe">Café</option>
            <option value="Capulin">Capulín</option>
            <option value="Mandarina">Mandarina</option>
            <option value="Naranja">Naranja</option>
            <option value="Jobo">Jobo</option>
            <option value="Fresa">Fresa</option>
            <option value="Arandano">Arándano</option>
            <option value="Tamarindo">Tamarindo</option>
            <option value="Lichi">Lichi</option>
            <option value="Maracuya">Maracuyá</option>
            <option value="Coco">Coco</option>
            <option value="Canela">Canela</option>
            <option value="Zarzamora">Zarzamora</option>
            <option value="Mango">Mango</option>
            <option value="Guayaba">Guayaba</option>
            <option value="Limon">Limón</option>
            <option value="Jerez">Jerez</option>
            <option value="Ciruela">Ciruela</option>
            <option value="Piña/Maracuya">Piña/Maracuyá</option>
            <option value="Naranja/Maracuya">Naranja/Maracuyá</option>
            
          </select>

          <label className="block mb-2">Tamaño (ml)</label>
          <select
            className="w-full p-2 border rounded mb-4"
            value={filtroSize}
            onChange={(e) => setFiltroSize(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="250">250</option>
            <option value="750">750</option>
            <option value="1000">1000</option>
          </select>

          <label className="block mb-2">Precio</label>
          <div className="flex space-x-2 mb-4">
            <input
              type="number"
              placeholder="Mín"
              value={filtroPrecioMin}
              onChange={(e) => setFiltroPrecioMin(e.target.value)}
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Máx"
              value={filtroPrecioMax}
              onChange={(e) => setFiltroPrecioMax(e.target.value)}
              className="w-1/2 p-2 border rounded"
            />
          </div>
        </div>

        {/* Grilla de productos */}
        <div className="md:col-span-3">
          {isLoading ? (
            <p>Cargando productos…</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              {/* Productos disponibles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {disponibles.map((prod) => (
                  <div
                    key={prod.id}
                    className="shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
                    onClick={() => router.push(`/producto/${prod.id}`)}
                  >
                    {prod.imagenes?.[0] ? (
                      <img
                        src={prod.imagenes[0].imageUrl}
                        alt={prod.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Sin imagen</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h2 className="font-bold mb-1">{prod.name}</h2>
                      <p className="text-lg font-semibold mb-2">
                        ${prod.precio.toFixed(2)}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComprarDirecto(prod);
                          }}
                          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
                        >
                          Comprar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAgregarAlCarrito(prod);
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                        >
                          Agregar al Carrito
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Productos Agotados */}
              {agotados.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold mt-12 mb-4">Productos Agotados</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agotados.map((prod) => (
                      <div
                        key={prod.id}
                        className="opacity-50 cursor-not-allowed shadow rounded-lg overflow-hidden"
                      >
                        {prod.imagenes?.[0] ? (
                          <img
                            src={prod.imagenes[0].imageUrl}
                            alt={prod.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Sin imagen</span>
                          </div>
                        )}
                        <div className="p-4">
                          <h2 className="font-bold mb-1">{prod.name}</h2>
                          <p className="text-lg font-semibold mb-2">
                            ${prod.precio.toFixed(2)}
                          </p>
                          <p className="text-sm text-blue-600 font-semibold mb-2">
                            Disponible en {RESTOCK_DAYS} días
                          </p>
                          <div className="flex space-x-2">
                            <button
                              disabled
                              className="px-3 py-2 bg-green-400 text-white rounded opacity-50 cursor-not-allowed"
                            >
                              Comprar
                            </button>
                            <button
                              disabled
                              className="px-3 py-2 bg-blue-400 text-white rounded opacity-50 cursor-not-allowed"
                            >
                              Agregar al Carrito
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
