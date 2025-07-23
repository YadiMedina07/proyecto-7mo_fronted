"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import { useRouter } from "next/navigation"
import { CONFIGURACIONES } from "../config/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Package,
  Edit,
  Trash2,
  DollarSign,
  Hash,
  FileText,
  Palette,
  Ruler,
  Package2,
  ImageIcon,
  AlertCircle,
  CheckCircle,
  Search,
  Grid3X3,
  List,
} from "lucide-react"

function AdminProductListPage() {
  const { user, isAuthenticated, theme } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // "success" o "error"
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState("grid") // "grid" o "list"

  // Estados para el modal de edición
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [updateForm, setUpdateForm] = useState({
    name: "",
    description: "",
    precio: "",
    sabor: "",
    tamano: "",
    stock: "",
  })
  const [updateImages, setUpdateImages] = useState([])
  const [updateRemoveOldImages, setUpdateRemoveOldImages] = useState(false)
  const [updateIsLoading, setUpdateIsLoading] = useState(false)

  // Función para obtener los productos desde el endpoint de administración
  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      // Se corrige la URL, eliminando el segmento "admin" para que se invoque el endpoint correcto.
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.productos)
      } else {
        setMessage("Error al obtener los productos.")
        setMessageType("error")
      }
    } catch (error) {
      console.error("Error al obtener productos:", error)
      setMessage("Error al obtener los productos.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    } else {
      fetchProducts()
    }
  }, [isAuthenticated, user])

  // Función para eliminar un producto
  const handleDelete = async (productId) => {
    const confirmDelete = confirm("¿Estás seguro de eliminar este producto?")
    if (!confirmDelete) return

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${productId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (response.ok) {
        setMessage("Producto eliminado exitosamente.")
        setMessageType("success")
        fetchProducts()
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "Error al eliminar el producto.")
        setMessageType("error")
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error)
      setMessage("Error al eliminar el producto.")
      setMessageType("error")
    }
  }

  // Función para abrir el modal de edición
  const handleUpdate = (product) => {
    setSelectedProduct(product)
    // Inicializa el formulario con los datos actuales del producto
    setUpdateForm({
      name: product.name,
      description: product.description,
      precio: product.precio,
      sabor: product.sabor,
      tamano: product.tamano,
      stock: product.stock,
    })
    setUpdateImages([])
    setUpdateRemoveOldImages(false)
    setShowModal(true)
  }

  // Manejo de cambios en el formulario del modal
  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target
    setUpdateForm((prev) => ({ ...prev, [name]: value }))
  }

  // Manejo de selección de nuevas imágenes en el modal
  const handleUpdateImageChange = (e) => {
    const files = Array.from(e.target.files)
    setUpdateImages(files)
  }

  // Función para enviar la actualización del producto desde el modal
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setUpdateIsLoading(true)

    const formData = new FormData()
    formData.append("name", updateForm.name)
    formData.append("description", updateForm.description)
    formData.append("precio", updateForm.precio)
    formData.append("sabor", updateForm.sabor)
    formData.append("tamano", updateForm.tamano)
    formData.append("stock", updateForm.stock)
    formData.append("removeOldImages", updateRemoveOldImages)

    updateImages.forEach((file) => {
      formData.append("images", file)
    })

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/${selectedProduct.id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      })
      if (response.ok) {
        await response.json()
        setMessage("Producto actualizado exitosamente.")
        setMessageType("success")
        setShowModal(false)
        fetchProducts()
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "Error al actualizar el producto.")
        setMessageType("error")
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error)
      setMessage("Error al actualizar el producto.")
      setMessageType("error")
    } finally {
      setUpdateIsLoading(false)
    }
  }

  // Función para obtener el estado del stock
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Sin stock", variant: "destructive" }
    if (stock <= 5) return { label: "Stock bajo", variant: "secondary" }
    return { label: "Disponible", variant: "default" }
  }

  // Filtrar productos por término de búsqueda
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sabor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Estadísticas de productos
  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock > 0).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
  }

  return (
    <div className={`min-h-screen py-8 pt-36 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg">
              <Package className="h-4 w-4 text-pink-600"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Administrar Productos</h1>
              <p className="text-muted-foreground">Gestiona tu catálogo de productos</p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package2 className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">En Stock</p>
                    <p className="text-2xl font-bold">{stats.inStock}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Bajo</p>
                    <p className="text-2xl font-bold">{stats.lowStock}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Sin Stock</p>
                    <p className="text-2xl font-bold">{stats.outOfStock}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mensajes */}
        {message && (
          <Alert
            className={`mb-6 ${messageType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {messageType === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={messageType === "success" ? "text-green-800" : "text-red-800"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Controles */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos por nombre, descripción o sabor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-2">
                Mostrando {filteredProducts.length} de {products.length} productos
              </p>
            )}
          </CardContent>
        </Card>

        {/* Lista de productos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No se encontraron productos" : "No hay productos"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primer producto"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
          >
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`${viewMode === "list" ? "flex" : ""}`}>
                  {/* Imagen del producto */}
                  <div className={`${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    {product.imagenes && product.imagenes.length > 0 ? (
                      <img
                        src={product.imagenes[0].imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        className={`object-cover ${viewMode === "list" ? "w-full h-full" : "w-full h-48"}`}
                      />
                    ) : (
                      <div
                        className={`bg-gray-100 flex items-center justify-center ${viewMode === "list" ? "w-full h-full" : "w-full h-48"
                          }`}
                      >
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Contenido del producto */}
                  <div className="flex-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge {...getStockStatus(product.stock)}>{getStockStatus(product.stock).label}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold">${product.precio.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-blue-600" />
                            <span>Stock: {product.stock}</span>
                          </div>
                          {product.sabor && (
                            <div className="flex items-center gap-2">
                              <Palette className="h-4 w-4 text-pink-600" />
                              <span>{product.sabor}</span>
                            </div>
                          )}
                          {product.tamano && (
                            <div className="flex items-center gap-2">
                              <Ruler className="h-4 w-4 text-orange-600" />
                              <span>{product.tamano}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdate(product)}
                          size="sm"
                          className="flex-1 bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(product.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-pink-600 text-pink-600 hover:bg-pink-50 flex items-center justify-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de edición */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-pink-600" />
                Editar Producto
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-pink-600" />
                    Nombre *
                  </Label>
                  <Input id="name" name="name" value={updateForm.name} onChange={handleUpdateFormChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precio" className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-pink-600" />
                    Precio *
                  </Label>
                  <Input
                    id="precio"
                    name="precio"
                    type="number"
                    step="0.01"
                    value={updateForm.precio}
                    onChange={handleUpdateFormChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-pink-600" />
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={updateForm.description}
                  onChange={handleUpdateFormChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sabor" className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-pink-600" />
                    Sabor
                  </Label>
                  <Input id="sabor" name="sabor" value={updateForm.sabor} onChange={handleUpdateFormChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tamano" className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-pink-600" />
                    Tamaño
                  </Label>
                  <Input
                    id="tamano"
                    name="tamano"
                    type="number"
                    value={updateForm.tamano}
                    onChange={handleUpdateFormChange}
                  />
                </div>
              </div>

              {/* Imágenes */}
              <div className="space-y-2">
                <Label htmlFor="images" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Nuevas Imágenes
                </Label>
                <Input id="images" type="file" accept="image/*" multiple onChange={handleUpdateImageChange} />
                <p className="text-xs text-muted-foreground">Selecciona nuevas imágenes para reemplazar las actuales</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="updateRemoveOldImages"
                  checked={updateRemoveOldImages}
                  onChange={(e) => setUpdateRemoveOldImages(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="updateRemoveOldImages" className="text-sm">
                  Eliminar imágenes anteriores
                </Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateIsLoading} className="bg-pink-600 hover:bg-pink-700">
                  {updateIsLoading ? "Actualizando..." : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AdminProductListPage
