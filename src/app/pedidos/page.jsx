"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import { FiUser } from "react-icons/fi";

export default function PedidoPage() {
  const { theme, user } = useAuth();
  const router = useRouter();

  // Carrito
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Direcciones
  const [direcciones, setDirecciones] = useState([]);
  const [direccionId, setDireccionId] = useState("");

  // Crear / Editar dirección
  const [successMsg, setSuccessMsg] = useState("");
  const [creatingDir, setCreatingDir] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Formulario de dirección (tanto crear como editar)
  const [newAddress, setNewAddress] = useState({
    alias: "",
    calle: "",
    numeroExterior: "",
    numeroInterior: "",
    colonia: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    pais: "México",
  });

  // Pedido
  const [orderLoading, setOrderLoading] = useState(false);

  // Carga inicial de carrito y direcciones
  // Carga inicial
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Direcciones
        const resDir = await fetch(
          `${CONFIGURACIONES.BASEURL2}/direcciones/obtener`,
          { credentials: "include" }
        );
        if (resDir.ok) {
          const dirs = await resDir.json();
          setDirecciones(dirs);
        }

        // Carrito
        const resCar = await fetch(
          `${CONFIGURACIONES.BASEURL2}/carrito/obtener`,
          { credentials: "include" }
        );
        if (resCar.ok) {
          const { carrito: items } = await resCar.json();
          setCarrito(items);
        } else {
          const err = await resCar.text();
          setError(err || "Error al cargar el carrito");
        }
      } catch (e) {
        console.error(e);
        setError("Error cargando datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = carrito.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );


  const canConfirm = direccionId && !editMode && direccionId !== "new" && carrito.length > 0 && !orderLoading;

  // Iniciar creación de nueva dirección
  const startCreating = () => {
    setEditMode(false);
    setDireccionId("new");
    setNewAddress({
      alias: "",
      calle: "",
      numeroExterior: "",
      numeroInterior: "",
      colonia: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
      pais: "México",
    });
  };

  // Iniciar edición de la dirección seleccionada
  const startEditing = (dir) => {
    setEditMode(true);
    setDireccionId(dir.id.toString());
    setNewAddress({
      alias: dir.alias || "",
      calle: dir.calle,
      numeroExterior: dir.numeroExterior,
      numeroInterior: dir.numeroInterior || "",
      colonia: dir.colonia,
      ciudad: dir.ciudad,
      estado: dir.estado,
      codigoPostal: dir.codigoPostal,
      pais: dir.pais,
    });
  };

  // Crear dirección
  const handleNewDirectionSubmit = async (e) => {
    e.preventDefault();
    setCreatingDir(true);
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/direcciones/crear`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setDirecciones(prev => [...prev, created]);
      setDireccionId(created.id.toString());
      setEditMode(false);

    } catch {
      setError("No se pudo crear la dirección");
    } finally {
      setCreatingDir(false);
    }
  };

  // Editar dirección
  const handleEditDirectionSubmit = async (e) => {
    e.preventDefault();
    setCreatingDir(true);
    setError("");              // limpia errores previos
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/direcciones/actualizar/${direccionId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAddress),
        }
      );

      // parsea siempre el JSON de respuesta
      const data = await res.json();

      if (!res.ok) {
        // si tu back envía { message: "algo" }, lo mostramos
        throw new Error(data.message || "Error desconocido del servidor");
      }

      // si todo OK, actualizamos el estado con la dirección actualizada
      setDirecciones(prev =>
        prev.map(d => (d.id === data.id ? data : d))
      );
      setEditMode(false);
      setSuccessMsg("Dirección actualizada correctamente");
    } catch (err) {
      // muestra el mensaje real de error
      setError(err.message);
    } finally {
      setCreatingDir(false);
    }
  };


  // Crear pedido
  const handleCreateOrder = async () => {
    setOrderLoading(true);
    setError("");
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/crear`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direccionEntregaId: Number(direccionId) }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el pedido");
      }
      router.push("/carrito");
    } catch (err) {
      setError(err.message);
    } finally {
      setOrderLoading(false);
    }
  };

  const selectedAddress = direcciones.find(d => String(d.id) === direccionId);

  return (
    <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Carrito", path: "/carrito" },
          { name: "Realizar Pedido", path: "/pedido" },
        ]}
      />

      <h1 className="text-3xl font-bold text-center mb-8">Realizar Pedido</h1>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
       {/* Mensaje de éxito */}
    {successMsg && (
      <p className="text-center text-green-500 mb-4">
        {successMsg}
      </p>
    )}
      {loading ? (
        <p className="text-center">Cargando…</p>
      ) : (
        <>
          {/* Selector de dirección */}
          <div className="mb-6 flex space-x-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium">Dirección de envío</label>
              <select
                value={direccionId}
                onChange={e => {
                  if (e.target.value === "new") startCreating();
                  else {
                    setEditMode(false);
                    setDireccionId(e.target.value);
                  }
                }}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">— Selecciona una dirección —</option>
                {direcciones.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.alias || `${d.calle}, ${d.colonia}, ${d.ciudad}`}
                  </option>
                ))}
                <option value="new">+ Agregar nueva dirección</option>
              </select>
            </div>
          </div>

          {/* Tarjeta de la dirección con botón dentro */}
          {selectedAddress && !editMode && direccionId !== "new" && (
            <div className="mb-6 p-4 border-l-4 border-pink-600 bg-white dark:bg-gray-200 rounded shadow-sm flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <FiUser className="text-2xl text-pink-600 mt-1" />
                <div>
                  <p className="font-semibold">
                    {user.name} {user.lastname} {user.telefono}
                  </p>
                  <p>
                    {selectedAddress.calle} {selectedAddress.numeroExterior}
                    {selectedAddress.numeroInterior && ` Int. ${selectedAddress.numeroInterior}`}
                  </p>
                  <p>
                    {selectedAddress.colonia}, {selectedAddress.ciudad} {selectedAddress.estado} {selectedAddress.codigoPostal}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className="inline-block bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded">
                  Dirección Predeterminada
                </span>
                <button
                  onClick={() => startEditing(selectedAddress)}
                  className="px-4 py-2 border border-black text-black rounded hover:bg-gray-100"
                >
                  Editar dirección
                </button>
              </div>
            </div>
          )}

          {/* Formulario de edición */}
          {editMode && (
            <div className="px-4 sm:px-6 md:px-10 lg:px-16">

              <form onSubmit={handleEditDirectionSubmit} className="mb-6 space-y-4">{/* Inputs grid como creación */}
                <div>
                  <label className="block text-sm">Alias (opcional)</label>
                  <input
                    type="text"
                    value={newAddress.alias}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, alias: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm">Calle</label>
                  <input
                    type="text"
                    value={newAddress.calle}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, calle: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Número Exterior</label>
                    <input
                      type="text"
                      value={newAddress.numeroExterior}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          numeroExterior: e.target.value,
                        }))
                      }
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Número Interior</label>
                    <input
                      type="text"
                      value={newAddress.numeroInterior}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          numeroInterior: e.target.value,
                        }))
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm">Colonia</label>
                  <input
                    type="text"
                    value={newAddress.colonia}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, colonia: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Ciudad</label>
                    <input
                      type="text"
                      value={newAddress.ciudad}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, ciudad: e.target.value }))
                      }
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Estado</label>
                    <input
                      type="text"
                      value={newAddress.estado}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, estado: e.target.value }))
                      }
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Código Postal</label>
                    <input
                      type="text"
                      value={newAddress.codigoPostal}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          codigoPostal: e.target.value,
                        }))
                      }
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">País</label>
                    <input
                      type="text"
                      value={newAddress.pais}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, pais: e.target.value }))
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creatingDir}
                  className="px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50"
                >
                  {creatingDir ? "Guardando..." : "Guardar dirección"}
                </button>
              </form>
            </div>
          )}

          {/* Formulario de creación */}
          {direccionId === "new" && (
            <div className="px-4 sm:px-6 md:px-10 lg:px-16">
              <form
                onSubmit={handleNewDirectionSubmit}
                className="mb-6 space-y-4"
              >
                <div>
                  <label className="block text-sm">Alias (opcional)</label>
                  <input
                    type="text"
                    value={newAddress.alias}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, alias: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm">Calle</label>
                  <input
                    type="text"
                    value={newAddress.calle}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, calle: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Número Exterior</label>
                    <input
                      type="text"
                      value={newAddress.numeroExterior}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          numeroExterior: e.target.value,
                        }))
                      }
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Número Interior</label>
                    <input
                      type="text"
                      value={newAddress.numeroInterior}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          numeroInterior: e.target.value,
                        }))
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm">Colonia</label>
                  <input
                    type="text"
                    value={newAddress.colonia}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, colonia: e.target.value }))
                    }
                    className="w-full border rounded p-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Ciudad</label>
                    <input
                      type="text"
                      value={newAddress.ciudad}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, ciudad: e.target.value }))
                      }
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Estado</label>
                    <input
                      type="text"
                      value={newAddress.estado}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, estado: e.target.value }))
                      }
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Código Postal</label>
                    <input
                      type="text"
                      value={newAddress.codigoPostal}
                      onChange={(e) =>
                        setNewAddress((p) => ({
                          ...p,
                          codigoPostal: e.target.value,
                        }))
                      }
                      className="w-full border rounded p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">País</label>
                    <input
                      type="text"
                      value={newAddress.pais}
                      onChange={(e) =>
                        setNewAddress((p) => ({ ...p, pais: e.target.value }))
                      }
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creatingDir}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  {creatingDir ? "Guardando..." : "Guardar dirección"}
                </button>
              </form>
            </div>
          )}
          {/* Lista de productos */}
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
                      <span className="text-gray-500 text-xs">
                        Sin imagen
                      </span>
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

          {/* Total y confirmación */}
          <div className="text-right mb-8">
            <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
          </div>
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
