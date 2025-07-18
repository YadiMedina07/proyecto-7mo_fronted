// app/adminVentas/grafico/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import { CONFIGURACIONES } from "../config/config";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function GraficoIngresosPage() {
  const { theme } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${CONFIGURACIONES.BASEURL2}/ventas/diarias?days=30`,
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Error al cargar datos del gráfico");
        setData(await res.json());
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Admin", path: "/admin" },
          { name: "Panel de Ventas", path: "/adminVentas" },
          { name: "Gráfico de Ingresos", path: "/adminVentas/grafico" },
        ]}
      />
      <h1 className="text-3xl font-bold mb-6">Gráfico de Ingresos (últimos 30 días)</h1>

      {loading ? (
        <p>Cargando gráfico…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
              />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Ingresos"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
