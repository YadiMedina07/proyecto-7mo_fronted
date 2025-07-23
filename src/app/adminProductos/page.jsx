"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/authContext"
import { useRouter } from "next/navigation"
import { CONFIGURACIONES } from "../config/config"
import {
  Package,
  Plus,
  Upload,
  X,
  DollarSign,
  Droplets,
  Ruler,
  Hash,
  FileText,
  ImageIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

function AdminProductsPage() {
  const { user, isAuthenticated, theme } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/login")
    }
  }, [isAuthenticated, user])

  const [activeTab, setActiveTab] = useState("create")
  const [form, setForm] = useState({
    name: "",
    description: "",
    precio: "",
    sabor: "",
    tamano: "",
    stock: "",
  })
  const [images, setImages] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // "success" o "error"
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    const invalid = files.find((file) => !allowedTypes.includes(file.type))

    if (invalid) {
      setImages([])
      setImagePreview([])
      setMessage("Formato de imagen no permitido. Usa JPG, PNG o GIF.")
      setMessageType("error")
      return
    }

    setImages(files)
    setMessage("")

    // Crear previsualizaciones
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }))
    setImagePreview(previews)
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreview.filter((_, i) => i !== index)

    // Liberar URL del objeto eliminado
    URL.revokeObjectURL(imagePreview[index].url)

    setImages(newImages)
    setImagePreview(newPreviews)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const clearForm = () => {
    setForm({
      name: "",
      description: "",
      precio: "",
      sabor: "",
      tamano: "",
      stock: "",
    })
    setImages([])
    setImagePreview([])
    // Liberar URLs de objetos
    imagePreview.forEach((preview) => URL.revokeObjectURL(preview.url))
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    // Validamos que los campos obligatorios (Nombre y Precio) estén completos
    if (!form.name || !form.precio) {
      setMessage("Los campos Nombre y Precio son obligatorios.")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    for (const key in form) {
      formData.append(key, form[key])
    }
    images.forEach((file) => formData.append("images", file))

    try {
      const response = await fetch(`${CONFIGURACIONES.BASEURL2}/productos/crear`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      if (response.ok) {
        await response.json()
        setMessage("Producto creado exitosamente.")
        setMessageType("success")
        clearForm()
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || "Error al crear el producto.")
        setMessageType("error")
      }
    } catch (error) {
      console.error("Error al crear producto:", error)
      setMessage("Error al crear el producto.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen py-8 pt-36 px-4 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Package className="h-10 w-10 text-pink-600" />
            <h1 className="text-4xl font-bold">Crear Producto</h1>
          </div>
          <p className="text-muted-foreground text-lg">Añade un nuevo producto al catálogo</p>
        </div>

        {/* Mensajes */}
        {message && (
          <Alert variant={messageType === "success" ? "default" : "destructive"} className="mb-6">
            {messageType === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Formulario */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-white dark:from-pink-950/20 dark:to-gray-900">
            <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-400">
              <Plus className="h-5 w-5" />
              Información del Producto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleCreateProduct} className="space-y-8">
              {/* Información Básica */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-pink-600" />
                  <h3 className="text-lg font-semibold">Información Básica</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                      <Package className="h-4 w-4 text-pink-600" />
                      Nombre del Producto *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Ingresa el nombre del producto"
                      className="focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="precio" className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="h-4 w-4 text-pink-600" />
                      Precio *
                    </Label>
                    <Input
                      id="precio"
                      name="precio"
                      type="number"
                      value={form.precio}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      className="focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock" className="flex items-center gap-2 text-sm font-medium">
                      <Hash className="h-4 w-4 text-pink-600" />
                      Stock Disponible *
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleInputChange}
                      placeholder="Cantidad disponible"
                      className="focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-pink-600" />
                    Descripción del Producto
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Describe las características principales del producto..."
                    rows={4}
                    className="focus:ring-pink-500 focus:border-pink-500 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Una buena descripción ayuda a los clientes a entender mejor el producto
                  </p>
                </div>
              </div>

              {/* Características del Producto */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Droplets className="h-5 w-5 text-pink-600" />
                  <h3 className="text-lg font-semibold">Características</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sabor" className="flex items-center gap-2 text-sm font-medium">
                      <Droplets className="h-4 w-4 text-pink-600" />
                      Sabor
                    </Label>
                    <Input
                      id="sabor"
                      name="sabor"
                      value={form.sabor}
                      onChange={handleInputChange}
                      placeholder="Ej. Vainilla, Chocolate, Fresa..."
                      className="focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tamano" className="flex items-center gap-2 text-sm font-medium">
                      <Ruler className="h-4 w-4 text-pink-600" />
                      Tamaño (ml)
                    </Label>
                    <Input
                      id="tamano"
                      name="tamano"
                      type="number"
                      value={form.tamano}
                      onChange={handleInputChange}
                      placeholder="Ej. 750, 1000..."
                      className="focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                </div>
              </div>

              {/* Imágenes del Producto */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="h-5 w-5 text-pink-600" />
                  <h3 className="text-lg font-semibold">Imágenes del Producto</h3>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-pink-300 dark:border-pink-700 rounded-lg p-8 text-center hover:border-pink-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="images"
                    />
                    <Label htmlFor="images" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                          <Upload className="h-8 w-8 text-pink-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-pink-700 dark:text-pink-400">
                            Haz clic para subir imágenes
                          </p>
                          <p className="text-sm text-muted-foreground">Formatos permitidos: JPG, PNG, GIF</p>
                          <p className="text-xs text-muted-foreground">
                            Puedes seleccionar múltiples imágenes a la vez
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {/* Preview de imágenes */}
                  {imagePreview.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-pink-600" />
                        <span className="text-sm font-medium">Imágenes seleccionadas ({imagePreview.length})</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreview.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg border-2 border-pink-200 dark:border-pink-800 overflow-hidden bg-gray-50 dark:bg-gray-800">
                              <img
                                src={preview.url || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                              title="Eliminar imagen"
                            >
                              <X className="h-3 w-3" />
                            </button>

                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 rounded-b-lg">
                              <p className="truncate" title={preview.name}>
                                {preview.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón de Crear */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 text-lg gap-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creando producto...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Crear Producto
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-3">
                  Los campos marcados con * son obligatorios
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <Package className="h-5 w-5 text-pink-600" />
                <span>Información completa del producto</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <ImageIcon className="h-5 w-5 text-pink-600" />
                <span>Soporte para múltiples imágenes</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-pink-600" />
                <span>Validación automática de datos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminProductsPage
