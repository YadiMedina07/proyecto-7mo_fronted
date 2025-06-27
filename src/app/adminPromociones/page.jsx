"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";

export default function CrearPromocion() {
    const { user, isAuthenticated, theme } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        descuento: "",
        productoId: "",
        activo: true,
    });
    const [productos, setProductos] = useState([]);      // <–– aquí
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== "admin") {
            router.push("/login");
            return;
        }

        // Carga los productos solo si es admin
        (async () => {
            setIsLoadingProducts(true);
            try {
                const res = await fetch(
                    `${CONFIGURACIONES.BASEURL2}/productos/`, // <–– asegúrate del /api
                    { credentials: "include" }
                );
                const data = await res.json();
                console.log(">>> data de /api/productos:", data);
                if (res.ok) {
                    setProductos(data.productos);               // <–– aquí debe ir setProductos
                } else {
                    throw new Error(data.message || "Error al cargar productos");
                }
            } catch (err) {
                console.error("Error al obtener productos:", err);
                setMessage("No se pudieron cargar los productos.");
                setMessageType("error");
            } finally {
                setIsLoadingProducts(false);
            }
        })();
    }, [isAuthenticated, user, router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.titulo || !form.fechaInicio || !form.productoId) {
            setMessage("Los campos Título, Fecha inicio y Producto son obligatorios.");
            setMessageType("error");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const payload = {
                titulo: form.titulo,
                descripcion: form.descripcion,
                fechaInicio: form.fechaInicio,
                fechaFin: form.fechaFin || null,
                descuento: Number(form.descuento) || 0,
                productoId: Number(form.productoId),
                activo: form.activo,
            };

            const res = await fetch(
                `${CONFIGURACIONES.BASEURL2}/productos/promociones`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();
            if (res.ok) {
                setMessage("Promoción creada exitosamente.");
                setMessageType("success");
                setForm({
                    titulo: "",
                    descripcion: "",
                    fechaInicio: "",
                    fechaFin: "",
                    productoId: "",
                    activo: true,
                });
            } else {
                setMessage(data.message || "Error al crear la promoción.");
                setMessageType("error");
            }
        } catch (err) {
            console.error("Error al crear promoción:", err);
            setMessage("Error al crear la promoción.");
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
            }`}>
            <h1 className="text-3xl font-bold text-center mb-8">Crear Promoción</h1>
            <div className={`shadow-xl rounded-lg p-8 max-w-3xl mx-auto ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                }`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block mb-2 font-medium">Título</label>
                        <input
                            type="text"
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg focus:ring-pink-500"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block mb-2 font-medium">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg focus:ring-pink-500"
                            rows="3"
                        />
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-medium">Fecha inicio</label>
                            <input
                                type="date"
                                name="fechaInicio"
                                value={form.fechaInicio}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg focus:ring-pink-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Fecha fin</label>
                            <input
                                type="date"
                                name="fechaFin"
                                value={form.fechaFin}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg focus:ring-pink-500"
                            />
                        </div>
                    </div>
                    {/* Descuento (%) */}
                    <div>
                        <label className="block mb-2 font-medium">Descuento (%)</label>
                        <input
                            type="number"
                            name="descuento"
                            value={form.descuento}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg focus:ring-pink-500"
                            placeholder="Ej. 15 para 15%"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium">Producto</label>
                        {isLoadingProducts ? (
                            <p>Cargando productos...</p>
                        ) : (
                            <select
                                name="productoId"
                                value={form.productoId}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg focus:ring-pink-500"
                                required
                            >
                                <option value="">-- Selecciona un producto --</option>
                                {productos.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    {/* Activo */}
                    <div>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="activo"
                                checked={form.activo}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Activo
                        </label>
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-lg bg-pink-700 text-white hover:bg-pink-800 disabled:bg-gray-400"
                    >
                        {isSubmitting ? "Creando promoción..." : "Crear Promoción"}
                    </button>

                    {/* Mensaje */}
                    {message && (
                        <p
                            className={`mt-4 text-center ${messageType === "success" ? "text-pink-500" : "text-red-500"
                                }`}
                        >
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
