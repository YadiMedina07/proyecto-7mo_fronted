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
  Scale,
  AlertTriangle,
  Save,
  X,
  Clock,
  Users,
  Settings,
} from "lucide-react"

function TermsPage() {
  const { user, isAuthenticated, theme } = useAuth()
  const [terms, setTerms] = useState([])
  const [currentTerms, setCurrentTerms] = useState(null)
  const [newTerms, setNewTerms] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  })
  const [editingTerms, setEditingTerms] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [termsToDelete, setTermsToDelete] = useState(null)

  // Verificar si el usuario es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"
    }
  }, [isAuthenticated, user])

  // Obtener todos los términos
  const fetchTerms = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms`, {
        method: "GET",
        credentials: "include",
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setTerms(data)
      } else {
        setTerms([])
        console.error("La respuesta no es un array:", data)
      }
    } catch (error) {
      console.error("Error al obtener los términos:", error)
      toast.error("Error al cargar los términos")
    }
  }

  // Obtener los términos actuales
  const fetchCurrentTerms = async () => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms/current`, {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentTerms(data)
      } else {
        console.error("Error al obtener los términos actuales")
      }
    } catch (error) {
      console.error("Error al obtener los términos actuales:", error)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const loadData = async () => {
        setIsLoading(true)
        await Promise.all([fetchTerms(), fetchCurrentTerms()])
        setIsLoading(false)
      }
      loadData()
    }
  }, [isAuthenticated, user])

  // Crear nuevos términos
  const handleCreateTerms = async () => {
    if (!newTerms.title || !newTerms.content || !newTerms.effectiveDate) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-center",
      })
      return
    }

    if (new Date(newTerms.effectiveDate) < new Date()) {
      toast.error("La fecha de vigencia no puede ser anterior a la fecha actual.", { position: "top-center" })
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTerms),
      })
      if (response.ok) {
        toast.success("Términos creados exitosamente.", {
          position: "top-center",
        })
        fetchTerms()
        fetchCurrentTerms()
        setNewTerms({ title: "", content: "", effectiveDate: "" })
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

  // Actualizar términos existentes
  const handleUpdateTerms = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms/${editingTerms.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingTerms),
      })
      if (response.ok) {
        setEditingTerms(null)
        fetchTerms()
        fetchCurrentTerms()
        toast.success("Términos actualizados exitosamente")
      }
    } catch (error) {
      console.error("Error al actualizar los términos:", error)
      toast.error("Error al actualizar los términos")
    } finally {
      setIsUpdating(false)
    }
  }

  // Eliminar términos
  const handleDeleteTerms = async (id) => {
    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (response.ok) {
        fetchTerms()
        fetchCurrentTerms()
        toast.success("Términos eliminados exitosamente")
        setShowDeleteDialog(false)
        setTermsToDelete(null)
      }
    } catch (error) {
      console.error("Error al eliminar los términos:", error)
      toast.error("Error al eliminar los términos")
    }
  }

  // Establecer términos como actuales
  const handleSetCurrentTerms = async (id) => {
    if (!id) {
      console.error("El ID de los términos no está definido")
      return
    }

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/terms/${id}/set-current`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        fetchTerms()
        fetchCurrentTerms()
        toast.success("Términos establecidos como actuales")
      } else {
        const errorData = await response.json()
        console.error("Error en la respuesta:", errorData)
      }
    } catch (error) {
      console.error("Error al establecer los términos como actuales:", error)
      toast.error("Error al establecer los términos como actuales")
    }
  }

  // Estadísticas
  const stats = {
    total: terms.length,
    current: terms.filter((t) => t.isCurrent).length,
    pending: terms.filter((t) => new Date(t.effectiveDate) > new Date()).length,
    active: terms.filter((t) => new Date(t.effectiveDate) <= new Date()).length,
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full mb-4">
          <Scale className="w-8 h-8 text-black" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-2">
          Gestión de Términos y Condiciones
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administra y controla los términos y condiciones de tu plataforma
        </p>
      </div>

      {/* Formulario de Crear/Editar */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
              {editingTerms ? (
                <Edit className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              ) : (
                <Plus className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              )}
            </div>
            <div>
              <CardTitle className="text-pink-800 dark:text-pink-200">
                {editingTerms ? "Editar Términos" : "Crear Nuevos Términos"}
              </CardTitle>
              <CardDescription>
                {editingTerms
                  ? "Modifica los datos de los términos existentes"
                  : "Completa los campos para crear nuevos términos"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-600" />
                Título
              </Label>
              <Input
                id="title"
                type="text"
                value={editingTerms ? editingTerms.title : newTerms.title}
                onChange={(e) =>
                  editingTerms
                    ? setEditingTerms({ ...editingTerms, title: e.target.value })
                    : setNewTerms({ ...newTerms, title: e.target.value })
                }
                placeholder="Ej. Términos y Condiciones v2.0"
                className="focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="effectiveDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-600" />
                Fecha de Vigencia
              </Label>
              <Input
                id="effectiveDate"
                type="date"
                value={editingTerms ? editingTerms.effectiveDate : newTerms.effectiveDate}
                onChange={(e) =>
                  editingTerms
                    ? setEditingTerms({
                        ...editingTerms,
                        effectiveDate: e.target.value,
                      })
                    : setNewTerms({ ...newTerms, effectiveDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <Label htmlFor="content" className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-pink-600" />
              Contenido de los Términos
            </Label>
            <Textarea
              id="content"
              value={editingTerms ? editingTerms.content : newTerms.content}
              onChange={(e) =>
                editingTerms
                  ? setEditingTerms({
                      ...editingTerms,
                      content: e.target.value,
                    })
                  : setNewTerms({ ...newTerms, content: e.target.value })
              }
              placeholder="Escribe aquí el contenido completo de los términos y condiciones..."
              rows={8}
              className="focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="flex justify-end gap-3">
            {editingTerms && (
              <Button variant="outline" onClick={() => setEditingTerms(null)} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            )}
            <Button
              onClick={editingTerms ? handleUpdateTerms : handleCreateTerms}
              disabled={isCreating || isUpdating}
              className="bg-pink-600 hover:bg-pink-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isCreating || isUpdating ? "Guardando..." : editingTerms ? "Guardar Cambios" : "Crear Términos"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Términos */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-blue-800 dark:text-blue-200">Listado de Términos</CardTitle>
              <CardDescription>Gestiona todos los términos y condiciones creados</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {terms.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay términos creados</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Crea tus primeros términos y condiciones usando el formulario de arriba
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
                      <Calendar className="w-4 h-4 text-pink-600" />
                      Fecha de Creación
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-pink-600" />
                      Fecha de Vigencia
                    </div>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terms.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-medium">{term.title}</TableCell>
                    <TableCell>{new Date(term.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(term.effectiveDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {term.isCurrent ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Actual
                        </Badge>
                      ) : new Date(term.effectiveDate) > new Date() ? (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <FileText className="w-3 h-3 mr-1" />
                          Inactivo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTerms(term)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Editar
                        </Button>
                        {!term.isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetCurrentTerms(term.id)}
                            className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Activar
                          </Button>
                        )}
                        <Dialog
                          open={showDeleteDialog && termsToDelete?.id === term.id}
                          onOpenChange={(open) => {
                            setShowDeleteDialog(open)
                            if (!open) setTermsToDelete(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setTermsToDelete(term)
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
                                ¿Estás seguro de que deseas eliminar los términos "{term.title}"? Esta acción no se
                                puede deshacer.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowDeleteDialog(false)
                                  setTermsToDelete(null)
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteTerms(term.id)}
                                className="flex items-center gap-2"
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

export default TermsPage
