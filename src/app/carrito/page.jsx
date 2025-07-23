"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  CreditCard,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function CarritoPage() {
  const { theme } = useAuth();
  const router = useRouter();
  const [carrito, setCarrito] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Light / Dark helpers
  const light = (s) => (theme === "light" ? s : "");
  const dark  = (s) => (theme === "dark" ? s : "");

  const breadcrumbsPages = [
    { name: "Home", path: "/" },
    { name: "Carrito", path: "/carrito" },
  ];

  useEffect(() => {
    const fetchCarrito = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${CONFIGURACIONES.BASEURL2}/carrito/obtener`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Error al obtener el carrito");
        const data = await response.json();
        setCarrito(data.carrito);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el carrito");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCarrito();
  }, []);

  const handleUpdateQuantity = async (itemId, cantidad) => {
    if (cantidad < 1) return;
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/carrito/actualizar/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ cantidad }),
        }
      );
      if (!res.ok) throw new Error();
      const { carritoItem } = await res.json();
      setCarrito((prev) =>
        prev.map((it) => (it.id === itemId ? carritoItem : it))
      );
    } catch {
      alert("No se pudo actualizar la cantidad");
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!confirm("¿Eliminar este producto del carrito?")) return;
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/carrito/eliminar/${itemId}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error();
      setCarrito((prev) => prev.filter((it) => it.id !== itemId));
    } catch {
      alert("No se pudo eliminar el producto");
    }
  };

  const totalGeneral = carrito.reduce(
    (sum, it) => sum + it.producto.precio * it.cantidad,
    0
  );
  const totalItems = carrito.reduce((sum, it) => sum + it.cantidad, 0);

  if (isLoading) {
    return (
      <div
        className={`${light("bg-gray-50 text-gray-900")} ${dark(
          "bg-gray-900 text-gray-100"
        )} min-h-screen py-8 pt-36 px-4`}
      >
        {/* ... skeleton placeholders ... */}
      </div>
    );
  }

  return (
    <div
      className={`${light("bg-gray-50 text-gray-900")} ${dark(
        "bg-gray-900 text-gray-100"
      )} min-h-screen py-8 pt-36 px-4`}
    >
      <div className="container mx-auto max-w-6xl">
        <Breadcrumbs pages={breadcrumbsPages} />

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Tu Carrito</h1>
          {carrito.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              {totalItems} {totalItems === 1 ? "producto" : "productos"}
            </Badge>
          )}
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : carrito.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-muted-foreground mb-6">
                Agrega algunos productos para comenzar tu compra
              </p>
              <Button
                asChild
                className={`${light("bg-pink-600 hover:bg-pink-500 text-white")} ${dark(
                  "bg-blue-600 hover:bg-blue-500 text-white"
                )}`}
              >
                <Link href="/producto">
                  <Package className="h-4 w-4 mr-2" />
                  Ver Productos
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {carrito.map((item) => (
                <Card
                  key={item.id}
                  className={`${light("bg-white text-gray-900")} ${dark(
                    "bg-gray-800 text-gray-100"
                  )} overflow-hidden`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {item.producto.imagenes?.[0] ? (
                          <img
                            src={
                              item.producto.imagenes[0].imageUrl ||
                              "/placeholder.svg"
                            }
                            alt={item.producto.name}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center bg-muted rounded-lg border">
                            <Package className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {item.producto.name}
                        </h3>
                        <p className="text-muted-foreground mb-2">
                          Precio unitario: $
                          {item.producto.precio.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.producto.sabor}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.producto.tamano}ml
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className={`${light("bg-white")} ${dark(
                              "bg-gray-700"
                            )}`}
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.cantidad - 1)
                            }
                            disabled={item.cantidad <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                Number(e.target.value)
                              )
                            }
                            className={`${light("bg-white text-gray-900")} ${dark(
                              "bg-gray-700 text-gray-100"
                            )} w-16 text-center h-8`}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className={`${light("bg-white")} ${dark(
                              "bg-gray-700"
                            )}`}
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.cantidad + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            $
                            {(
                              item.producto.precio * item.cantidad
                            ).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.cantidad} × $
                            {item.producto.precio.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Resumen del pedido */}
            <Card
              className={`${light("bg-white text-gray-900")} ${dark(
                "bg-gray-800 text-gray-100"
              )} sticky top-4`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Productos ({totalItems})</span>
                    <span>${totalGeneral.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalGeneral.toFixed(2)}</span>
                </div>

                {/* Botones del resumen */}
                <div className="space-y-2 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className={`
                      w-full
                      ${light("bg-pink-600 hover:bg-pink-500 text-white")}
                      ${dark("bg-blue-600 hover:bg-blue-500 text-white")}
                    `}
                  >
                    <Link href="/pedidos">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Continuar con el pago
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className={`
                      w-full bg-transparent
                      ${light("border-pink-600 text-pink-600 hover:bg-pink-50")}
                      ${dark("border-blue-400 text-blue-400 hover:bg-blue-900")}
                    `}
                  >
                    <Link href="/producto">
                      <Package className="h-4 w-4 mr-2" />
                      Seguir Comprando
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Envío gratuito en todos los pedidos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Garantía de satisfacción</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span>Devolución fácil en 30 días</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
