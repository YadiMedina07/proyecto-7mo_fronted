"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function SalesTablePage() {
  const { theme, user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Ventas", path: "/adminVentas" },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchSales();
  }, [isAuthenticated, user]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/prediccion/all`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al obtener las ventas");
      const data = await res.json();
      // Se espera que el endpoint retorne un objeto con { ventas: [...] }
      setSales(data.ventas || []);
    } catch (err) {
      setError("No se pudieron cargar las ventas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs pages={breadcrumbsPages} />
      <h1 className="text-3xl font-bold text-center mb-8">Historial de Ventas</h1>

      {loading ? (
        <p className="text-center">Cargando ventas...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead
              className={`${
                theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-200"
              }`}
            >
              <tr>
                {["Fecha", "Producto", "Usuario", "Cantidad", "Precio Unit.", "Total"].map((header) => (
                  <th key={header} className="px-4 py-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">
                    {new Date(item.fechaVenta).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{item.producto.name}</td>
                  <td className="px-4 py-2">{item.usuario?.name ?? "Anónimo"}</td>
                  <td className="px-4 py-2">{item.cantidad}</td>
                  <td className="px-4 py-2">${item.precioUnitario.toFixed(2)}</td>
                  <td className="px-4 py-2">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

