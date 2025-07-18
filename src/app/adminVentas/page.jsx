"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CONFIGURACIONES } from "../config/config";

export default function AdminVentasPage() {
  const { theme } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGeneral = async () => {
      try {
        const res = await fetch(
          `${CONFIGURACIONES.BASEURL2}/ventas/general`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("No se pudo cargar la vista general");
        setData(await res.json());
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGeneral();
  }, []);

  return (
    <div className={`container mx-auto py-8 pt-36 ${
      theme === "dark" ? "bg-gray-100 text-gray-100" : "bg-white text-gray-900"
    }`}>
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Admin", path: "/admin" },
          { name: "Panel de Ventas", path: "/adminVentas" },
        ]}
      />
      <h1 className="text-3xl font-bold mb-6">Vista General de Ventas</h1>

      {loading ? (
        <p>Cargando datos…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Ventas Totales</h2>
            <p className="text-3xl font-bold">{data.totalSales}</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Ingresos Totales</h2>
            <p className="text-3xl font-bold">${data.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-100 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Ticket Promedio</h2>
            <p className="text-3xl font-bold">${data.averageTicket.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
