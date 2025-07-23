"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/authContext"
import { CONFIGURACIONES } from "../config/config"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Calendar,
  Shield,
  AlertTriangle,
  Save,
  X,
  Clock,
  Users,
  Settings,
} from "lucide-react"

function PrivacyPolicyPage() {
  const { user, isAuthenticated, theme } = useAuth()
  const [policies, setPolicies] = useState([])
  const [currentPolicy, setCurrentPolicy] = useState(null)
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  })
  const [editingPolicy, setEditingPolicy] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [policyToDelete, setPolicyToDelete] = useState(null)

  // Verificar si el usuario es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"
    }
  }, [isAuthenticated, user])

  // Obtener todas las políticas
  const fetchPolicies = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/privacy-policy`, {
        method: "GET",
        credentials: "include",
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setPolicies(data)
      } else {
        setPolicies([])
        console.error("La respuesta no es un array:", data)
      }
    } catch (error) {
      console.error("Error al obtener las políticas:", error)
      toast.error("Error al cargar las políticas")
    }
  }

  // Obtener la política actual
  const fetchCurrentPolicy = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/current`, {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentPolicy(data)
      } else {
        console.error("Error al obtener la política actual")
      }
    } catch (error) {
      console.error("Error al obtener la política actual:", error)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const loadData = async () => {
        setIsLoading(true)
        await Promise.all([fetchPolicies(), fetchCurrentPolicy()])
        setIsLoading(false)
      }
      loadData()
    }
  }, [isAuthenticated, user])

  // Crear una nueva política
  const handleCreatePolicy = async () => {
    if (!newPolicy.title || !newPolicy.content || !newPolicy.effectiveDate) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-center",
      })
      return
    }

    if (new Date(newPolicy.effectiveDate) < new Date()) {
      toast.error("La fecha de vigencia no puede ser anterior a la fecha actual.", { position: "top-center" })
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/privacy-policy`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPolicy),
      })
      if (response.ok) {
        toast.success("Política creada exitosamente.", {
          position: "top-center",
        })
        fetchPolicies()
        fetchCurrentPolicy()
        setNewPolicy({ title: "", content: "", effectiveDate: "" })
      } else {
        const errorData = await response.json()
        toast.error(errorData.message, { position: "top-center" })
      }
    } catch (error) {
      toast.error("Error en el servidor.", { position: "top-center" })
    } finally {
      setIsCreating(false)
    }
  }

  // Actualizar una política existente
  const handleUpdatePolicy = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${editingPolicy.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingPolicy),
      })
      if (response.ok) {
        setEditingPolicy(null)
        fetchPolicies()
        fetchCurrentPolicy()
        toast.success("Política actualizada exitosamente")
      }
    } catch (error) {
      console.error("Error al actualizar la política:", error)
      toast.error("Error al actualizar la política")
    } finally {
      setIsUpdating(false)
    }
  }

  // Eliminar una política
  const handleDeletePolicy = async (id) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (response.ok) {
        fetchPolicies()
        fetchCurrentPolicy()
        toast.success("Política eliminada exitosamente")
        setShowDeleteDialog(false)
        setPolicyToDelete(null)
      }
    } catch (error) {
      console.error("Error al eliminar la política:", error)
      toast.error("Error al eliminar la política")
    }
  }

  // Establecer una política como actual
  const handleSetCurrentPolicy = async (id) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/privacy-policy/${id}/set-current`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        fetchPolicies()
        fetchCurrentPolicy()
        toast.success("Política establecida como actual")
      }
    } catch (error) {
      console.error("Error al establecer la política como actual:", error)
      toast.error("Error al establecer la política como actual")
    }
  }

  // Estadísticas
  const stats = {
    total: policies.length,
    current: policies.filter((p) => p.isCurrent).length,
    pending: policies.filter((p) => new Date(p.effectiveDate) > new Date()).length,
    active: policies.filter((p) => new Date(p.effectiveDate) <= new Date()).length,
  }

  if (isLoading) {
    return (
      <div className={`container mx-auto py-8 pt-36 px-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="space-y-6">
          <Skeleton className="h-12 w-96 mx-auto" />
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
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-2">
          Gestión de Políticas de Privacidad
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administra y controla las políticas de privacidad de tu plataforma
        </p>
      </div>        
      {/* Política Actual */}
      {currentPolicy && (
        <Card className="mb-8 border-green-200 dark:border-green-800">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-green-800 dark:text-green-200">Política Actual</CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  Esta es la política que está actualmente en vigor
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Título</Label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{currentPolicy.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha de Vigencia</Label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {new Date(currentPolicy.effectiveDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Contenido</Label>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentPolicy.content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario de Crear/Editar */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
              {editingPolicy ? (
                <Edit className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              ) : (
                <Plus className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              )}
            </div>
            <div>
              <CardTitle className="text-pink-800 dark:text-pink-200">
                {editingPolicy ? "Editar Política" : "Crear Nueva Política"}
              </CardTitle>
              <CardDescription>
                {editingPolicy
                  ? "Modifica los datos de la política existente"
                  : "Completa los campos para crear una nueva política"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Título
              </Label>
              <Input
                id="title"
                type="text"
                value={editingPolicy ? editingPolicy.title : newPolicy.title}
                onChange={(e) =>
                  editingPolicy
                    ? setEditingPolicy({ ...editingPolicy, title: e.target.value })
                    : setNewPolicy({ ...newPolicy, title: e.target.value })
                }
                placeholder="Ej. Política de Privacidad v2.0"
                className="focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="effectiveDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha de Vigencia
              </Label>
              <Input
                id="effectiveDate"
                type="date"
                value={editingPolicy ? editingPolicy.effectiveDate : newPolicy.effectiveDate}
                onChange={(e) =>
                  editingPolicy
                    ? setEditingPolicy({
                        ...editingPolicy,
                        effectiveDate: e.target.value,
                      })
                    : setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <Label htmlFor="content" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Contenido de la Política
            </Label>
            <Textarea
              id="content"
              value={editingPolicy ? editingPolicy.content : newPolicy.content}
              onChange={(e) =>
                editingPolicy
                  ? setEditingPolicy({
                      ...editingPolicy,
                      content: e.target.value,
                    })
                  : setNewPolicy({ ...newPolicy, content: e.target.value })
              }
              placeholder="Escribe aquí el contenido completo de la política de privacidad..."
              rows={8}
              className="focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="flex justify-end gap-3">
            {editingPolicy && (
              <Button variant="outline" onClick={() => setEditingPolicy(null)} className="flex items-center gap-2 border-pink-600 text-pink-600 hover:bg-pink-50">
                <X className="w-4 h-4 " />
                Cancelar
              </Button>
            )}
            <Button
              onClick={editingPolicy ? handleUpdatePolicy : handleCreatePolicy}
              disabled={isCreating || isUpdating}
              className="bg-pink-600 hover:bg-pink-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isCreating || isUpdating ? "Guardando..." : editingPolicy ? "Guardar Cambios" : "Crear Política"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Políticas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-blue-800 dark:text-blue-200">Listado de Políticas</CardTitle>
              <CardDescription>Gestiona todas las políticas de privacidad creadas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {policies.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay políticas creadas</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Crea tu primera política de privacidad usando el formulario de arriba
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-pink-600" />
                      Título
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-pink-600"  />
                      Fecha de Creación
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 " />
                      Fecha de Vigencia
                    </div>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy._id}>
                    <TableCell className="font-medium">{policy.title}</TableCell>
                    <TableCell>{new Date(policy.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(policy.effectiveDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {policy.isCurrent ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Actual
                        </Badge>
                      ) : new Date(policy.effectiveDate) > new Date() ? (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <FileText className="w-3 h-3 mr-1" />
                          Inactiva
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPolicy(policy)}
                          className="flex items-center gap-1 bg-pink-600 hover:bg-pink-500 text-white"
                        >
                          <Edit className="w-3 h-3" />
                          Editar
                        </Button>

                        {!policy.isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetCurrentPolicy(policy.id)}
                            className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Activar
                          </Button>
                        )}

                        <Dialog
                          open={showDeleteDialog && policyToDelete?._id === policy._id}
                          onOpenChange={(open) => {
                            setShowDeleteDialog(open)
                            if (!open) setPolicyToDelete(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPolicyToDelete(policy)
                                setShowDeleteDialog(true)
                              }}
                              className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                              Eliminar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                Confirmar Eliminación
                              </DialogTitle>
                              <DialogDescription>
                                ¿Estás seguro de que deseas eliminar la política "{policy.title}"? Esta acción no se
                                puede deshacer.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowDeleteDialog(false)
                                  setPolicyToDelete(null)
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeletePolicy(policy.id)}
                                className="flex items-center gap-2 border-pink-600 text-pink-600 hover:bg-pink-50"
                              >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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

export default PrivacyPolicyPage
