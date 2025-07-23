"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import Image from "next/image";
import Script from "next/script";
import Swal from "sweetalert2";
import {
  User,
  MapPin,
  Package,
  CreditCard,
  Truck,
  Edit,
  Plus,
  Check,
  AlertCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function PedidoPage() {
  const { theme, user } = useAuth();
  const router = useRouter();
  const paypalRef = useRef(null);

  // Light/dark helpers
  const light = (s) => (theme === "light" ? s : "");
  const dark = (s) => (theme === "dark" ? s : "");

  const [carrito, setCarrito] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [direccionId, setDireccionId] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [creatingDir, setCreatingDir] = useState(false);
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

  // Carga inicial de direcciones y carrito
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

  // Actualiza la dirección seleccionada
  useEffect(() => {
    setSelectedAddress(
      direcciones.find((d) => String(d.id) === direccionId) || null
    );
  }, [direccionId, direcciones]);

  // Cálculos de totales
  const subtotal = carrito.reduce((sum, it) => sum + it.producto.precio * it.cantidad, 0);
  const envio = subtotal > 500 ? 0 : 99;
  const total = subtotal + envio;

  // Inicio de modos crear/editar
  const startCreating = () => {
    setEditMode(false);
    setDireccionId("new");
    setSuccessMsg("");
    setError("");
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
  const startEditing = (dir) => {
    setEditMode(true);
    setDireccionId(dir.id.toString());
    setSuccessMsg("");
    setError("");
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

  // Crear nueva dirección
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
      setDirecciones((prev) => [...prev, created]);
      setDireccionId(created.id.toString());
      setSuccessMsg("Dirección creada correctamente");
    } catch {
      setError("Error al crear la dirección");
    } finally {
      setCreatingDir(false);
    }
  };

  // Actualizar dirección existente
  const handleEditDirectionSubmit = async (e) => {
    e.preventDefault();
    setCreatingDir(true);
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al actualizar");
      setDirecciones((prev) => prev.map((d) => (d.id === data.id ? data : d)));
      setSuccessMsg("Dirección actualizada correctamente");
    } catch (err) {
      setError(err.message || "Error al actualizar la dirección");
    } finally {
      setCreatingDir(false);
    }
  };

  // Eliminar dirección
  const handleDeleteDirection = async (id) => {
    if (!confirm("¿Eliminar esta dirección?")) return;
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/direcciones/eliminar/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error();
      setDirecciones((prev) => prev.filter((d) => d.id !== id));
      setDireccionId("");
      setSuccessMsg("Dirección eliminada correctamente");
    } catch {
      Swal.fire("Error", "No se pudo eliminar la dirección", "error");
    }
  };

  // Renderizar botones PayPal
  useEffect(() => {
    let cancelled = false;
    if (!paypalRef.current || carrito.length === 0 || !selectedAddress) return;
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
            const res = await fetch(`${CONFIGURACIONES.BASEURL2}/paypal/create-order`, {
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
            });
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
                Swal.fire("¡Pedido confirmado!", "Gracias por tu compra", "success");
                router.push("/gracias");
              } else {
                Swal.fire("Error", result.message || "Error al capturar pago", "error");
              }
            } catch {
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
    const interval = setInterval(() => {
      if (window.paypal) {
        clearInterval(interval);
        renderButtons();
      }
    }, 200);
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (paypalRef.current) paypalRef.current.innerHTML = "";
    };
  }, [carrito, selectedAddress, total, router]);

  if (loading) {
    return (
      <div className={`min-h-screen py-8 pt-36 px-4 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className={`${light("bg-white")} ${dark("bg-gray-800 text-gray-100")}`}>
                <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
              <Card className={`${light("bg-white")} ${dark("bg-gray-800 text-gray-100")}`}>
                <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                <CardContent className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className={`${light("bg-white")} ${dark("bg-gray-800 text-gray-100")}`}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 pt-36 px-4 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto max-w-6xl">
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

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Finalizar Pedido</h1>
          <p className="text-muted-foreground">Completa tu información para procesar el pedido</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMsg && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de Envío */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={`${light("bg-white")} ${dark("bg-gray-800 text-gray-100")}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-pink-600" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selector de dirección */}
                <div className="space-y-2">
                  <Label htmlFor="direccion-select" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>
                    Seleccionar dirección
                  </Label>
                  <Select
                    value={direccionId}
                    onValueChange={(value) => {
                      if (value === "new") startCreating();
                      else {
                        setEditMode(false);
                        setDireccionId(value);
                      }
                    }}
                  >
                    <SelectTrigger className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}>
                      <SelectValue placeholder="— Selecciona una dirección —" />
                    </SelectTrigger>
                    <SelectContent className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}>
                      {direcciones.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.alias || `${d.calle}, ${d.colonia}, ${d.ciudad}`}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4 text-pink-600" />
                          Agregar nueva dirección
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dirección seleccionada */}
                {selectedAddress && !editMode && direccionId !== "new" && (
                  <Card className={`border-l-4 border-l-primary ${light("bg-white")} ${dark("bg-gray-800 text-gray-100")}`}>
                    <CardContent className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className={`${light("text-gray-900")} ${dark("text-gray-100")} font-semibold`}>
                            {user.name} {user.lastname}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedAddress.calle} {selectedAddress.numeroExterior}
                            {selectedAddress.numeroInterior && ` Int. ${selectedAddress.numeroInterior}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedAddress.colonia}, {selectedAddress.ciudad} {selectedAddress.estado}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            CP: {selectedAddress.codigoPostal}, {selectedAddress.pais}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${light("border-pink-600 text-pink-600 hover:bg-pink-50")} ${dark("border-blue-400 text-blue-400 hover:bg-blue-900")}`}
                          onClick={() => startEditing(selectedAddress)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="solid"
                          size="sm"
                          className={`${light("bg-pink-600 hover:bg-pink-500 text-white")} ${dark("bg-blue-600 hover:bg-blue-500 text-white")}`}
                          onClick={() => handleDeleteDirection(selectedAddress.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Formulario nueva dirección */}
                {direccionId === "new" && (
                  <Card className={`border-l-4 border-l-primary ${light("bg-white")} ${dark("bg-gray-800 text-gray-100")}`}>
                    <CardHeader>
                      <CardTitle className={`${light("text-gray-900")} ${dark("text-gray-100")} text-lg`}>
                        Nueva Dirección
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleNewDirectionSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="alias" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Alias (opcional)</Label>
                            <Input
                              id="alias"
                              type="text"
                              placeholder="Casa, Oficina, etc."
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.alias}
                              onChange={(e) => setNewAddress((p) => ({ ...p, alias: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="calle" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Calle *</Label>
                            <Input
                              id="calle"
                              type="text"
                              placeholder="Nombre de la calle"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.calle}
                              onChange={(e) => setNewAddress((p) => ({ ...p, calle: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="numeroExterior" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Número Exterior *</Label>
                            <Input
                              id="numeroExterior"
                              type="text"
                              placeholder="123"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.numeroExterior}
                              onChange={(e) => setNewAddress((p) => ({ ...p, numeroExterior: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="numeroInterior" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Número Interior</Label>
                            <Input
                              id="numeroInterior"
                              type="text"
                              placeholder="A, 1, etc."
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.numeroInterior}
                              onChange={(e) => setNewAddress((p) => ({ ...p, numeroInterior: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="colonia" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Colonia *</Label>
                            <Input
                              id="colonia"
                              type="text"
                              placeholder="Nombre de la colonia"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.colonia}
                              onChange={(e) => setNewAddress((p) => ({ ...p, colonia: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="ciudad" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Ciudad *</Label>
                            <Input
                              id="ciudad"
                              type="text"
                              placeholder="Nombre de la ciudad"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.ciudad}
                              onChange={(e) => setNewAddress((p) => ({ ...p, ciudad: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="estado" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Estado *</Label>
                            <Input
                              id="estado"
                              type="text"
                              placeholder="Nombre del estado"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.estado}
                              onChange={(e) => setNewAddress((p) => ({ ...p, estado: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor="codigoPostal" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Código Postal *</Label>
                            <Input
                              id="codigoPostal"
                              type="text"
                              placeholder="12345"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.codigoPostal}
                              onChange={(e) => setNewAddress((p) => ({ ...p, codigoPostal: e.target.value }))}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="pais" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>País</Label>
                            <Input
                              id="pais"
                              type="text"
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.pais}
                              onChange={(e) => setNewAddress((p) => ({ ...p, pais: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            disabled={creatingDir}
                            className={`${light("bg-pink-600 hover:bg-pink-500 text-white")} ${dark("bg-blue-600 hover:bg-blue-500 text-white")}`}
                          >
                            {creatingDir ? "Guardando..." : "Guardar dirección"}
                          </Button>
                          <Button
                            variant="outline"
                            className={`${light("border-pink-600 text-pink-600 hover:bg-pink-50")} ${dark("border-blue-400 text-blue-400 hover:bg-blue-900")}`}
                            onClick={() => setDireccionId("")}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Formulario editar dirección */}
                {editMode && selectedAddress && (
                  <Card className={`border-l-4 border-l-primary ${light("bg-white")} ${dark("bg-gray-800 text-gray-100")}`}>
                    <CardHeader>
                      <CardTitle className={`${light("text-gray-900")} ${dark("text-gray-100")} text-lg`}>Editar Dirección</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleEditDirectionSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="alias-edit" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Alias (opcional)</Label>
                            <Input
                              id="alias-edit"
                              type="text"
                              placeholder="Casa, Oficina, etc."
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.alias}
                              onChange={(e) => setNewAddress((p) => ({ ...p, alias: e.target.value }))} />
                          </div>
                          <div>
                            <Label htmlFor="calle-edit" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Calle *</Label>
                            <Input
                              id="calle-edit"
                              type="text"
                              placeholder="Nombre de la calle"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.calle}
                              onChange={(e) => setNewAddress((p) => ({ ...p, calle: e.target.value }))} />
                          </div>
                          <div>
                            <Label htmlFor="numeroExterior-edit" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Número Exterior *</Label>
                            <Input
                              id="numeroExterior-edit"
                              type="text"
                              placeholder="123"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.numeroExterior}
                              onChange={(e) => setNewAddress((p) => ({ ...p, numeroExterior: e.target.value }))} />
                          </div>
                          <div>
                            <Label htmlFor="numeroInterior-edit" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Número Interior</Label>
                            <Input
                              id="numeroInterior-edit"
                              type="text"
                              placeholder="A, 1, etc."
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.numeroInterior}
                              onChange={(e) => setNewAddress((p) => ({ ...p, numeroInterior: e.target.value }))} />
                          </div>
                          <div>
                            <Label htmlFor="colonia-edit" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Colonia *</Label>
                            <Input
                              id="colonia-edit"
                              type="text"
                              placeholder="Nombre de la colonia"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.colonia}
                              onChange={(e) => setNewAddress((p) => ({ ...p, colonia: e.target.value }))} />
                          </div>
                          <div>
                            <Label htmlFor="ciudad-edit" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Ciudad *</Label>
                            <Input
                              id="ciudad-edit"
                              type="text"
                              placeholder="Nombre de la ciudad"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.ciudad}
                              onChange={(e) => setNewAddress((p) => ({ ...p, ciudad: e.target.value }))} />
                          </div>
                          <div>
                            <Label htmlFor="estado-edit" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Estado *</Label>
                            <Input
                              id="estado-edit"
                              type="text"
                              placeholder="Nombre del estado"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.estado}
                              onChange={(e) => setNewAddress((p) => ({ ...p, estado: e.target.value }))} />
                          </div>
                          <div>
                            <Label htmlFor="codigoPostal-edit" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>Código Postal *</Label>
                            <Input
                              id="codigoPostal-edit"
                              type="text"
                              placeholder="12345"
                              required
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.codigoPostal}
                              onChange={(e) => setNewAddress((p) => ({ ...p, codigoPostal: e.target.value }))} />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="pais-edit" className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>País</Label>
                            <Input
                              id="pais-edit"
                              type="text"
                              className={`${light("bg-white text-gray-900")} ${dark("bg-gray-700 text-gray-100")}`}
                              value={newAddress.pais}
                              onChange={(e) => setNewAddress((p) => ({ ...p, pais: e.target.value }))} />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            disabled={creatingDir}
                            className={`${light("bg-pink-600 hover:bg-pink-500 text-white")} ${dark("bg-blue-600 hover:bg-blue-500 text-white")}`}
                          >
                            {creatingDir ? "Actualizando..." : "Actualizar dirección"}
                          </Button>
                          <Button
                            variant="outline"
                            className={`${light("border-pink-600 text-pink-600 hover:bg-pink-50")} ${dark("border-blue-400 text-blue-400 hover:bg-blue-900")}`}
                            onClick={() => setEditMode(false)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Productos del Pedido */}
            <Card className={`${light("bg-white")} ${dark("bg-gray-800 text-gray-100")}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-pink-600" />
                  Productos del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {carrito.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        {item.producto.imagenes?.[0] ? (
                          <img
                            src={item.producto.imagenes[0].imageUrl}
                            alt={item.producto.name}
                            className="w-12 h-12 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded-lg border flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className={`${light("text-gray-900")} ${dark("text-gray-100")} font-medium`}>{item.producto.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Cantidad: {item.cantidad}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`${light("text-gray-900")} ${dark("text-gray-100")} font-semibold`}>
                          ${(item.producto.precio * item.cantidad).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${item.producto.precio.toFixed(2)} c/u
                        </p>
                      </div>
                    </div>
                    {index < carrito.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Resumen y Pago */}
          <div className="lg:col-span-1">
            <Card className={`${light("bg-white text-gray-900")} ${dark("bg-gray-800 text-gray-100")} sticky top-4`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-pink-600" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span>
                    {envio === 0 ? (
                      <div className="flex items-center text-green-600">
                        <Truck className="h-4 w-4 mr-1" />
                        Gratis
                      </div>
                    ) : (
                      `$${envio.toFixed(2)}`
                    )}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {subtotal < 500 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      ¡Faltan ${(500 - subtotal).toFixed(2)} para envío gratis!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Métodos de Pago */}
                <div className="space-y-3">
                  <Label className={`${light("text-gray-800")} ${dark("text-gray-100")}`}>
                    Métodos de pago disponibles:
                  </Label>
                  <div className="flex items-center justify-center gap-4 p-3 border rounded-lg">
                    <Image
                      src="/assets/mercado-pago-logo.png"
                      alt="Mercado Pago"
                      width={80}
                      height={40}
                      className="object-contain"
                    />
                    <Image
                      src="/assets/logo_paypal.png"
                      alt="PayPal"
                      width={80}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* PayPal Button */}
                <div className="space-y-3">
                  {selectedAddress && carrito.length > 0 ? (
                    <div ref={paypalRef} id="paypal-button-container" className="min-h-[60px]"></div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {!selectedAddress
                          ? "Selecciona una dirección de envío para continuar"
                          : "Tu carrito está vacío"}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Garantías */}
                <div className="space-y-2 pt-4 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Pago 100% seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Garantía de satisfacción</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Soporte 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
