"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import Breadcrumbs from "../../components/Breadcrumbs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Package,
  Users,
  Clock,
  CheckCircle,
  Truck,
  Search,
  Eye,
  Calendar,
  DollarSign,
  User,
  Hash,
  RefreshCw,
  Filter,
  ShoppingBag,
  AlertCircle,
} from "lucide-react"

export default function AdminPedidosPage() {
  const { theme } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [selectedUser, setSelectedUser] = useState("all") // Updated default value to "all"
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // Updated default value to "all"
  const router = useRouter()

  const estados = [
    { value: "RECIBIDO", label: "Recibido", color: "bg-blue-100 text-blue-800", icon: Package },
    { value: "EN_PREPARACION", label: "En preparación", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    { value: "LISTO_ENTREGA", label: "Listo para entrega", color: "bg-orange-100 text-orange-800", icon: CheckCircle },
    { value: "EN_CAMINO", label: "En camino", color: "bg-purple-100 text-purple-800", icon: Truck },
    { value: "ENTREGADO", label: "Entregado", color: "bg-green-100 text-green-800", icon: CheckCircle },
  ]

  // 1) Carga de usuarios
  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/auth/users`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUsuarios(data))
      .catch(() => console.error("No se pudieron cargar los usuarios"))
  }, [])

  // 2) Carga de pedidos al cambiar usuario seleccionado
  useEffect(() => {
    setLoading(true)
    setError("")
    const url = new URL(`${CONFIGURACIONES.BASEURL2}/pedidos/obtener`, window.location.origin)
    if (selectedUser !== "all") url.searchParams.set("usuarioId", selectedUser)
    fetch(url.toString(), { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar pedidos")
        return res.json()
      })
      .then(({ pedidos }) => {
        // Filtramos fuera los que ya confirmó el cliente
        setPedidos(pedidos.filter((p) => p.estado !== "RECIBIDO_CLIENTE"))
      })
      .catch(() => setError("No se pudieron cargar los pedidos"))
      .finally(() => setLoading(false))
  }, [selectedUser])

  // 3) Cuando el admin cambia estado de un pedido
  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/pedidos/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ estado: nuevoEstado }),
      })
      if (!res.ok) throw new Error()
      const { pedido } = await res.json()
      if (pedido.estado === "RECIBIDO_CLIENTE") {
        // si el admin accidentalmente lo marca así, también lo ocultamos
        setPedidos((prev) => prev.filter((p) => p.id !== pedido.id))
      } else {
        // solo actualizamos el estado en la tabla
        setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? pedido : p)))
      }
    } catch {
      alert("No se pudo actualizar el estado")
    }
  }

  // Función para refrescar datos
  const handleRefresh = () => {
    setLoading(true)
    setError("")
    const url = new URL(`${CONFIGURACIONES.BASEURL2}/pedidos/obtener`, window.location.origin)
    if (selectedUser !== "all") url.searchParams.set("usuarioId", selectedUser)
    fetch(url.toString(), { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar pedidos")
        return res.json()
      })
      .then(({ pedidos }) => {
        setPedidos(pedidos.filter((p) => p.estado !== "RECIBIDO_CLIENTE"))
      })
      .catch(() => setError("No se pudieron cargar los pedidos"))
      .finally(() => setLoading(false))
  }

  // Función para obtener el estado con estilo
  const getEstadoInfo = (estado) => {
    return (
      estados.find((e) => e.value === estado) || {
        value: estado,
        label: estado,
        color: "bg-gray-100 text-gray-800",
        icon: Package,
      }
    )
  }

  // Filtrar pedidos - CORREGIDO
  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      searchTerm === "" ||
      pedido.id.toString().includes(searchTerm) ||
      pedido.usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.usuario.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || pedido.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calcular estadísticas
  const stats = {
    total: pedidos.length,
    recibidos: pedidos.filter((p) => p.estado === "RECIBIDO").length,
    enPreparacion: pedidos.filter((p) => p.estado === "EN_PREPARACION").length,
    listos: pedidos.filter((p) => p.estado === "LISTO_ENTREGA").length,
    enCamino: pedidos.filter((p) => p.estado === "EN_CAMINO").length,
    entregados: pedidos.filter((p) => p.estado === "ENTREGADO").length,
  }

  return (
    <div
      className={`container mx-auto py-8 pt-36 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}
    >
      <Breadcrumbs
        pages={[
          { name: "Home", path: "/" },
          { name: "Admin", path: "/admin" },
          { name: "Pedidos", path: "/admin/pedidos" },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent flex items-center gap-3">
            <ShoppingBag className="text-pink-600" size={40} />
            Gestión de Pedidos
          </h1>
          <p className="text-gray-600 mt-2">Administra y actualiza el estado de todos los pedidos</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2 bg-transparent">
          <RefreshCw size={16} />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Recibidos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.recibidos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">En Prep.</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.enPreparacion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-orange-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Listos</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.listos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="text-purple-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">En Camino</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.enCamino}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Entregados</p>
                  <p className="text-2xl font-bold text-green-600">{stats.entregados}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} className="text-pink-600" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Selector de cliente - CORREGIDO */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-pink-600"/>
                Filtrar por cliente
              </Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {usuarios.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Búsqueda */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Search size={16} className="text-pink-600"/>
                Buscar pedido o cliente
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="ID del pedido, nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por estado - CORREGIDO */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Package size={16} className="text-pink-600"/>
                Filtrar por estado
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {estados.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contador de resultados */}
          {searchTerm || statusFilter !== "all" || selectedUser !== "all" ? (
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {filteredPedidos.length} de {pedidos.length} pedidos
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Contenido principal */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      ) : filteredPedidos.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">No hay pedidos</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" || selectedUser !== "all"
                ? "No se encontraron pedidos que coincidan con los filtros aplicados."
                : "No hay pedidos disponibles en este momento."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="flex items-center gap-2">
                      <Hash size={16} className="text-pink-600"/>
                      Pedido
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-pink-600" />
                        Fecha
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-pink-600"/>
                        Cliente
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-pink-600" />
                        Estado
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <DollarSign size={16} className="text-pink-600"/>
                        Total
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Eye size={16} className="text-pink-600"/>
                        Acciones
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPedidos.map((p) => {
                    const estadoInfo = getEstadoInfo(p.estado)
                    const IconComponent = estadoInfo.icon

                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Hash size={14} className="text-gray-400" />
                            {p.id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(p.fecha_pedido).toLocaleDateString()}
                            <div className="text-xs text-gray-500">{new Date(p.fecha_pedido).toLocaleTimeString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{p.usuario.name}</div>
                            <div className="text-sm text-gray-500">{p.usuario.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={p.estado} onValueChange={(value) => handleChangeEstado(p.id, value)}>
                            <SelectTrigger className="w-auto min-w-[140px]">
                              <div className="flex items-center gap-2">
                                <IconComponent size={14} />
                                <span className="text-sm">{estadoInfo.label}</span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {estados.map((estado) => {
                                const EstadoIcon = estado.icon
                                return (
                                  <SelectItem key={estado.value} value={estado.value}>
                                    <div className="flex items-center gap-2">
                                      <EstadoIcon size={14} />
                                      {estado.label}
                                    </div>
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-semibold text-lg">${p.total.toFixed(2)}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            onClick={() => router.push(`/detallePedido/${p.id}`)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Eye size={14} />
                            Ver detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
