"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { useRouter } from "next/navigation";
import { CONFIGURACIONES } from "../config/config";
import Breadcrumbs from "../../components/Breadcrumbs";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminSalesPage() {
  const { user, isAuthenticated, theme } = useAuth();
  const router = useRouter();

  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [leastProducts, setLeastProducts] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [predictions, setPredictions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTop, setIsLoadingTop] = useState(false);
  const [isLoadingLeast, setIsLoadingLeast] = useState(false);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  const [error, setError] = useState("");
  const [errorStock, setErrorStock] = useState("");

  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Ventas", path: "/adminVentas" },
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login");
      return;
    }
    fetchSales();
    fetchTopProducts();
    fetchLeastProducts();
    fetchStockPredictions();
  }, [isAuthenticated, user]);

  // --- Fetch de Ventas y Top/Least ---
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/prediccion/all`, { credentials: "include" });
      const { ventas } = await res.json();
      setSales(ventas);
    } catch {
      setError("No se pudieron cargar las ventas.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTopProducts = async () => {
    setIsLoadingTop(true);
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/prediccion/top?limit=5`, { credentials: "include" });
      const { topProducts } = await res.json();
      setTopProducts(topProducts);
    } catch {
      setError("No se pudo cargar el top de ventas.");
    } finally {
      setIsLoadingTop(false);
    }
  };

  const fetchLeastProducts = async () => {
    setIsLoadingLeast(true);
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/prediccion/least?limit=1`, { credentials: "include" });
      const { leastProducts } = await res.json();
      setLeastProducts(leastProducts);
    } catch {
      setError("No se pudo cargar los productos menos vendidos.");
    } finally {
      setIsLoadingLeast(false);
    }
  };

 

  // --- Fetch de Stock y predicción ---
  const fetchStockPredictions = async () => {
    setIsLoadingStock(true);
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/prediccion/stock`, { credentials: "include" });
      if (!res.ok) throw new Error("Error al obtener datos de stock.");
      const data = await res.json();
      setStockData(data);
      const predicted = predictDepletion(data);
      setPredictions(predicted);
    } catch (err) {
      setErrorStock(err.message);
    } finally {
      setIsLoadingStock(false);
    }
  };

  // --- Configuración de la gráfica de Top Ventas ---
  const chartData = {
    labels: topProducts.map(({ producto }) => producto.name),
    datasets: [
      {
        label: "Unidades vendidas",
        data: topProducts.map(({ totalVendido }) => totalVendido),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Top 5 Productos Más Vendidos",
      },
      legend: { display: false },
    },
    scales: { y: { beginAtZero: true } },
  };

  // --- Configuración de la gráfica de Predicción de Stock ---
  const stockChartData = {
    labels: predictions.map((item) => `${item.flavor} - ${item.size}`),
    datasets: [
      {
        label: "Días para agotar el stock",
        data: predictions.map((item) =>
          item.daysToDeplete === Infinity ? 0 : item.daysToDeplete
        ),
        borderWidth: 1,
      },
    ],
  };

  const stockChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Predicción de Agotamiento de Stock",
      },
      legend: { display: false },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <Breadcrumbs pages={breadcrumbsPages} />
      <h1 className="text-3xl font-bold text-center mb-8">Historial de Ventas</h1>

      {/* --- Gráfica de Top Ventas --- */}
      {isLoadingTop ? (
        <p className="text-center">Cargando gráfica...</p>
      ) : (
        <div className="mb-12">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* --- Cards de Producto Más Vendido y Menos Vendido --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Producto Más Vendido</h2>
          {topProducts[0] && (
            <div className="shadow rounded-lg p-4 bg-white dark:bg-gray-300">
              <img src={topProducts[0].producto.imagenes?.[0]?.imageUrl ?? ""} alt={topProducts[0].producto.name} className="w-full h-48 object-cover mb-4" />
              <h3 className="text-xl font-bold">{topProducts[0].producto.name}</h3>
              <p>Vendidos: {topProducts[0].totalVendido}</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Producto Menos Vendido</h2>
          {leastProducts[0] && (
            <div className="shadow rounded-lg p-4 bg-white dark:bg-gray-300">
              <img src={leastProducts[0].producto.imagenes?.[0]?.imageUrl ?? ""} alt={leastProducts[0].producto.name} className="w-full h-48 object-cover mb-4" />
              <h3 className="text-xl font-bold">{leastProducts[0].producto.name}</h3>
              <p>Vendidos: {leastProducts[0].totalVendido}</p>
            </div>
          )}
        </section>
      </div>

      {/* --- Tabla de Ventas --- */}
      {isLoading ? (
        <p className="text-center">Cargando ventas...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto mb-12">
          <table className="min-w-full border-collapse">
            <thead className={`${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-200"}`}>
              <tr>
                {["Fecha", "Producto", "Usuario", "Cantidad", "Precio Unit.", "Total"].map((h) => (
                  <th key={h} className="px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{new Date(item.fechaVenta).toLocaleDateString()}</td>
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
