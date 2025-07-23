"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import Breadcrumbs from "../../components/Breadcrumbs"
import { useRouter } from "next/navigation"
import {
  Package,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  Calendar,
  DollarSign,
  ShoppingBag,
  AlertCircle,
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

export default function MisPedidosPage() {
  const { theme } = useAuth()
  const router = useRouter()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // 1) Carga inicial, excluyendo los que ya confirmó el cliente
  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/obtener-usuario`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar tus pedidos")
        return res.json()
      })
      .then(({ pedidos }) => {
        setPedidos(
          // quitamos los ya "RECIBIDO_CLIENTE"
          pedidos.filter((p) => p.estado !== "RECIBIDO_CLIENTE"),
        )
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // 2) Lógica de "confirmar recibido"
  const handleConfirmReceived = async (id) => {
    try {
      const res = await fetch(
        `${CONFIGURACIONES.BASEURL2}/pedidos/confirmar-recibo/${id}`,
        {
          method: "PUT",
          credentials: "include",
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error al confirmar")
      // al confirmar, lo quitamos de la lista
      setPedidos((prev) => prev.filter((p) => p.id !== Number(id)))
    } catch (err) {
      alert(err.message)
    }
  }

  const getStatusBadge = (estado) => {
    const statusConfig = {
      PENDIENTE: {
        variant: "secondary",
        icon: Clock,
        color: "text-yellow-600",
      },
      PROCESANDO: {
        variant: "default",
        icon: Package,
        color: "text-blue-600",
      },
      ENVIADO: { variant: "default", icon: Truck, color: "text-purple-600" },
      ENTREGADO: {
        variant: "default",
        icon: CheckCircle,
        color: "text-green-600",
      },
    }

    const config =
      statusConfig[estado] ||
      { variant: "secondary", icon: Clock, color: "text-gray-600" }
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
            <Skeleton className="h-8 w-48" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
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
          ]}
        />

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="h-8 w-8 text-black" />
          <h1 className="text-3xl font-bold text-black">Mis Pedidos</h1>
          {pedidos.length > 0 && (
            <Badge
              variant="secondary"
              className="text-sm border-pink-600 text-pink-600"
            >
              {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
            </Badge>
          )}
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4 text-black" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : pedidos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                No tienes pedidos pendientes
              </h2>
              <p className="text-muted-foreground mb-6">
                Cuando realices un pedido, aparecerá aquí
              </p>
              <Button
                onClick={() => router.push("/producto")}
                className="bg-pink-600 hover:bg-pink-500 text-white"
              >
                <Package className="h-4 w-4 mr-2" />
                Ver Productos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Package className="h-5 w-5 text-pink-600" />
                Historial de Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Vista de tabla para pantallas grandes */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-black">
                        Pedido
                      </TableHead>
                      <TableHead className="text-black">Fecha</TableHead>
                      <TableHead className="text-black">Estado</TableHead>
                      <TableHead className="text-right text-black">
                        Total
                      </TableHead>
                      <TableHead className="text-center text-black">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidos.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium text-black">
                          #{p.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-pink-600" />
                            {new Date(p.fecha_pedido).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(p.fecha_pedido).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(p.estado)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <DollarSign className="h-4 w-4 text-black" />
                            <span className="font-semibold">{p.total.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/detallePedido/${p.id}`)}
                              className="border-pink-600 text-pink-600 hover:bg-pink-50 gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              Ver detalles
                            </Button>
                            {p.estado === "ENTREGADO" && (
                              <Button
                                size="sm"
                                onClick={() => handleConfirmReceived(p.id)}
                                className="gap-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Confirmar recibido
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Vista de cards para pantallas pequeñas */}
              <div className="md:hidden space-y-4">
                {pedidos.map((p) => (
                  <Card key={p.id} className="border-l-4 border-l-pink-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-pink-600">
                            Pedido #{p.id}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 text-pink-600" />
                            {new Date(p.fecha_pedido).toLocaleDateString()}
                          </div>
                        </div>
                        {getStatusBadge(p.estado)}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-pink-600" />
                          <span className="font-semibold text-lg">
                            ${p.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/detallePedido/${p.id}`)}
                          className="border-pink-600 text-pink-600 hover:bg-pink-50 flex-1 gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Ver detalles
                        </Button>
                        {p.estado === "ENTREGADO" && (
                          <Button
                            size="sm"
                            onClick={() => handleConfirmReceived(p.id)}
                            className="flex-1 gap-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Confirmar recibido
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información adicional */}
        {pedidos.length > 0 && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-pink-600" />
                  <span>Los pedidos se actualizan en tiempo real</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 text-pink-600" />
                  <span>Seguimiento disponible para todos los envíos</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-pink-600" />
                  <span>Confirma la recepción para completar el pedido</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
