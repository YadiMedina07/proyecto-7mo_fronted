"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../../context/authContext"
import Breadcrumbs from "../../components/Breadcrumbs"
import { CONFIGURACIONES } from "../config/config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Mail,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Eye,
  AlertCircle,
  Calendar,
} from "lucide-react"

export default function AdminContactosPage() {
  const { theme } = useAuth()
  const [list, setList] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // all, pending, responded

  useEffect(() => {
    fetch(`${CONFIGURACIONES.BASEURL2}/contactos`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setList(data)
        setFilteredList(data)
      })
      .finally(() => setLoading(false))
  }, [])

  // Filtrar mensajes basado en búsqueda y estado
  useEffect(() => {
    let filtered = list

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (contact.nombre && contact.nombre.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((contact) => (statusFilter === "responded" ? contact.responded : !contact.responded))
    }

    setFilteredList(filtered)
  }, [list, searchTerm, statusFilter])

  // Estadísticas
  const stats = {
    total: list.length,
    responded: list.filter((c) => c.responded).length,
    pending: list.filter((c) => !c.responded).length,
    today: list.filter((c) => {
      const today = new Date().toDateString()
      const contactDate = new Date(c.createdAt || c.fecha).toDateString()
      return contactDate === today
    }).length,
  }

  if (loading) {
    return (
      <div className={`container mx-auto py-8 pt-36 px-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto py-8 pt-36 px-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          pages={[
            { name: "Home", path: "/" },
            { name: "Admin", path: "/admin" },
            { name: "Atención al Cliente", path: "/adminContactos" },
          ]}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-2">
          Mensajes de Contacto
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Gestiona y responde a los mensajes de atención al cliente</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Mensajes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Respondidos</p>
                <p className="text-3xl font-bold text-green-600">{stats.responded}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hoy</p>
                <p className="text-3xl font-bold text-purple-600">{stats.today}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <CardTitle className="text-gray-800 dark:text-gray-200">Filtros</CardTitle>
              <CardDescription>Busca y filtra los mensajes de contacto</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por motivo, email o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Todos ({stats.total})
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => setStatusFilter("pending")}
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Pendientes ({stats.pending})
              </Button>
              <Button
                variant={statusFilter === "responded" ? "default" : "outline"}
                onClick={() => setStatusFilter("responded")}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Respondidos ({stats.responded})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Mensajes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                Mensajes de Contacto ({filteredList.length})
              </CardTitle>
              <CardDescription>Lista de todos los mensajes recibidos</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredList.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm || statusFilter !== "all" ? (
                <>
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No se encontraron mensajes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                </>
              ) : (
                <>
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No hay mensajes de contacto
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Los mensajes de contacto aparecerán aquí cuando los usuarios se pongan en contacto
                  </p>
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-pink-600" />
                      Contacto
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-pink-600" />
                      Motivo
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2 text-pink-600">
                      <Calendar className="w-4 h-4" />
                      Fecha
                    </div>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredList.map((contact) => (
                  <TableRow key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {contact.nombre || "Sin nombre"}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{contact.motivo}</p>
                        {contact.mensaje && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                            {contact.mensaje.substring(0, 100)}
                            {contact.mensaje.length > 100 && "..."}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.createdAt
                        ? new Date(contact.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Sin fecha"}
                    </TableCell>
                    <TableCell>
                      {contact.responded ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Respondido
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Link href={`/adminContactos/${contact.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                            <Eye className="w-3 h-3" />
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
