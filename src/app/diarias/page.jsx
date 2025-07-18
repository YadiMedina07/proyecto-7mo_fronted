"use client";

import React, { useState, useEffect, Fragment } from "react";
import { useAuth } from "../../context/authContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CONFIGURACIONES } from "../config/config";

export default function VentasDiariasPage() {
  const { theme } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [loadingDetalles, setLoadingDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState("");

  useEffect(() => {
    const fetchDiarias = async () => {
      try {
        const res = await fetch(
          `${CONFIGURACIONES.BASEURL2}/ventas/diarias?days=7`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("No se pudo cargar el reporte diario");
        setData(await res.json());
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDiarias();
  }, []);

  const fetchDetalles = async (date) => {
    setSelectedDate(date);
    setLoadingDetalles(true);
    setErrorDetalles("");
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/ventas/detalles?date=${date}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("No se pudieron cargar los detalles");
      setDetalles(await res.json());
    } catch (e) {
      console.error(e);
      setErrorDetalles(e.message);
    } finally {
      setLoadingDetalles(false);
    }
  };

  return (
    <div className={`container mx-auto py-8 pt-36 ${
      theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
    }`}>
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Admin", path: "/admin" },
          { name: "Panel de Ventas", path: "/adminVentas" },
          { name: "Reporte Diario", path: "/adminVentas/diarias" },
        ]}
      />
      <h1 className="text-3xl font-bold mb-6">Reporte de Pedidos Diarios</h1>

      {loading ? (
        <p>Cargando…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Fecha</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase">Ventas</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ date, count, revenue }) => (
                <Fragment key={date}>
                  <tr
                    className="border-t border-gray-200 dark:border-gray-100 hover:bg-gray-100 dark:hover:bg-gray-100 cursor-pointer"
                    onClick={() => fetchDetalles(date)}
                  >
                    <td className="px-6 py-4 text-sm">{date}</td>
                    <td className="px-6 py-4 text-center text-sm">{count}</td>
                    <td className="px-6 py-4 text-right text-sm">${revenue.toFixed(2)}</td>
                  </tr>

                  {selectedDate === date && (
                    <tr>
                      <td colSpan={3} className="bg-gray-50 dark:bg-gray-300 p-4">
                        {loadingDetalles ? (
                          <p>Cargando detalles…</p>
                        ) : errorDetalles ? (
                          <p className="text-red-500">{errorDetalles}</p>
                        ) : detalles.length === 0 ? (
                          <p>No hubo ventas en esa fecha.</p>
                        ) : (
                          <table className="w-full">
                            <thead>
                              <tr>
                                <th className="text-left text-xs uppercase">Producto</th>
                                <th className="text-left text-xs uppercase">Usuario</th>
                                <th className="text-center text-xs uppercase">Cantidad</th>
                                <th className="text-right text-xs uppercase">Precio U.</th>
                                <th className="text-right text-xs uppercase">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detalles.map((v) => (
                                <tr key={v.id} className="border-t border-gray-200 dark:border-gray-200">
                                  <td className="py-2 text-sm">{v.producto.name}</td>
                                  <td className="py-2 text-sm">{v.usuario?.name || "Anon"}</td>
                                  <td className="py-2 text-center text-sm">{v.cantidad}</td>
                                  <td className="py-2 text-right text-sm">${v.precioUnitario.toFixed(2)}</td>
                                  <td className="py-2 text-right text-sm">${v.total.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
