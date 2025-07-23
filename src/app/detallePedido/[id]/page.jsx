"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../context/authContext"
import { useParams, useRouter } from "next/navigation"
import { CONFIGURACIONES } from "../../config/config"
import Breadcrumbs from "../../../components/Breadcrumbs"
import {
  Package,
  Calendar,
  ArrowLeft,
  DollarSign,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

export default function DetallePedidoPage() {
  const { theme } = useAuth()
  const { id } = useParams()
  const router = useRouter()
  const [pedido, setPedido] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/${id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el pedido")
        return res.json()
      })
      .then(({ pedido }) => setPedido(pedido))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const getStatusBadge = (estado) => {
    const statusConfig = {
      PENDIENTE: {
        variant: "secondary",
        icon: Clock,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      },
      PROCESANDO: {
        variant: "default",
        icon: Package,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      ENVIADO: {
        variant: "default",
        icon: Truck,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
      ENTREGADO: {
        variant: "default",
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-50",
      },
      RECIBIDO_CLIENTE: {
        variant: "default",
        icon: CheckCircle,
        color: "text-green-700",
        bg: "bg-green-100",
      },
    }

    const config =
      statusConfig[estado] || {
        variant: "secondary",
        icon: Clock,
        color: "text-gray-600",
        bg: "bg-gray-50",
      }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {estado}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen py-8 pt-36 px-4 ${
          theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <Skeleton className="h-12 w-12 rounded" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
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
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`min-h-screen py-8 pt-36 px-4 ${
          theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 text-pink-600" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen py-8 pt-36 px-4 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto max-w-6xl">
        <Breadcrumbs
          pages={[
            { name: "Home", path: "/" },
            { name: "Mis Pedidos", path: "/misPedidos" },
            { name: `Pedido #${id}`, path: `/detallePedido/${id}` },
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-pink-600" />
            <div>
              <h1 className="text-3xl font-bold text-black">
                Pedido #{id}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {new Date(pedido.fecha_pedido).toLocaleDateString()} a las{" "}
                  {new Date(pedido.fecha_pedido).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(pedido.estado)}
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2 border-pink-600 text-pink-600 hover:bg-pink-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productos del Pedido */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <ShoppingCart className="h-5 w-5 text-pink-600" />
                  Productos del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Vista de tabla para pantallas grandes */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px] text-black">
                          Imagen
                        </TableHead>
                        <TableHead className="text-black">Producto</TableHead>
                        <TableHead className="text-center text-black">
                          Cantidad
                        </TableHead>
                        <TableHead className="text-right text-black">
                          Precio Unit.
                        </TableHead>
                        <TableHead className="text-right text-black">
                          Subtotal
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedido.detallePedido.map((item) => {
                        const imgUrl =
                          item.producto.imagenes[0]?.imageUrl ||
                          "/placeholder.svg"
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <img
                                src={imgUrl}
                                alt={item.producto.name}
                                className="w-12 h-12 object-cover rounded-lg border"
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {item.producto.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.producto.sabor} •{" "}
                                  {item.producto.tamano}ml
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">
                                {item.cantidad}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <DollarSign className="h-3 w-3 text-black" />
                                <span>{item.precio_unitario.toFixed(2)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              <div className="flex items-center justify-end gap-1">
                                <DollarSign className="h-3 w-3 text-black" />
                                <span>
                                  {(
                                    item.precio_unitario * item.cantidad
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Vista de cards para pantallas pequeñas */}
                <div className="md:hidden space-y-4">
                  {pedido.detallePedido.map((item) => {
                    const imgUrl =
                      item.producto.imagenes[0]?.imageUrl ||
                      "/placeholder.svg"
                    return (
                      <Card
                        key={item.id}
                        className="border-l-4 border-l-pink-600"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <img
                              src={imgUrl}
                              alt={item.producto.name}
                              className="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">
                                {item.producto.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.producto.sabor} •{" "}
                                {item.producto.tamano}ml
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">Cantidad:</span>
                                  <Badge variant="outline">
                                    {item.cantidad}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">
                                    ${item.precio_unitario.toFixed(2)} c/u
                                  </p>
                                  <p className="font-semibold">
                                    $
                                    {(
                                      item.precio_unitario * item.cantidad
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información del Pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-600">
                  <Package className="h-5 w-5 text-pink-600" />
                  Información del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Número de pedido:
                    </span>
                    <span className="font-medium">#{pedido.id}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Estado:
                    </span>
                    {getStatusBadge(pedido.estado)}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Fecha del pedido:
                    </span>
                    <span className="font-medium text-right">
                      {new Date(pedido.fecha_pedido).toLocaleDateString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Hora:
                    </span>
                    <span className="font-medium">
                      {new Date(pedido.fecha_pedido).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumen de Costos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-600">
                  <DollarSign className="h-5 w-5 text-pink-600" />
                  Resumen de Costos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${pedido.total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Envío:</span>
                    <span className="text-green-600">Incluido</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Impuestos:</span>
                    <span>Incluidos</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-5 w-5 text-black" />
                    <span className="text-black">{pedido.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas del Pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-pink-600">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-xl font-bold text-black">
                      {pedido.detallePedido.reduce(
                        (sum, item) => sum + item.cantidad,
                        0,
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Productos
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-xl font-bold text-black">
                      {pedido.detallePedido.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tipos diferentes
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
