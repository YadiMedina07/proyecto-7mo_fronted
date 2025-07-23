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
  ShieldAlert,
  AlertTriangle,
  Save,
  X,
  Clock,
  Settings,
  Shield,
} from "lucide-react"

function DeslindePage() {
  const { user, isAuthenticated, theme } = useAuth()
  const [deslindes, setDeslindes] = useState([])
  const [currentDeslinde, setCurrentDeslinde] = useState(null)
  const [newDeslinde, setNewDeslinde] = useState({
    title: "",
    content: "",
    effectiveDate: "",
  })
  const [editingDeslinde, setEditingDeslinde] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deslindeToDelete, setDeslindeToDelete] = useState(null)

  // Verificar si el usuario es admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login"
    }
  }, [isAuthenticated, user])

  // Obtener todos los deslindes
  const fetchDeslindes = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setDeslindes(data)
      } else {
        setDeslindes([])
        console.error("La respuesta no es un array:", data)
      }
    } catch (error) {
      console.error("Error al obtener los deslindes:", error)
      toast.error("Error al cargar los deslindes")
    }
  }

  // Obtener el deslinde actual
  const fetchCurrentDeslinde = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde/current`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentDeslinde(data)
      } else {
        console.error("Error al obtener el deslinde actual")
      }
    } catch (error) {
      console.error("Error al obtener el deslinde actual:", error)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const loadData = async () => {
        setIsLoading(true)
        await Promise.all([fetchDeslindes(), fetchCurrentDeslinde()])
        setIsLoading(false)
      }
      loadData()
    }
  }, [isAuthenticated, user])

  // Crear un nuevo deslinde
  const handleCreateDeslinde = async () => {
    if (!newDeslinde.title || !newDeslinde.content || !newDeslinde.effectiveDate) {
      toast.error("Todos los campos son obligatorios.", {
        position: "top-center",
      })
      return
    }

    if (new Date(newDeslinde.effectiveDate) < new Date()) {
      toast.error("La fecha de vigencia no puede ser anterior a la fecha actual.", { position: "top-center" })
      return
    }

    setIsCreating(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDeslinde),
      })
      if (response.ok) {
        toast.success("Deslinde creado exitosamente.", {
          position: "top-center",
        })
        fetchDeslindes()
        fetchCurrentDeslinde()
        setNewDeslinde({ title: "", content: "", effectiveDate: "" })
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

  // Actualizar un deslinde existente
  const handleUpdateDeslinde = async () => {
    setIsUpdating(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde/${editingDeslinde._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingDeslinde),
      })
      if (response.ok) {
        setEditingDeslinde(null)
        fetchDeslindes()
        fetchCurrentDeslinde()
        toast.success("Deslinde actualizado exitosamente")
      }
    } catch (error) {
      console.error("Error al actualizar el deslinde:", error)
      toast.error("Error al actualizar el deslinde")
    } finally {
      setIsUpdating(false)
    }
  }

  // Eliminar un deslinde
  const handleDeleteDeslinde = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        fetchDeslindes()
        fetchCurrentDeslinde()
        toast.success("Deslinde eliminado exitosamente")
        setShowDeleteDialog(false)
        setDeslindeToDelete(null)
      }
    } catch (error) {
      console.error("Error al eliminar el deslinde:", error)
      toast.error("Error al eliminar el deslinde")
    }
  }

  // Establecer un deslinde como actual
  const handleSetCurrentDeslinde = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/docs/deslinde/${id}/set-current`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        fetchDeslindes()
        fetchCurrentDeslinde()
        toast.success("Deslinde establecido como actual")
      }
    } catch (error) {
      console.error("Error al establecer el deslinde como actual:", error)
      toast.error("Error al establecer el deslinde como actual")
    }
  }

  // Estadísticas
  const stats = {
    total: deslindes.length,
    current: deslindes.filter((d) => d.isCurrent).length,
    pending: deslindes.filter((d) => new Date(d.effectiveDate) > new Date()).length,
    active: deslindes.filter((d) => new Date(d.effectiveDate) <= new Date()).length,
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-black to-black rounded-full mb-4">
          <ShieldAlert className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-2">
          Gestión de Deslinde de Responsabilidad
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Administra y controla los deslindes de responsabilidad de tu plataforma
        </p>
      </div>


      {/* Deslinde Actual */}
      {currentDeslinde && (
        <Card className="mb-8 border-green-200 dark:border-green-800">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-green-800 dark:text-green-200">Deslinde Actual</CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  Este es el deslinde de responsabilidad que está actualmente en vigor
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Título</Label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{currentDeslinde.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha de Vigencia</Label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                  {new Date(currentDeslinde.effectiveDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Contenido</Label>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{currentDeslinde.content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario de Crear/Editar */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              {editingDeslinde ? (
                <Edit className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              ) : (
                <Plus className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              )}
            </div>
            <div>
              <CardTitle className="text-black dark:text-black">
                {editingDeslinde ? "Editar Deslinde" : "Crear Nuevo Deslinde"}
              </CardTitle>
              <CardDescription>
                {editingDeslinde
                  ? "Modifica los datos del deslinde existente"
                  : "Completa los campos para crear un nuevo deslinde de responsabilidad"}
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
                value={editingDeslinde ? editingDeslinde.title : newDeslinde.title}
                onChange={(e) =>
                  editingDeslinde
                    ? setEditingDeslinde({ ...editingDeslinde, title: e.target.value })
                    : setNewDeslinde({ ...newDeslinde, title: e.target.value })
                }
                placeholder="Ej. Deslinde de Responsabilidad v2.0"
                className="focus:ring-orange-500 focus:border-orange-500"
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
                value={editingDeslinde ? editingDeslinde.effectiveDate : newDeslinde.effectiveDate}
                onChange={(e) =>
                  editingDeslinde
                    ? setEditingDeslinde({
                        ...editingDeslinde,
                        effectiveDate: e.target.value,
                      })
                    : setNewDeslinde({ ...newDeslinde, effectiveDate: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <Label htmlFor="content" className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-pink-600" />
              Contenido del Deslinde
            </Label>
            <Textarea
              id="content"
              value={editingDeslinde ? editingDeslinde.content : newDeslinde.content}
              onChange={(e) =>
                editingDeslinde
                  ? setEditingDeslinde({
                      ...editingDeslinde,
                      content: e.target.value,
                    })
                  : setNewDeslinde({ ...newDeslinde, content: e.target.value })
              }
              placeholder="Escribe aquí el contenido completo del deslinde de responsabilidad..."
              rows={8}
              className="focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex justify-end gap-3">
            {editingDeslinde && (
              <Button variant="outline" onClick={() => setEditingDeslinde(null)} className="flex items-center gap-2">
                <X className="w-4 h-4 text-pink-600" />
                Cancelar
              </Button>
            )}
            <Button
              onClick={editingDeslinde ? handleUpdateDeslinde : handleCreateDeslinde}
              disabled={isCreating || isUpdating}
              className="bg-pink-600 hover:bg-pink-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isCreating || isUpdating ? "Guardando..." : editingDeslinde ? "Guardar Cambios" : "Crear Deslinde"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Deslindes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-blue-800 dark:text-blue-200">Listado de Deslindes</CardTitle>
              <CardDescription>Gestiona todos los deslindes de responsabilidad creados</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {deslindes.length === 0 ? (
            <div className="text-center py-12">
              <ShieldAlert className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay deslindes creados</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Crea tu primer deslinde de responsabilidad usando el formulario de arriba
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
                    <div className="flex items-center gap-2 ">
                      <Clock className="w-4 h-4 text-pink-600" />
                      Fecha de Vigencia
                    </div>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deslindes.map((deslinde) => (
                  <TableRow key={deslinde._id}>
                    <TableCell className="font-medium">{deslinde.title}</TableCell>
                    <TableCell>{new Date(deslinde.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(deslinde.effectiveDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {deslinde.isCurrent ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Actual
                        </Badge>
                      ) : new Date(deslinde.effectiveDate) > new Date() ? (
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
                          onClick={() => setEditingDeslinde(deslinde)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Editar
                        </Button>
                        {!deslinde.isCurrent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetCurrentDeslinde(deslinde._id)}
                            className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Activar
                          </Button>
                        )}
                        <Dialog
                          open={showDeleteDialog && deslindeToDelete?._id === deslinde._id}
                          onOpenChange={(open) => {
                            setShowDeleteDialog(open)
                            if (!open) setDeslindeToDelete(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDeslindeToDelete(deslinde)
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
                                ¿Estás seguro de que deseas eliminar el deslinde "{deslinde.title}"? Esta acción no se
                                puede deshacer.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowDeleteDialog(false)
                                  setDeslindeToDelete(null)
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteDeslinde(deslinde._id)}
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

export default DeslindePage
