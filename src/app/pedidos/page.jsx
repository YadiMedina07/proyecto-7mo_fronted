"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import { FiUser } from "react-icons/fi";
import { FaShippingFast } from "react-icons/fa";
import Image from "next/image";
import Script from "next/script";
import Swal from "sweetalert2";

export default function PedidoPage() {
  const { theme, user } = useAuth();
  const router = useRouter();
  const paypalRef = useRef(null);

  const [carrito, setCarrito] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [direccionId, setDireccionId] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar direcciones y carrito
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDir, resCar] = await Promise.all([
          fetch(`${CONFIGURACIONES.BASEURL2}/direcciones/obtener`, { credentials: "include" }),
          fetch(`${CONFIGURACIONES.BASEURL2}/carrito/obtener`, { credentials: "include" }),
        ]);
        if (!resDir.ok || !resCar.ok) throw new Error("Error cargando datos");
        const dirs = await resDir.json();
        const { carrito: items } = await resCar.json();
        setDirecciones(dirs);
        setCarrito(items);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar información");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Actualizar dirección seleccionada
  useEffect(() => {
    setSelectedAddress(
      direcciones.find((d) => String(d.id) === direccionId) || null
    );
  }, [direccionId, direcciones]);

  // Cálculos de totales
  const subtotal = carrito.reduce(
    (sum, it) => sum + it.producto.precio * it.cantidad,
    0
  );
  const envio = subtotal > 500 ? 0 : 99;
  const total = subtotal + envio;

  // Render PayPal Buttons tras cargar SDK
  useEffect(() => {
    if (!paypalRef.current || carrito.length === 0 || !selectedAddress) return;
    let cancelled = false;
    let intervalId = null;

    const renderButtons = () => {
      if (!window.paypal) return;
      window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
            height: 55,
          },
          createOrder: async () => {
            const res = await fetch(
              `${CONFIGURACIONES.BASEURL2}/paypal/create-order`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: carrito.map((ci) => ({
                    id: ci.productoId,
                    name: ci.producto.name,
                    price: parseFloat(ci.producto.precio.toFixed(2)),
                    quantity: ci.cantidad,
                  })),
                  total: parseFloat(total.toFixed(2)),
                }),
              }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Error al crear orden");
            return data.orderId;
          },
          onApprove: async (approval) => {
            if (cancelled) return;
            try {
              const res = await fetch(
                `${CONFIGURACIONES.BASEURL2}/paypal/capture-order`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: approval.orderID }),
                }
              );
              const result = await res.json();
              if (res.ok) {
                Swal.fire(
                  "¡Pedido confirmado!",
                  "Gracias por tu compra",
                  "success"
                );
                router.push("/gracias");
              } else {
                Swal.fire(
                  "Error",
                  result.message || "Error al capturar pago",
                  "error"
                );
              }
            } catch (err) {
              console.error(err);
              Swal.fire("Error", "Error procesando pago", "error");
            }
          },
          onError: (err) => {
            if (!cancelled) {
              console.error(err);
              Swal.fire("Error", "Hubo un error con PayPal", "error");
            }
          },
        })
        .render(paypalRef.current);
    };

    // Intentar cargar botones cuando window.paypal esté disponible
    intervalId = setInterval(() => {
      if (window.paypal) {
        clearInterval(intervalId);
        renderButtons();
      }
    }, 200);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      if (paypalRef.current) paypalRef.current.innerHTML = "";
    };
  }, [carrito, selectedAddress, total, router]);

  if (loading) return <p>Cargando…</p>;

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* SDK de PayPal */}
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${CONFIGURACIONES.PAYPAL_CLIENT_ID}&currency=USD`}
        strategy="afterInteractive"
      />

      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Carrito", path: "/carrito" },
          { name: "Realizar Pedido", path: "/pedido" },
        ]}
      />

      <h1 className="text-3xl font-bold text-center mb-8">Realizar Pedido</h1>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Selección de dirección */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Dirección de envío</label>
        <select
          value={direccionId}
          onChange={(e) => setDireccionId(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">— Selecciona una dirección —</option>
          {direcciones.map((d) => (
            <option key={d.id} value={d.id}>
              {d.alias || `${d.calle}, ${d.colonia}, ${d.ciudad}`}
            </option>
          ))}
        </select>
      </div>

      {selectedAddress && (
        <div className="mb-6 p-4 border-l-4 border-pink-600 bg-white rounded shadow-sm">
          <div className="flex items-start space-x-4">
            <FiUser className="text-2xl text-pink-600 mt-1" />
            <div>
              <p className="font-semibold">
                {user.name} {user.lastname}
              </p>
              <p>
                {selectedAddress.calle} {selectedAddress.numeroExterior}
              </p>
              <p>
                {selectedAddress.colonia}, {selectedAddress.ciudad}{" "}
                {selectedAddress.estado}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Lista de productos */}
        <div className="w-full lg:w-2/3 space-y-2">
          {carrito.map((item) => (
            <div
              key={item.id}
              className="flex justify-between p-4 border rounded-lg"
            >
              <span>
                {item.producto.name} x {item.cantidad}
              </span>
              <span>
                ${(item.producto.precio * item.cantidad).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="w-full lg:w-1/3">
          <div
            className={`rounded-xl shadow-lg sticky top-4 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`p-6 ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <h2 className="mb-4 text-xl font-bold">Resumen del Pedido</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>
                  {envio === 0 ? (
                    <span className="flex items-center text-green-500">
                      <FaShippingFast className="mr-1" /> Gratis
                    </span>
                  ) : (
                    `$${envio.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-4 mt-4 text-lg font-bold border-t">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex items-center w-full h-16 justify-evenly">
                <Image
                  src="/assets/mercado-pago-logo.png"
                  alt="Mercado Pago"
                  width={120}
                  height={80}
                  className="object-contain"
                />
                <Image
                  src="/assets/logo_paypal.png"
                  alt="PayPal"
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </div>
              
              <div ref={paypalRef} id="paypal-button-container" className="mt-6"></div>

              {subtotal < 500 && (
                <div
                  className={`mt-4 p-3 rounded-lg text-center text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 text-yellow-400"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  <FaShippingFast className="inline mr-2" /> ¡Faltan $
                  {(500 - subtotal).toFixed(2)} para envío gratis!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
