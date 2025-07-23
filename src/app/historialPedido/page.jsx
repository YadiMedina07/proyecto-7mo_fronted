"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import Breadcrumbs from "../../components/Breadcrumbs"
import { useRouter } from "next/navigation"
import {
  Package,
  Eye,
  Calendar,
  DollarSign,
  History,
  AlertCircle,
  Clock,
  Truck,
  CheckCircle,
  RotateCcw,
  TrendingUp,
  ShoppingBag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function HistorialPedidosPage() {
  const { theme } = useAuth()
  const router = useRouter()
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/historial`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar el historial")
        return res.json()
      })
      .then(({ pedidos }) => setPedidos(pedidos))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const getStatusBadge = (estado) => {
    const statusConfig = {
      PENDIENTE: { variant: "secondary", icon: Clock, color: "text-yellow-600" },
      PROCESANDO: { variant: "default", icon: Package, color: "text-blue-600" },
      ENVIADO: { variant: "default", icon: Truck, color: "text-purple-600" },
      ENTREGADO: { variant: "default", icon: CheckCircle, color: "text-green-600" },
      RECIBIDO_CLIENTE: { variant: "default", icon: CheckCircle, color: "text-green-700" },
    }

    const config = statusConfig[estado] || { variant: "secondary", icon: Clock, color: "text-gray-600" }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {estado}
      </Badge>
    )
  }

  // Calcular estadísticas
  const totalGastado = pedidos.reduce((sum, p) => sum + p.total, 0)
  const pedidosCompletados = pedidos.filter((p) => p.estado === "RECIBIDO_CLIENTE" || p.estado === "ENTREGADO").length
  const promedioGasto = pedidos.length > 0 ? totalGastado / pedidos.length : 0

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

            {/* Estadísticas skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-8 w-24" />
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
            { name: "Historial", path: "/historialPedidos" },
          ]}
        />

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <History className="h-5 w-5 text-pink-600" />
          <h1 className="text-3xl font-bold">Historial de Pedidos</h1>
          {pedidos.length > 0 && (
            <Badge variant="secondary" className="h-5 w-5 text-pink-600">
              {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
            </Badge>
          )}
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : pedidos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No hay pedidos en tu historial</h2>
              <p className="text-muted-foreground mb-6">Cuando completes tus primeros pedidos, aparecerán aquí</p>
              <Button onClick={() => router.push("/producto")}>
                <Package className="h-4 w-4 mr-2" />
                Ver Productos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Gastado</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <p className="text-2xl font-bold">{totalGastado.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pedidos Completados</p>
                      <p className="text-2xl font-bold">{pedidosCompletados}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Promedio por Pedido</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <p className="text-2xl font-bold">{promedioGasto.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Pedidos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-pink-600" />
                  Todos los Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Vista de tabla para pantallas grandes */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Pedido</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidos.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">#{p.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-pink-600" />
                              {new Date(p.fecha_pedido).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(p.fecha_pedido).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {p.estado ? getStatusBadge(p.estado) : <Badge variant="secondary">Sin estado</Badge>}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
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
                    <Card key={p.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">Pedido #{p.id}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(p.fecha_pedido).toLocaleDateString()}
                            </div>
                          </div>
                          {p.estado ? getStatusBadge(p.estado) : <Badge variant="secondary">Sin estado</Badge>}
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-lg">${p.total.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/detallePedido/${p.id}`)}
                            className="flex-1 gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Ver detalles
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <History className="h-4 w-4 text-pink-600"/>
                    <span>Historial completo de todas tus compras</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4 text-pink-600" />
                    <span>Revisa los detalles de cada pedido</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <RotateCcw className="h-4 w-4 text-pink-600" />
                    <span>Reordena tus productos favoritos fácilmente</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
