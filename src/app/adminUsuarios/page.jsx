"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import {
  Users,
  UserCheck,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  Crown,
  User,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

function AdminPage() {
  const { user, isAuthenticated, theme } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null })
  const [editDialog, setEditDialog] = useState({ open: false, user: null, newRole: "" })
  const [actionLoading, setActionLoading] = useState({})

  // Redirige si no es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"
    }
  }, [isAuthenticated, user])

  // Carga la lista de usuarios
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const fetchUsers = async () => {
        setLoading(true)
        const token = localStorage.getItem("token")
        try {
          const res = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          })
          if (!res.ok) throw new Error("Error al cargar usuarios")
          const data = await res.json()
          setUsers(data)
          setError("")
        } catch (err) {
          console.error(err)
          setError("No se pudieron cargar los usuarios")
        } finally {
          setLoading(false)
        }
      }

      fetchUsers()
    }
  }, [isAuthenticated, user])

  // Eliminar usuario
  const handleDelete = async (userId) => {
    setActionLoading((prev) => ({ ...prev, [`delete-${userId}`]: true }))
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })
      if (!res.ok) throw new Error("Error al eliminar")
      // filtra por id numérico
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setDeleteDialog({ open: false, user: null })
    } catch (err) {
      console.error(err)
      setError(err.message || "No se pudo eliminar al usuario")
    } finally {
      setActionLoading((prev) => ({ ...prev, [`delete-${userId}`]: false }))
    }
  }

  // Editar rol de usuario
  const handleEditRole = async () => {
    const { user: userToEdit, newRole } = editDialog
    if (!newRole || newRole === userToEdit.role) {
      setEditDialog({ open: false, user: null, newRole: "" })
      return
    }

    setActionLoading((prev) => ({ ...prev, [`edit-${userToEdit.id}`]: true }))
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${CONFIGURACIONES.BASEURL2}/auth/admin/users/${userToEdit.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Error al actualizar rol")
      }
      const updated = await res.json()
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      setEditDialog({ open: false, user: null, newRole: "" })
    } catch (err) {
      console.error(err)
      setError(err.message || "No se pudo actualizar el rol")
    } finally {
      setActionLoading((prev) => ({ ...prev, [`edit-${userToEdit.id}`]: false }))
    }
  }

  // Filtrar usuarios
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Obtener estadísticas
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
    verified: users.filter((u) => u.verified).length,
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { variant: "default", icon: Crown, color: "text-yellow-600" },
      user: { variant: "secondary", icon: User, color: "text-blue-600" },
      moderator: { variant: "outline", icon: Shield, color: "text-purple-600" },
    }

    const config = roleConfig[role] || { variant: "secondary", icon: User, color: "text-gray-600" }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {role}
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
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          {/* Estadísticas skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
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

          {/* Tabla skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Users className="h-10 w-10 text-pink-600" />
            <h1 className="text-4xl font-bold">Panel de Administración</h1>
          </div>
          <p className="text-muted-foreground text-lg">Gestión completa de usuarios del sistema</p>
        </div>

        {/* Mensajes de Error */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabla de Usuarios */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4 text-pink-600" />
                Gestión de Usuarios
              </CardTitle>
              <Badge variant="outline" className="text-sm">
                {filteredUsers.length} de {users.length} usuarios
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 text-pink-600" />
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="user">Usuarios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabla */}
            {filteredUsers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-pink-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {u.name} {u.lastname}
                              </p>
                              <p className="text-sm text-muted-foreground">ID: {u.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-pink-600"/>
                            <span>{u.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {u.verified ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Verificado
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Sin verificar
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 text-pink-600" />
                            {new Date(u.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setEditDialog({ open: true, user: u, newRole: u.role })}
                                className="gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Editar Rol
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteDialog({ open: true, user: u })}
                                className="gap-2 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                                Eliminar Usuario
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron usuarios</h3>
                <p className="text-muted-foreground">
                  {searchTerm || roleFilter !== "all"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "No hay usuarios registrados en el sistema"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Confirmación para Eliminar */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, user: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                ¿Eliminar Usuario?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta de{" "}
                <strong>
                  {deleteDialog.user?.name} {deleteDialog.user?.lastname}
                </strong>{" "}
                ({deleteDialog.user?.email}) del sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(deleteDialog.user?.id)}
                disabled={actionLoading[`delete-${deleteDialog.user?.id}`]}
                className="bg-red-600 hover:bg-red-700"
              >
                {actionLoading[`delete-${deleteDialog.user?.id}`] ? "Eliminando..." : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog para Editar Rol */}
        <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, user: null, newRole: "" })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-600" />
                Editar Rol de Usuario
              </DialogTitle>
              <DialogDescription>
                Cambiar el rol de{" "}
                <strong>
                  {editDialog.user?.name} {editDialog.user?.lastname}
                </strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Nuevo Rol</Label>
                <Select
                  value={editDialog.newRole}
                  onValueChange={(value) => setEditDialog({ ...editDialog, newRole: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Usuario
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Administrador
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setEditDialog({ open: false, user: null, newRole: "" })}>
                Cancelar
              </Button>
              <Button
                onClick={handleEditRole}
                disabled={!editDialog.newRole || actionLoading[`edit-${editDialog.user?.id}`]}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                {actionLoading[`edit-${editDialog.user?.id}`] ? "Actualizando..." : "Actualizar Rol"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Información del Sistema */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-pink-600" />
                <span>Panel de administración seguro</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-pink-600" />
                <span>Gestión completa de usuarios</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-pink-600" />
                <span>Acciones con confirmación</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminPage
